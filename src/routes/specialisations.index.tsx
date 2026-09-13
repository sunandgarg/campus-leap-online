import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, BriefcaseBusiness, GraduationCap, Search, Target } from "lucide-react";
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
        title: "Online Degree Specialisations — Compare Careers & Universities | DekhoCampus",
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
  const [programSlug, setProgramSlug] = useState("all");

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
      <section className="border-b border-border bg-[#131720] text-white">
        <div className="container-page grid gap-6 py-10 lg:grid-cols-[1fr_0.62fr] lg:items-end lg:py-12">
          <div>
            <span className="inline-flex items-center gap-2 border-l-4 border-[#f47b25] pl-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/85">
              <GraduationCap className="h-4 w-4" /> Career-focused specialisations
            </span>
            <h1 className="mt-4 max-w-4xl font-display text-3xl font-extrabold leading-[1.04] tracking-[-0.055em] sm:text-4xl lg:text-5xl">
              Choose a specialisation for the work you want to do.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
              Start with career direction, then compare curriculum, universities and total cost. A
              specialisation is useful only when its subjects match your goal.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              [allSpecialisations.length, "pathways"],
              [programCatalog.length, "degrees"],
              ["4 steps", "to shortlist"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg border border-white/15 bg-[#252b36] p-3">
                <p className="font-display text-lg font-extrabold text-white">{value}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-white/70">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-8 lg:py-10">
        <div className="sticky top-20 z-20 min-w-0 rounded-xl border border-border bg-background p-3 shadow-card">
          <div className="grid min-w-0 gap-3 md:grid-cols-[1fr_0.62fr_auto]">
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search a role, skill or specialisation"
                aria-label="Search specialisations"
                className="h-10 w-full min-w-0 rounded-lg pl-10"
              />
            </div>
            <select
              value={programSlug}
              onChange={(event) => setProgramSlug(event.target.value)}
              aria-label="Filter specialisations by degree"
              className="h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-sm font-semibold"
            >
              <option value="all">All degrees</option>
              {programCatalog.map((program) => (
                <option key={program.slug} value={program.slug}>
                  {program.code} · {program.name}
                </option>
              ))}
            </select>
            <Button
              asChild
              className="h-10 w-full min-w-0 rounded-lg bg-[#a94300] font-extrabold text-white hover:bg-[#8f3700]"
            >
              <Link to="/finder">
                Help me choose <Target className="ml-2 h-4 w-4" />
              </Link>
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
            {filtered.length} specialisations matched
          </p>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Career ranges are directional, never guaranteed.
          </p>
        </div>

        <CompactRail label="Filtered specialisation pathways" rows={2} columns={4}>
          {filtered.map((specialisation) => (
            <Link
              key={specialisation.slug}
              to="/specialisations/$specialisationSlug"
              params={{ specialisationSlug: specialisation.slug }}
              className="group flex min-h-[12.5rem] flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-[#325dd2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#325dd2] focus-visible:ring-offset-2"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#edf5ff] text-[#1768cc] dark:bg-[#102a42] dark:text-[#78b9ff]">
                  <Target className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">
                  {specialisation.program.code}
                </span>
              </div>
              <h2 className="mt-3 line-clamp-2 font-display text-base font-extrabold leading-snug tracking-[-0.02em]">
                {specialisation.name}
              </h2>
              <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
                {specialisation.summary}
              </p>
              <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-foreground">
                    {specialisation.universityCount
                      ? `${specialisation.universityCount} mapped university options`
                      : "University availability not yet mapped"}
                  </p>
                  <p className="mt-1 truncate text-[10px] text-muted-foreground">
                    {specialisation.careerDirections[0]}
                  </p>
                </div>
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-[#1768cc] transition group-hover:translate-x-1 dark:text-[#78b9ff]"
                />
              </div>
            </Link>
          ))}
        </CompactRail>

        {filtered.length === 0 ? (
          <div className="mt-6 rounded-[1.75rem] border border-dashed border-border bg-card p-14 text-center">
            <GraduationCap className="mx-auto h-7 w-7 text-muted-foreground" />
            <h2 className="mt-4 font-display text-xl font-extrabold">No exact pathway found</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a broader role such as finance, data, marketing, people or operations.
            </p>
          </div>
        ) : null}

        <div className="mt-10 grid gap-5 rounded-xl border border-border bg-secondary p-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="self-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#071b2c] text-white dark:bg-[#1768cc]">
              <BriefcaseBusiness className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-display text-2xl font-extrabold tracking-[-0.04em]">
              Still choosing between two career directions?
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Get a course-first shortlist. You can review matches privately before sharing your
              phone number.
            </p>
          </div>
          <LeadForm compact title="Review my specialisation shortlist" showMatchQuestions />
        </div>
      </section>
    </div>
  );
}
