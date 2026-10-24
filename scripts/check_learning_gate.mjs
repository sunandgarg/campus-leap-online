import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { z } from "zod";

const courses = JSON.parse(fs.readFileSync("src/data/featured-learning.json", "utf8"));
function compile(path, require, production = false, extra = {}) {
  const source = fs
    .readFileSync(path, "utf8")
    .replaceAll("import.meta.env.PROD", String(production));
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, {
    exports,
    require,
    Request,
    Response,
    FormData,
    AbortController,
    URL,
    TextEncoder,
    TextDecoder,
    crypto,
    setTimeout,
    clearTimeout,
    console: { error() {} },
    ...extra,
  });
  return exports;
}
const helper = compile("src/lib/featured-learning.ts", () => ({ default: courses }));
for (const course of courses) {
  assert.equal(
    helper.learningContinuation(course.id, { ok: true, continueUrl: course.href }),
    course.href,
  );
  assert.equal(
    helper.learningContinuation(course.id, { ok: false, continueUrl: course.href }),
    null,
  );
  assert.equal(helper.learningContinuation(course.id, { ok: true }), null);
  assert.equal(
    helper.learningContinuation(course.id, { ok: true, continueUrl: "https://evil.example/" }),
    null,
  );
}
assert.equal(
  helper.learningContinuation("unknown", { ok: true, continueUrl: courses[0].href }),
  null,
);

let failure = null;
let insertValues = [];
const database = {
  prepare(sql) {
    return {
      bind(...values) {
        if (sql.includes("INSERT INTO leads")) insertValues = values;
        return {
          first: async () =>
            sql.includes("SELECT attempts")
              ? { attempts: failure === "rate" ? 6 : 1 }
              : failure === "duplicate"
                ? { found: 1 }
                : null,
        };
      },
    };
  },
  async batch() {
    if (failure === "database") throw Error("simulated database failure");
    return [{ meta: { changes: 1 } }, { meta: { changes: failure ? 0 : 1 } }];
  },
};
const api = compile(
  "src/routes/api.leads.ts",
  (name) => {
    if (name === "@tanstack/react-router") return { createFileRoute: () => (options) => options };
    if (name === "zod") return { z };
    if (name === "@/lib/featured-learning") return helper;
    if (name === "@/lib/db.server") return { getDatabase: async () => database };
    throw Error(`Unexpected module ${name}`);
  },
  true,
  {
    process: {
      env: {
        TURNSTILE_SECRET_KEY: "test-only",
        LEAD_BUCKET_SECRET: "test-only-long-secret-not-live-000000000",
      },
    },
    fetch: async () => ({
      ok: true,
      json: async () => ({
        success: failure !== "verification",
        action: "counselling_lead",
        hostname: "online.dekhocampus.com",
      }),
    }),
  },
);
const lead = {
  fullName: "Test Learner",
  phone: "9000000000",
  email: "",
  universitySlug: null,
  programSlug: null,
  sourcePath: "/#featured-learning",
  message: "test",
  contactChannel: "call",
  consentGiven: true,
  consentText:
    "Use my submitted details to provide the counselling response I requested. I can withdraw permission at any time.",
  consentVersion: "counselling-2026.09",
  shareWithUniversity: false,
  universityShareConsentVersion: null,
  universityShareConsentText: null,
  qualification: null,
  goal: null,
  utmSource: null,
  utmMedium: null,
  utmCampaign: null,
  referrer: null,
  turnstileToken: "unit-test-token",
  website: "",
  elapsedMs: 3000,
  externalCourseId: courses[0].id,
};
let address = 0;
async function post(overrides = {}, origin = "https://online.dekhocampus.com") {
  const request = new Request("https://online.dekhocampus.com/api/leads", {
    method: "POST",
    headers: {
      origin,
      "content-type": "application/json",
      "cf-connecting-ip": `192.0.2.${++address}`,
    },
    body: JSON.stringify({ ...lead, ...overrides }),
  });
  const response = await api.Route.server.handlers.POST({ request });
  return { status: response.status, body: await response.json() };
}
for (const course of courses) {
  const result = await post({ externalCourseId: course.id });
  assert.equal(result.status, 200);
  assert.equal(result.body.continueUrl, course.href);
  assert.ok(insertValues.includes(course.title), "Save the selected course with the lead");
  assert.ok(
    insertValues.some(
      (value) => typeof value === "string" && value.includes(`"externalCourseId":"${course.id}"`),
    ),
  );
}
assert.equal(
  (await post({ externalCourseId: undefined })).body.continueUrl,
  undefined,
  "Ordinary lead forms remain unchanged",
);
const compactContext = JSON.stringify({
  state: "Maharashtra",
  highestQualification: "Graduate",
  requestContext: "Online MBA",
  requestedChannel: "call",
  consentVersion: "counselling-2026.09",
});
assert.equal(
  (
    await post({
      externalCourseId: undefined,
      message: compactContext,
      universitySlug: "amity-university-online",
      programSlug: "online-mba",
    })
  ).status,
  200,
);
assert.ok(
  insertValues.includes(compactContext),
  "Preserve compact-form state, qualification and page context with the lead",
);
assert.ok(insertValues.includes("amity-university-online") && insertValues.includes("online-mba"));
for (const [overrides, status] of [
  [{ externalCourseId: "https://evil.example" }, 400],
  [{ consentGiven: false }, 400],
  [{ phone: "123" }, 400],
  [{ website: "spam" }, 200],
  [{ elapsedMs: 0 }, 200],
]) {
  const result = await post(overrides);
  assert.equal(result.status, status);
  assert.equal(result.body.continueUrl, undefined);
}
for (const [mode, status] of [
  ["database", 503],
  ["duplicate", 409],
  ["rate", 429],
  ["verification", 400],
]) {
  failure = mode;
  const result = await post();
  assert.equal(result.status, status);
  assert.equal(result.body.continueUrl, undefined, `${mode} must not unlock a provider link`);
}
failure = null;
assert.equal((await post({}, "https://evil.example")).status, 403);
console.log(
  `Learning gate passed: ${courses.length} saved course contexts, approved destinations only, consent/phone validation, bot traps, database/duplicate/rate/security failures and ordinary form compatibility. No network or real leads used.`,
);
