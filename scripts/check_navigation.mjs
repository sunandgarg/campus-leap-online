import assert from "node:assert/strict";

const origin = "http://127.0.0.1:8092";
async function page(path) {
  const response = await fetch(origin + path, { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200, path);
  return response.text();
}
function links(html) {
  return [
    ...new Set([...html.matchAll(/href="(\/[^"]*)"/g)].map((match) => match[1].split(/[?#]/)[0])),
  ];
}
const home = await page("/");
const courseNavigation = home.match(
  /<nav aria-label="Choose an online course"[\s\S]*?<\/nav>/,
)?.[0];
assert.ok(courseNavigation, "Homepage course list missing");
assert.ok(courseNavigation.includes("ambition-card"), "Homepage degree browser missing");
assert.equal(
  (courseNavigation.match(/class="ambition-card"/g) || []).length,
  12,
  "Expected twelve course options in the two-row interest carousel",
);
assert.ok(home.includes('aria-label="Choose how to explore"'), "Two discovery paths missing");
assert.ok(home.includes('href="#explore-courses"'));
assert.ok(home.includes('href="#explore-universities"'));
assert.ok(home.includes('id="explore-universities"'));
assert.ok(home.includes('aria-label="View Amity University Online"'));
assert.ok(home.includes('aria-label="Explore by interest"'));
assert.ok(!home.includes("Know the course. Then choose the university."));
assert.ok(!home.includes("Have a university in mind? Start here."));
const universityFeeBar = home.match(
  /<div role="group" aria-label="Choose a university to compare MBA fees"[\s\S]*?<\/div>/,
)?.[0];
assert.ok(universityFeeBar, "University fee selector missing");
assert.equal(
  (universityFeeBar.match(/<button /g) || []).length,
  8,
  "Expected eight regional university selectors",
);
assert.ok(home.includes('id="compare-mba-fees"'), "Fee section anchor missing");
assert.ok(home.includes("View all courses"), "Desktop carousel needs a View all destination");
const optionalGuidesStart = home.lastIndexOf(
  "<details",
  home.indexOf("Need a little more clarity?"),
);
assert.ok(optionalGuidesStart > 0, "Secondary guidance disclosure missing");
for (const id of ["home-recognition-title", "home-budget-title", "home-study-title"]) {
  assert.ok(
    home.indexOf(`aria-labelledby="${id}"`) < optionalGuidesStart,
    `${id} must be visible without opening a disclosure`,
  );
}
assert.ok(!home.includes("Pause gentle motion"), "Removed motion control must not return");
for (const path of ["/programs", "/universities", "/compare", "/contact", "/search"]) {
  assert.ok(links(home).includes(path), `Missing direct homepage destination: ${path}`);
}
const catalogue = await page("/programs");
assert.ok(catalogue.includes("course-list-row"), "Course catalogue must use open rows");
const universityDirectory = await page("/universities");
assert.ok(
  universityDirectory.includes("university-list-row"),
  "University directory must use logo-and-text rows",
);
const courses = links(catalogue).filter((path) => /^\/programs\/[^/]+$/.test(path));
assert.ok(courses.length >= 14, "Course catalogue lost a destination");
let offeringCount = 0;
for (let i = 0; i < courses.length; i += 3) {
  await Promise.all(
    courses.slice(i, i + 3).map(async (path) => {
      const html = await page(path);
      const nav = html.match(
        /<nav aria-label="Open a university course profile"[\s\S]*?<\/nav>/,
      )?.[0];
      if (!nav) return;
      const offerings = links(nav).filter((link) => /^\/universities\/[^/]+\/[^/]+$/.test(link));
      assert.ok(offerings.length > 0, `Empty university navigation: ${path}`);
      for (const offering of offerings) {
        assert.equal(offering.split("/").at(-1), path.split("/").at(-1), "Course link mismatch");
      }
      offeringCount += offerings.length;
    }),
  );
}
const offering = await page("/universities/amity-university-online/online-mba");
assert.ok(offering.includes('href="#apply"'), "Guidance form shortcut missing");
const universityPaths = links(universityDirectory).filter((path) =>
  /^\/universities\/[^/]+$/.test(path),
);
assert.ok(universityPaths.length > 0);
let universityCourseCount = 0;
for (const path of [
  ...new Set(["/universities/amity-university-online", ...universityPaths.slice(0, 5)]),
]) {
  const html = await page(path);
  const canonical = html.match(
    /rel="canonical" href="https:\/\/online.dekhocampus.com([^\"]+)"/,
  )?.[1];
  assert.ok(
    canonical?.startsWith("/online-universities/"),
    "University canonical URL must use the public format",
  );
  const nav = html.match(
    /<nav[^>]+aria-label="Open a course at this university"[\s\S]*?<\/nav>/,
  )?.[0];
  assert.ok(nav, `University needs direct course navigation: ${path}`);
  for (const course of links(nav)) {
    assert.ok(
      course.startsWith(canonical + "/courses-fees/"),
      "University navigation must not mix institutions",
    );
    universityCourseCount++;
  }
}
assert.ok(universityCourseCount > 0);
console.log(
  `Navigation passed: interest discovery (${courses.length} guides, ${offeringCount} course profiles) and university cards (${universityCourseCount} direct course links sampled) reach details within 3 clicks; guidance/search/compare reachable.`,
);
