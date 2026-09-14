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
  const quickPrograms = useMemo(() => {
    const preferredCodes = ["MBA", "BBA", "MCA", "BCA", "M.COM", "B.COM"];
    return preferredCodes
      .map((code) => programCatalog.find((item) => item.code.toUpperCase() === code))
      .filter((item): item is (typeof programCatalog)[number] => Boolean(item));
  }, []);

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
        <div className="container-page grid gap-6 py-8 lg:grid-cols-[1fr_0.62fr] lg:items-end lg:py-10">
          <div>
            <span className="inline-flex items-center gap-2 border-l-4 border-[#f47b25] pl-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/85">
              <GraduationCap className="h-4 w-4" /> Career-focused specialisations
            </span>
            <h1 className="mt-3 max-w-4xl font-display text-3xl font-extrabold leading-[1.04] tracking-[-0.05em] sm:text-4xl lg:text-[2.65rem]">
              Explore career-focused specialisations.
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

      <section className="container-page py-6 lg:py-8">
        <div className="sticky top-20 z-20 min-w-0 rounded-xl border border-border bg-background p-3 shadow-card">
          <div className="grid min-w-0 gap-3 sm:grid-cols-[1fr_auto]">
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
            <Button
              asChild
              className="h-10 w-full min-w-0 rounded-lg bg-[#a94300] font-extrabold text-white hover:bg-[#8f3700] sm:w-auto"
            >
              <Link to="/finder">
                Help me choose <Target className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div
            className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="group"
            aria-label="Filter specialisations by degree"
          >
            <button
              type="button"
              aria-pressed={programSlug === "all"}
              onClick={() => setProgramSlug("all")}
              className={`h-8 shrink-0 rounded-full border px-3 text-[11px] font-extrabold transition-colors ${
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
                className={`h-8 shrink-0 rounded-full border px-3 text-[11px] font-extrabold transition-colors ${
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
              className="h-8 min-w-[8.75rem] shrink-0 rounded-full border border-input bg-card px-3 text-[11px] font-extrabold text-muted-foreground"
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
          railClassName="gap-3 auto-cols-[minmax(16rem,90%)] min-[360px]:auto-cols-[calc((100%_-_0.75rem)/2)] sm:auto-cols-[calc((100%_-_1.5rem)/3)] lg:auto-cols-[calc((100%_-_3rem)/5)]"
        >
          {filtered.map((specialisation) => (
            <Link
              key={specialisation.slug}
              to="/specialisations/$specialisationSlug"
              params={{ specialisationSlug: specialisation.slug }}
              aria-label={`View ${specialisation.name} specialisation`}
              className="group relative flex h-[12rem] min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_10px_26px_-24px_rgba(19,23,32,0.58)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#325dd2] hover:shadow-[0_16px_34px_-24px_rgba(50,93,210,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#325dd2] focus-visible:ring-offset-2"
            >
              <div className="flex min-w-0 items-center gap-2 border-b border-border bg-[#f6f8fc] px-2.5 py-2 dark:bg-[#171d28]">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#131720] text-white dark:bg-[#325dd2]">
                  <Target className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="hidden truncate text-[10px] font-bold uppercase tracking-[0.06em] text-muted-foreground sm:block">
                    Specialisation
                  </p>
                  <p className="truncate text-xs font-extrabold text-[#a94300] dark:text-[#ffad70]">
                    {specialisation.program.code}
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-[10px] font-extrabold text-foreground">
                  <Clock3 className="h-3 w-3 text-[#1768cc]" aria-hidden="true" />
                  {specialisation.program.durationYears}
                  <span className="sm:hidden">y</span>
                  <span className="hidden sm:inline"> yr</span>
                </span>
              </div>

              <div className="flex min-h-0 flex-1 flex-col px-2.5 py-2">
                <h2 className="line-clamp-2 min-h-8 font-display text-[0.78rem] font-extrabold leading-4 tracking-[-0.018em] sm:text-[0.82rem]">
                  {specialisation.name}
                </h2>
                <p className="mt-1 truncate text-[10px] font-semibold text-muted-foreground">
                  For: {specialisation.careerDirections[0]}
                </p>
                <div className="mt-auto border-t border-border pt-1.5">
                  <p className="flex min-w-0 items-center gap-1.5 truncate text-[10px] font-extrabold text-foreground">
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        specialisation.universityCount ? "bg-[#14845f]" : "bg-[#f47b25]"
                      }`}
                      aria-hidden="true"
                    />
                    {specialisation.universityCount
                      ? `${specialisation.universityCount} university options`
                      : "Mapping in review"}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] font-semibold text-muted-foreground">
                    Fee varies by university · confirm intake
                  </p>
                </div>
              </div>

              <span className="flex h-8 shrink-0 items-center justify-center gap-1.5 bg-[#325dd2] px-2 text-[10px] font-extrabold text-white transition-colors group-hover:bg-[#2449ad]">
                View pathway
                <ArrowRight
                  className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
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
