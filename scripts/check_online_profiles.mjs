import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const modules = new Map();
function load(path) {
  if (modules.has(path)) return modules.get(path);
  const exports = {};
  modules.set(path, exports);
  const code = ts.transpileModule(fs.readFileSync(path, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    Date,
    URL,
    console,
    require(name) {
      if (name.startsWith("@/data/") || name === "@/lib/online-paths")
        return load(`src/${name.slice(2)}.ts`);
      return {};
    },
  });
  return exports;
}
const data = load("src/data/universities.ts");
const paths = load("src/lib/online-paths.ts");
const details = load("src/data/online-profile-details.ts");
const template = paths;
const publicSlugs = data.universities.map(paths.universityPublicSlug);
if (process.argv.includes("--catalogue")) {
  const urls = data.universities.flatMap((u) => [
    paths.universityPath(u),
    ...data.getUniversityPrograms(u).map((p) => paths.coursePath(u, p.slug)),
  ]);
  assert.equal(new Set(urls).size, urls.length, "Public course paths must be unique");
  for (let i = 0; i < urls.length; i += 4) {
    await Promise.all(
      urls.slice(i, i + 4).map(async (path) => {
        const response = await fetch(`http://127.0.0.1:8092${path}`, {
          signal: AbortSignal.timeout(20000),
        });
        assert.equal(response.status, 200, path);
        assert.match(await response.text(), /class="online-profile(?:\s[^\"]*)?"/, path);
      }),
    );
  }
  console.log(`Catalogue HTTP passed: ${urls.length} unique university and general course pages.`);
}
assert.equal(new Set(publicSlugs).size, publicSlugs.length, "University IDs must be unique");
let courses = 0;
for (const u of data.universities) {
  assert.equal(paths.resolveOnlineUniversity(paths.universityPublicSlug(u))?.slug, u.slug);
  assert.equal(paths.resolveOnlineUniversity(`${paths.universityPublicSlug(u)}-wrong`), undefined);
  for (const p of data.getUniversityPrograms(u)) {
    const resolved = paths.resolveOnlineCourse(u, paths.coursePublicSlug(u, p.slug));
    assert.equal(resolved.program.slug, p.slug);
    assert.equal(resolved.university.slug, u.slug);
    assert.equal(
      template.publishedCourseFee({
        ...resolved,
        university: { ...u, verificationCurrent: false },
      }),
      null,
    );
    courses++;
  }
}
assert.equal(
  paths.universityPublicSlug(data.getUniversity("amity-university-online")),
  "amity-university-online-900012",
);
assert.equal(paths.universityPublicSlug(data.getUniversity("lpu-online")), "lpu-online-900011");
const coursePaths = [];
for (const s of details.specialistCourses) {
  const u = data.getUniversity(s.universitySlug);
  const resolved = paths.resolveOnlineCourse(u, s.publicSlug);
  assert.equal(resolved.specialist.name, s.name);
  assert.equal(template.publishedCourseFee(resolved, "2026-10-24"), s.fee);
  assert.equal(
    template.publishedCourseFee(resolved, "2026-11-01"),
    null,
    "Expired fee must stay hidden",
  );
  assert.equal(
    template.publishedCourseFee(resolved, "2026-10-01"),
    null,
    "Future-dated evidence must stay hidden",
  );
  const differentUniversity = data.universities.find((other) => other.slug !== u.slug);
  assert.equal(
    paths.resolveOnlineCourse(differentUniversity, s.publicSlug),
    undefined,
    "Cross-university course must not resolve",
  );
  coursePaths.push(paths.specialistPath(s));
}
assert.ok(
  coursePaths.includes(
    "/online-universities/amity-university-online-900012/courses-fees/mba-online-in-data-science-1104242",
  ),
);
assert.ok(
  coursePaths.includes(
    "/online-universities/jiit-online-900015/courses-fees/mba-online-in-marketing-management-1104317",
  ),
);
if (process.argv.includes("--http")) {
  const origin = "http://127.0.0.1:8092";
  const requested = [
    ...coursePaths,
    "/online-universities/amity-university-online-900012",
    "/online-universities/lpu-online-900011",
  ];
  for (const path of requested) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, /class="online-profile(?:\s[^\"]*)?"/);
    assert.ok(
      html.includes(
        `aria-label="${coursePaths.includes(path) ? "Course" : "University"} sections"`,
      ),
    );
    assert.ok(html.includes('id="apply"'));
    assert.ok(html.includes('class="profile-mobile-banner"'));
    const tabs = html.match(/<nav class="profile-tabs"[\s\S]*?<\/nav>/)?.[0];
    assert.ok(tabs, "Shared profile tabs missing");
    const tabLinks = [...tabs.matchAll(/<a href="([^"]+)"([^>]*)>/g)];
    const universityUrl = path.split("/courses-fees")[0];
    assert.equal(
      tabLinks.length,
      3,
      "Course and university pages must have the same three page tabs",
    );
    assert.equal(
      tabLinks.map((item) => item[1]).join(","),
      [universityUrl, `${universityUrl}/courses-fees`, `${universityUrl}/faculty`].join(","),
    );
    const activeTab = coursePaths.includes(path) ? 1 : 0;
    assert.ok(tabLinks[activeTab][2].includes('aria-current="page"'));
    if (coursePaths.includes(path)) {
      assert.ok(
        html.indexOf('class="profile-toc"') < html.indexOf('id="highlights"'),
        "Course contents must be reachable before the details",
      );
      assert.ok(html.indexOf('id="highlights"') < html.indexOf('id="about-course"'));
    }
    assert.ok(
      html.includes('name="robots" content="noindex,follow"'),
      "Unreviewed entitlement must not be indexed",
    );
    assert.ok(!html.includes("FindMyCollege"));
    assert.ok(!html.includes("Ends in"));
    assert.ok(html.includes(`rel="canonical" href="https://online.dekhocampus.com${path}"`));
  }
  for (const tab of ["courses-fees", "faculty"]) {
    const response = await fetch(
      `${origin}/online-universities/amity-university-online-900012/${tab}`,
    );
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(
      html.includes(
        `href="/online-universities/amity-university-online-900012/${tab}" aria-current="page"`,
      ),
      `${tab} must highlight its active tab`,
    );
    if (tab === "faculty") assert.match(html, /<h1>Amity University Online Faculty<\/h1>/);
  }
  for (const path of [
    "/online-universities/not-real-900012",
    "/online-universities/amity-university-online-900012/courses-fees/not-real-123",
  ]) {
    assert.equal((await fetch(origin + path)).status, 404, path);
  }
  for (const [legacy, target] of [
    [
      "/universities/amity-university-online",
      "/online-universities/amity-university-online-900012",
    ],
    ["/universities/lpu-online", "/online-universities/lpu-online-900011"],
    [
      "/universities/amity-university-online/online-mba",
      paths.coursePath(data.getUniversity("amity-university-online"), "online-mba"),
    ],
  ]) {
    const response = await fetch(origin + legacy, { redirect: "manual" });
    assert.equal(response.status, 301, legacy);
    assert.equal(new URL(response.headers.get("location"), origin).pathname, target);
  }
  const html = await (await fetch(origin + requested[0])).text();
  const destinations = [
    ...new Set([...html.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1].split(/[?#]/)[0])),
  ];
  for (let i = 0; i < destinations.length; i += 4) {
    await Promise.all(
      destinations.slice(i, i + 4).map(async (path) => {
        assert.equal((await fetch(origin + path)).status, 200, `Dead internal link: ${path}`);
      }),
    );
  }
  console.log(
    `HTTP passed: 4 requested pages, tabs, redirects, 404s, canonicals and ${destinations.length} internal destinations.`,
  );
}
console.log(
  `Profile logic passed: ${publicSlugs.length} unique university URLs, ${courses} mapped courses, 2 specialist URLs, cross-university isolation and fee expiry guards.`,
);
