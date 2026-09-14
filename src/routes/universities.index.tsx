import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  GitCompareArrows,
  IndianRupee,
  MapPin,
  Search,
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
      { title: "Online Universities in India | DekhoCampus" },
      {
        name: "description",
        content:
          "Browse online university profiles by course and location, compare your shortlist, and check the latest fee and intake details before applying.",
      },
      { property: "og:title", content: "Explore Online Universities in India" },
      {
        property: "og:description",
        content:
          "Find online universities by course and location, then compare the options that fit you.",
      },
    ],
  }),
  component: UniversitiesPage,
});

type SortKey = "feeLow" | "feeHigh" | "name";
const DIRECTORY_PAGE_SIZE = 24;

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
  const [feeCeiling, setFeeCeiling] = useState(maximumCatalogFee);
  const [sort, setSort] = useState<SortKey>("name");
  const [page, setPage] = useState(0);
  const quickPrograms = useMemo(() => {
    const preferredCodes = ["MBA", "BBA", "MCA", "BCA", "M.COM", "B.COM"];
    return preferredCodes
      .map((code) => programCatalog.find((item) => item.code.toUpperCase() === code))
      .filter((item): item is (typeof programCatalog)[number] => Boolean(item));
  }, []);
  const selectedProgram = programCatalog.find((item) => item.slug === program);

  const list = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
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

    const filtered = universities.filter((university) => {
      const matchesQuery =
        !normalizedQuery ||
        university.name.toLowerCase().includes(normalizedQuery) ||
        university.city.toLowerCase().includes(normalizedQuery) ||
        university.state.toLowerCase().includes(normalizedQuery);
      const matchesProgram =
        program === "all" || university.programs.some((item) => item.slug === program);
      const matchesState = stateFilter === "all" || university.state === stateFilter;
      const fee = relevantFee(university.slug);
      const feeFilterActive = feeCeiling < maximumCatalogFee;
      const matchesFee = !feeFilterActive || (Number.isFinite(fee) && fee <= feeCeiling);
      return matchesQuery && matchesProgram && matchesState && matchesFee;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      const aFee = relevantFee(a.slug);
      const bFee = relevantFee(b.slug);
      if (Number.isFinite(aFee) !== Number.isFinite(bFee)) {
        return Number.isFinite(aFee) ? -1 : 1;
      }
      return sort === "feeLow" ? aFee - bFee : bFee - aFee;
    });
  }, [feeCeiling, maximumCatalogFee, program, query, sort, stateFilter]);

  const pageCount = Math.max(1, Math.ceil(list.length / DIRECTORY_PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pagedList = list.slice(
    safePage * DIRECTORY_PAGE_SIZE,
    (safePage + 1) * DIRECTORY_PAGE_SIZE,
  );

  useEffect(() => {
    setPage(0);
  }, [feeCeiling, program, query, sort, stateFilter]);

  const filtersAreActive =
    query.trim().length > 0 ||
    program !== "all" ||
    stateFilter !== "all" ||
    feeCeiling < maximumCatalogFee;

  function resetFilters() {
    setQuery("");
    setProgram("all");
    setStateFilter("all");
    setFeeCeiling(maximumCatalogFee);
    setSort("name");
    setPage(0);
  }

  const renderAdvancedFilters = (rangeId: string) => (
    <>
      <div className="relative min-w-0">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <select
          value={stateFilter}
          onChange={(event) => setStateFilter(event.target.value)}
          aria-label="Filter universities by state"
          className="h-10 w-full min-w-0 appearance-none rounded-lg border border-input bg-background pl-10 pr-3 text-xs font-bold sm:text-sm"
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
        value={sort}
        onChange={(event) => setSort(event.target.value as SortKey)}
        aria-label="Sort universities"
        className="h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-xs font-bold sm:text-sm"
      >
        <option value="name">Name: A–Z</option>
        <option value="feeLow">Fee: low to high</option>
        <option value="feeHigh">Fee: high to low</option>
      </select>
      {maximumCatalogFee > 0 ? (
        <div className="min-w-0 rounded-lg border border-border bg-background px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor={rangeId} className="flex items-center gap-1.5 text-xs font-extrabold">
              <IndianRupee className="h-3.5 w-3.5 text-[#a94300]" /> Maximum total fee
            </label>
            <span className="shrink-0 text-[10px] font-bold text-muted-foreground">
              {feeCeiling >= maximumCatalogFee ? "Any fee" : formatINR(feeCeiling)}
            </span>
          </div>
          <input
            id={rangeId}
            type="range"
            min="0"
            max={maximumCatalogFee}
            step="5000"
            value={feeCeiling}
            onChange={(event) => setFeeCeiling(Number(event.target.value))}
            className="mt-2 h-4 w-full accent-[#f47b25]"
          />
        </div>
      ) : null}
    </>
  );

  return (
    <>
      <section className="border-b border-border bg-[#f6f8fc] dark:bg-[#121722]">
        <div className="container-page py-5 sm:py-7 lg:py-9">
          <p className="flex items-center gap-2 text-xs font-extrabold text-[#2449ad] dark:text-[#b9ceff]">
            <Building2 className="h-4 w-4" aria-hidden="true" /> Online university finder
          </p>
          <div className="mt-2 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <h1 className="max-w-3xl font-display text-[2rem] font-extrabold leading-[1.05] tracking-[-0.045em] text-[#131720] dark:text-foreground sm:text-4xl lg:text-[2.6rem]">
                Find an online university that fits you.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Search by course or location, save time with a shortlist, and check the latest fee
                and intake details before you apply.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                asChild
                className="h-11 bg-[#325dd2] font-extrabold text-white hover:bg-[#2449ad]"
              >
                <Link to="/compare">
                  <GitCompareArrows className="mr-2 h-4 w-4" /> Compare
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 bg-card font-extrabold">
                <Link to="/finder">Help me choose</Link>
              </Button>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-3 divide-x divide-border border-t border-border pt-4">
            <div className="pr-3">
              <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Universities
              </dt>
              <dd className="mt-1 font-display text-lg font-extrabold">{universities.length}</dd>
            </div>
            <div className="px-3">
              <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Courses
              </dt>
              <dd className="mt-1 font-display text-lg font-extrabold">{programCatalog.length}</dd>
            </div>
            <div className="pl-3">
              <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Compare
              </dt>
              <dd className="mt-1 font-display text-lg font-extrabold">Up to 3</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="container-page py-4 pb-8 lg:py-7">
        <div className="sticky top-16 z-30 min-w-0 rounded-xl border border-border bg-background/95 p-2.5 shadow-card backdrop-blur sm:p-3">
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-2">
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search university or city"
                className="h-11 w-full min-w-0 rounded-lg bg-card pl-10 pr-3 text-sm"
                aria-label="Search universities"
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
            className="mt-2 flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="group"
            aria-label="Popular course filters"
          >
            <button
              type="button"
              aria-pressed={program === "all"}
              onClick={() => setProgram("all")}
              className={`h-9 shrink-0 rounded-full border px-3 text-xs font-extrabold transition-colors ${
                program === "all"
                  ? "border-[#325dd2] bg-[#325dd2] text-white"
                  : "border-border bg-card text-muted-foreground hover:border-[#80ace0]"
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
                className={`h-9 shrink-0 rounded-full border px-3 text-xs font-extrabold transition-colors ${
                  program === item.slug
                    ? "border-[#325dd2] bg-[#325dd2] text-white"
                    : "border-border bg-card text-muted-foreground hover:border-[#80ace0]"
                }`}
              >
                {item.code}
              </button>
            ))}
            <select
              value={program}
              onChange={(event) => setProgram(event.target.value)}
              aria-label="Choose from all online courses"
              className="h-9 min-w-[9.5rem] shrink-0 rounded-full border border-input bg-card px-3 text-xs font-extrabold text-muted-foreground"
            >
              <option value="all">More courses</option>
              {programCatalog.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.code} · {item.name}
                </option>
              ))}
            </select>
          </div>

          <details className="group mt-2 border-t border-border pt-2 xl:hidden">
            <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between rounded-lg px-1 text-xs font-extrabold [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#325dd2]" /> Location, fee &amp; sort
              </span>
              <span className="text-muted-foreground group-open:hidden">Show</span>
              <span className="hidden text-muted-foreground group-open:inline">Hide</span>
            </summary>
            <div className="mt-2 grid grid-cols-2 gap-2 [&>*:last-child]:col-span-2">
              {renderAdvancedFilters("university-fee-ceiling-mobile")}
            </div>
          </details>

          <div className="mt-2 hidden grid-cols-[0.85fr_0.85fr_1.3fr_auto] gap-2 border-t border-border pt-2 xl:grid xl:items-center">
            {renderAdvancedFilters("university-fee-ceiling-desktop")}
            <Button
              type="button"
              variant="ghost"
              disabled={!filtersAreActive}
              onClick={resetFilters}
              className="h-10 rounded-lg"
            >
              Clear filters
            </Button>
          </div>
        </div>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#2449ad] dark:text-[#b9ceff]">
              {selectedProgram ? `${selectedProgram.code} universities` : "All online universities"}
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold tracking-[-0.035em]">
              Compare your options
            </h2>
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="mt-1 text-xs font-semibold text-muted-foreground"
            >
              {list.length} {list.length === 1 ? "university" : "universities"} found
            </p>
          </div>
          {filtersAreActive ? (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex min-h-10 items-center text-xs font-extrabold text-[#1768cc] dark:text-[#78b9ff] xl:hidden"
            >
              Clear all
            </button>
          ) : (
            <Link
              to="/programs"
              className="hidden min-h-10 items-center text-sm font-extrabold text-[#1768cc] dark:text-[#78b9ff] sm:inline-flex"
            >
              Browse courses <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          )}
        </div>

        {list.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <Building2 className="mx-auto h-7 w-7 text-muted-foreground" />
            <p className="mt-3 font-display text-lg font-bold">No university matches yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try another city, course, or a wider fee range.
            </p>
            <Button className="mt-4" variant="outline" onClick={resetFilters}>
              Reset filters
            </Button>
          </div>
        ) : (
          <CompactRail
            key={`university-page-${safePage}`}
            label="Online university options"
            rows={2}
            columns={4}
            className="mt-3"
            railClassName="gap-2 auto-cols-[calc((100%_-_0.5rem)/2)] sm:auto-cols-[calc((100%_-_1rem)/3)] lg:auto-cols-[calc((100%_-_2.5rem)/6)]"
          >
            {pagedList.map((university, index) => (
              <UniversityCard key={university.slug} university={university} priority={index < 12} />
            ))}
          </CompactRail>
        )}

        {list.length > DIRECTORY_PAGE_SIZE ? (
          <nav
            aria-label="University result pages"
            className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-border bg-card p-2"
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={safePage === 0}
              onClick={() => setPage((value) => Math.max(0, value - 1))}
              className="min-h-10 px-3"
            >
              Previous
            </Button>
            <p
              className="text-center text-xs font-extrabold text-muted-foreground"
              aria-live="polite"
            >
              {safePage + 1} / {pageCount}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage((value) => Math.min(pageCount - 1, value + 1))}
              className="min-h-10 px-3"
            >
              Next
            </Button>
          </nav>
        ) : null}

        <div className="mt-8 grid gap-4 rounded-2xl border border-border bg-[#f6f8fc] p-4 dark:bg-[#151b26] sm:p-5 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1768cc] shadow-sm dark:bg-[#202938] dark:text-[#78b9ff]">
              <GitCompareArrows className="h-4 w-4" />
            </span>
            <h2 className="mt-3 font-display text-xl font-extrabold">Need a shorter shortlist?</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Tell us the course, budget, and study routine you prefer. We’ll help you narrow the
              list, then you can verify the exact intake before paying.
            </p>
            <ul className="mt-3 grid gap-2 text-xs font-bold text-muted-foreground sm:grid-cols-3 lg:grid-cols-1">
              {["Free guidance", "No forced application", "Your choice stays yours"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#16865b]" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <LeadForm compact title="Get my university shortlist" className="shadow-none" />
        </div>
      </section>
    </>
  );
}
