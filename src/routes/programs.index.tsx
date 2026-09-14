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
import { CompactRail } from "@/components/site/compact-rail";
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
        <div className="sticky top-16 z-30 min-w-0 rounded-xl border border-border bg-background/95 p-2.5 shadow-card backdrop-blur sm:p-3">
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
          <CompactRail
            label="Online course options"
            rows={2}
            columns={3}
            className="mt-3"
            railClassName="gap-2 auto-cols-[calc((100%_-_0.5rem)/2)] sm:auto-cols-[calc((100%_-_1rem)/3)] lg:auto-cols-[calc((100%_-_2rem)/5)]"
          >
            {programs.map((program) => {
              const offers = universitiesOfferingProgram(program.slug);
              const verifiedOffers = verifiedUniversitiesOfferingProgram(program.slug);
              const lowest = verifiedOffers.length
                ? Math.min(...verifiedOffers.map(({ program: offer }) => offer.totalFee))
                : null;
              const logoUniversities = offers.slice(0, 3).map(({ university }) => university);

              return (
                <Link
                  key={program.slug}
                  to="/programs/$programSlug"
                  params={{ programSlug: program.slug }}
                  aria-label={`Explore ${program.name}`}
                  className="group relative flex h-[12.25rem] min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_9px_25px_-24px_rgba(19,23,32,0.65)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#80ace0] hover:shadow-[0_14px_30px_-22px_rgba(50,93,210,0.48)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#325dd2] focus-visible:ring-offset-2"
                >
                  <span className="h-1 shrink-0 bg-[#325dd2]" aria-hidden="true" />
                  <div className="flex items-center justify-between gap-1.5 border-b border-border bg-[#f8faff] px-2.5 py-2 dark:bg-[#171d28]">
                    <span className="inline-flex min-w-0 items-center gap-1.5 text-xs font-extrabold text-[#2449ad] dark:text-[#a9c0ff]">
                      <GraduationCap className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">{program.code}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-[10px] font-bold text-muted-foreground">
                      <Clock3 className="h-3 w-3" aria-hidden="true" /> {program.durationYears} yr
                    </span>
                  </div>

                  <div className="flex min-h-0 flex-1 flex-col p-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#a94300] dark:text-[#ffad70]">
                      {program.level}
                    </p>
                    <h3 className="mt-1 line-clamp-3 min-h-12 font-display text-xs font-extrabold leading-4 tracking-[-0.015em] sm:text-[0.82rem]">
                      {program.name}
                    </h3>

                    <div className="mt-2 flex min-w-0 items-center gap-2">
                      <div className="flex shrink-0 -space-x-1.5" aria-hidden="true">
                        {logoUniversities.length ? (
                          logoUniversities.map((university, index) => (
                            <UniversityLogo
                              key={university.slug}
                              university={university}
                              size="sm"
                              priority={index === 0}
                              className="h-6 w-6 rounded-full border-2 border-white dark:border-[#171d28]"
                            />
                          ))
                        ) : (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary">
                            <Layers3 className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                      <p className="min-w-0 text-[10px] font-bold text-muted-foreground">
                        {offers.length} {offers.length === 1 ? "option" : "options"}
                      </p>
                    </div>

                    <div className="mt-auto flex min-w-0 items-center justify-between gap-1.5 border-t border-border pt-1.5">
                      <div className="min-w-0">
                        <p className="truncate text-[10px] font-extrabold text-foreground">
                          {program.specialisations.length} pathways
                        </p>
                        <p className="line-clamp-2 text-[10px] font-semibold leading-3 text-muted-foreground">
                          {lowest !== null
                            ? `Fee from ${formatINR(lowest)}`
                            : "Current fee unavailable"}
                        </p>
                      </div>
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#edf2ff] text-[#2449ad] transition-colors group-hover:bg-[#325dd2] group-hover:text-white dark:bg-[#243352] dark:text-[#a9c0ff]">
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </CompactRail>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
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

        <div className="mt-8 grid gap-4 rounded-2xl border border-border bg-[#f6f8fc] p-4 dark:bg-[#151b26] sm:p-5 lg:grid-cols-[1fr_390px] lg:items-center">
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
