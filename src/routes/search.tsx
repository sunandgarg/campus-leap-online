import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  Clock3,
  GraduationCap,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { UniversityCard } from "@/components/site/university-card";
import { Button } from "@/components/ui/button";
import {
  formatINR,
  getUniversityApprovalClaims,
  programCatalog,
  universities,
  universitiesOfferingProgram,
  verifiedUniversitiesOfferingProgram,
} from "@/data/universities";
import { slugifySpecialisation } from "@/data/specialisations";

type ResultType = "all" | "programs" | "universities" | "specialisations";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Discover Online Courses & Universities | DekhoCampus Online" },
      {
        name: "description",
        content:
          "Search online degree categories, specialisations and source-labelled university records in one place.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q: initialQuery } = Route.useSearch();
  const [query, setQuery] = useState(initialQuery);
  const [resultType, setResultType] = useState<ResultType>("all");
  const [showAllUniversities, setShowAllUniversities] = useState(false);
  const normalizedQuery = query.trim().toLowerCase();

  useEffect(() => {
    setQuery(initialQuery);
    setResultType("all");
    setShowAllUniversities(false);
  }, [initialQuery]);

  const results = useMemo(() => {
    const matches = (value: string) => {
      if (!normalizedQuery) return true;
      const normalizedValue = value.toLowerCase();
      if (/^[a-z0-9]{1,3}$/.test(normalizedQuery)) {
        return normalizedValue.split(/[^a-z0-9]+/).includes(normalizedQuery);
      }
      return normalizedValue.includes(normalizedQuery);
    };

    const programs = programCatalog.filter(
      (program) =>
        matches(program.name) ||
        matches(program.code) ||
        matches(program.level) ||
        program.specialisations.some(matches) ||
        program.careers.some(matches),
    );

    const directlyMatchedUniversities = universities.filter(
      (university) =>
        matches(university.name) ||
        matches(university.shortName) ||
        matches(university.city) ||
        matches(university.state) ||
        getUniversityApprovalClaims(university).some((claim) => matches(claim.renderedClaim)) ||
        university.highlights.some(matches),
    );

    const matchingProgramSlugs = new Set(programs.map((program) => program.slug));
    const matchedUniversities = universities.filter(
      (university) =>
        directlyMatchedUniversities.includes(university) ||
        university.programs.some((program) => matchingProgramSlugs.has(program.slug)),
    );

    const specialisations = programCatalog.flatMap((program) =>
      program.specialisations
        .filter(matches)
        .map((specialisation) => ({ specialisation, program })),
    );

    return { programs, universities: matchedUniversities, specialisations };
  }, [normalizedQuery]);

  const totalResults =
    results.programs.length + results.universities.length + results.specialisations.length;
  const showPrograms = resultType === "all" || resultType === "programs";
  const showUniversities = resultType === "all" || resultType === "universities";
  const showSpecialisations = resultType === "all" || resultType === "specialisations";

  return (
    <div className="bg-background">
      <section className="border-b border-border bg-[#edf2ff] py-14 dark:bg-[#1b263c] lg:py-16">
        <div className="container-page">
          <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#2449ad] dark:text-[#b9ceff]">
            <Search className="h-4 w-4" /> Search the whole catalogue
          </span>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold tracking-[-0.055em] sm:text-5xl lg:text-6xl">
            Find courses, universities and specialisations.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            Search by course, career, specialisation, university, location or accreditation.
          </p>

          <div className="mt-8 flex max-w-3xl items-center gap-3 rounded-xl border border-border bg-card p-2 pl-4 shadow-card">
            <Search className="h-5 w-5 shrink-0 text-[#1768cc] dark:text-[#78b9ff]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try “MBA”, “data science”, “A++” or “Noida”"
              aria-label="Search the online degree catalogue"
              className="h-12 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-[#0d5cad] focus-visible:ring-offset-2 sm:text-base"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="container-page py-10 lg:py-14">
        <div className="flex flex-col gap-4 border-b border-border pb-7 md:flex-row md:items-center md:justify-between">
          <div>
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="font-display text-xl font-extrabold"
            >
              {normalizedQuery
                ? `${totalResults} results for “${query.trim()}”`
                : "Explore the catalogue"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Source status, cited fees and editorial guidance stay clearly separated.
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {[
              ["all", "All"],
              ["programs", `Courses (${results.programs.length})`],
              ["universities", `Universities (${results.universities.length})`],
              ["specialisations", `Specialisations (${results.specialisations.length})`],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={resultType === value}
                onClick={() => setResultType(value as ResultType)}
                className={`flex h-10 shrink-0 items-center rounded-xl border px-4 text-xs font-extrabold transition ${
                  resultType === value
                    ? "border-[#1768cc] bg-[#1768cc] text-white"
                    : "border-border bg-card text-muted-foreground hover:border-[#80ace0] hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {totalResults === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-border bg-card px-6 py-20 text-center">
            <SlidersHorizontal className="mx-auto h-8 w-8 text-muted-foreground" />
            <h2 className="mt-5 font-display text-2xl font-extrabold">No exact match yet</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              Try a broader term such as business, technology, bachelor’s, master’s or a city.
            </p>
            <Button onClick={() => setQuery("")} variant="outline" className="mt-6 rounded-xl">
              Browse everything
            </Button>
          </div>
        ) : (
          <div className="space-y-16 pt-10">
            {showPrograms && results.programs.length > 0 ? (
              <section>
                <SectionTitle
                  icon={BookOpenCheck}
                  title="Online courses"
                  count={results.programs.length}
                />
                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  {results.programs.map((program) => {
                    const offers = universitiesOfferingProgram(program.slug);
                    const verifiedOffers = verifiedUniversitiesOfferingProgram(program.slug);
                    const lowestFee = verifiedOffers[0]?.program.totalFee ?? null;
                    return (
                      <Link
                        key={program.slug}
                        to="/programs/$programSlug"
                        params={{ programSlug: program.slug }}
                        className="group rounded-[1.5rem] border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-[#80ace0] hover:shadow-lg"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="rounded-full bg-secondary px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">
                              {program.level} · typically {program.durationYears} years
                            </span>
                            <h2 className="mt-4 font-display text-xl font-extrabold">
                              {program.name}
                            </h2>
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                              {program.overview}
                            </p>
                          </div>
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border transition group-hover:bg-[#1768cc] group-hover:text-white">
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4 text-xs font-bold text-muted-foreground">
                          <span>{offers.length} catalogue records</span>
                          <span>{program.specialisations.length} pathway themes</span>
                          <span>
                            {lowestFee !== null
                              ? `Sourced fee from ${formatINR(lowestFee)}`
                              : "Confirm current fee"}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {showUniversities && results.universities.length > 0 ? (
              <section>
                <SectionTitle
                  icon={Building2}
                  title="Online universities"
                  count={results.universities.length}
                />
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {(showAllUniversities
                    ? results.universities
                    : results.universities.slice(0, 12)
                  ).map((university) => (
                    <UniversityCard key={university.slug} university={university} />
                  ))}
                </div>
                {results.universities.length > 12 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAllUniversities((value) => !value)}
                    aria-expanded={showAllUniversities}
                    className="mt-5 rounded-xl"
                  >
                    {showAllUniversities
                      ? "Show fewer universities"
                      : `Show all ${results.universities.length} universities`}
                  </Button>
                ) : null}
              </section>
            ) : null}

            {showSpecialisations && results.specialisations.length > 0 ? (
              <section>
                <SectionTitle
                  icon={GraduationCap}
                  title="Matching specialisations"
                  count={results.specialisations.length}
                />
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {results.specialisations.map(({ specialisation, program }) => (
                    <Link
                      key={`${program.slug}-${specialisation}`}
                      to="/specialisations/$specialisationSlug"
                      params={{
                        specialisationSlug: `${program.slug.replace(/^online-/, "")}-${slugifySpecialisation(specialisation)}`,
                      }}
                      className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition hover:border-[#80ace0]"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf5ff] text-[#1768cc] dark:bg-[#102a42] dark:text-[#78b9ff]">
                        <GraduationCap className="h-4.5 w-4.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold">{specialisation}</p>
                        <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Clock3 className="h-3 w-3" /> {program.code} · typically{" "}
                          {program.durationYears} years
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  count,
}: {
  icon: typeof BookOpenCheck;
  title: string;
  count: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-[#1768cc] dark:text-[#78b9ff]">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <h2 className="font-display text-2xl font-extrabold">{title}</h2>
        <p className="text-xs text-muted-foreground">{count} matching results</p>
      </div>
    </div>
  );
}
