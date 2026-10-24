import { newsImage, newsPath, type NewsItem } from "@/data/news";

export function NewsPhoto({ item, priority = false }: { item: NewsItem; priority?: boolean }) {
  const photo = newsImage(item);
  return (
    <img
      className="news-photo"
      src={photo.src}
      alt={photo.alt}
      width={1400}
      height={934}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
    />
  );
}

export function NewsStory({
  item,
  variant = "grid",
}: {
  item: NewsItem;
  variant?: "grid" | "lead" | "compact";
}) {
  return (
    <a className={`news-story news-story-${variant}`} href={newsPath(item)}>
      <NewsPhoto item={item} priority={variant === "lead"} />
      <div className="news-story-copy">
        <span className="news-category-label">{item.categories[0]}</span>
        <h3>{item.title}</h3>
        {variant === "lead" && <p className="news-story-excerpt">{item.summary}</p>}
        <p className="news-story-meta">
          {item.label}
          <span>·</span>
          <time dateTime="2026-10-24">24 Oct 2026</time>
        </p>
      </div>
    </a>
  );
}
