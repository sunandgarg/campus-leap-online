import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { UniversityLogo } from "@/components/site/university-logo";
import { getUniversityPrograms, universities } from "@/data/universities";

export const featuredUniversitySlugs = [
  "amity-university-online",
  "lpu-online",
  "manipal-university-online",
  "chandigarh-university-online",
  "jain-university-online",
  "dy-patil-university-online",
  "shoolini-university-online",
  "sikkim-manipal-university-online",
];

export function HomeUniversityBrowser() {
  const featured = featuredUniversitySlugs.flatMap((slug) => {
    const university = universities.find((item) => item.slug === slug);
    return university ? [university] : [];
  });
  const railRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(1);
  const [active, setActive] = useState(1);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  function centre(index: number) {
    const rail = railRef.current;
    const card = rail?.children[index] as HTMLElement | undefined;
    if (!rail || !card) return;
    rail.scrollTo({
      left: card.offsetLeft - (rail.clientWidth - card.offsetWidth) / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let frame = 0;
    let resizeFrame = 0;
    let resizing = false;
    const resize = () => {
      resizing = true;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(resizeFrame);
      const card = rail.children[activeRef.current] as HTMLElement | undefined;
      if (card) rail.scrollLeft = card.offsetLeft - (rail.clientWidth - card.offsetWidth) / 2;
      resizeFrame = requestAnimationFrame(() => {
        resizing = false;
      });
    };
    const update = () => {
      if (resizing) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const middle = rail.scrollLeft + rail.clientWidth / 2;
        let nearest = 0;
        let distance = Infinity;
        Array.from(rail.children).forEach((child, index) => {
          const card = child as HTMLElement;
          const next = Math.abs(card.offsetLeft + card.offsetWidth / 2 - middle);
          if (next < distance) {
            nearest = index;
            distance = next;
          }
        });
        activeRef.current = nearest;
        setActive(nearest);
      });
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(rail);
    rail.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      rail.removeEventListener("scroll", update);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(resizeFrame);
    };
  }, []);
  return (
    <section
      id="explore-universities"
      className="home-section scroll-mt-20 border-t border-border"
      aria-labelledby="home-universities-title"
    >
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-3xl">
          <h2
            id="home-universities-title"
            className="font-display text-[28px] font-extrabold leading-tight tracking-tight sm:text-[36px]"
          >
            Compare familiar names with visible data.
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
            Explore universities, browse their courses and compare the details that matter to you.
          </p>
        </div>
        <Link to="/universities" className="study-browser-link">
          View all universities <ArrowRight size={16} />
        </Link>
      </header>
      <div className="university-spotlight">
        <div className="university-spotlight-controls">
          <p>Swipe to explore. Tap a university to know more.</p>
          <div>
            <button
              type="button"
              aria-label="Previous university"
              disabled={active === 0}
              onClick={() => centre(active - 1)}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Next university"
              disabled={active === featured.length - 1}
              onClick={() => centre(active + 1)}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
        <div
          ref={railRef}
          className="university-spotlight-rail"
          role="region"
          aria-label="Featured universities"
          aria-roledescription="carousel"
          tabIndex={0}
          data-dragging={dragging || undefined}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              const next = Math.max(
                0,
                Math.min(featured.length - 1, active + (event.key === "ArrowRight" ? 1 : -1)),
              );
              if (event.target === event.currentTarget) centre(next);
              else
                (event.currentTarget.children[next] as HTMLElement | undefined)?.focus({
                  preventScroll: true,
                });
            }
          }}
          onPointerDown={(event) => {
            suppressClick.current = false;
            if (event.pointerType !== "mouse" || event.button !== 0) return;
            drag.current = { x: event.clientX, left: event.currentTarget.scrollLeft, moved: false };
          }}
          onPointerMove={(event) => {
            const start = drag.current;
            if (!start) return;
            const offset = event.clientX - start.x;
            if (Math.abs(offset) > 6 && !start.moved) {
              start.moved = true;
              suppressClick.current = true;
              setDragging(true);
              event.currentTarget.setPointerCapture(event.pointerId);
            }
            if (start.moved) event.currentTarget.scrollLeft = start.left - offset;
          }}
          onPointerUp={(event) => {
            const moved = drag.current?.moved;
            drag.current = null;
            setDragging(false);
            if (event.currentTarget.hasPointerCapture(event.pointerId))
              event.currentTarget.releasePointerCapture(event.pointerId);
            if (moved) centre(activeRef.current);
          }}
          onPointerCancel={() => {
            drag.current = null;
            suppressClick.current = true;
            setDragging(false);
          }}
          onClickCapture={(event) => {
            if (suppressClick.current) {
              event.preventDefault();
              event.stopPropagation();
              suppressClick.current = false;
            }
          }}
        >
          {featured.map((university, index) => {
            const programs = getUniversityPrograms(university);
            return (
              <Link
                key={university.slug}
                to="/universities/$universitySlug"
                params={{ universitySlug: university.slug }}
                className="home-university-card"
                data-centred={active === index || undefined}
                aria-label={`View ${university.name}`}
                draggable={false}
                onFocus={() => centre(index)}
              >
                <div className="home-university-card-mark">
                  <UniversityLogo
                    university={university}
                    className="h-14 w-28 rounded-none border-0 bg-white"
                  />
                  <span>{university.state || "India"}</span>
                </div>
                <h3>{university.shortName}</h3>
                <p>
                  {programs.length} course {programs.length === 1 ? "profile" : "profiles"}
                </p>
                <div className="home-university-course-links">
                  {programs.slice(0, 4).map((program) => (
                    <span key={program.slug}>{program.code}</span>
                  ))}
                </div>
                <span className="study-browser-link">
                  View university <ArrowRight size={16} />
                </span>
              </Link>
            );
          })}
        </div>
        <div className="university-spotlight-dots" aria-label="Choose a university slide">
          {featured.map((university, index) => (
            <button
              key={university.slug}
              type="button"
              aria-label={`Show ${university.shortName}`}
              aria-pressed={active === index}
              onClick={() => centre(index)}
            />
          ))}
        </div>
        <p className="sr-only" role="status">
          {featured[active]?.shortName}, {active + 1} of {featured.length}
        </p>
      </div>
    </section>
  );
}
