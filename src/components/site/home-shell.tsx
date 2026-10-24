import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  GitCompareArrows,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  Target,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/site/brand-logo";
import { UniversityLogo } from "@/components/site/university-logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { programCatalog, universities, universitiesOfferingProgram } from "@/data/universities";
import { useComparison } from "@/hooks/use-comparison";
import { coursePath, universityPath } from "@/lib/online-paths";

const mainLinks = [
  { to: "/programs", label: "Courses", icon: BookOpenCheck },
  { to: "/universities", label: "Universities", icon: Building2 },
  { to: "/compare", label: "Compare", icon: GitCompareArrows },
  { to: "/news", label: "News", icon: BookOpenCheck },
] as const;
const helpLinks = [
  { to: "/finder", label: "Find my course", icon: Target },
  { to: "/specialisations", label: "Specialisations", icon: BookOpenCheck },
  { to: "/methodology", label: "Check recognition & fees", icon: ShieldCheck },
  { to: "/about", label: "About DekhoCampus", icon: Building2 },
] as const;

// Keep the established homepage shell independent of the editorial profile pages.
export function HomeHeader() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const { count } = useComparison();
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  function toggleTheme() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  }
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-2 sm:h-[72px]">
        <Link
          to="/"
          aria-label="DekhoCampus home"
          className="inline-flex min-h-11 shrink-0 items-center rounded-lg focus-visible:ring-2 focus-visible:ring-ring"
        >
          <BrandLogo size="sm" className="sm:hidden [&>img]:w-[100px]" />
          <BrandLogo size="md" className="hidden sm:inline-flex" />
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {mainLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {label}
              {to === "/compare" && count > 0 && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            to="/search"
            search={{ q: "" }}
            aria-label="Search courses and universities"
            className="inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-border bg-card px-3 text-sm text-muted-foreground hover:bg-secondary"
          >
            <Search className="h-4 w-4" />
            <span className="hidden xl:inline">Search</span>
          </Link>
          <Button asChild className="h-11 rounded-full px-3 text-xs sm:px-5 sm:text-sm">
            <Link to="/contact">
              <span className="sm:hidden">Get help</span>
              <span className="hidden sm:inline">Free counselling</span>
            </Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open navigation menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent className="w-[min(100%,400px)] overflow-y-auto pb-24 [&>button]:h-11 [&>button]:w-11">
              <SheetTitle className="pr-12 text-xl">Where would you like to go?</SheetTitle>
              <SheetDescription className="mt-2 text-sm">
                Courses, universities and help. No sign-up to explore.
              </SheetDescription>
              <nav aria-label="All pages" className="mt-6" onClick={() => setOpen(false)}>
                {mainLinks.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold hover:bg-secondary"
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Link>
                ))}
                <p className="mb-2 mt-6 text-xs font-semibold text-muted-foreground">
                  Go straight to a course
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {programCatalog.slice(0, 4).map((p) => (
                    <Link
                      key={p.slug}
                      to="/programs/$programSlug"
                      params={{ programSlug: p.slug }}
                      className="flex min-h-11 items-center justify-between rounded-xl border border-border px-3 text-sm font-semibold"
                    >
                      {p.code}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
                <div className="mt-6 border-t border-border pt-3">
                  {helpLinks.map(({ to, label, icon: Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm hover:bg-secondary"
                    >
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      {label}
                    </Link>
                  ))}
                </div>
              </nav>
              <Button asChild className="mt-5 h-12 w-full rounded-full">
                <Link to="/contact">
                  Free counselling <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <button
                type="button"
                onClick={toggleTheme}
                className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-border text-sm"
              >
                {dark ? <Sun size={16} /> : <Moon size={16} />}
                {dark ? "Switch to light mode" : "Switch to dark mode"}
              </button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function HomeFooter() {
  const courseColumns = ["online-mba", "online-bba"].map((slug) => {
    const code = slug === "online-mba" ? "MBA" : "BBA";
    return {
      title: `Online ${code}`,
      links: universitiesOfferingProgram(slug)
        .sort(
          (a, b) =>
            Number(b.university.slug === "amity-university-online") -
              Number(a.university.slug === "amity-university-online") ||
            a.university.name.localeCompare(b.university.name),
        )
        .slice(0, 6)
        .map(({ university }) => ({
          label: `${university.shortName.replace(/\s+Online$/i, "")} ${code} course profile`,
          href: coursePath(university, slug),
          university,
        })),
      all: `/programs/${slug}`,
    };
  });
  const columns = [
    ...courseColumns,
    {
      title: "Universities",
      links: universities
        .filter((u) => u.programs.length > 0)
        .slice(0, 6)
        .map((university) => ({
          label: university.shortName,
          href: universityPath(university),
          university,
        })),
      all: "/universities",
    },
    {
      title: "Explore & support",
      links: [...mainLinks, ...helpLinks].map((link) => ({
        label: link.label,
        href: link.to,
        university: undefined,
      })),
      all: "/contact",
    },
  ];
  return (
    <footer className="site-footer border-t border-border bg-[#fffdf9] text-foreground dark:bg-[#0b1018]">
      <div className="container-page py-9 lg:py-16">
        <div className="grid gap-7 border-b border-border pb-8 lg:grid-cols-[1.25fr_0.85fr_0.85fr_0.85fr_0.9fr] lg:gap-7 lg:pb-12">
          <div className="lg:pr-6">
            <Link to="/" aria-label="DekhoCampus home">
              <BrandLogo size="lg" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              A simpler way to explore online degrees, compare universities and plan your next step.
            </p>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("dekhocampus:open-diya"))}
              className="mt-5 flex min-h-12 w-full max-w-sm items-center gap-3 rounded-xl border border-border bg-background px-3 py-2 text-left hover:border-primary"
            >
              <img
                src="/diya-ai.webp"
                alt=""
                width="36"
                height="36"
                className="rounded-full bg-white"
              />
              <span>
                <strong className="block text-sm">Ask Diya</strong>
                <span className="text-xs text-muted-foreground">
                  Find your way around DekhoCampus
                </span>
              </span>
            </button>
            <a
              href="https://dekhocampus.com"
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-primary"
            >
              Visit DekhoCampus.com <ArrowRight size={14} />
            </a>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="mb-3 text-sm font-bold">{column.title}</h2>
              <div className="flex flex-col">
                {column.links.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex min-h-11 items-center gap-2 py-2 text-sm leading-5 text-muted-foreground hover:text-primary"
                  >
                    {item.university && (
                      <UniversityLogo
                        university={item.university}
                        size="md"
                        className="footer-university-logo"
                      />
                    )}
                    {item.label}
                  </a>
                ))}
                <a
                  href={column.all}
                  className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary"
                >
                  View all <ArrowRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 py-6 text-sm">
          <div>
            <p className="font-semibold">Need help with your shortlist?</p>
            <a
              href="mailto:online@dekhocampus.com"
              className="inline-flex min-h-11 items-center text-primary"
            >
              online@dekhocampus.com
            </a>
          </div>
          <nav aria-label="Legal" className="flex flex-wrap gap-5">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/accessibility">Accessibility</Link>
          </nav>
        </div>
        <div className="border-t border-border pt-5 text-xs leading-6 text-muted-foreground">
          <p className="font-semibold text-foreground">One important check before you pay</p>
          <p>
            Course availability, fees and admission details can change by intake. Confirm the exact
            university, programme, Online mode and academic session on the university website and
            the relevant official portal.
          </p>
          <p className="mt-4">
            © {new Date().getFullYear()} DekhoCampus Online. All rights reserved.
          </p>
          <p>
            DekhoCampus helps learners research their options. Universities manage admissions, fees,
            scholarships, placements and academic delivery.
          </p>
        </div>
      </div>
    </footer>
  );
}
