import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UniversityCard } from "@/components/site/university-card";
import { LeadForm } from "@/components/site/lead-form";
import { universities, programCatalog, getUniversityPrograms } from "@/data/universities";

export const Route = createFileRoute("/universities/")({
  head: () => ({
    meta: [
      { title: "All Online Universities in India — Fees, Approvals & Programs" },
      {
        name: "description",
        content:
          "Browse every UGC-entitled online university on DekhoCampus Online. Filter by program, NAAC grade and fees, and open detailed university pages.",
      },
      { property: "og:title", content: "All Online Universities in India" },
      {
        property: "og:description",
        content:
          "Filter UGC-entitled online universities by program, accreditation and fees on DekhoCampus Online.",
      },
    ],
  }),
  component: UniversitiesPage,
});

type SortKey = "rating" | "feeLow" | "feeHigh" | "name";

function UniversitiesPage() {
  const [query, setQuery] = useState("");
  const [program, setProgram] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("rating");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = universities.filter((u) => {
      const matchesQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q) ||
        u.state.toLowerCase().includes(q);
      const matchesProgram = program === "all" || u.programs.some((p) => p.slug === program);
      return matchesQuery && matchesProgram;
    });

    const minFee = (slug: string) =>
      Math.min(...getUniversityPrograms(universities.find((u) => u.slug === slug)!).map((p) => p.totalFee));

    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "feeLow") return minFee(a.slug) - minFee(b.slug);
      if (sort === "feeHigh") return minFee(b.slug) - minFee(a.slug);
      return b.rating - a.rating;
    });
  }, [query, program, sort]);

  return (
    <>
      <section className="hero-ink text-ink-foreground">
        <div className="container-page py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            {universities.length} universities · UGC entitled
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-extrabold md:text-4xl">
            Online universities in India
          </h1>
          <p className="mt-4 max-w-2xl text-ink-foreground/75">
            Compare accreditation, fees, specialisations and placement partners. Every listing links
            to detailed program pages with curriculum and eligibility.
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-card md:p-5">
          <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search university, city or state"
                className="pl-9"
                aria-label="Search universities"
              />
            </div>
            <select
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              aria-label="Filter by program"
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
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
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="rating">Sort: Highest rated</option>
              <option value="feeLow">Sort: Fees low to high</option>
              <option value="feeHigh">Sort: Fees high to low</option>
              <option value="name">Sort: Name (A–Z)</option>
            </select>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Showing {list.length} of {universities.length} universities
        </p>

        {list.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="font-display text-lg font-bold">No universities match your filters</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try clearing the search or choosing a different program.
            </p>
            <Button
              className="mt-5"
              variant="outline"
              onClick={() => {
                setQuery("");
                setProgram("all");
              }}
            >
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
          <div className="rounded-2xl bg-surface p-8">
            <h2 className="font-display text-2xl font-bold">Not sure which one fits?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Our counsellors compare entitlement status, exam formats, placement support and EMI
              plans for your specific profile — free of cost. Most students shortlist within a single
              call.
            </p>
          </div>
          <LeadForm compact title="Get a personalised shortlist" />
        </div>
      </section>
    </>
  );
}
