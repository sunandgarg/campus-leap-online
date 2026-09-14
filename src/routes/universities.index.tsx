import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  IndianRupee,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UniversityCard } from "@/components/site/university-card";
import { LeadForm } from "@/components/site/lead-form";
import { CompactRail } from "@/components/site/compact-rail";
import {
  formatINR,
  universities,
  programCatalog,
  getUniversityPrograms,
} from "@/data/universities";

export const Route = createFileRoute("/universities/")({
  head: () => ({
    meta: [
      { title: "Online University Profiles in India | DekhoCampus" },
      {
        name: "description",
        content:
          "Browse source-listed and editorial online university profiles. Filter by programme, location and research depth, then verify the exact current intake.",
      },
      { property: "og:title", content: "Online University Profiles in India" },
      {
        property: "og:description",
        content:
          "Browse editorial profiles and clearly labelled historical UGC-DEB directory records.",
      },
    ],
  }),
  component: UniversitiesPage,
});

type SortKey = "rating" | "feeLow" | "feeHigh" | "name";
type ProfileFilter = "all" | "complete" | "directory";
const DIRECTORY_PAGE_SIZE = 20;

function UniversitiesPage() {
  const stateOptions = useMemo(
    () => [...new Set(universities.map((university) => university.state))].sort(),
    [],
  );
  const maximumCatalogFee = useMemo(() => {
    const amounts = universities.flatMap((university) =>
      getUniversityPrograms(university)
        .filter((item) => item.totalFeeAvailable)
        .map((item) => item.totalFee),
    );
    return Math.max(0, ...amounts);
  }, []);
  const [query, setQuery] = useState("");
  const [program, setProgram] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [profileFilter, setProfileFilter] = useState<ProfileFilter>("all");
  const [feeCeiling, setFeeCeiling] = useState(maximumCatalogFee);
  const [sort, setSort] = useState<SortKey>("name");
  const [page, setPage] = useState(0);
  const quickPrograms = useMemo(() => {
    const preferredCodes = ["MBA", "BBA", "MCA", "BCA", "M.COM", "B.COM"];
    return preferredCodes
      .map((code) => programCatalog.find((item) => item.code.toUpperCase() === code))
      .filter((item): item is (typeof programCatalog)[number] => Boolean(item));
  }, []);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const relevantFee = (universitySlug: string) => {
      const university = universities.find((item) => item.slug === universitySlug)!;
      const offerings = getUniversityPrograms(university).filter((item) => item.totalFeeAvailable);
      if (program !== "all") {
        return (
          offerings.find((item) => item.slug === program)?.totalFee ?? Number.POSITIVE_INFINITY
        );
      }
      return Math.min(...offerings.map((item) => item.totalFee));
    };

    const filtered = universities.filter((u) => {
      const matchesQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q) ||
        u.state.toLowerCase().includes(q);
      const matchesProgram = program === "all" || u.programs.some((p) => p.slug === program);
      const matchesState = stateFilter === "all" || u.state === stateFilter;
      const matchesProfile =
        profileFilter === "all" ||
        (profileFilter === "directory"
          ? u.profileDepth === "directory"
          : u.profileDepth !== "directory");
      const fee = relevantFee(u.slug);
      const feeFilterActive = feeCeiling < maximumCatalogFee;
      const matchesFee = !feeFilterActive || (Number.isFinite(fee) && fee <= feeCeiling);
      return matchesQuery && matchesProgram && matchesState && matchesProfile && matchesFee;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "feeLow" || sort === "feeHigh") {
        const aFee = relevantFee(a.slug);
        const bFee = relevantFee(b.slug);
        if (Number.isFinite(aFee) !== Number.isFinite(bFee)) {
          return Number.isFinite(aFee) ? -1 : 1;
        }
        return sort === "feeLow" ? aFee - bFee : bFee - aFee;
      }
      if ((a.profileDepth === "directory") !== (b.profileDepth === "directory")) {
        return a.profileDepth === "directory" ? 1 : -1;
      }
      if (a.metricsVerified !== b.metricsVerified) return a.metricsVerified ? -1 : 1;
      if (a.metricsVerified && b.metricsVerified) return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });
  }, [feeCeiling, maximumCatalogFee, profileFilter, program, query, sort, stateFilter]);

  const pageCount = Math.max(1, Math.ceil(list.length / DIRECTORY_PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pagedList = list.slice(
    safePage * DIRECTORY_PAGE_SIZE,
    (safePage + 1) * DIRECTORY_PAGE_SIZE,
  );

  useEffect(() => {
    setPage(0);
  }, [feeCeiling, profileFilter, program, query, sort, stateFilter]);

  const filtersAreActive =
    query.trim().length > 0 ||
    program !== "all" ||
    stateFilter !== "all" ||
    profileFilter !== "all" ||
    feeCeiling < maximumCatalogFee;

  function resetFilters() {
    setQuery("");
    setProgram("all");
    setStateFilter("all");
    setProfileFilter("all");
    setFeeCeiling(maximumCatalogFee);
    setSort("name");
    setPage(0);
  }

  return (
    <>
      <section className="border-b border-border bg-[#f6f8fc] dark:bg-[#121722]">
        <div className="container-page py-7 lg:py-9">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2 border-l-4 border-[#f47b25] pl-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#2449ad] dark:text-[#b9ceff]">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" /> Independent catalogue
              </p>
              <h1 className="mt-3 max-w-4xl font-display text-3xl font-extrabold tracking-[-0.05em] text-[#131720] dark:text-foreground sm:text-4xl lg:text-[2.55rem]">
                Explore online universities by course.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Start with the course and location that suit you. Every profile tells you whether
                its information is editorial or from a historical directory source, so you know what
                still needs current-intake confirmation.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Button
                asChild
                className="bg-[#f47b25] font-extrabold text-[#111827] hover:bg-[#d85f12]"
              >
                <Link to="/compare">
                  Compare universities <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="bg-card font-bold">
                <Link to="/methodology">How we check data</Link>
              </Button>
            </div>
          </div>

          <dl className="mt-5 flex flex-wrap gap-x-9 gap-y-3 border-t border-border pt-4">
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Profiles to explore
              </dt>
              <dd className="mt-1 font-display text-lg font-extrabold text-[#131720] dark:text-foreground">
                {universities.length} universities
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Course categories
              </dt>
              <dd className="mt-1 font-display text-lg font-extrabold text-[#131720] dark:text-foreground">
                {programCatalog.length} choices
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Before admission
              </dt>
              <dd className="mt-1 font-display text-sm font-extrabold text-[#131720] dark:text-foreground">
                Verify university + course + mode + session
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="container-page py-6 lg:py-8">
        <div className="overflow-hidden rounded-xl border border-border border-t-[3px] border-t-[#f47b25] bg-card p-3 shadow-card md:p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Search className="h-4 w-4 text-[#325dd2] dark:text-[#8cb0ff]" aria-hidden="true" />
              <div>
                <h2 className="text-sm font-extrabold">Find your university</h2>
                <p className="text-xs text-muted-foreground">
                  Search first, then narrow the results.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!filtersAreActive}
              onClick={resetFilters}
              className="rounded-full"
            >
              <SlidersHorizontal className="mr-1 h-4 w-4" /> Clear filters
            </Button>
          </div>

          <div
            className="mb-3 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="group"
            aria-label="Quick course filters"
          >
            <span className="shrink-0 text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
              Popular
            </span>
            <button
              type="button"
              aria-pressed={program === "all"}
              onClick={() => setProgram("all")}
              className={`h-8 shrink-0 rounded-full border px-3 text-[11px] font-extrabold transition-colors ${
                program === "all"
                  ? "border-[#325dd2] bg-[#325dd2] text-white"
                  : "border-border bg-background text-muted-foreground hover:border-[#80ace0]"
              }`}
            >
              All courses
            </button>
            {quickPrograms.map((item) => (
              <button
                key={item.slug}
                type="button"
                aria-pressed={program === item.slug}
                onClick={() => setProgram(item.slug)}
                className={`h-8 shrink-0 rounded-full border px-3 text-[11px] font-extrabold transition-colors ${
                  program === item.slug
                    ? "border-[#325dd2] bg-[#325dd2] text-white"
                    : "border-border bg-background text-muted-foreground hover:border-[#80ace0]"
                }`}
              >
                {item.code}
              </button>
            ))}
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-2.5 xl:grid-cols-[1.35fr_1fr_0.95fr_1fr_1fr]">
            <div className="relative col-span-2 min-w-0 xl:col-span-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="University, city or state"
                className="h-10 w-full min-w-0 rounded-xl bg-background pl-10"
                aria-label="Search universities"
              />
            </div>
            <select
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              aria-label="Filter by program"
              className="h-10 w-full min-w-0 rounded-xl border border-input bg-background px-3 text-sm font-semibold"
            >
              <option value="all">All courses</option>
              {programCatalog.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className="relative min-w-0">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                value={stateFilter}
                onChange={(event) => setStateFilter(event.target.value)}
                aria-label="Filter by state"
                className="h-10 w-full min-w-0 appearance-none rounded-xl border border-input bg-background pl-10 pr-3 text-sm font-semibold"
              >
                <option value="all">All locations</option>
                {stateOptions.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={profileFilter}
              onChange={(event) => setProfileFilter(event.target.value as ProfileFilter)}
              aria-label="Filter by profile depth"
              className="h-10 w-full min-w-0 rounded-xl border border-input bg-background px-3 text-sm font-semibold"
            >
              <option value="all">All profiles</option>
              <option value="complete">Editorial profiles</option>
              <option value="directory">Directory research</option>
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort universities"
              className="h-10 w-full min-w-0 rounded-xl border border-input bg-background px-3 text-sm font-semibold"
            >
              <option value="name">Name: A–Z</option>
              <option value="rating">Highest sourced rating</option>
              <option value="feeLow">Lowest sourced fee</option>
              <option value="feeHigh">Highest sourced fee</option>
            </select>
          </div>

          {maximumCatalogFee > 0 ? (
            <div className="mt-3 grid gap-3 border-t border-border pt-3 sm:grid-cols-[auto_minmax(8rem,1fr)] sm:items-center">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff1e7] text-[#b44e0e] dark:bg-[#392418] dark:text-[#ffad70]">
                  <IndianRupee className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <label htmlFor="university-fee-ceiling" className="text-xs font-extrabold">
                    Sourced fee ceiling
                  </label>
                  <p className="text-[10px] text-muted-foreground">
                    {feeCeiling >= maximumCatalogFee
                      ? "Show every available fee"
                      : `Up to ${formatINR(feeCeiling)}`}
                  </p>
                </div>
              </div>
              <input
                id="university-fee-ceiling"
                type="range"
                min="0"
                max={maximumCatalogFee}
                step="5000"
                value={feeCeiling}
                onChange={(event) => setFeeCeiling(Number(event.target.value))}
                className="w-full accent-[#f47a20]"
              />
            </div>
          ) : (
            <div>
              <p className="mt-3 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">
                Fee filtering appears after current, source-backed total fees are published.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#2449ad] dark:text-[#b9ceff]">
              Explore your options
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold tracking-[-0.035em]">
              University directory
            </h2>
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="mt-1 text-xs font-semibold text-muted-foreground"
            >
              {list.length} of {universities.length} profiles matched
            </p>
          </div>
          <Link
            to="/programs"
            className="hidden items-center text-sm font-extrabold text-[#1768cc] dark:text-[#78b9ff] sm:inline-flex"
          >
            Browse by course <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {list.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="font-display text-lg font-bold">No universities match your filters</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try clearing the search or choosing a different program.
            </p>
            <Button className="mt-5" variant="outline" onClick={resetFilters}>
              Reset filters
            </Button>
          </div>
        ) : (
          <CompactRail
            key={`university-page-${safePage}`}
            label="Filtered university profiles"
            rows={2}
            columns={4}
            className="mt-3"
            railClassName="gap-3 auto-cols-[minmax(16rem,90%)] min-[360px]:auto-cols-[calc((100%_-_0.75rem)/2)] sm:auto-cols-[calc((100%_-_1.5rem)/3)] lg:auto-cols-[calc((100%_-_3rem)/5)]"
          >
            {pagedList.map((u, index) => (
              <UniversityCard key={u.slug} university={u} priority={index < 12} />
            ))}
          </CompactRail>
        )}

        {list.length > DIRECTORY_PAGE_SIZE ? (
          <nav
            aria-label="University result pages"
            className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-2"
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={safePage === 0}
              onClick={() => setPage((value) => Math.max(0, value - 1))}
            >
              Previous 20
            </Button>
            <p
              className="text-center text-xs font-extrabold text-muted-foreground"
              aria-live="polite"
            >
              Page {safePage + 1} of {pageCount}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage((value) => Math.min(pageCount - 1, value + 1))}
            >
              Next 20
            </Button>
          </nav>
        ) : null}

        <div className="mt-9 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[1.5rem] border border-border bg-[#f6f8fc] p-5 dark:bg-[#151b26]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-[#1768cc] shadow-sm dark:text-[#78b9ff]">
              <Building2 className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-display text-xl font-bold">Not sure which one fits?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Compare entitlement status, exam formats, learner support and EMI plans for your
              specific course. Ask a counsellor only when you need additional clarity.
            </p>
            <ul className="mt-4 grid gap-2 text-xs font-semibold sm:grid-cols-3 lg:grid-cols-1">
              {[
                "No payment required",
                "Used for your requested response",
                "No forced application",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#16865b]" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <LeadForm
            compact
            title="Get a personalised shortlist"
            className="rounded-[1.5rem] shadow-none"
          />
        </div>
      </section>
    </>
  );
}
