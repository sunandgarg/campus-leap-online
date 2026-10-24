import { useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronRight, Link2, Printer } from "lucide-react";
import { NewsPhoto, NewsStory } from "@/components/site/news-story";
import { UniversityLogo } from "@/components/site/university-logo";
import { newsItems, newsPath, newsImage, newsCategoryPath } from "@/data/news";
import { articleContent, articleReadingMinutes } from "@/data/news-articles";
import { universities } from "@/data/universities";
import { universityPath } from "@/lib/online-paths";
import { SITE_ORIGIN } from "@/lib/site-origin";

export const Route = createFileRoute("/news_/$articleSlug")({
  loader: ({ params }) => {
    const item = newsItems.find((entry) => entry.slug === params.articleSlug);
    if (!item) throw notFound();
    return { item, content: articleContent(item) };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.item.title} | DekhoCampus`
          : "Article not found | DekhoCampus",
      },
      {
        name: "description",
        content: loaderData?.item.summary ?? "Browse education news and guides from DekhoCampus.",
      },
      { property: "og:type", content: "article" },
      ...(loaderData
        ? [
            { property: "og:title", content: loaderData.item.title },
            { property: "og:description", content: loaderData.item.summary },
            { property: "og:url", content: `${SITE_ORIGIN}${newsPath(loaderData.item)}` },
            { property: "og:image", content: `${SITE_ORIGIN}${newsImage(loaderData.item).src}` },
            { property: "article:published_time", content: "2026-10-24T00:00:00+05:30" },
            { name: "twitter:card", content: "summary_large_image" },
          ]
        : [{ name: "robots", content: "noindex,follow" }]),
    ],
  }),
  notFoundComponent: () => (
    <div className="article-not-found news-container">
      <h1>We couldn’t find that article.</h1>
      <p>It may have moved, or the address may be incomplete.</p>
      <a href="/news">
        Back to news & guides <ArrowRight size={17} />
      </a>
    </div>
  ),
  component: NewsArticle,
});

function NewsArticle() {
  const { item, content } = Route.useLoaderData();
  const [copyState, setCopyState] = useState("");
  const photo = newsImage(item);
  const related = newsItems
    .filter(
      (entry) =>
        entry.slug !== item.slug &&
        entry.categories.some((category) => item.categories.includes(category)),
    )
    .slice(0, 4);
  const featuredUniversities = universities
    .filter((university) => university.profileDepth !== "directory")
    .slice(0, 3);
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyState("Link copied");
    } catch {
      setCopyState("Copy this page’s address from your browser.");
    }
  }
  return (
    <div className="news-article-page">
      <div className="news-container">
        <nav className="article-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <ChevronRight size={13} />
          <a href="/news">News & guides</a>
          <ChevronRight size={13} />
          <a href={newsCategoryPath(item.categories[0]!)}>{item.categories[0]}</a>
        </nav>
        <figure className="article-cover">
          <NewsPhoto item={item} priority />
          <figcaption>
            Representational photograph ·{" "}
            <a href={photo.source} target="_blank" rel="noopener noreferrer">
              {photo.credit} / Pexels
            </a>
          </figcaption>
        </figure>
        <div className="article-layout">
          <article className="article-main">
            <header className="article-heading">
              <a className="news-category-label" href={newsCategoryPath(item.categories[0]!)}>
                {item.categories[0]}
              </a>
              <h1>{item.title}</h1>
              <p className="article-standfirst">{item.summary}</p>
              <div className="article-byline">
                <img src="/dekhocampus-logo.png" width={36} height={36} alt="" />
                <div>
                  <strong>DekhoCampus Education Desk</strong>
                  <p>
                    <time dateTime="2026-10-24">24 October 2026</time>
                    <span>·</span>
                    {articleReadingMinutes(content, item.summary)} min read<span>·</span>
                    {item.label}
                  </p>
                </div>
              </div>
            </header>
            <div className="article-share">
              <span>Share this article</span>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${item.title} ${SITE_ORIGIN}${newsPath(item)}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share article on WhatsApp"
              >
                WhatsApp <ArrowUpRight size={14} />
              </a>
              <button type="button" onClick={copyLink}>
                <Link2 size={15} />
                Copy link
              </button>
              <button type="button" onClick={() => window.print()}>
                <Printer size={15} />
                Print
              </button>
              <span className="article-copy-status" role="status">
                {copyState}
              </span>
            </div>
            <details className="article-contents">
              <summary>On this page</summary>
              <nav aria-label="Article contents">
                {content.sections.map((section) => (
                  <a key={section.id} href={`#${section.id}`}>
                    {section.heading}
                  </a>
                ))}
              </nav>
            </details>
            <section className="article-in-short">
              <h2>In short</h2>
              <ul>
                {content.takeaways.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>
            <div className="article-body">
              {content.sections.map((section) => (
                <section id={section.id} key={section.id}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.bullets && (
                    <ul>
                      {section.bullets.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )}
                  {section.table && (
                    <div
                      className="article-table-wrap"
                      role="region"
                      aria-label={section.heading}
                      tabIndex={0}
                    >
                      <table>
                        <caption>{section.heading} — checklist</caption>
                        <thead>
                          <tr>
                            {section.table.headers.map((header) => (
                              <th key={header} scope="col">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.table.rows.map((row, index) => (
                            <tr key={index}>
                              {row.map((cell, cellIndex) =>
                                cellIndex === 0 ? (
                                  <th key={cellIndex} scope="row">
                                    {cell}
                                  </th>
                                ) : (
                                  <td key={cellIndex}>{cell}</td>
                                ),
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              ))}
            </div>
            <section className="article-next-step">
              <h2>Your next step</h2>
              <p>Keep your questions and confirmed details together as you compare options.</p>
              <a
                href={item.href}
                {...(item.href.startsWith("https://")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {item.action}
                <ArrowUpRight size={17} />
              </a>
            </section>
            <footer className="article-editorial-note">
              {item.source && (
                <p>
                  <strong>Source:</strong>{" "}
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.source}
                  </a>
                  . Checked 24 October 2026.
                </p>
              )}
              <p>
                <strong>About this guide:</strong> Prepared by the DekhoCampus Education Desk.
                Course outlines are general guidance, not a university prospectus. Confirm current
                eligibility, recognition, fees and admission terms with the university before
                paying. No job, salary or admission outcome is guaranteed.
              </p>
              <a href="/contact">
                Suggest a correction <ArrowRight size={14} />
              </a>
            </footer>
            <nav className="article-topics" aria-label="Article topics">
              <span>Filed under</span>
              {item.categories.map((category) => (
                <a key={category} href={newsCategoryPath(category)}>
                  {category}
                </a>
              ))}
            </nav>
            <nav className="article-back" aria-label="Article navigation">
              <a href="/news">
                <ArrowLeft size={17} />
                All news & guides
              </a>
              <a href={newsCategoryPath(item.categories[0]!)}>
                More in {item.categories[0]}
                <ArrowRight size={17} />
              </a>
            </nav>
          </article>
          <aside className="article-sidebar">
            <section className="article-help">
              <span>LET’S TALK IT THROUGH</span>
              <h2>A course question on your mind?</h2>
              <p>
                Get help comparing universities, costs and the study format that fits your week.
              </p>
              <a href="/contact">
                Get free counselling <ArrowRight size={17} />
              </a>
              <small>No obligation to apply.</small>
            </section>
            <section className="article-universities">
              <h2>Explore online universities</h2>
              {featuredUniversities.map((university) => (
                <a key={university.slug} href={universityPath(university)}>
                  <UniversityLogo university={university} size="md" />
                  <span>
                    <strong>{university.shortName}</strong>
                    <small>{university.state}</small>
                  </span>
                  <ChevronRight size={16} />
                </a>
              ))}
              <a className="article-view-all" href="/online-universities">
                View all universities <ArrowRight size={15} />
              </a>
            </section>
            <section className="article-sidebar-stories">
              <h2>Also worth reading</h2>
              {related.slice(0, 3).map((entry) => (
                <a key={entry.slug} href={newsPath(entry)}>
                  {entry.title}
                  <ArrowUpRight size={15} />
                </a>
              ))}
            </section>
          </aside>
        </div>
        <section className="article-related">
          <div className="news-section-heading">
            <h2>Read next</h2>
            <a href="/news">
              All articles
              <ArrowRight size={16} />
            </a>
          </div>
          <div className="news-card-grid">
            {related.map((entry) => (
              <NewsStory key={entry.slug} item={entry} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
