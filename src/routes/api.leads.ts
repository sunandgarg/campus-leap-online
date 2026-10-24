import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getDatabase } from "@/lib/db.server";
import { getLearningCourse } from "@/lib/featured-learning";

const contactChannelSchema = z.enum(["call", "whatsapp", "email"]);

const leadSchema = z
  .object({
    fullName: z.string().trim().min(2).max(100),
    externalCourseId: z
      .string()
      .max(100)
      .refine((id) => Boolean(getLearningCourse(id)))
      .optional(),
    phone: z.string().regex(/^[6-9]\d{9}$/),
    email: z.union([z.string().trim().email().max(254), z.literal("")]).optional(),
    universitySlug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .max(160)
      .nullable(),
    programSlug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .max(160)
      .nullable(),
    sourcePath: z.string().max(500),
    message: z.string().max(2_000),
    contactChannel: contactChannelSchema,
    consentGiven: z.literal(true),
    consentText: z.string().max(500),
    consentVersion: z.literal("counselling-2026.09"),
    shareWithUniversity: z.boolean(),
    universityShareConsentVersion: z.literal("university-share-2026.09").nullable(),
    universityShareConsentText: z.string().max(500).nullable(),
    qualification: z.enum(["Student", "Parent"]).nullable(),
    goal: z.string().max(160).nullable(),
    utmSource: z.string().max(160).nullable(),
    utmMedium: z.string().max(160).nullable(),
    utmCampaign: z.string().max(160).nullable(),
    referrer: z.string().max(500).nullable(),
    turnstileToken: z.string().max(2_048).nullable(),
    website: z.string().max(200),
    elapsedMs: z.number().int().min(0).max(86_400_000),
  })
  .superRefine((lead, context) => {
    if (lead.contactChannel === "email" && !lead.email) {
      context.addIssue({
        code: "custom",
        path: ["email"],
        message: "Email is required for an email response.",
      });
    }

    if (
      lead.shareWithUniversity &&
      (!lead.universitySlug ||
        !lead.universityShareConsentVersion ||
        !lead.universityShareConsentText)
    ) {
      context.addIssue({
        code: "custom",
        path: ["shareWithUniversity"],
        message: "University-sharing consent is incomplete.",
      });
    }
  });

type IntakeResult =
  | { ok: true; continueUrl?: string }
  | {
      ok: false;
      reason: "duplicate" | "rate_limited" | "unavailable" | "verification_failed" | "invalid";
    };
type IntakeFailure = Extract<IntakeResult, { ok: false }>;

type RateWindow = { count: number; startedAt: number };

const rateWindows = new Map<string, RateWindow>();
const WINDOW_MS = 10 * 60 * 1_000;
const MAX_ATTEMPTS_PER_WINDOW = 12;
const MAX_BODY_BYTES = 12_000;
const MAX_RATE_BUCKETS = 2_000;

function json(result: IntakeResult, status = 200) {
  return Response.json(result, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function getClientBucket(request: Request) {
  const cloudflareAddress = request.headers.get("cf-connecting-ip")?.trim();
  if (import.meta.env.PROD) return cloudflareAddress || "unavailable";

  return (
    cloudflareAddress ||
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unavailable"
  );
}

async function createDatabaseClientBucket(request: Request) {
  const cloudflareAddress = request.headers.get("cf-connecting-ip")?.trim();
  const developmentAddress =
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "local-development";
  const networkAddress = import.meta.env.PROD
    ? cloudflareAddress
    : cloudflareAddress || developmentAddress;
  const configuredSecret = process.env["LEAD_BUCKET_SECRET"];

  // Production is intentionally fail-closed: the database limiter must never
  // collapse visitors into one server-egress bucket or store a raw address.
  if (
    import.meta.env.PROD &&
    (!networkAddress || !configuredSecret || configuredSecret.length < 32)
  ) {
    return null;
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(configuredSecret || "local-development-only"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`dekhocampus-lead-intake\u0000${networkAddress}`),
  );
  const digest = Array.from(new Uint8Array(signature), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");

  return `v1_${digest}`;
}

function isRateLimited(bucket: string) {
  const now = Date.now();
  const current = rateWindows.get(bucket);

  if (!current || now - current.startedAt >= WINDOW_MS) {
    rateWindows.set(bucket, { count: 1, startedAt: now });
    return false;
  }

  current.count += 1;
  return current.count > MAX_ATTEMPTS_PER_WINDOW;
}

function pruneRateWindows() {
  if (rateWindows.size <= MAX_RATE_BUCKETS) return;
  const oldestAllowed = Date.now() - WINDOW_MS;
  for (const [key, value] of rateWindows) {
    if (value.startedAt < oldestAllowed) rateWindows.delete(key);
  }

  if (rateWindows.size <= MAX_RATE_BUCKETS) return;
  const excess = rateWindows.size - MAX_RATE_BUCKETS;
  const oldest = [...rateWindows.entries()]
    .sort(([, left], [, right]) => left.startedAt - right.startedAt)
    .slice(0, excess);
  for (const [key] of oldest) rateWindows.delete(key);
}

type BodyReadResult =
  { ok: true; body: string } | { ok: false; reason: "too_large" | "read_error" };

async function readBodyWithLimit(request: Request, maximumBytes: number): Promise<BodyReadResult> {
  if (!request.body) return { ok: true, body: "" };

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let body = "";
  let bytesRead = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesRead += value.byteLength;
      if (bytesRead > maximumBytes) {
        await reader.cancel("request body exceeds the intake limit");
        return { ok: false, reason: "too_large" };
      }
      body += decoder.decode(value, { stream: true });
    }
    return { ok: true, body: body + decoder.decode() };
  } catch {
    return { ok: false, reason: "read_error" };
  } finally {
    reader.releaseLock();
  }
}

function logIntakeFailure(request: Request, code: string) {
  const cfRay = request.headers.get("cf-ray")?.match(/^[a-zA-Z0-9-]{1,80}$/)?.[0] ?? "missing";
  console.error("lead_intake_failure", { code, cfRay });
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

type TurnstileResponse = {
  success?: boolean;
  action?: string;
  hostname?: string;
};

async function verifyTurnstile(request: Request, token: string | null) {
  const secret = process.env["TURNSTILE_SECRET_KEY"];
  const isProduction = import.meta.env.PROD;

  // Local development remains usable without production credentials. A
  // production deployment fails closed when the secret is not configured.
  if (!secret) return !isProduction;
  if (!token) return false;

  const formData = new FormData();
  formData.set("secret", secret);
  formData.set("response", token);
  formData.set("idempotency_key", crypto.randomUUID());

  const clientIp = request.headers.get("cf-connecting-ip")?.trim();
  if (clientIp) formData.set("remoteip", clientIp);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    if (!response.ok) {
      logIntakeFailure(request, "turnstile_unavailable");
      return false;
    }

    const result = (await response.json()) as TurnstileResponse;
    if (!result.success || result.action !== "counselling_lead") return false;

    const requestHostname = new URL(request.url).hostname.toLowerCase();
    const configuredHostnames = (process.env["TURNSTILE_ALLOWED_HOSTNAMES"] ?? "")
      .split(",")
      .map((hostname) => hostname.trim().toLowerCase())
      .filter(Boolean);
    const allowedHostnames = new Set([requestHostname, ...configuredHostnames]);

    return Boolean(result.hostname && allowedHostnames.has(result.hostname.toLowerCase()));
  } catch {
    logIntakeFailure(request, "turnstile_unreachable");
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

const COUNSELLING_CONSENT_TEXT =
  "Use my submitted details to provide the counselling response I requested. I can withdraw permission at any time.";

async function storeLead(
  lead: z.infer<typeof leadSchema>,
  clientBucket: string,
): Promise<IntakeResult> {
  if (lead.consentText !== COUNSELLING_CONSENT_TEXT) return { ok: false, reason: "invalid" };

  const database = await getDatabase();
  if (lead.shareWithUniversity) {
    const university = await database
      .prepare("SELECT name FROM universities WHERE slug = ? AND published = 1")
      .bind(lead.universitySlug)
      .first<{ name: string }>();
    const expectedText = university
      ? `You may share these enquiry details only with ${university.name} for this request. This is optional and is not selected by default.`
      : null;
    if (!expectedText || lead.universityShareConsentText !== expectedText) {
      return { ok: false, reason: "invalid" };
    }
  }

  const now = new Date().toISOString();
  const rateStatement = database
    .prepare(
      `INSERT INTO lead_intake_rate_limits (bucket_hash, window_started_at, attempts, last_attempt_at)
       VALUES (?, unixepoch(), 1, unixepoch())
       ON CONFLICT(bucket_hash) DO UPDATE SET
         window_started_at = CASE WHEN window_started_at <= unixepoch() - 600 THEN unixepoch() ELSE window_started_at END,
         attempts = CASE WHEN window_started_at <= unixepoch() - 600 THEN 1 ELSE attempts + 1 END,
         last_attempt_at = unixepoch()`,
    )
    .bind(clientBucket);
  const insertStatement = database
    .prepare(
      `INSERT INTO leads (
        id, full_name, phone, email, university_slug, program_slug, source_path, message,
        contact_channels, consent_given, consent_version, consent_text, consent_at,
        share_with_university, university_share_consent_at, university_share_consent_version,
        university_share_consent_text, qualification, goal, utm_source, utm_medium, utm_campaign,
        referrer, status, created_at
      )
      SELECT ?,?,?,?,?,?,?,?, ?,1,?,?,?, ?,?,?,?, ?,?,?,?,?,?, 'new', ?
      WHERE (SELECT attempts FROM lead_intake_rate_limits WHERE bucket_hash = ?) <= 5
        AND (SELECT count(*) FROM leads WHERE unixepoch(created_at) > unixepoch() - 60) < 60
        AND NOT EXISTS (
          SELECT 1 FROM leads WHERE phone = ? AND unixepoch(created_at) > unixepoch() - 120
        )`,
    )
    .bind(
      crypto.randomUUID(),
      lead.fullName,
      lead.phone,
      lead.email?.trim() || null,
      lead.universitySlug,
      lead.programSlug,
      lead.sourcePath,
      lead.message,
      JSON.stringify([lead.contactChannel]),
      lead.consentVersion,
      lead.consentText,
      now,
      lead.shareWithUniversity ? 1 : 0,
      lead.shareWithUniversity ? now : null,
      lead.universityShareConsentVersion,
      lead.universityShareConsentText,
      lead.qualification,
      lead.goal,
      lead.utmSource,
      lead.utmMedium,
      lead.utmCampaign,
      lead.referrer,
      now,
      clientBucket,
      lead.phone,
    );

  const [, insertResult] = await database.batch([rateStatement, insertStatement]);
  if ((insertResult?.meta.changes ?? 0) > 0) return { ok: true };

  const [rate, duplicate] = await Promise.all([
    database
      .prepare("SELECT attempts FROM lead_intake_rate_limits WHERE bucket_hash = ?")
      .bind(clientBucket)
      .first<{ attempts: number }>(),
    database
      .prepare(
        "SELECT 1 AS found FROM leads WHERE phone = ? AND unixepoch(created_at) > unixepoch() - 120 LIMIT 1",
      )
      .bind(lead.phone)
      .first<{ found: number }>(),
  ]);
  if ((rate?.attempts ?? 0) > 5) return { ok: false, reason: "rate_limited" };
  if (duplicate) return { ok: false, reason: "duplicate" };
  return { ok: false, reason: "rate_limited" };
}

export const Route = createFileRoute("/api/leads")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isSameOrigin(request)) return json({ ok: false, reason: "invalid" }, 403);
        if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
          return json({ ok: false, reason: "invalid" }, 415);
        }

        const declaredLength = Number(request.headers.get("content-length") ?? 0);
        if (declaredLength > MAX_BODY_BYTES) return json({ ok: false, reason: "invalid" }, 413);

        const bucket = getClientBucket(request);
        if (isRateLimited(bucket)) return json({ ok: false, reason: "rate_limited" }, 429);
        pruneRateWindows();

        const bodyRead = await readBodyWithLimit(request, MAX_BODY_BYTES);
        if (!bodyRead.ok) {
          return json(
            { ok: false, reason: "invalid" },
            bodyRead.reason === "too_large" ? 413 : 400,
          );
        }

        let parsedJson: unknown;
        try {
          parsedJson = JSON.parse(bodyRead.body);
        } catch {
          return json({ ok: false, reason: "invalid" }, 400);
        }

        const parsed = leadSchema.safeParse(parsedJson);
        if (!parsed.success) return json({ ok: false, reason: "invalid" }, 400);

        // Quietly accept obvious automation without writing PII or teaching a bot
        // which trap it triggered.
        if (parsed.data.website || parsed.data.elapsedMs < 900) return json({ ok: true });

        if (!(await verifyTurnstile(request, parsed.data.turnstileToken))) {
          return json({ ok: false, reason: "verification_failed" }, 400);
        }

        const clientBucket = await createDatabaseClientBucket(request);
        if (!clientBucket) return json({ ok: false, reason: "unavailable" }, 503);

        const course = getLearningCourse(parsed.data.externalCourseId);
        try {
          const result = await storeLead(
            course
              ? {
                  ...parsed.data,
                  goal: course.title,
                  message: JSON.stringify({
                    externalCourseId: course.id,
                    provider: course.provider,
                    course: course.title,
                    requestedChannel: parsed.data.contactChannel,
                  }),
                }
              : parsed.data,
            clientBucket,
          );
          if (!result.ok) {
            const status =
              result.reason === "rate_limited"
                ? 429
                : result.reason === "duplicate"
                  ? 409
                  : result.reason === "invalid"
                    ? 400
                    : 503;
            return json(result, status);
          }
        } catch {
          logIntakeFailure(request, "d1_unreachable");
          return json({ ok: false, reason: "unavailable" }, 503);
        }

        return json({ ok: true, ...(course ? { continueUrl: course.href } : {}) });
      },
    },
  },
});
