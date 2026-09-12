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
      <section className="relative overflow-hidden border-b border-border bg-[#071c2e] text-white">
        <div className="pointer-events-none absolute -right-32 -top-28 h-[32rem] w-[32rem] rounded-full bg-[#175fa3]/35 blur-3xl" />
        <div className="container-page relative py-16 lg:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8bc7ff]">
            <BookOpenCheck className="h-4 w-4" /> {programCatalog.length} online course guides
          </span>
          <h1 className="mt-6 max-w-4xl font-display text-4xl font-extrabold tracking-[-0.06em] sm:text-5xl lg:text-6xl">
            Start with the course. Then compare every university.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/65">
            Explore category-level eligibility, curriculum themes, career direction and clearly
            labelled fee status before choosing where to enrol.
          </p>
        </div>
      </section>

      <section className="container-page py-10 lg:py-14">
        <div className="rounded-[1.5rem] border border-border bg-card p-4 shadow-[0_18px_50px_-42px_rgba(12,39,71,0.7)] sm:p-5">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search course, specialisation or career"
                aria-label="Search online courses"
                className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm outline-none focus:border-[#1768cc] focus-visible:ring-2 focus-visible:ring-[#0d5cad] focus-visible:ring-offset-2"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
              {(["All", "Bachelors", "Masters", "Diploma", "Certificate"] as LevelFilter[]).map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={level === item}
                    onClick={() => setLevel(item)}
                    className={`h-12 shrink-0 rounded-xl border px-4 text-xs font-extrabold transition ${
                      level === item
                        ? "border-[#1768cc] bg-[#1768cc] text-white"
                        : "border-border bg-background text-muted-foreground hover:border-[#80ace0]"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between gap-4">
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
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
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
              return (
                <article
                  key={program.slug}
                  className="group overflow-hidden rounded-[1.75rem] border border-border bg-card transition hover:-translate-y-0.5 hover:border-[#80ace0] hover:shadow-xl"
                >
                  <div className="p-6 sm:p-7">
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-[#edf5ff] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#1768cc] dark:bg-[#102a42] dark:text-[#78b9ff]">
                            {program.level}
                          </span>
                          <span className="rounded-full bg-secondary px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">
                            {program.durationYears} years
                          </span>
                        </div>
                        <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.15em] text-[#a94300] dark:text-[#ff9a5b]">
                          Online {program.code}
                        </p>
                        <h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.04em]">
                          {program.name}
                        </h2>
                      </div>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-[#1768cc] dark:text-[#78b9ff]">
                        <GraduationCap className="h-5 w-5" />
                      </span>
                    </div>
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {program.overview}
                    </p>

                    <div className="mt-6 grid grid-cols-3 divide-x divide-border rounded-2xl bg-secondary/55 py-4 text-center">
                      <div className="px-2">
                        <p className="font-display text-base font-extrabold">{offers.length}</p>
                        <p className="mt-1 text-[10px] font-bold text-muted-foreground">
                          Catalogue records
                        </p>
                      </div>
                      <div className="px-2">
                        <p className="font-display text-base font-extrabold">
                          {program.specialisations.length}
                        </p>
                        <p className="mt-1 text-[10px] font-bold text-muted-foreground">
                          Pathway themes
                        </p>
                      </div>
                      <div className="px-2">
                        <p className="font-display text-base font-extrabold">{program.semesters}</p>
                        <p className="mt-1 text-[10px] font-bold text-muted-foreground">
                          Semesters
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 border-y border-border bg-background">
                    <div className="p-4 sm:px-6">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                        Sourced fee from
                      </p>
                      <p className="mt-1 font-display text-lg font-extrabold">
                        {lowest !== null ? formatINR(lowest) : "Confirm current fee"}
                      </p>
                    </div>
                    <div className="border-l border-border p-4 sm:px-6">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                        Published monthly amount from
                      </p>
                      <p className="mt-1 font-display text-lg font-extrabold text-[#1768cc] dark:text-[#78b9ff]">
                        {lowestEmi !== null ? formatINR(lowestEmi) : "Not mapped"}
                        {lowestEmi !== null ? (
                          <span className="text-[10px] text-muted-foreground">/mo</span>
                        ) : null}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 p-5 sm:px-7">
                    <div className="flex -space-x-2">
                      {offers.slice(0, 4).map(({ university }) => (
                        <span
                          key={university.slug}
                          title={university.shortName}
                          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-card bg-white"
                        >
                          <UniversityLogo university={university} size="sm" />
                        </span>
                      ))}
                    </div>
                    <Button
                      asChild
                      className="rounded-xl bg-[#1768cc] font-extrabold text-white hover:bg-[#0e57b2]"
                    >
                      <Link to="/programs/$programSlug" params={{ programSlug: program.slug }}>
                        View course details <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
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

        <div className="mt-16 grid gap-7 rounded-[2rem] bg-secondary/55 p-6 lg:grid-cols-[1fr_420px] lg:items-center lg:p-10">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#1768cc] dark:text-[#78b9ff]">
              <WalletCards className="h-4 w-4" /> Personal shortlist
            </span>
            <h2 className="mt-4 max-w-xl font-display text-3xl font-extrabold tracking-[-0.045em]">
              Not sure which course fits your profile?
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
              Share your qualification, budget and career goal. We’ll help you narrow the course and
              university combination—without requiring payment.
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-xs font-bold text-muted-foreground">
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
