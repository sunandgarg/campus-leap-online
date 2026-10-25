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
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    Date,
    URL,
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
const navigation = load("src/data/header-navigation.ts");
const before = data.universities.map((item) => item.slug).join(",");
const { universityLinks, degrees, specialisations } = navigation.getHeaderNavigation();
assert.equal(universityLinks.length, data.universities.length);
assert.equal(new Set(universityLinks.map((item) => item.href)).size, universityLinks.length);
assert.equal(universityLinks[0].university.slug, "amity-university-online");
assert.equal(
  degrees
    .slice(0, 6)
    .map((item) => item.code)
    .join(","),
  "MBA,MCA,M.Com,BBA,BCA,B.Com",
);
assert.equal(
  data.universities.map((item) => item.slug).join(","),
  before,
  "Navigation sorting must not mutate the catalogue",
);
const hrefs = new Set(["/news", "/finder", "/compare", "/scholarships"]);
for (const item of universityLinks) {
  assert.ok(paths.resolveOnlineUniversity(item.href.split("/").pop()));
}
for (const degree of degrees) {
  hrefs.add(`/programs/${degree.slug}`);
  for (const entry of navigation.getHeaderDegreeUniversities(degree.slug)) {
    const university = paths.resolveOnlineUniversity(entry.href.split("/")[2]);
    assert.ok(paths.resolveOnlineCourse(university, entry.href.split("/").pop()));
    hrefs.add(entry.href);
  }
}
assert.equal(navigation.getHeaderDegreeUniversities("not-a-course").length, 0);
assert.equal(navigation.getHeaderSpecialisationEntries("not-a-specialisation").length, 0);
for (const specialisation of specialisations) {
  const entries = navigation.getHeaderSpecialisationEntries(specialisation.name);
  assert.ok(entries.length > 0);
  for (const entry of entries) {
    if (entry.university) {
      assert.ok(
        entry.university.verificationCurrent,
        "Do not invent university specialisation mappings",
      );
      assert.ok(entry.href.endsWith("#other-specialisations"));
    } else {
      assert.ok(
        entry.href.startsWith("/specialisations/"),
        "Unmapped pathways must link to a guide, not a claimed university offer",
      );
    }
    hrefs.add(entry.href);
  }
}
const source = fs.readFileSync("src/components/site/site-header.tsx", "utf8");
for (const control of [
  "aria-expanded={active === label}",
  'event.key === "Escape"',
  'event.key === "ArrowDown"',
  "onMouseEnter",
  'aria-label="Close navigation"',
  "toggleTheme",
  'aria-label="All pages"',
])
  assert.ok(source.includes(control), control);
assert.ok(
  !/50%|countdown|Ends in|120\+|salaries that match/.test(source),
  "Do not copy unsupported marketing claims",
);
const root = fs.readFileSync("src/routes/__root.tsx", "utf8");
assert.ok(
  root.includes("<SiteHeader />") && !root.includes("<HomeHeader />"),
  "Homepage and profile pages must share navigation",
);
const css = fs.readFileSync("src/styles/header.css", "utf8");
assert.ok(css.includes("repeat(3, minmax(0, 1fr))"));
assert.ok(css.includes("prefers-reduced-motion"));

if (process.argv.includes("--http")) {
  const homeResponse = await fetch("http://127.0.0.1:8092/");
  assert.equal(homeResponse.status, 200);
  const home = await homeResponse.text();
  for (const label of [
    "Top Universities",
    "Trending Degrees",
    "Trending Specializations",
    "News",
    "Scholarships",
    "Course Finder",
  ])
    assert.ok(home.includes(label), label);
  const mainNav = home.match(/<nav class="reference-desktop-nav"[\s\S]*?<\/nav>/)?.[0];
  assert.ok(mainNav?.includes('href="/news"'), "News must be a direct header link");
  assert.ok(!mainNav?.includes(">More<"), "More must be removed from the header");
  for (const href of [...hrefs]) {
    const response = await fetch(`http://127.0.0.1:8092${href}`, {
      signal: AbortSignal.timeout(20000),
    });
    assert.equal(response.status, 200, href);
  }
  const articleSearch = await fetch("http://127.0.0.1:8092/search?q=DEB-ID");
  assert.equal(articleSearch.status, 200);
  assert.ok(
    (await articleSearch.text()).includes("/news/deb-id-online-degree-checklist"),
    "Header search must find articles as advertised",
  );
  console.log(
    `Header HTTP passed: ${hrefs.size} course, specialisation and resource destinations.`,
  );
}
console.log(
  `Header navigation passed: ${universityLinks.length} university links, ${degrees.length} degrees, ${specialisations.length} specialisations, catalogue isolation and accessible controls.`,
);
