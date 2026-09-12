import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const contactChannelSchema = z.enum(["call", "whatsapp", "email"]);

const leadSchema = z
  .object({
    fullName: z.string().trim().min(2).max(100),
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
  | { ok: true }
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
  if (rateWindows.size < 1_000) return;
  const oldestAllowed = Date.now() - WINDOW_MS;
  for (const [key, value] of rateWindows) {
    if (value.startedAt < oldestAllowed) rateWindows.delete(key);
  }
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
    if (!response.ok) return false;

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
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

function mapRpcFailure(message: string): IntakeFailure {
  if (message.includes("duplicate_recent_enquiry")) return { ok: false, reason: "duplicate" };
  if (message.includes("rate_limit") || message.includes("intake_temporarily_busy")) {
    return { ok: false, reason: "rate_limited" };
  }
  return { ok: false, reason: "unavailable" };
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

        let rawBody: string;
        try {
          rawBody = await request.text();
        } catch {
          return json({ ok: false, reason: "invalid" }, 400);
        }
        if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
          return json({ ok: false, reason: "invalid" }, 413);
        }

        let parsedJson: unknown;
        try {
          parsedJson = JSON.parse(rawBody);
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

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin.rpc("submit_counselling_lead_from_server", {
          p_client_bucket: clientBucket,
          p_full_name: parsed.data.fullName,
          p_phone: parsed.data.phone,
          p_email: parsed.data.email || null,
          p_university_slug: parsed.data.universitySlug,
          p_program_slug: parsed.data.programSlug,
          p_source_path: parsed.data.sourcePath,
          p_message: parsed.data.message,
          p_contact_channels: [parsed.data.contactChannel],
          p_consent_given: parsed.data.consentGiven,
          p_consent_text: parsed.data.consentText,
          p_consent_version: parsed.data.consentVersion,
          p_share_with_university: parsed.data.shareWithUniversity,
          p_university_share_consent_version: parsed.data.universityShareConsentVersion,
          p_university_share_consent_text: parsed.data.universityShareConsentText,
          p_qualification: parsed.data.qualification,
          p_goal: parsed.data.goal,
          p_utm_source: parsed.data.utmSource,
          p_utm_medium: parsed.data.utmMedium,
          p_utm_campaign: parsed.data.utmCampaign,
          p_referrer: parsed.data.referrer,
        });

        if (error) {
          const failure = mapRpcFailure(error.message);
          const status =
            failure.reason === "rate_limited" ? 429 : failure.reason === "duplicate" ? 409 : 503;
          return json(failure, status);
        }

        return json({ ok: true });
      },
    },
  },
});
