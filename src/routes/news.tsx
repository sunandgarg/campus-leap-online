import { createFileRoute, redirect, stripSearchParams } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { NewsStory } from "@/components/site/news-story";
import { newsCategories, newsCategoryPath, newsItems, newsPath, filterNews } from "@/data/news";

export const Route = createFileRoute("/news")({
  validateSearch: (search: Record<string, unknown>) => ({
    category:
      typeof search["category"] === "string" &&
      newsCategories.some((category) => category === search["category"])
        ? search["category"]
        : "",
    q: typeof search["q"] === "string" ? search["q"].trim().slice(0, 120) : "",
    story:
      typeof search["story"] === "string" && newsItems.some((item) => item.slug === search["story"])
        ? search["story"]
        : "",
  }),
  search: { middlewares: [stripSearchParams({ category: "", q: "", story: "" })] },
  beforeLoad: ({ search }) => {
    const item = newsItems.find((entry) => entry.slug === search.story);
    if (item) throw redirect({ href: newsPath(item), statusCode: 301 });
  },
  head: ({ match }) => ({
    meta: [
      { title: "Education News & Online Degree Guides | DekhoCampus" },
      {
        name: "description",
        content:
          "Education updates and practical guides to online degrees, university fees, eligibility and admissions from DekhoCampus.",
      },
      ...(match.search.category || match.search.q
        ? [{ name: "robots", content: "noindex,follow" }]
        : []),
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  const { category, q } = Route.useSearch();
  const results = filterNews(category, q);
  const filtered = Boolean(category || q);
  return (
    <div className="news-page">
      <section className="news-masthead news-container">
        <div>
          <p>DEKHOCAMPUS • EDUCATION DESK</p>
          <h1>Education news & guides</h1>
          <span>Admissions, online degrees and the details worth knowing before you choose.</span>
        </div>
        <time dateTime="2026-10-24">Saturday, 24 October 2026</time>
      </section>
      <div className="news-container">
        <nav className="news-topic-strip" aria-label="Browse news categories">
          <a href="/news" aria-current={!category ? "page" : undefined}>
            All articles
          </a>
          {newsCategories.slice(0, 8).map((item) => (
            <a
              key={item}
              href={newsCategoryPath(item)}
              aria-current={category === item ? "page" : undefined}
            >
              {item}
            </a>
          ))}
          <a href="#news-all-categories">All categories</a>
        </nav>
        <div id="latest-stories" className="news-latest">
          {filtered ? (
            <section className="news-results">
              <div className="news-section-heading">
                <div>
                  <h2>{q ? `Search results for “${q}”` : category}</h2>
                  <p>
                    {results.length} {results.length === 1 ? "article" : "articles"}
                    {category && q ? ` in ${category}` : ""}
                  </p>
                </div>
                <a href="/news">
                  All articles <ArrowRight size={16} />
                </a>
              </div>
              <form action="/news" className="news-results-search">
                {category && <input type="hidden" name="category" value={category} />}
                <Search size={18} />
                <input
                  type="search"
                  name="q"
                  defaultValue={q}
                  aria-label="Search this news collection"
                  placeholder="Search a course, fee or admission topic"
                />
                <button type="submit">Search</button>
              </form>
              {results.length ? (
                <div className="news-card-grid">
                  {results.map((item) => (
                    <NewsStory key={item.slug} item={item} />
                  ))}
                </div>
              ) : (
                <div className="news-empty">
                  <h3>
                    {category && !q
                      ? `No ${category.toLowerCase()} articles yet`
                      : "No articles found"}
                  </h3>
                  <p>
                    {category && !q
                      ? "This category is ready. Published stories will appear here as they are added."
                      : "Try MBA, MCA, fees or admissions."}
                  </p>
                  <a href="/news">
                    Browse all articles <ArrowRight size={16} />
                  </a>
                </div>
              )}
            </section>
          ) : (
            <>
              <section className="news-featured" aria-label="Featured education stories">
                <div className="news-feature-layout">
                  <NewsStory item={newsItems[0]!} variant="lead" />
                  <div className="news-feature-side">
                    <h2>Worth a read</h2>
                    {newsItems.slice(1, 5).map((item) => (
                      <NewsStory key={item.slug} item={item} variant="compact" />
                    ))}
                  </div>
                </div>
                <div className="news-card-grid news-feature-bottom">
                  {newsItems.slice(5, 9).map((item) => (
                    <NewsStory key={item.slug} item={item} />
                  ))}
                </div>
              </section>
              {newsCategories
                .filter(
                  (item) =>
                    [
                      "News",
                      "Course",
                      "Management",
                      "Computer Applications",
                      "Admissions",
                      "Arts",
                      "Science",
                      "Commerce",
                    ].includes(item) && filterNews(item).length > 0,
                )
                .map((item) => (
                  <section className="news-category-section" key={item}>
                    <div className="news-section-heading">
                      <h2>{item === "Course" ? "Course guides" : item}</h2>
                      <a href={newsCategoryPath(item)}>
                        View all <ArrowRight size={16} />
                      </a>
                    </div>
                    <div className="news-card-grid">
                      {filterNews(item)
                        .slice(0, 4)
                        .map((entry) => (
                          <NewsStory key={entry.slug} item={entry} />
                        ))}
                    </div>
                  </section>
                ))}
            </>
          )}
        </div>
        <section id="news-all-categories" className="news-category-directory">
          <div>
            <h2>Browse by topic</h2>
            <p>Go straight to what you need.</p>
            <a className="news-directory-top" href="#latest-stories">
              Back to articles <ArrowRight size={15} />
            </a>
          </div>
          <nav aria-label="All news topics">
            {newsCategories.map((item) => (
              <a key={item} href={newsCategoryPath(item)}>
                {item}
                <span>{filterNews(item).length}</span>
                <ArrowRight size={16} />
              </a>
            ))}
          </nav>
        </section>
        <section className="news-guidance">
          <div>
            <h2>Still have a question?</h2>
            <p>Talk through your course shortlist, fees or next steps with a counsellor.</p>
          </div>
          <a href="/contact">
            Ask us <ArrowRight size={18} />
          </a>
        </section>
      </div>
    </div>
  );
}
