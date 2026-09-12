import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  GitCompareArrows,
  GraduationCap,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/site/brand-logo";
import { programCatalog, universities } from "@/data/universities";
import { useComparison } from "@/hooks/use-comparison";

const navLinks = [
  { to: "/specialisations", label: "Specialisations" },
  { to: "/finder", label: "Degree finder" },
  { to: "/compare", label: "Compare" },
  { to: "/methodology", label: "How it works" },
] as const;

type DesktopMenu = "programs" | "universities" | null;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [desktopMenu, setDesktopMenu] = useState<DesktopMenu>(null);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const comparison = useComparison();

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    setOpen(false);
    setDesktopMenu(null);
  }, [pathname]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setDesktopMenu(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function toggleTheme() {
    const nextDark = !dark;
    document.documentElement.classList.toggle("dark", nextDark);
    window.localStorage.setItem("dekhocampus-theme", nextDark ? "dark" : "light");
    setDark(nextDark);
  }

  function closeNavigation() {
    setOpen(false);
    setDesktopMenu(null);
  }

  const groupedPrograms = ["Masters", "Bachelors", "Diploma", "Certificate"].map((level) => ({
    level,
    programs: programCatalog.filter((program) => program.level === level),
  }));

  return (
    <header className="sticky top-0 z-50 px-3 pt-3">
      <div className="container-page relative flex h-16 items-center justify-between gap-4 rounded-2xl border border-border/80 bg-background/92 px-4 shadow-[0_16px_45px_-28px_rgba(18,38,62,0.58)] backdrop-blur-xl sm:px-5">
        <Link
          to="/"
          aria-label="DekhoCampus home"
          className="flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={closeNavigation}
        >
          <BrandLogo variant="mark" size="md" className="sm:hidden" />
          <BrandLogo size="md" className="hidden sm:inline-flex" />
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main navigation">
          <button
            type="button"
            aria-expanded={desktopMenu === "programs"}
            aria-controls="desktop-navigation-panel"
            onClick={() => setDesktopMenu((menu) => (menu === "programs" ? null : "programs"))}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            Programs
            <ChevronDown
              className={`h-3.5 w-3.5 transition ${desktopMenu === "programs" ? "rotate-180" : ""}`}
            />
          </button>
          <button
            type="button"
            aria-expanded={desktopMenu === "universities"}
            aria-controls="desktop-navigation-panel"
            onClick={() =>
              setDesktopMenu((menu) => (menu === "universities" ? null : "universities"))
            }
            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            Universities
            <ChevronDown
              className={`h-3.5 w-3.5 transition ${desktopMenu === "universities" ? "rotate-180" : ""}`}
            />
          </button>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setDesktopMenu(null)}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <Link
            to="/search"
            search={{ q: "" }}
            aria-label="Search courses and universities"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-foreground transition hover:bg-secondary"
          >
            <Search className="h-4 w-4" />
          </Link>
          <Link
            to="/compare"
            aria-label={`Open comparison${comparison.count ? ` with ${comparison.count} selected` : ""}`}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-foreground transition hover:bg-secondary"
          >
            <GitCompareArrows className="h-4 w-4" />
            {comparison.count > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1768cc] px-1 text-[10px] font-extrabold text-white">
                {comparison.count}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            title={dark ? "Switch to light theme" : "Switch to dark theme"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-foreground transition hover:bg-secondary"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Button
            asChild
            size="sm"
            className="h-10 min-w-0 rounded-xl bg-[#a94300] px-4 font-extrabold text-white hover:bg-[#8f3700]"
          >
            <Link to="/contact">Free counselling</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <Link
            to="/compare"
            aria-label={`Open comparison${comparison.count ? ` with ${comparison.count} selected` : ""}`}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background"
          >
            <GitCompareArrows className="h-4 w-4" />
            {comparison.count > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1768cc] px-1 text-[10px] font-extrabold text-white">
                {comparison.count}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {desktopMenu ? (
          <div
            id="desktop-navigation-panel"
            className="absolute left-0 right-0 top-[4.45rem] hidden overflow-hidden rounded-[1.4rem] border border-border bg-popover shadow-[0_28px_80px_-34px_rgba(18,38,62,0.6)] xl:block"
          >
            {desktopMenu === "programs" ? (
              <div className="grid grid-cols-[0.76fr_2.24fr]">
                <div className="bg-[#152238] p-7 text-white">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <GraduationCap className="h-5 w-5" />
                  </span>
                  <p className="mt-5 font-display text-xl font-extrabold tracking-[-0.04em]">
                    Find your online degree
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Explore by qualification, then compare fees, eligibility and universities.
                  </p>
                  <Link
                    to="/programs"
                    onClick={closeNavigation}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#ff9a50]"
                  >
                    Browse all programs <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-4 gap-6 p-7">
                  {groupedPrograms.map((group) => (
                    <div key={group.level}>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
                        {group.level}
                      </p>
                      <div className="mt-3 space-y-1">
                        {group.programs.length ? (
                          group.programs.map((program) => (
                            <Link
                              key={program.slug}
                              to="/programs/$programSlug"
                              params={{ programSlug: program.slug }}
                              onClick={closeNavigation}
                              className="block rounded-lg px-2 py-2 text-sm font-bold transition hover:bg-secondary hover:text-[#1768cc]"
                            >
                              <span className="mr-2 text-[#a94300] dark:text-[#ff9a5b]">
                                {program.code}
                              </span>
                              <span className="text-xs font-medium text-muted-foreground">
                                {program.durationYears} yr
                              </span>
                            </Link>
                          ))
                        ) : (
                          <p className="px-2 py-2 text-xs text-muted-foreground">Coming soon</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-7">
                <div className="flex items-end justify-between gap-6 border-b border-border pb-5">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#a94300] dark:text-[#ff9a5b]">
                      University directory
                    </p>
                    <p className="mt-1 font-display text-xl font-extrabold tracking-[-0.035em]">
                      Explore online-university profiles
                    </p>
                  </div>
                  <Link
                    to="/universities"
                    onClick={closeNavigation}
                    className="inline-flex items-center gap-2 text-sm font-extrabold text-[#1768cc] dark:text-[#70b3ff]"
                  >
                    View all <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-5">
                  {universities.slice(0, 9).map((university) => (
                    <Link
                      key={university.slug}
                      to="/universities/$universitySlug"
                      params={{ universitySlug: university.slug }}
                      onClick={closeNavigation}
                      className="flex items-center gap-3 rounded-xl border border-transparent p-3 transition hover:border-border hover:bg-secondary"
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold text-white"
                        style={{ backgroundColor: university.accentColor }}
                      >
                        {university.shortName.slice(0, 2).toUpperCase()}
                      </span>
                      <span>
                        <span className="block text-sm font-extrabold">{university.shortName}</span>
                        <span className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                          <ShieldCheck className="h-3 w-3" />
                          {university.profileDepth === "directory"
                            ? "Directory record"
                            : "Reviewed profile"}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {open ? (
        <div className="container-page mt-2 overflow-hidden rounded-2xl border border-border bg-background shadow-xl xl:hidden">
          <div className="flex max-h-[calc(100vh-7rem)] flex-col gap-1 overflow-y-auto p-4">
            <Link
              to="/search"
              search={{ q: "" }}
              onClick={closeNavigation}
              className="mb-2 flex items-center gap-3 rounded-xl border border-border bg-secondary px-3 py-3 text-sm font-extrabold text-foreground"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-card text-[#1768cc] dark:text-[#70b3ff]">
                <Search className="h-4 w-4" />
              </span>
              Search courses and universities
            </Link>
            <p className="px-3 pt-1 text-[9px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
              Popular courses
            </p>
            <Link
              to="/programs"
              onClick={closeNavigation}
              className="rounded-lg px-3 py-2.5 text-sm font-extrabold text-foreground hover:bg-secondary"
            >
              All programs
            </Link>
            <div className="grid grid-cols-2 gap-2 px-3 pb-3">
              {programCatalog.slice(0, 6).map((program) => (
                <Link
                  key={program.slug}
                  to="/programs/$programSlug"
                  params={{ programSlug: program.slug }}
                  onClick={closeNavigation}
                  className="rounded-lg bg-secondary px-3 py-2 text-xs font-bold"
                >
                  {program.code}
                </Link>
              ))}
            </div>
            <Link
              to="/universities"
              onClick={closeNavigation}
              className="rounded-lg px-3 py-2.5 text-sm font-extrabold text-foreground hover:bg-secondary"
            >
              Universities
            </Link>
            <p className="mt-2 px-3 pt-2 text-[9px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
              More
            </p>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeNavigation}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
              >
                {link.label}
              </Link>
            ))}
            <Button
              asChild
              className="mt-2 w-full rounded-xl bg-[#a94300] font-extrabold text-white hover:bg-[#8f3700]"
            >
              <Link to="/contact" onClick={closeNavigation}>
                Get free counselling
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
