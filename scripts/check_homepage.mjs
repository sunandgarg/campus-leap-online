import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const logos = JSON.parse(await readFile(new URL("src/data/bundled-university-logos.json", root)));
for (const [slug, path] of Object.entries(logos)) {
  assert.match(slug, /^[a-z0-9-]+$/);
  assert.match(path, /^\/university-logos\/[a-z0-9-]+-[a-f0-9]{12}\.webp$/);
  assert.ok((await stat(new URL(`public${path}`, root))).size > 0, `Empty logo: ${slug}`);
}
for (const slug of [
  "amity-university-online",
  "lpu-online",
  "manipal-university-online",
  "chandigarh-university-online",
  "jain-university-online",
  "dy-patil-university-online",
  "shoolini-university-online",
  "sikkim-manipal-university-online",
]) {
  assert.ok(logos[slug], `Missing homepage logo: ${slug}`);
}
for (const guide of ["degree-checklist", "fee-checklist", "admission-questions"]) {
  const html = await readFile(new URL(`public/guides/${guide}.html`, root), "utf8");
  assert.ok(html.includes('src="guide.js"'), `Print handler missing: ${guide}`);
  assert.ok(!html.includes("onclick="), `CSP-incompatible handler: ${guide}`);
}
const headers = await readFile(new URL("public/_headers", root), "utf8");
assert.match(
  headers,
  /\/university-logos\/\*\s+cache-control: public, max-age=31536000, immutable/,
);
console.log(
  `Homepage assets passed: ${Object.keys(logos).length} bundled logos, 8 featured marks, 3 printable guides and cache rule.`,
);
