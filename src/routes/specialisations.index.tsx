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

        <CompactRail
          label="Filtered specialisation pathways"
          rows={2}
          columns={3}
          railClassName="auto-cols-[92%] sm:auto-cols-[minmax(20rem,48%)] lg:auto-cols-[calc((100%-2rem)/3)]"
        >
          {filtered.map((specialisation) => (
            <Link
              key={specialisation.slug}
              to="/specialisations/$specialisationSlug"
              params={{ specialisationSlug: specialisation.slug }}
              className="group relative flex h-[9.5rem] flex-col overflow-hidden rounded-[1.25rem] border border-border bg-card shadow-card transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#325dd2] hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#325dd2] focus-visible:ring-offset-2"
            >
              <div className="h-1 shrink-0 bg-[#f47b25]" aria-hidden="true" />
              <div className="flex min-w-0 items-center gap-2.5 px-3 pt-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#131720] text-white dark:bg-[#325dd2]">
                  <Target className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#a94300] dark:text-[#ff9a5b]">
                      Online {specialisation.program.code}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                      <Clock3 className="h-3 w-3" aria-hidden="true" />
                      {specialisation.program.durationYears} yr
                    </span>
                  </div>
                </div>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-[#1768cc] transition-colors group-hover:border-[#325dd2] group-hover:bg-[#325dd2] group-hover:text-white dark:text-[#78b9ff]">
                  <ArrowRight
                    className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>
              <h2 className="mx-3 mt-2 line-clamp-2 font-display text-[0.95rem] font-extrabold leading-[1.18] tracking-[-0.025em] sm:text-base">
                {specialisation.name}
              </h2>
              <p className="mx-3 mt-1 truncate text-[10px] font-semibold text-muted-foreground">
                Career direction: {specialisation.careerDirections[0]}
              </p>
              <div className="mt-auto flex min-w-0 items-center justify-between gap-2 border-t border-border px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-[10px] font-extrabold text-foreground">
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        specialisation.universityCount ? "bg-[#14845f]" : "bg-[#f47b25]"
                      }`}
                      aria-hidden="true"
                    />
                    {specialisation.universityCount
                      ? `${specialisation.universityCount} university options mapped`
                      : "University mapping in review"}
                  </p>
                </div>
                <span className="shrink-0 text-[10px] font-extrabold text-[#1768cc] dark:text-[#78b9ff]">
                  View pathway
                </span>
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
