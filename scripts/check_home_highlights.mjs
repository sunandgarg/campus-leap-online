import assert from "node:assert/strict";
import fs from "node:fs";

const courses = JSON.parse(fs.readFileSync("src/data/featured-learning.json", "utf8"));
const allowedHosts = new Set([
  "www.upgrad.com",
  "grow.google",
  "www.scaler.com",
  "skillshop.exceedlms.com",
]);
assert.equal(courses.length, 6);
assert.equal(new Set(courses.map((course) => course.id)).size, 6);
assert.equal(courses[0].provider, "Google");
assert.equal(courses[0].pricing, "Free");
assert.ok(courses.slice(1).every((course) => course.pricing === "Paid"));
assert.equal(new Set(courses.map((course) => course.category)).size, 5);
assert.equal(new Set(courses.map((course) => course.href)).size, courses.length);
for (const course of courses) {
  const url = new URL(course.href);
  assert.equal(url.protocol, "https:");
  assert.ok(allowedHosts.has(url.hostname), "Only official provider links");
  assert.ok(fs.existsSync(`public${course.logo}`), "Provider logos must be bundled");
  const logo = fs.readFileSync(`public${course.logo}`, "utf8");
  assert.ok(logo.includes("<svg"));
  assert.ok(!/<script|onload=|<foreignObject/i.test(logo));
}
const home = fs.readFileSync("src/components/site/home-sections.tsx", "utf8");
const panel = fs.readFileSync("src/components/site/home-fee-comparison.tsx", "utf8");
const learning = fs.readFileSync("src/components/site/featured-learning.tsx", "utf8");
const css = fs.readFileSync("src/styles.css", "utf8");
assert.ok(!home.includes("Pause gentle motion"));
assert.ok(
  css.includes("animation: study-bob 2s ease-in-out 2 alternate"),
  "Uncontrolled motion must stop within 5 seconds",
);
assert.ok(css.includes("prefers-reduced-motion: reduce"));
assert.match(css, /\.ambition-filter-label\s*\{[^}]*background: #fff0e2/);
assert.match(css, /\.lucide-badge-check > path:last-child\s*\{[^}]*stroke: #fff/);
assert.ok(panel.includes("<FeaturedLearning />"));
assert.ok(learning.includes("not bundled degree benefits or partnerships"));
assert.ok(learning.includes("<DialogTrigger asChild>"));
assert.ok(learning.includes("externalCourseId={course.id}"));
assert.ok(!learning.includes("href="), "Cards must not bypass the lead gate");
assert.ok(!learning.includes("Free learning"));
assert.ok(
  learning.includes('aria-label="Skill courses, scroll for more" tabIndex={0}') ||
    (learning.includes('aria-label="Skill courses, scroll for more"') &&
      learning.includes("tabIndex={0}")),
);
assert.ok(learning.includes("data-price={course.pricing}"));
assert.match(css, /\.skills-course-list\s*\{[^}]*height: 288px;[^}]*overflow-y: auto/);
console.log(
  "Homepage highlights passed: Google free first, 6 gated courses across 5 subjects, compact 3-row scrolling list, right-side price badges and bundled logos.",
);
