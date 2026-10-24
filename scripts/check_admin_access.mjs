import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { createLocalJWKSet, exportJWK, generateKeyPair, jwtVerify, SignJWT } from "jose";

const { publicKey, privateKey } = await generateKeyPair("RS256");
const jwk = { ...(await exportJWK(publicKey)), kid: "test-key", alg: "RS256" };
const localKeys = createLocalJWKSet({ keys: [jwk] });
const exports = {};
let keyLoads = 0;
vm.runInNewContext(
  ts.transpileModule(fs.readFileSync("src/lib/admin-access.ts", "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText,
  {
    exports,
    URL,
    Map,
    require: () => ({
      jwtVerify,
      createRemoteJWKSet: () => {
        keyLoads++;
        return localKeys;
      },
    }),
  },
);
const { hasAdminAccess, isProtectedAdminPath } = exports;
for (const path of [
  "/admin",
  "/admin/catalogue",
  "/api/admin/data",
  "/%61dmin",
  "/api/%61dmin/data",
  "/api%2fadmin/data",
  "/api/%2561dmin/data",
])
  assert.equal(isProtectedAdminPath(path), true, path);
for (const path of ["/news", "/api/leads", "/administrator", "/news/admin-guide"])
  assert.equal(isProtectedAdminPath(path), false, path);
const settings = {
  ACCESS_TEAM_DOMAIN: "https://example.cloudflareaccess.com",
  ACCESS_POLICY_AUD: "staff-app",
};
const request = (token) =>
  new Request("https://online.dekhocampus.com/api/admin/data", {
    headers: token ? { "Cf-Access-Jwt-Assertion": token } : {},
  });
async function sign({
  issuer = settings.ACCESS_TEAM_DOMAIN,
  audience = "staff-app",
  expires = "1h",
  expiry = true,
} = {}) {
  let jwt = new SignJWT({ email: "test@example.invalid" })
    .setProtectedHeader({ alg: "RS256", kid: "test-key" })
    .setIssuer(issuer)
    .setAudience(audience)
    .setSubject("test-staff")
    .setIssuedAt();
  if (expiry) jwt = jwt.setExpirationTime(expires);
  return jwt.sign(privateKey);
}
assert.equal(await hasAdminAccess(request(), settings), false);
assert.equal(await hasAdminAccess(request("forged"), settings), false);
const valid = await sign();
assert.equal(await hasAdminAccess(request(valid), {}), false);
assert.equal(
  await hasAdminAccess(request(valid), {
    ...settings,
    ACCESS_TEAM_DOMAIN: "https://attacker.invalid",
  }),
  false,
);
assert.equal(await hasAdminAccess(request(valid), settings), true);
assert.equal(
  await hasAdminAccess(request(await sign({ audience: "another-app" })), settings),
  false,
);
assert.equal(
  await hasAdminAccess(
    request(await sign({ issuer: "https://other.cloudflareaccess.com" })),
    settings,
  ),
  false,
);
assert.equal(
  await hasAdminAccess(request(await sign({ expires: "1 second ago" })), settings),
  false,
);
assert.equal(await hasAdminAccess(request(await sign({ expiry: false })), settings), false);
assert.equal(await hasAdminAccess(request(`${valid.slice(0, -10)}tamperedxx`), settings), false);
assert.equal(keyLoads, 1);
if (process.argv.includes("--http")) {
  const origin = process.argv[process.argv.indexOf("--http") + 1] || "http://127.0.0.1:8092";
  for (const path of [
    "/admin",
    "/api/admin/data?entity=leads",
    "/api/admin/bootstrap",
    "/api/%61dmin/data?entity=leads",
    "/api%2fadmin/data?entity=leads",
  ]) {
    for (const token of [null, "forged"]) {
      const response = await fetch(`${origin}${path}`, {
        headers: token ? { "Cf-Access-Jwt-Assertion": token } : {},
        redirect: "manual",
      });
      assert.equal(response.status, 403, path);
    }
  }
  console.log(`Admin HTTP passed: anonymous and forged-header requests blocked at ${origin}.`);
}
console.log(
  "Access verification passed: signature, issuer, audience, expiry, required claims, missing config, malformed tokens and cached signing keys.",
);
