import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  ChevronDown,
  GitCompareArrows,
  GraduationCap,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";

import { BrandLogo } from "@/components/site/brand-logo";
import { UniversityLogo } from "@/components/site/university-logo";
import { Button } from "@/components/ui/button";
import { programCatalog, universities } from "@/data/universities";
import { useComparison } from "@/hooks/use-comparison";

type DesktopMenu = "programs" | "universities" | "tools" | null;

const navLinks = [
  { to: "/specialisations", label: "Specialisations" },
  { to: "/about", label: "About" },
] as const;

const toolLinks = [
  {
    to: "/finder" as const,
    title: "Course finder",
    description: "Get a useful starting shortlist",
    icon: Target,
  },
  {
    to: "/compare" as const,
    title: "Compare universities",
    description: "Keep up to three options together",
    icon: GitCompareArrows,
  },
  {
    to: "/search" as const,
    title: "Search everything",
    description: "Courses, universities and topics",
    icon: Search,
  },
  {
    to: "/methodology" as const,
    title: "Before-you-pay check",
    description: "Know what to confirm before applying",
    icon: ShieldCheck,
  },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [desktopMenu, setDesktopMenu] = useState<DesktopMenu>(null);
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const desktopPanelRef = useRef<HTMLDivElement>(null);
  const navigationReturnFocusRef = useRef<HTMLElement | null>(null);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const comparison = useComparison();

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    setOpen(false);
    setDesktopMenu(null);
    navigationReturnFocusRef.current = null;
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => {
      mobilePanelRef.current
        ?.querySelector<HTMLElement>("a[href], button:not([disabled])")
        ?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!desktopMenu) return;
    const frame = window.requestAnimationFrame(() => {
      desktopPanelRef.current
        ?.querySelector<HTMLElement>("a[href], button:not([disabled])")
        ?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [desktopMenu]);

  useEffect(() => {
    if (!desktopMenu) return;

    function handleOutsidePointer(event: PointerEvent) {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setDesktopMenu(null);
        navigationReturnFocusRef.current = null;
      }
    }

    document.addEventListener("pointerdown", handleOutsidePointer);
    return () => document.removeEventListener("pointerdown", handleOutsidePointer);
  }, [desktopMenu]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        const returnTarget = navigationReturnFocusRef.current;
        setOpen(false);
        setDesktopMenu(null);
        navigationReturnFocusRef.current = null;
        window.requestAnimationFrame(() => returnTarget?.focus());
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function toggleTheme() {
    const nextDark = !dark;
    document.documentElement.classList.toggle("dark", nextDark);
    try {
      window.localStorage.setItem("dekhocampus-theme", nextDark ? "dark" : "light");
    } catch {
      // The theme still changes when browser storage is unavailable.
    }
    setDark(nextDark);
  }

  function closeNavigation() {
    setOpen(false);
    setDesktopMenu(null);
    navigationReturnFocusRef.current = null;
  }

  function toggleMobileNavigation() {
    if (open) {
      setOpen(false);
      navigationReturnFocusRef.current = null;
      window.requestAnimationFrame(() => mobileMenuButtonRef.current?.focus());
      return;
    }

    navigationReturnFocusRef.current = mobileMenuButtonRef.current;
    setDesktopMenu(null);
    setOpen(true);
  }

  function toggleDesktopNavigation(menu: Exclude<DesktopMenu, null>, trigger: HTMLButtonElement) {
    if (desktopMenu === menu) {
      setDesktopMenu(null);
      navigationReturnFocusRef.current = null;
      window.requestAnimationFrame(() => trigger.focus());
      return;
    }

    navigationReturnFocusRef.current = trigger;
    setOpen(false);
    setDesktopMenu(menu);
  }

  const groupedPrograms = ["Masters", "Bachelors", "Diploma", "Certificate"].map((level) => ({
    level,
    programs: programCatalog.filter((program) => program.level === level),
  }));

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-border bg-background shadow-[0_1px_0_rgba(19,23,32,0.02)]"
    >
      <div className="container-page relative flex h-14 items-center justify-between gap-2 sm:h-16">
        <div className="flex min-w-0 items-center lg:gap-0">
          <button
            ref={mobileMenuButtonRef}
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation-panel"
            onClick={toggleMobileNavigation}
            className="absolute right-0 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-card transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-secondary active:scale-95 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link
            to="/"
            aria-label="DekhoCampus home"
            onClick={closeNavigation}
            className="flex h-11 min-w-0 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <BrandLogo size="sm" className="sm:hidden" />
            <BrandLogo size="md" className="hidden sm:inline-flex" />
          </Link>
        </div>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
          <DesktopMenuButton
            label="Courses"
            open={desktopMenu === "programs"}
            onClick={(trigger) => toggleDesktopNavigation("programs", trigger)}
          />
          <DesktopMenuButton
            label="Universities"
            open={desktopMenu === "universities"}
            onClick={(trigger) => toggleDesktopNavigation("universities", trigger)}
          />
          <DesktopMenuButton
            label="Tools"
            open={desktopMenu === "tools"}
            onClick={(trigger) => toggleDesktopNavigation("tools", trigger)}
          />
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setDesktopMenu(null)}
              className="hidden h-11 items-center rounded-xl px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground xl:inline-flex"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Link
            to="/compare"
            aria-label={`Compare universities${comparison.count ? `, ${comparison.count} selected` : ""}`}
            className="relative mr-12 hidden h-10 items-center gap-1.5 rounded-full border border-[#c8d5f8] bg-[#edf2ff] px-3 text-[11px] font-extrabold text-[#2449ad] transition-colors hover:border-[#325dd2] dark:border-[#41547d] dark:bg-[#263653] dark:text-[#b9ceff] sm:inline-flex sm:h-11 sm:text-xs lg:hidden"
          >
            <GitCompareArrows className="h-4 w-4" aria-hidden="true" />
            <span>Compare</span>
            {comparison.count > 0 ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#325dd2] px-1 text-[9px] text-white">
                {comparison.count}
              </span>
            ) : null}
          </Link>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              to="/search"
              search={{ q: "" }}
              aria-label="Search courses and universities"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 text-xs font-bold text-foreground transition-colors hover:border-[#86a2e8] hover:bg-secondary"
            >
              <Search className="h-4 w-4" />
              <span className="hidden xl:inline">Search</span>
            </Link>
            <Link
              to="/compare"
              aria-label={`Compare universities${comparison.count ? `, ${comparison.count} selected` : ""}`}
              className="relative inline-flex h-11 items-center gap-2 rounded-xl border border-[#c8d5f8] bg-[#edf2ff] px-3 text-xs font-extrabold text-[#2449ad] transition-colors hover:border-[#325dd2] dark:border-[#41547d] dark:bg-[#263653] dark:text-[#b9ceff]"
            >
              <GitCompareArrows className="h-4 w-4" />
              Compare
              {comparison.count > 0 ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#325dd2] px-1 text-[9px] text-white">
                  {comparison.count}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
              title={dark ? "Switch to light theme" : "Switch to dark theme"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-secondary"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Button
              asChild
              className="h-11 rounded-xl bg-[#f47b25] px-4 font-extrabold text-[#111827] hover:bg-[#e56e1e]"
            >
              <Link to="/contact">Talk to a counsellor</Link>
            </Button>
          </div>
        </div>

        {desktopMenu ? (
          <DesktopPanel
            panelRef={desktopPanelRef}
            menu={desktopMenu}
            groupedPrograms={groupedPrograms}
            onNavigate={closeNavigation}
          />
        ) : null}
      </div>

      {open ? (
        <div
          ref={mobilePanelRef}
          id="mobile-navigation-panel"
          tabIndex={-1}
          aria-label="Mobile navigation menu"
          className="border-t border-border bg-background lg:hidden"
        >
          <div className="container-page max-h-[calc(100dvh-3.5rem)] overflow-y-auto pb-[calc(5.75rem+env(safe-area-inset-bottom))] pt-3 sm:max-h-[calc(100dvh-4rem)]">
            <Link
              to="/search"
              search={{ q: "" }}
              onClick={closeNavigation}
              className="flex min-h-12 items-center gap-3 rounded-xl border border-border bg-card px-3 text-sm font-bold shadow-card"
            >
              <Search className="h-5 w-5 text-[#325dd2]" />
              Search courses and universities
            </Link>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { to: "/programs" as const, label: "Courses", icon: BookOpenCheck },
                { to: "/universities" as const, label: "Universities", icon: Building2 },
                { to: "/finder" as const, label: "Find my fit", icon: Sparkles },
                { to: "/compare" as const, label: "Compare", icon: GitCompareArrows },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeNavigation}
                  className="flex min-h-14 items-center gap-2.5 rounded-xl bg-secondary px-3 text-sm font-extrabold"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-card text-[#325dd2]">
                    <item.icon className="h-4 w-4" />
                  </span>
                  {item.label}
                </Link>
              ))}
            </div>

            <p className="mt-5 px-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
              Popular courses
            </p>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {programCatalog.slice(0, 8).map((program) => (
                <Link
                  key={program.slug}
                  to="/programs/$programSlug"
                  params={{ programSlug: program.slug }}
                  onClick={closeNavigation}
                  className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-border bg-card px-4 text-xs font-extrabold"
                >
                  Online {program.code}
                </Link>
              ))}
            </div>

            <div className="mt-4 divide-y divide-border rounded-xl border border-border bg-card px-3">
              <Link
                to="/specialisations"
                onClick={closeNavigation}
                className="flex min-h-12 items-center justify-between text-sm font-bold"
              >
                Explore specialisations <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link
                to="/methodology"
                onClick={closeNavigation}
                className="flex min-h-12 items-center justify-between text-sm font-bold"
              >
                What to check before paying <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link
                to="/about"
                onClick={closeNavigation}
                className="flex min-h-12 items-center justify-between text-sm font-bold"
              >
                About DekhoCampus <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex min-h-12 w-full items-center justify-between text-left text-sm font-bold"
              >
                {dark ? "Use light theme" : "Use dark theme"}
                {dark ? (
                  <Sun className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Moon className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>

            <Button
              asChild
              className="mt-3 min-h-12 w-full bg-[#f47b25] font-extrabold text-[#111827] hover:bg-[#e56e1e]"
            >
              <Link to="/contact" onClick={closeNavigation}>
                Talk to a counsellor
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function DesktopMenuButton({
  label,
  open,
  onClick,
}: {
  label: string;
  open: boolean;
  onClick: (trigger: HTMLButtonElement) => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls="desktop-navigation-panel"
      aria-haspopup="true"
      onClick={(event) => onClick(event.currentTarget)}
      className="inline-flex h-11 items-center gap-1 rounded-xl px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      {label}
      <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
  );
}

function DesktopPanel({
  panelRef,
  menu,
  groupedPrograms,
  onNavigate,
}: {
  panelRef: RefObject<HTMLDivElement | null>;
  menu: Exclude<DesktopMenu, null>;
  groupedPrograms: { level: string; programs: typeof programCatalog }[];
  onNavigate: () => void;
}) {
  return (
    <div
      ref={panelRef}
      id="desktop-navigation-panel"
      tabIndex={-1}
      aria-label={`${menu} navigation`}
      className="absolute left-5 right-5 top-full hidden overflow-hidden rounded-b-2xl border border-border bg-popover shadow-lift lg:block md:left-8 md:right-8"
    >
      {menu === "programs" ? (
        <div className="grid grid-cols-[0.7fr_2.3fr]">
          <MenuIntro
            icon={GraduationCap}
            title="Find your online course"
            description="Browse by qualification and open any course for university options."
            to="/programs"
            linkLabel="See all courses"
            onNavigate={onNavigate}
          />
          <div className="grid grid-cols-4 gap-5 p-6">
            {groupedPrograms.map((group) => (
              <div key={group.level}>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
                  {group.level}
                </p>
                <div className="mt-2 space-y-0.5">
                  {group.programs.length ? (
                    group.programs.map((program) => (
                      <Link
                        key={program.slug}
                        to="/programs/$programSlug"
                        params={{ programSlug: program.slug }}
                        onClick={onNavigate}
                        className="flex min-h-10 items-center justify-between rounded-lg px-2 text-sm font-bold transition-colors hover:bg-secondary hover:text-[#2449ad] dark:hover:text-[#8cb0ff]"
                      >
                        <span>Online {program.code}</span>
                        <span className="text-[10px] font-semibold text-muted-foreground">
                          {program.durationYears} yr
                        </span>
                      </Link>
                    ))
                  ) : (
                    <p className="flex min-h-10 items-center px-2 text-xs text-muted-foreground">
                      Coming soon
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : menu === "universities" ? (
        <div className="grid grid-cols-[0.7fr_2.3fr]">
          <MenuIntro
            icon={Building2}
            title="Explore universities"
            description="Start with popular profiles or open the complete university directory."
            to="/universities"
            linkLabel="View all universities"
            onNavigate={onNavigate}
          />
          <div className="grid grid-cols-3 gap-2 p-6">
            {universities.slice(0, 9).map((university) => (
              <Link
                key={university.slug}
                to="/universities/$universitySlug"
                params={{ universitySlug: university.slug }}
                onClick={onNavigate}
                className="flex min-h-16 items-center gap-3 rounded-xl border border-transparent p-3 transition-colors hover:border-border hover:bg-secondary"
              >
                <UniversityLogo
                  university={university}
                  size="sm"
                  className="h-10 w-14 rounded-lg bg-white"
                />
                <span className="min-w-0">
                  <span className="line-clamp-1 block text-sm font-extrabold">
                    {university.shortName}
                  </span>
                  <span className="mt-0.5 block text-[10px] font-semibold text-muted-foreground">
                    {university.state || "India"}
                    {university.programs.length ? ` · ${university.programs.length} courses` : ""}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-[0.7fr_2.3fr]">
          <MenuIntro
            icon={Sparkles}
            title="Make a clearer choice"
            description="Use practical tools to find, compare and confirm your options."
            to="/finder"
            linkLabel="Start course finder"
            onNavigate={onNavigate}
          />
          <div className="grid grid-cols-2 gap-3 p-6">
            {toolLinks.map((tool) => (
              <Link
                key={tool.title}
                to={tool.to}
                {...(tool.to === "/search" ? { search: { q: "" } } : {})}
                onClick={onNavigate}
                className="flex min-h-20 items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:border-[#86a2e8] hover:bg-secondary"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf2ff] text-[#325dd2] dark:bg-[#263653]">
                  <tool.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-extrabold">{tool.title}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {tool.description}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MenuIntro({
  icon: Icon,
  title,
  description,
  to,
  linkLabel,
  onNavigate,
}: {
  icon: typeof GraduationCap;
  title: string;
  description: string;
  to: "/programs" | "/universities" | "/finder";
  linkLabel: string;
  onNavigate: () => void;
}) {
  return (
    <div className="border-r border-border bg-surface p-6">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#325dd2] text-white">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-4 font-display text-xl font-extrabold tracking-[-0.04em]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      <Link
        to={to}
        onClick={onNavigate}
        className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-extrabold text-[#2449ad] hover:underline dark:text-[#8cb0ff]"
      >
        {linkLabel} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
