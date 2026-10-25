import { Menu, Search, ArrowUpRight, ChevronDown } from "lucide-react";
import { BrandLogo } from "@/components/site/brand-logo";
import { newsCategories, newsCategoryPath } from "@/data/news";

export function NewsHeader() {
  return (
    <header className="news-header">
      <div className="news-container news-header-inner">
        <a href="/" aria-label="DekhoCampus home" className="news-brand">
          <BrandLogo size="lg" />
          <span>NEWS & GUIDES</span>
        </a>
        <nav aria-label="News topics" className="news-desktop-nav">
          {newsCategories.slice(0, 4).map((category) => (
            <a key={category} href={newsCategoryPath(category)}>
              {category}
            </a>
          ))}
          <details>
            <summary>
              All topics <ChevronDown size={14} />
            </summary>
            <div>
              {newsCategories.slice(4).map((category) => (
                <a key={category} href={newsCategoryPath(category)}>
                  {category}
                </a>
              ))}
              <a href="/news">All articles</a>
              <a href="/universities">
                Find a university <ArrowUpRight size={14} />
              </a>
            </div>
          </details>
        </nav>
        <form action="/news" role="search" className="news-header-search">
          <Search size={18} />
          <input
            name="q"
            type="search"
            aria-label="Search news and guides"
            placeholder="Search articles…"
          />
          <button type="submit" aria-label="Search articles">
            <ArrowUpRight size={17} />
          </button>
        </form>
        <details className="news-mobile-menu">
          <summary aria-label="Open news menu">
            <Menu size={23} />
          </summary>
          <nav aria-label="Mobile news topics">
            <a href="/news">All articles</a>
            {newsCategories.map((category) => (
              <a key={category} href={newsCategoryPath(category)}>
                {category}
              </a>
            ))}
            <a href="/">Back to DekhoCampus</a>
            <form action="/news">
              <input
                name="q"
                type="search"
                aria-label="Search articles on mobile"
                placeholder="Search articles…"
              />
              <button type="submit" aria-label="Search">
                <Search size={18} />
              </button>
            </form>
          </nav>
        </details>
      </div>
    </header>
  );
}
