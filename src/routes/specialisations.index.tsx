import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, BriefcaseBusiness, Clock3, GraduationCap, Search, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LeadForm } from "@/components/site/lead-form";
import { CompactRail } from "@/components/site/compact-rail";
import { getAllSpecialisations } from "@/data/specialisations";
import { programCatalog } from "@/data/universities";

export const Route = createFileRoute("/specialisations/")({
  head: () => ({
    meta: [
      {
        title: "Online Degree Specialisations — Careers & Universities | DekhoCampus",
      },
      {
        name: "description",
        content:
          "Explore online MBA, MCA, BBA and other degree specialisations by skills, career direction and university availability.",
      },
    ],
  }),
  component: SpecialisationsPage,
});

function SpecialisationsPage() {
  const allSpecialisations = useMemo(() => getAllSpecialisations(), []);
  const [query, setQuery] = useState("");
  const [programSlug, setProgramSlug] = useState(
    () => programCatalog.find((program) => program.code.toUpperCase() === "MBA")?.slug ?? "all",
  );
  const quickPrograms = useMemo(() => {
    const preferredCodes = ["MBA", "BBA", "MCA", "BCA", "M.COM", "B.COM"];
    return preferredCodes
      .map((code) => programCatalog.find((item) => item.code.toUpperCase() === code))
      .filter((item): item is (typeof programCatalog)[number] => Boolean(item));
  }, []);
  const selectedProgram = programCatalog.find((item) => item.slug === programSlug);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return allSpecialisations.filter((specialisation) => {
      const matchesProgram = programSlug === "all" || specialisation.program.slug === programSlug;
      const matchesQuery =
        !normalizedQuery ||
        specialisation.name.toLowerCase().includes(normalizedQuery) ||
        specialisation.program.name.toLowerCase().includes(normalizedQuery) ||
        specialisation.skills.some((skill) => skill.toLowerCase().includes(normalizedQuery)) ||
        specialisation.careerDirections.some((career) =>
          career.toLowerCase().includes(normalizedQuery),
        );
      return matchesProgram && matchesQuery;
    });
  }, [allSpecialisations, programSlug, query]);

  return (
    <div className="bg-background">
      <section className="border-b border-border bg-[#f6f8fc] dark:bg-[#121722]">
        <div className="container-page py-5 sm:py-7 lg:py-9">
          <p className="flex items-center gap-2 text-xs font-extrabold text-[#2449ad] dark:text-[#b9ceff]">
            <Target className="h-4 w-4" aria-hidden="true" /> Career-focused pathways
          </p>
          <h1 className="mt-2 max-w-3xl font-display text-[2rem] font-extrabold leading-[1.05] tracking-[-0.045em] text-[#131720] dark:text-foreground sm:text-4xl lg:text-[2.6rem]">
            Find the specialisation that matches your goal.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Explore roles and skills first, then open a pathway to see its course and university
            options in one place.
          </p>
          <dl className="mt-5 grid max-w-2xl grid-cols-3 divide-x divide-border border-t border-border pt-4">
            <div className="pr-3">
              <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Pathways
              </dt>
              <dd className="mt-1 font-display text-lg font-extrabold">
                {allSpecialisations.length}
              </dd>
            </div>
            <div className="px-3">
              <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Degrees
              </dt>
              <dd className="mt-1 font-display text-lg font-extrabold">{programCatalog.length}</dd>
            </div>
            <div className="pl-3">
              <dt className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Finder
              </dt>
              <dd className="mt-1 font-display text-lg font-extrabold">4 steps</dd>
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
                placeholder="Search role, skill or pathway"
                aria-label="Search specialisations"
                className="h-11 w-full min-w-0 rounded-lg bg-card pl-10 pr-3 text-sm"
              />
            </div>
            <Button
              asChild
              className="h-11 rounded-lg bg-[#325dd2] px-3 font-extrabold text-white hover:bg-[#2449ad]"
            >
              <Link to="/finder" aria-label="Open course finder">
                <Target className="h-4 w-4 min-[360px]:mr-2" />
                <span className="hidden min-[360px]:inline">Find my fit</span>
              </Link>
            </Button>
          </div>

          <div
            className="mt-2 flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="group"
            aria-label="Filter specialisations by degree"
          >
            <button
              type="button"
              aria-pressed={programSlug === "all"}
              onClick={() => setProgramSlug("all")}
              className={`h-9 shrink-0 rounded-full border px-3 text-xs font-extrabold transition-colors ${
                programSlug === "all"
                  ? "border-[#325dd2] bg-[#325dd2] text-white"
                  : "border-border bg-card text-muted-foreground hover:border-[#80ace0]"
              }`}
            >
              All degrees
            </button>
            {quickPrograms.map((program) => (
              <button
                key={program.slug}
                type="button"
                aria-pressed={programSlug === program.slug}
                onClick={() => setProgramSlug(program.slug)}
                className={`h-9 shrink-0 rounded-full border px-3 text-xs font-extrabold transition-colors ${
                  programSlug === program.slug
                    ? "border-[#325dd2] bg-[#325dd2] text-white"
                    : "border-border bg-card text-muted-foreground hover:border-[#80ace0]"
                }`}
              >
                {program.code}
              </button>
            ))}
            <select
              value={programSlug}
              onChange={(event) => setProgramSlug(event.target.value)}
              aria-label="Choose from all degree categories"
              className="h-9 min-w-[9.5rem] shrink-0 rounded-full border border-input bg-card px-3 text-xs font-extrabold text-muted-foreground"
            >
              <option value="all">More degrees</option>
              {programCatalog.map((program) => (
                <option key={program.slug} value={program.slug}>
                  {program.code} · {program.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#2449ad] dark:text-[#b9ceff]">
              {selectedProgram ? `${selectedProgram.code} pathways` : "All career pathways"}
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold tracking-[-0.035em]">
              Explore specialisations
            </h2>
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="mt-1 text-xs font-semibold text-muted-foreground"
            >
              {filtered.length} {filtered.length === 1 ? "pathway" : "pathways"} found
            </p>
          </div>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Career outcomes depend on skills and experience.
          </p>
        </div>

        {filtered.length > 0 ? (
          <CompactRail
            label="Online degree specialisation options"
            rows={2}
            columns={3}
            className="mt-3"
            railClassName="gap-2 auto-cols-[calc((100%_-_0.5rem)/2)] sm:auto-cols-[calc((100%_-_1rem)/3)] lg:auto-cols-[calc((100%_-_2rem)/5)]"
          >
            {filtered.map((specialisation) => (
              <Link
                key={specialisation.slug}
                to="/specialisations/$specialisationSlug"
                params={{ specialisationSlug: specialisation.slug }}
                aria-label={`Explore ${specialisation.name} specialisation`}
                className="group relative flex h-[11.35rem] min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_9px_25px_-24px_rgba(19,23,32,0.65)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#80ace0] hover:shadow-[0_14px_30px_-22px_rgba(50,93,210,0.48)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#325dd2] focus-visible:ring-offset-2"
              >
                <span className="h-1 shrink-0 bg-[#f47b25]" aria-hidden="true" />
                <div className="flex items-center justify-between gap-1.5 border-b border-border bg-[#f8faff] px-2.5 py-2 dark:bg-[#171d28]">
                  <span className="inline-flex min-w-0 items-center gap-1.5 text-xs font-extrabold text-[#2449ad] dark:text-[#a9c0ff]">
                    <Target className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span className="truncate">{specialisation.program.code}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-[10px] font-bold text-muted-foreground">
                    <Clock3 className="h-3 w-3" aria-hidden="true" />
                    {specialisation.program.durationYears} yr
                  </span>
                </div>

                <div className="flex min-h-0 flex-1 flex-col p-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#a94300] dark:text-[#ffad70]">
                    Specialisation
                  </p>
                  <h3 className="mt-1 line-clamp-2 min-h-8 font-display text-xs font-extrabold leading-4 tracking-[-0.015em] sm:text-[0.82rem]">
                    {specialisation.name}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[10px] font-semibold leading-3.5 text-muted-foreground">
                    For {specialisation.careerDirections[0]}
                  </p>

                  <div className="mt-auto flex min-w-0 items-center justify-between gap-1.5 border-t border-border pt-1.5">
                    <div className="min-w-0">
                      <p className="text-[10px] font-extrabold text-foreground">
                        {specialisation.universityCount
                          ? `${specialisation.universityCount} options`
                          : "Options pending"}
                      </p>
                      <p className="text-[10px] font-semibold text-muted-foreground">Fees vary</p>
                    </div>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#edf2ff] text-[#2449ad] transition-colors group-hover:bg-[#325dd2] group-hover:text-white dark:bg-[#243352] dark:text-[#a9c0ff]">
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </CompactRail>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <GraduationCap className="mx-auto h-7 w-7 text-muted-foreground" />
            <h2 className="mt-3 font-display text-xl font-extrabold">No exact pathway found</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a broader role such as finance, data, marketing, people or operations.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setProgramSlug("all");
              }}
              className="mt-4 rounded-lg"
            >
              Reset filters
            </Button>
          </div>
        )}

        <div className="mt-8 grid gap-4 rounded-2xl border border-border bg-[#f6f8fc] p-4 dark:bg-[#151b26] sm:p-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1768cc] shadow-sm dark:bg-[#202938] dark:text-[#78b9ff]">
              <BriefcaseBusiness className="h-4 w-4" />
            </span>
            <h2 className="mt-3 font-display text-xl font-extrabold tracking-[-0.035em]">
              Choosing between two career directions?
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Get a course-first shortlist and review the matches before deciding whether you want a
              counsellor to call.
            </p>
          </div>
          <LeadForm compact title="Review my pathway shortlist" showMatchQuestions />
        </div>
      </section>
    </div>
  );
}
