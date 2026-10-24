import { useRouterState } from "@tanstack/react-router";
import { ArrowRight, Building2, ChevronDown, Menu, Moon, Search, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/site/brand-logo";
import { UniversityLogo } from "@/components/site/university-logo";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { programCatalog, universities } from "@/data/universities";
import { getAllSpecialisations } from "@/data/specialisations";
import { universityPath } from "@/lib/online-paths";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [dark, setDark] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const headerRef = useRef<HTMLElement>(null);
  const names = [
    "amity-university-online",
    "lpu-online",
    "manipal-university-online",
    "chandigarh-university-online",
    "gla-university-uttar-pradesh",
    "jaypee-institute-of-information-technology-uttar-pradesh",
  ];
  const topUniversities = names
    .map((slug) => universities.find((u) => u.slug === slug))
    .filter((u) => u !== undefined);
  const groups = [
    {
      label: "Top Universities",
      links: topUniversities.map((u) => ({
        label: u.shortName,
        href: universityPath(u),
        university: u,
      })),
      all: { label: "View all universities", href: "/online-universities" },
    },
    {
      label: "Trending Degrees",
      links: programCatalog.slice(0, 12).map((p) => ({
        label: `Online ${p.code}`,
        href: `/programs/${p.slug}`,
        university: undefined,
      })),
      all: { label: "View all courses", href: "/programs" },
    },
    {
      label: "Trending Specializations",
      links: getAllSpecialisations()
        .slice(0, 12)
        .map((s) => ({ label: s.name, href: `/specialisations/${s.slug}`, university: undefined })),
      all: { label: "View all specialisations", href: "/specialisations" },
    },
    {
      label: "More",
      links: [
        { label: "Compare Universities", href: "/compare", university: undefined },
        { label: "Course Finder", href: "/finder", university: undefined },
        { label: "About Us", href: "/about", university: undefined },
        { label: "News & Guides", href: "/news", university: undefined },
        { label: "Contact Us", href: "/contact", university: undefined },
        { label: "Admission Checklist", href: "/methodology", university: undefined },
      ],
      all: { label: "Free counselling", href: "/contact" },
    },
  ];
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  useEffect(() => {
    setOpen(false);
    setActive(null);
  }, [pathname]);
  useEffect(() => {
    function outside(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setActive(null);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  function toggleTheme() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  }
  return (
    <>
      <header
        ref={headerRef}
        className="reference-header"
        onKeyDown={(e) => {
          if (e.key === "Escape") setActive(null);
        }}
      >
        <div className="reference-nav-inner">
          <a href="/" aria-label="DekhoCampus home" className="reference-brand">
            <BrandLogo size="sm" />
          </a>
          <nav
            className="reference-desktop-nav"
            aria-label="Main navigation"
            onMouseLeave={() => setActive(null)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setActive(null);
            }}
          >
            {groups.map((group, index) => (
              <div
                className="reference-nav-group"
                key={group.label}
                onMouseEnter={() => setActive(group.label)}
              >
                <button
                  type="button"
                  aria-expanded={active === group.label}
                  aria-controls={`nav-menu-${index}`}
                  onClick={() => setActive(group.label)}
                >
                  {group.label}
                  <ChevronDown size={11} />
                </button>
                <div
                  className="reference-dropdown"
                  id={`nav-menu-${index}`}
                  hidden={active !== group.label}
                >
                  <p>{group.label}</p>
                  <div>
                    {group.links.map((item) => (
                      <a href={item.href} key={item.href}>
                        {item.university && (
                          <UniversityLogo university={item.university} size="sm" />
                        )}
                        <span>{item.label}</span>
                        <ArrowRight size={12} />
                      </a>
                    ))}
                  </div>
                  <a className="reference-nav-all" href={group.all.href}>
                    {group.all.label}
                    <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            ))}
            <a className="reference-scholarships" href="/scholarships">
              Scholarships
            </a>
            <a className="reference-scholarships" href="/news">
              News
            </a>
          </nav>
          <form action="/search" className="reference-header-search" role="search">
            <Search size={14} />
            <input
              aria-label="Search colleges, degrees and specialisations"
              name="q"
              placeholder="Search college, degree, article…"
            />
            <button type="submit" aria-label="Search">
              <ArrowRight size={14} />
            </button>
          </form>
          <a className="reference-course-finder" href="/finder">
            <Building2 size={14} />
            <span>Course Finder</span>
          </a>
          <a
            className="reference-mobile-search-link"
            href="/search"
            aria-label="Search courses and universities"
          >
            <Search size={18} />
          </a>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="reference-menu-toggle"
                aria-label="Open navigation menu"
              >
                <Menu size={21} />
              </button>
            </SheetTrigger>
            <SheetContent className="w-[min(100%,400px)] overflow-y-auto pb-24">
              <SheetTitle>Explore DekhoCampus</SheetTitle>
              <SheetDescription>
                Choose a degree, compare universities or ask for guidance.
              </SheetDescription>
              <form className="reference-mobile-search" action="/search">
                <Search size={16} />
                <input
                  name="q"
                  aria-label="Search courses and universities"
                  placeholder="Search courses & universities"
                />
                <button type="submit" aria-label="Search">
                  <ArrowRight size={16} />
                </button>
              </form>
              <nav aria-label="All pages" className="reference-mobile-nav">
                {groups.map((group) => (
                  <details key={group.label}>
                    <summary>
                      {group.label}
                      <ChevronDown size={15} />
                    </summary>
                    {group.links.map((item) => (
                      <a href={item.href} key={item.href}>
                        {item.university && (
                          <UniversityLogo university={item.university} size="sm" />
                        )}
                        {item.label}
                        <ArrowRight size={13} />
                      </a>
                    ))}
                    <a href={group.all.href}>{group.all.label}</a>
                  </details>
                ))}
                <a href="/scholarships">
                  Scholarships
                  <ArrowRight size={15} />
                </a>
                <a href="/programs">
                  Courses
                  <ArrowRight size={15} />
                </a>
                <a href="/universities">
                  Universities
                  <ArrowRight size={15} />
                </a>
                <a href="/compare">
                  Compare
                  <ArrowRight size={15} />
                </a>
                <a href="/contact">
                  Free counselling
                  <ArrowRight size={15} />
                </a>
                <button type="button" onClick={toggleTheme}>
                  {dark ? <Sun size={16} /> : <Moon size={16} />}
                  {dark ? "Use light mode" : "Use dark mode"}
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <div className="reference-promo">
        <span>Find the right online degree for your next step.</span>
        <a href="/contact">
          Get Free Counselling <ArrowRight size={13} />
        </a>
      </div>
    </>
  );
}
