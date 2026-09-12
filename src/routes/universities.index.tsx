import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-[#071c2e] text-white">
        <div className="pointer-events-none absolute -right-32 -top-40 h-[32rem] w-[32rem] rounded-full bg-[#175fa3]/35 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-[#a96918]/20 blur-3xl" />
        <div className="container-page relative py-14 lg:py-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8bc7ff]">
            <ShieldCheck className="h-4 w-4" /> {universities.length} university profiles
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-4xl font-extrabold tracking-[-0.055em] sm:text-5xl lg:text-6xl">
            Compare online universities with confidence.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/65">
            Filter by course, location, research depth and source-backed fee when available.
            Editorial and directory profiles clearly show what still needs intake-level
            confirmation.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-[#a94300] font-extrabold text-white hover:bg-[#8f3700]"
            >
              <Link to="/compare">
                Open comparison <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-xl border-white/20 bg-white/[0.06] font-bold text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/methodology">How we verify information</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="rounded-[1.5rem] border border-border bg-card p-4 shadow-[0_18px_50px_-42px_rgba(12,39,71,0.7)] md:p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf5ff] text-[#1768cc] dark:bg-[#102a42] dark:text-[#78b9ff]">
              <Search className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-extrabold">Find your best-fit university</h2>
              <p className="text-xs text-muted-foreground">
                Search, filter and sort the catalogue.
              </p>
            </div>
          </div>
          <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-[1.3fr_1fr_0.9fr_1fr_1fr]">
            <div className="relative min-w-0">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search university, city or state"
                className="h-12 w-full min-w-0 rounded-xl pl-10"
                aria-label="Search universities"
              />
            </div>
            <select
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              aria-label="Filter by program"
              className="h-12 w-full min-w-0 rounded-xl border border-input bg-background px-3 text-sm font-semibold"
            >
              <option value="all">All programs</option>
              {programCatalog.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort universities"
              className="h-12 w-full min-w-0 rounded-xl border border-input bg-background px-3 text-sm font-semibold"
            >
              <option value="rating">Sort: Highest sourced rating</option>
              <option value="feeLow">Sort: Fees low to high</option>
              <option value="feeHigh">Sort: Fees high to low</option>
              <option value="name">Sort: Name (A–Z)</option>
            </select>
            <div className="relative min-w-0 md:order-2 xl:order-none">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                value={stateFilter}
                onChange={(event) => setStateFilter(event.target.value)}
                aria-label="Filter by state"
                className="h-12 w-full min-w-0 appearance-none rounded-xl border border-input bg-background pl-10 pr-3 text-sm font-semibold"
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
              className="h-12 w-full min-w-0 rounded-xl border border-input bg-background px-3 text-sm font-semibold"
            >
              <option value="all">All data depths</option>
              <option value="complete">Complete profiles</option>
              <option value="directory">Directory profiles</option>
            </select>
          </div>

          <div
            className={`mt-4 grid gap-4 border-t border-border pt-4 md:items-center ${
              maximumCatalogFee > 0 ? "md:grid-cols-[auto_1fr_auto]" : "md:grid-cols-[1fr_auto]"
            }`}
          >
            {maximumCatalogFee > 0 ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff1e7] text-[#df651b] dark:bg-[#392418] dark:text-[#ffad70]">
                    <IndianRupee className="h-4 w-4" />
                  </span>
                  <div>
                    <label htmlFor="university-fee-ceiling" className="text-xs font-extrabold">
                      Maximum sourced total fee
                    </label>
                    <p className="text-[10px] text-muted-foreground">
                      {feeCeiling >= maximumCatalogFee
                        ? "Any sourced fee"
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
              </>
            ) : (
              <p className="text-xs leading-5 text-muted-foreground">
                Fee filtering appears after current, source-backed total fees are published.
              </p>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!filtersAreActive}
              onClick={resetFilters}
              className="justify-self-start rounded-xl md:justify-self-end"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Reset filters
            </Button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="text-sm font-bold text-muted-foreground"
          >
            Showing {list.length} of {universities.length} universities
          </p>
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
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((u) => (
              <UniversityCard key={u.slug} university={u} />
            ))}
          </div>
        )}

        <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[1.75rem] border border-border bg-surface p-8">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-card text-[#1768cc] shadow-sm dark:text-[#78b9ff]">
              <Building2 className="h-5 w-5" />
            </span>
            <h2 className="mt-5 font-display text-2xl font-bold">Not sure which one fits?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Compare entitlement status, exam formats, learner support and EMI plans for your
              specific course. Ask a counsellor only when you need additional clarity.
            </p>
            <ul className="mt-6 space-y-3 text-sm font-semibold">
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
          <LeadForm compact title="Get a personalised shortlist" />
        </div>
      </section>
    </>
  );
}
