import { useRouterState } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Building2,
  ChevronDown,
  ChevronRight,
  Menu,
  Moon,
  Search,
  Sun,
} from "lucide-react";
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
import {
  getHeaderDegreeUniversities,
  getHeaderNavigation,
  getHeaderSpecialisationEntries,
} from "@/data/header-navigation";

const menuLabels = ["Top Universities", "Trending Degrees", "Trending Specializations"] as const;
type HeaderMenu = (typeof menuLabels)[number];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<HeaderMenu | null>(null);
  const [degreeSlug, setDegreeSlug] = useState("online-mba");
  const [specialisationName, setSpecialisationName] = useState("");
  const [dark, setDark] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const headerRef = useRef<HTMLElement>(null);
  const { universityLinks, degrees, specialisations } = getHeaderNavigation();
  const degree = degrees.find((item) => item.slug === degreeSlug) ?? degrees[0];
  const degreeUniversities = degree ? getHeaderDegreeUniversities(degree.slug) : [];
  const specialisation =
    specialisations.find((item) => item.name === specialisationName) ?? specialisations[0];
  const specialisationEntries = specialisation
    ? getHeaderSpecialisationEntries(specialisation.name)
    : [];
  const featured = universityLinks[0];
  const panelId = "header-explore-panel";

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

  function closeMenu(restoreFocus = false) {
    if (restoreFocus)
      headerRef.current?.querySelector<HTMLButtonElement>('button[aria-expanded="true"]')?.focus();
    setActive(null);
  }
  function toggleTheme() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  }

  return (
    <>
      <header
        ref={headerRef}
        className={`reference-header mega-header${pathname.startsWith("/online-universities/") ? " profile-site-header" : ""}`}
        onMouseLeave={() => closeMenu()}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) closeMenu();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            closeMenu(true);
          }
        }}
      >
        <div className="reference-nav-inner">
          <a href="/" aria-label="DekhoCampus home" className="reference-brand">
            <BrandLogo size="md" />
          </a>
          <nav className="reference-desktop-nav" aria-label="Main navigation">
            {menuLabels.map((label) => (
              <button
                key={label}
                type="button"
                className="mega-trigger"
                aria-expanded={active === label}
                aria-controls={panelId}
                onMouseEnter={() => setActive(label)}
                onClick={() => setActive(label)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setActive(label);
                    requestAnimationFrame(() =>
                      document
                        .getElementById(panelId)
                        ?.querySelector<HTMLElement>("button, a")
                        ?.focus(),
                    );
                  }
                }}
              >
                {label}
              </button>
            ))}
            <a className="reference-scholarships" href="/news" onMouseEnter={() => closeMenu()}>
              News
            </a>
            <a
              className="reference-scholarships"
              href="/scholarships"
              onMouseEnter={() => closeMenu()}
            >
              Scholarships
            </a>
          </nav>
          <form
            action="/search"
            className="reference-header-search"
            role="search"
            onFocus={() => closeMenu()}
          >
            <Search size={19} />
            <input
              aria-label="Search colleges, degrees and specialisations"
              name="q"
              type="search"
              placeholder="Search college, degree, article…"
            />
            <button type="submit" aria-label="Search">
              <ArrowRight size={17} />
            </button>
          </form>
          <a
            className="reference-course-finder"
            aria-label="Course Finder"
            href="/finder"
            onMouseEnter={() => closeMenu()}
          >
            <Building2 size={20} />
            <span>Course Finder</span>
          </a>
          <a
            className="reference-mobile-search-link"
            href="/search"
            aria-label="Search courses and universities"
          >
            <Search size={20} />
          </a>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="reference-menu-toggle"
                aria-label="Open navigation menu"
              >
                <Menu size={23} />
              </button>
            </SheetTrigger>
            <SheetContent className="w-[min(100%,420px)] overflow-y-auto pb-24">
              <SheetTitle>Explore DekhoCampus</SheetTitle>
              <SheetDescription>
                Choose a degree, explore universities and find your next step.
              </SheetDescription>
              <form className="reference-mobile-search" action="/search">
                <Search size={17} />
                <input
                  name="q"
                  type="search"
                  aria-label="Search courses and universities"
                  placeholder="Search courses & universities"
                />
                <button type="submit" aria-label="Search">
                  <ArrowRight size={17} />
                </button>
              </form>
              <nav aria-label="All pages" className="reference-mobile-nav">
                <details>
                  <summary>
                    Top Universities
                    <ChevronDown size={16} />
                  </summary>
                  {universityLinks.slice(0, 12).map((item) => (
                    <a key={item.href} href={item.href}>
                      <UniversityLogo university={item.university} size="sm" />
                      <span>{item.label}</span>
                      <ChevronRight size={15} />
                    </a>
                  ))}
                  <a href="/online-universities">
                    View all universities
                    <ArrowRight size={15} />
                  </a>
                </details>
                <details>
                  <summary>
                    Trending Degrees
                    <ChevronDown size={16} />
                  </summary>
                  {degrees.map((item) => (
                    <details key={item.slug} className="mega-mobile-degree">
                      <summary>
                        Online {item.code}
                        <ChevronDown size={15} />
                      </summary>
                      <a href={`/programs/${item.slug}`}>
                        About Online {item.code}
                        <ArrowRight size={15} />
                      </a>
                      {getHeaderDegreeUniversities(item.slug).map((entry) => (
                        <a key={entry.href} href={entry.href}>
                          <UniversityLogo university={entry.university} size="sm" />
                          <span>{entry.label}</span>
                        </a>
                      ))}
                    </details>
                  ))}
                  <a href="/programs">
                    View all courses
                    <ArrowRight size={15} />
                  </a>
                </details>
                <details>
                  <summary>
                    Trending Specializations
                    <ChevronDown size={16} />
                  </summary>
                  {specialisations.slice(0, 12).map((item) => (
                    <a key={item.name} href={`/specialisations/${item.records[0]!.slug}`}>
                      {item.name}
                      <ChevronRight size={15} />
                    </a>
                  ))}
                  <a href="/specialisations">
                    View all specialisations
                    <ArrowRight size={15} />
                  </a>
                </details>
                <a href="/news">
                  News
                  <ArrowRight size={16} />
                </a>
                <a href="/scholarships">
                  Scholarships
                  <ArrowRight size={16} />
                </a>
                <a href="/contact">
                  Free counselling
                  <ArrowRight size={16} />
                </a>
                <button type="button" onClick={toggleTheme}>
                  {dark ? <Sun size={17} /> : <Moon size={17} />}
                  {dark ? "Use light mode" : "Use dark mode"}
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        {active && (
          <>
            <button
              type="button"
              tabIndex={-1}
              aria-label="Close navigation"
              className="mega-scrim"
              onMouseEnter={() => closeMenu()}
              onClick={() => closeMenu(true)}
            />
            <div id={panelId} className="mega-panel" aria-label={active}>
              <div className="mega-panel-inner">
                <div className="mega-main">
                  <h2 className={`mega-heading mega-heading-${menuLabels.indexOf(active)}`}>
                    {active}
                  </h2>
                  {active === "Top Universities" && (
                    <>
                      <nav className="mega-university-list" aria-label="Top university links">
                        {universityLinks.map((item) => (
                          <a href={item.href} key={item.href} title={item.label}>
                            <UniversityLogo university={item.university} size="sm" />
                            <span>{item.label}</span>
                          </a>
                        ))}
                      </nav>
                      <a className="mega-view-all" href="/online-universities">
                        View all universities
                        <ArrowRight size={16} />
                      </a>
                    </>
                  )}
                  {active === "Trending Degrees" && (
                    <div className="mega-browser">
                      <nav className="mega-categories" aria-label="Choose a degree in navigation">
                        {degrees.map((item) => (
                          <button
                            key={item.slug}
                            type="button"
                            aria-pressed={item.slug === degree?.slug}
                            onMouseEnter={() => setDegreeSlug(item.slug)}
                            onFocus={() => setDegreeSlug(item.slug)}
                            onClick={() => setDegreeSlug(item.slug)}
                          >
                            Online {item.code}
                            <ChevronRight size={17} />
                          </button>
                        ))}
                      </nav>
                      <div className="mega-results">
                        <nav
                          className="mega-degree-list"
                          aria-label={
                            degree
                              ? `Universities for Online ${degree.code}`
                              : "Degree universities"
                          }
                        >
                          {degreeUniversities.map((item) => (
                            <a href={item.href} key={item.href} title={item.label}>
                              <UniversityLogo university={item.university} size="sm" />
                              <span>{item.label}</span>
                            </a>
                          ))}
                        </nav>
                        {!degreeUniversities.length && (
                          <p className="mega-empty">
                            University course profiles are being added. Start with the course guide.
                          </p>
                        )}
                        <a
                          className="mega-view-all"
                          href={degree ? `/programs/${degree.slug}` : "/programs"}
                        >
                          View Online {degree?.code} details & fees
                          <ArrowRight size={16} />
                        </a>
                      </div>
                    </div>
                  )}
                  {active === "Trending Specializations" && (
                    <div className="mega-browser">
                      <nav
                        className="mega-categories"
                        aria-label="Choose a specialisation in navigation"
                      >
                        {specialisations.map((item) => (
                          <button
                            key={item.name}
                            type="button"
                            aria-pressed={item.name === specialisation?.name}
                            onMouseEnter={() => setSpecialisationName(item.name)}
                            onFocus={() => setSpecialisationName(item.name)}
                            onClick={() => setSpecialisationName(item.name)}
                          >
                            {item.name}
                            <ChevronRight size={17} />
                          </button>
                        ))}
                      </nav>
                      <div className="mega-results">
                        <nav
                          className="mega-specialisation-list"
                          aria-label="Specialisation course links"
                        >
                          {specialisationEntries.map((item) => (
                            <a key={item.href} href={item.href}>
                              <div>
                                {item.university ? (
                                  <>
                                    <UniversityLogo university={item.university} size="sm" />
                                    <span>{item.university.shortName}</span>
                                  </>
                                ) : (
                                  <>
                                    <BookOpen size={18} />
                                    <span>Course guide</span>
                                  </>
                                )}
                                <ArrowUpRight size={20} />
                              </div>
                              <strong>{item.label}</strong>
                            </a>
                          ))}
                        </nav>
                        <a className="mega-view-all" href="/specialisations">
                          View all specialisations
                          <ArrowRight size={16} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                <aside
                  className={`mega-feature mega-feature-${active === "Trending Degrees" ? "degree" : "university"}`}
                >
                  <span className="mega-feature-tag">Explore</span>
                  {active !== "Trending Degrees" && featured && (
                    <UniversityLogo
                      university={featured.university}
                      className="mega-feature-logo"
                    />
                  )}
                  <h3>
                    {active === "Trending Degrees"
                      ? `Online ${degree?.code ?? "degrees"}`
                      : active === "Top Universities"
                        ? featured?.label
                        : "Find your specialisation"}
                  </h3>
                  <p>
                    {active === "Trending Degrees"
                      ? "Get to know the course. Compare universities, study formats and complete fees in one place."
                      : active === "Top Universities"
                        ? "Explore the university, browse its courses and check the details that matter to you."
                        : "Compare what you’ll study, the skills you’ll build and the university options available."}
                  </p>
                  <a
                    href={
                      active === "Trending Degrees" && degree
                        ? `/programs/${degree.slug}`
                        : active === "Top Universities"
                          ? (featured?.href ?? "/online-universities")
                          : "/specialisations"
                    }
                  >
                    {active === "Top Universities" ? "Explore University" : "Start Exploring"}
                    <ChevronRight size={19} />
                  </a>
                </aside>
              </div>
            </div>
          </>
        )}
      </header>
      <div
        className={`reference-promo mega-promo${pathname.startsWith("/online-universities/") ? " profile-promo" : ""}`}
      >
        <span>
          <span className="mega-promo-intro">Explore your online degree. </span>
          <strong>Check scholarships & fee benefits.</strong>
        </span>
        <a href="/scholarships">
          Explore Now
          <ChevronRight size={18} />
        </a>
      </div>
    </>
  );
}
