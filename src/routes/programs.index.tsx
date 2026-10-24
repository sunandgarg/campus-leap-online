import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  Clock3,
  GitCompareArrows,
  GraduationCap,
  Layers3,
  Search,
  Sparkles,
} from "lucide-react";
import { LeadForm } from "@/components/site/lead-form";
import { UniversityLogo } from "@/components/site/university-logo";
import { Button } from "@/components/ui/button";
import {
  formatINR,
  programCatalog,
  universitiesOfferingProgram,
  verifiedUniversitiesOfferingProgram,
  type ProgramLevel,
} from "@/data/universities";

export const Route = createFileRoute("/programs/")({
  head: () => ({
    meta: [
      { title: "Online Courses — MBA, BBA, MCA, BCA & More | DekhoCampus" },
      {
        name: "description",
        content:
          "Explore online degree courses by study level, duration, specialisation and university availability.",
      },
      { property: "og:title", content: "Explore Online Degree Courses in India" },
      {
        property: "og:description",
        content:
          "Find online undergraduate, postgraduate, diploma and certificate courses in one place.",
      },
    ],
  }),
  component: ProgramsPage,
});

type LevelFilter = "All" | ProgramLevel;

const levelTabs: { value: LevelFilter; label: string }[] = [
  { value: "All", label: "All courses" },
  { value: "Masters", label: "Postgraduate" },
  { value: "Bachelors", label: "Undergraduate" },
  { value: "Diploma", label: "Diplomas" },
  { value: "Certificate", label: "Certificates" },
];

function ProgramsPage() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<LevelFilter>("All");

  const programs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return programCatalog.filter((program) => {
      const matchesLevel = level === "All" || program.level === level;
      const matchesQuery =
        !normalized ||
        program.name.toLowerCase().includes(normalized) ||
        program.code.toLowerCase().includes(normalized) ||
        program.specialisations.some((item) => item.toLowerCase().includes(normalized)) ||
        program.careers.some((item) => item.toLowerCase().includes(normalized));
      return matchesLevel && matchesQuery;
    });
  }, [level, query]);

  return (
    <div className="bg-background text-foreground">
      <section className="border-b border-border bg-[#f6f8fc] dark:bg-[#121722]">
        <div className="container-page py-5 sm:py-7 lg:py-9">
          <p className="flex items-center gap-2 text-xs font-extrabold text-[#2449ad] dark:text-[#b9ceff]">
            <BookOpenCheck className="h-4 w-4" aria-hidden="true" /> Online course explorer
          </p>
          <h1 className="mt-2 max-w-3xl font-display text-[2rem] font-extrabold leading-[1.05] tracking-[-0.045em] text-[#131720] dark:text-foreground sm:text-4xl lg:text-[2.6rem]">
            Choose a course for where you want to go next.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Start with your study level, then explore duration, specialisations and universities for
            every course that interests you.
          </p>
          <dl className="mt-5 grid max-w-2xl grid-cols-3 divide-x divide-border border-t border-border pt-4">
            <div className="pr-3">
              <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Course guides
              </dt>
              <dd className="mt-1 font-display text-lg font-extrabold">{programCatalog.length}</dd>
            </div>
            <div className="px-3">
              <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Study levels
              </dt>
              <dd className="mt-1 font-display text-lg font-extrabold">4</dd>
            </div>
            <div className="pl-3">
              <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Shortlist
              </dt>
              <dd className="mt-1 font-display text-lg font-extrabold">Free</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="container-page py-4 pb-8 lg:py-7">
        <div className="sticky top-16 z-30 min-w-0 p-2.5 backdrop-blur sm:p-3 border-b border-border">
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-2">
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search course, career or skill"
                aria-label="Search online courses"
                className="h-11 w-full min-w-0 rounded-lg border border-border bg-card pl-10 pr-3 text-sm outline-none focus:border-[#325dd2] focus-visible:ring-2 focus-visible:ring-[#325dd2] focus-visible:ring-offset-2"
              />
            </div>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-lg bg-card px-3 font-extrabold"
            >
              <Link to="/compare" aria-label="Open university comparison">
                <GitCompareArrows className="h-4 w-4 min-[360px]:mr-2" />
                <span className="hidden min-[360px]:inline">Compare</span>
              </Link>
            </Button>
          </div>
          <div
            className="mt-2 flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="group"
            aria-label="Filter courses by study level"
          >
            {levelTabs.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={level === item.value}
                onClick={() => setLevel(item.value)}
                className={`h-9 shrink-0 rounded-full border px-3 text-xs font-extrabold transition-colors ${
                  level === item.value
                    ? "border-[#325dd2] bg-[#325dd2] text-white"
                    : "border-border bg-card text-muted-foreground hover:border-[#80ace0]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#2449ad] dark:text-[#b9ceff]">
              {level === "All" ? "All study levels" : level}
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold tracking-[-0.035em]">
              Explore online courses
            </h2>
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="mt-1 text-xs font-semibold text-muted-foreground"
            >
              {programs.length} {programs.length === 1 ? "course" : "courses"} found
            </p>
          </div>
          <Link
            to="/specialisations"
            className="hidden min-h-10 items-center text-sm font-extrabold text-[#1768cc] dark:text-[#78b9ff] sm:inline-flex"
          >
            Browse specialisations <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {programs.length > 0 ? (
          <div
            aria-label="Online course options"
            className="mt-3 grid min-w-0 grid-cols-1 gap-x-10 md:grid-cols-2"
          >
            {programs.map((program) => {
              const offers = universitiesOfferingProgram(program.slug),
                verified = verifiedUniversitiesOfferingProgram(program.slug);
              const lowest = verified.length
                ? Math.min(...verified.map(({ program: offer }) => offer.totalFee))
                : null;
              return (
                <Link
                  key={program.slug}
                  to="/programs/$programSlug"
                  params={{ programSlug: program.slug }}
                  aria-label={`Explore ${program.name}`}
                  className="course-list-row group flex min-h-36 items-center gap-4 border-b border-border py-5 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
                >
                  <span className="w-16 shrink-0 text-lg font-semibold text-primary">
                    {program.code}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold leading-6 group-hover:text-primary">
                      {program.name}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {program.durationYears} years · {offers.length} university profiles
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex -space-x-1">
                        {offers.slice(0, 3).map(({ university }) => (
                          <UniversityLogo
                            key={university.slug}
                            university={university}
                            size="sm"
                            className="h-6 w-6 rounded-full border-0"
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {lowest !== null ? `Fee from ${formatINR(lowest)}` : "Check current fee"}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                </Link>
              );
            })}{" "}
          </div>
        ) : (
          <div className="mt-5 p-8 text-center border-b border-border">
            <Sparkles className="mx-auto h-7 w-7 text-muted-foreground" />
            <h2 className="mt-3 font-display text-xl font-extrabold">No matching course yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Try another keyword or choose a different study level.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setLevel("All");
              }}
              className="mt-4 rounded-lg"
            >
              Reset filters
            </Button>
          </div>
        )}

        <div className="mt-8 grid gap-4 p-4 sm:p-5 lg:grid-cols-[1fr_390px] lg:items-center border-b border-border">
          <div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1768cc] shadow-sm dark:bg-[#202938] dark:text-[#78b9ff]">
              <GraduationCap className="h-4 w-4" />
            </span>
            <h2 className="mt-3 max-w-xl font-display text-xl font-extrabold tracking-[-0.035em]">
              Not sure which course fits your profile?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Tell us your qualification, budget and career goal. We’ll help you narrow the course
              and university combination without asking you to pay.
            </p>
          </div>
          <LeadForm compact title="Get my course shortlist" />
        </div>
      </section>
    </div>
  );
}
