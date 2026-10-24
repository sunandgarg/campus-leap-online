import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const modules = new Map();
function load(path) {
  if (modules.has(path)) return modules.get(path);
  const exports = {};
  modules.set(path, exports);
  const compiled = ts.transpileModule(fs.readFileSync(path, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(compiled, {
    exports,
    Date,
    require: (name) => load(`src/${name.slice(2)}.ts`),
  });
  return exports;
}
const { newsItems, newsCategories, filterNews, newsCategoryPath, newsPath, newsImage } =
  load("src/data/news.ts");
const { articleContent, articleReadingMinutes } = load("src/data/news-articles.ts");
assert.equal(new Set(newsCategories).size, newsCategories.length);
for (const category of [
  "Cutoff 2026",
  "Engineering",
  "Medical",
  "Scholarships",
  "Arts",
  "Science",
  "Commerce",
  "Careers",
  "10th Board",
  "12th Board",
  "Study Abroad",
  "Photostories",
])
  assert.ok(newsCategories.includes(category));
assert.equal(filterNews("Nursing").length, 0);
assert.ok(filterNews("Comparisons").length > 0);
assert.equal(new Set(newsItems.map((item) => item.slug)).size, newsItems.length);
assert.equal(filterNews().length, newsItems.length);
assert.equal(filterNews("Course", "  mBa  ELIGIBILITY ").length, 1);
assert.equal(filterNews("Computer Applications", "MCA eligibility").length, 1);
assert.equal(filterNews("Admissions", "MCA").length, 0);
assert.equal(filterNews("", "no-such-degree-xyz").length, 0);
assert.equal(newsCategoryPath("Online Degrees"), "/news?category=Online%20Degrees");
for (const item of newsItems) {
  assert.ok(item.categories.every((category) => newsCategories.includes(category)));
  assert.ok(item.title && item.summary && item.action);
  assert.ok(item.href.startsWith("/") || item.href.startsWith("https://deb.ugc.ac.in/"));
  if (item.label === "Official update") assert.ok(item.source);
  const content = articleContent(item);
  assert.ok(content.takeaways.length >= 3);
  assert.ok(content.sections.length >= 3);
  assert.equal(
    new Set(content.sections.map((section) => section.id)).size,
    content.sections.length,
  );
  assert.ok(articleReadingMinutes(content, item.summary) >= 1);
  assert.ok(fs.existsSync(`public${newsImage(item).src}`));
  for (const section of content.sections) {
    assert.ok(section.heading && section.paragraphs.length);
    for (const row of section.table?.rows ?? [])
      assert.equal(row.length, section.table.headers.length);
  }
}
assert.throws(() => articleContent({ slug: "unknown" }), /Missing article content/);
assert.equal(newsPath({ slug: "an article" }), "/news/an%20article");
if (process.argv.includes("--http")) {
  const origin = "http://127.0.0.1:8092";
  for (let index = 0; index < newsItems.length; index += 4) {
    await Promise.all(
      newsItems.slice(index, index + 4).map(async (item) => {
        const response = await fetch(`${origin}${newsPath(item)}`);
        assert.equal(response.status, 200, item.slug);
        const html = await response.text();
        assert.ok(html.includes('class="article-main"'), item.slug);
        assert.ok(html.includes(`id="${articleContent(item).sections[0].id}"`));
        assert.ok(html.includes(`https://online.dekhocampus.com${newsPath(item)}`));
        assert.ok(!html.includes('role="dialog"'));
      }),
    );
  }
  assert.equal((await fetch(`${origin}/news/no-such-article`)).status, 404);
  const old = await fetch(`${origin}/news?story=${newsItems[0].slug}`, { redirect: "manual" });
  assert.equal(old.status, 301);
  assert.equal(old.headers.get("location"), newsPath(newsItems[0]));
  const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
  for (const item of newsItems) assert.ok(sitemap.includes(newsPath(item)));
  const filtered = await (await fetch(`${origin}/news?q=MBA%20eligibility`)).text();
  assert.ok(filtered.includes('name="robots" content="noindex,follow"'));
  console.log(
    `HTTP passed: ${newsItems.length} article pages, legacy preview redirect, 404, sitemap and filtered-page indexing guard.`,
  );
}
console.log(
  "News passed: search, category isolation, unique article paths, full content, section anchors, table columns, reading times, photographs and source attribution.",
);
