import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const programCatalog = [
  { slug: "online-mba", code: "MBA", level: "Masters" },
  { slug: "online-mca", code: "MCA", level: "Masters" },
  { slug: "online-bba", code: "BBA", level: "Bachelors" },
  { slug: "online-bca", code: "BCA", level: "Bachelors" },
  { slug: "diploma", code: "PGD DS", level: "Diploma" },
];
const source = fs.readFileSync("src/components/site/home-degree-browser.tsx", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const exports = {};
vm.runInNewContext(compiled, {
  exports,
  require: (name) =>
    name === "@/data/universities"
      ? {
          programCatalog,
          universitiesOfferingProgram: (slug) =>
            Array.from({ length: 8 }, (_, index) => ({
              university: { slug: `university-${index}` },
              program: programCatalog.find((program) => program.slug === slug),
            })),
        }
      : {},
});
for (const program of programCatalog) {
  const options = exports.degreeOptions(programCatalog, program.slug);
  assert.equal(options.length, 6);
  assert.ok(options.every((option) => option.program.slug === program.slug));
  assert.equal(new Set(options.map((option) => option.university.slug)).size, 6);
}
assert.equal(exports.degreeOptions(programCatalog, "unknown").length, 0);
assert.equal(exports.degreeOptions([], "online-mba").length, 0);
assert.ok(source.includes('useState("all")'));
assert.ok(source.includes('aria-label="Explore by interest"'));
assert.ok(
  source.includes("aria-label={name}"),
  "Short mobile labels must preserve full accessible names",
);
assert.ok(source.includes('shortName: "Business & Startups"'));
assert.ok(source.includes('shortName: "Media & Comms"'));
const shell = fs.readFileSync("src/components/site/home-shell.tsx", "utf8");
assert.ok(
  shell.includes("h-11 min-w-0 rounded-full px-3 text-xs sm:min-w-24"),
  "Mobile help button must fit a 320px header",
);
assert.ok(source.includes("setInterestIndex(index)") && source.includes('setCourse("all")'));
assert.ok(source.includes('label="Choose an online course"'));
assert.ok(source.includes("View all courses"));
assert.ok(source.includes('program.entitlementStatus === "verified"'));
assert.ok(source.includes("program.feesVerified") && source.includes("program.totalFeeAvailable"));
const university = fs.readFileSync("src/components/site/home-university-browser.tsx", "utf8");
assert.ok(university.includes('id="explore-universities"'));
assert.ok(university.includes('aria-label="Featured universities"'));
assert.ok(university.includes("<UniversityLogo"));
assert.ok(university.includes("getUniversityPrograms(university)"));
assert.ok(university.includes('to="/universities/$universitySlug"'));
const css = fs.readFileSync("src/styles.css", "utf8");
const grid = css.match(/\.ambition-cards\s*\{([^}]+)\}/)?.[1] ?? "";
assert.match(grid, /grid-template-rows:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
assert.match(grid, /grid-auto-flow:\s*column/);
assert.match(
  css,
  /\.home-interest-browser\s*\{\s*grid-template-columns:\s*116px minmax\(0,\s*1fr\)/,
);
assert.match(css, /\.home-interest-browser \.ambition-interests\s*\{\s*display:\s*block/);
console.log(
  "Discovery passed: interest/course filters, isolated course selection, empty matches, university course links, fee evidence guards and compact two-row rails.",
);
