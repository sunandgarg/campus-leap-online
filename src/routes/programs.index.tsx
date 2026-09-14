import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  Clock3,
  GraduationCap,
  Search,
  Sparkles,
  WalletCards,
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
      { title: "Online Degree Programs — MBA, BBA, MCA, BCA & More | DekhoCampus Online" },
      {
        name: "description",
        content:
          "Explore online degree category guides with typical duration, pathway themes and clearly separated university source records.",
      },
      { property: "og:title", content: "Online Degree Programs in India" },
      {
        property: "og:description",
        content:
          "Browse online degree category guides and clearly labelled university catalogue records, with exact fees shown only when sourced.",
      },
    ],
  }),
  component: ProgramsPage,
});

type LevelFilter = "All" | ProgramLevel;

const levelTabs: { value: LevelFilter; label: string }[] = [
  { value: "All", label: "All courses" },
  { value: "Bachelors", label: "Undergraduate" },
  { value: "Masters", label: "Postgraduate" },
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
      <section className="border-b border-border bg-[#131720] text-white">
        <div className="container-page py-8 lg:py-10">
          <span className="inline-flex items-center gap-2 border-l-4 border-[#f47b25] pl-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/85">
            <BookOpenCheck className="h-4 w-4" /> {programCatalog.length} online course guides
          </span>
          <h1 className="mt-3 max-w-4xl font-display text-3xl font-extrabold tracking-[-0.055em] sm:text-4xl lg:text-[2.65rem]">
            Browse online degrees by your study level.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
            Explore category-level eligibility, curriculum themes, career direction and clearly
            labelled fee status before choosing where to enrol.
          </p>
        </div>
      </section>

      <section className="container-page py-6 lg:py-8">
        <div className="rounded-xl border border-border bg-card p-3 shadow-card sm:p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search course, specialisation or career"
                aria-label="Search online courses"
                className="h-10 w-full rounded-lg border border-border bg-background pl-11 pr-4 text-sm outline-none focus:border-[#325dd2] focus-visible:ring-2 focus-visible:ring-[#325dd2] focus-visible:ring-offset-2"
              />
            </div>
            <div
              className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="group"
              aria-label="Filter courses by study level"
            >
              {levelTabs.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={level === item.value}
                  onClick={() => setLevel(item.value)}
                  className={`h-10 shrink-0 rounded-lg border px-3 text-xs font-extrabold transition-colors ${
                    level === item.value
                      ? "border-[#325dd2] bg-[#325dd2] text-white"
                      : "border-border bg-background text-muted-foreground hover:border-[#80ace0]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <p
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="text-sm font-bold text-muted-foreground"
          >
            Showing {programs.length} of {programCatalog.length} courses
          </p>
          <Link
            to="/compare"
            className="hidden items-center text-sm font-extrabold text-[#1768cc] dark:text-[#78b9ff] sm:inline-flex"
          >
            Open comparison <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {programs.length > 0 ? (
          <CompactRail
            label="Filtered online course guides"
            rows={2}
            columns={3}
            railClassName="gap-3 auto-cols-[minmax(16rem,90%)] min-[360px]:auto-cols-[calc((100%_-_0.75rem)/2)] sm:auto-cols-[calc((100%_-_1.5rem)/3)] lg:auto-cols-[calc((100%_-_3rem)/5)]"
          >
            {programs.map((program) => {
              const offers = universitiesOfferingProgram(program.slug);
              const verifiedOffers = verifiedUniversitiesOfferingProgram(program.slug);
              const lowest = verifiedOffers[0]?.program.totalFee ?? null;
              const monthlyOffers = verifiedOffers.filter(
                ({ program: offer }) => offer.emiPerMonthVerified,
              );
              const lowestEmi = monthlyOffers.length
                ? Math.min(...monthlyOffers.map(({ program: offer }) => offer.emiPerMonth))
                : null;
              const exampleUniversity = verifiedOffers[0]?.university ?? offers[0]?.university;
              return (
                <article
                  key={program.slug}
                  className="group relative flex h-[12rem] min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_10px_26px_-24px_rgba(19,23,32,0.58)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#325dd2] hover:shadow-[0_16px_34px_-24px_rgba(50,93,210,0.55)] focus-within:border-[#325dd2]"
                >
                  <div className="flex min-w-0 items-start gap-2 border-b border-border bg-[#f6f8fc] px-2.5 py-2 dark:bg-[#171d28]">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#131720] text-white dark:bg-[#325dd2]">
                      <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="hidden truncate text-[10px] font-bold uppercase tracking-[0.06em] text-muted-foreground sm:block">
                        {program.level}
                      </p>
                      <p className="truncate text-xs font-extrabold text-[#a94300] dark:text-[#ffad70]">
                        {program.code}
                      </p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-extrabold text-foreground">
                      <Clock3 className="h-3 w-3 text-[#1768cc]" aria-hidden="true" />
                      {program.durationYears}
                      <span className="sm:hidden">y</span>
                      <span className="hidden sm:inline"> yr</span>
                    </span>
                  </div>

                  <div className="flex min-h-0 flex-1 flex-col px-2.5 py-2">
                    <h2 className="line-clamp-2 min-h-8 font-display text-[0.78rem] font-extrabold leading-4 tracking-[-0.018em] sm:text-[0.82rem]">
                      {program.name}
                    </h2>
                    <p className="mt-1 truncate text-[10px] font-bold text-muted-foreground">
                      {offers.length} universities · {program.specialisations.length} paths
                    </p>
                    <div className="mt-auto flex min-w-0 items-center gap-1.5 border-t border-border pt-1.5">
                      {exampleUniversity ? (
                        <UniversityLogo
                          university={exampleUniversity}
                          size="sm"
                          className="h-7 w-7 rounded-md"
                        />
                      ) : (
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary">
                          <BookOpenCheck className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p
                          className="truncate text-[10px] font-extrabold text-foreground"
                          title={
                            lowest !== null
                              ? `Source-backed fee from ${formatINR(lowest)}`
                              : undefined
                          }
                        >
                          {lowest !== null ? `Sourced: ${formatINR(lowest)}` : "Fee check"}
                        </p>
                        <p className="truncate text-[10px] font-semibold text-muted-foreground">
                          {lowestEmi !== null
                            ? `EMI: ${formatINR(lowestEmi)}/month`
                            : "Verify current intake"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/programs/$programSlug"
                    params={{ programSlug: program.slug }}
                    aria-label={`View ${program.name} course details`}
                    className="flex h-8 shrink-0 items-center justify-center gap-1.5 bg-[#325dd2] px-2 text-[10px] font-extrabold text-white transition-colors hover:bg-[#2449ad] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#325dd2] focus-visible:ring-inset"
                  >
                    View course
                    <ArrowRight
                      className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </article>
              );
            })}
          </CompactRail>
        ) : (
          <div className="mt-6 rounded-[1.75rem] border border-dashed border-border bg-card p-14 text-center">
            <Sparkles className="mx-auto h-7 w-7 text-muted-foreground" />
            <h2 className="mt-4 font-display text-xl font-extrabold">No matching course</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another keyword or reset the filters.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setLevel("All");
              }}
              className="mt-5 rounded-xl"
            >
              Reset filters
            </Button>
          </div>
        )}

        <div className="mt-10 grid gap-5 rounded-xl bg-secondary p-5 lg:grid-cols-[1fr_390px] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#1768cc] dark:text-[#78b9ff]">
              <WalletCards className="h-4 w-4" /> Personal shortlist
            </span>
            <h2 className="mt-3 max-w-xl font-display text-2xl font-extrabold tracking-[-0.045em]">
              Not sure which course fits your profile?
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Share your qualification, budget and career goal. We’ll help you narrow the course and
              university combination—without requiring payment.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock3 className="h-4 w-4" /> Free session
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4" /> Course-first guidance
              </span>
            </div>
          </div>
          <LeadForm compact title="Get a program recommendation" />
        </div>
      </section>
    </div>
  );
}
