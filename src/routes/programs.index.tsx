import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, GraduationCap } from "lucide-react";
import { LeadForm } from "@/components/site/lead-form";
import { programCatalog, universitiesOfferingProgram, formatINR } from "@/data/universities";

export const Route = createFileRoute("/programs/")({
  head: () => ({
    meta: [
      { title: "Online Degree Programs — MBA, BBA, MCA, BCA & More | DekhoCampus Online" },
      {
        name: "description",
        content:
          "Explore every online degree program available in India with duration, specialisations, eligibility and the universities that offer it.",
      },
      { property: "og:title", content: "Online Degree Programs in India" },
      {
        property: "og:description",
        content:
          "Compare online MBA, BBA, MCA, BCA, M.Com and PG diploma programs across UGC-entitled universities.",
      },
    ],
  }),
  component: ProgramsPage,
});

function ProgramsPage() {
  return (
    <>
      <section className="hero-ink text-ink-foreground">
        <div className="container-page py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            {programCatalog.length} programs
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">
            Online degree programs
          </h1>
          <p className="mt-4 max-w-2xl text-ink-foreground/75">
            Pick a program to see every university offering it online, ranked by total fee, with
            curriculum, specialisations and career outcomes.
          </p>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="space-y-4">
          {programCatalog.map((p) => {
            const offers = universitiesOfferingProgram(p.slug);
            const lowest = offers[0]?.program.totalFee ?? 0;
            return (
              <Link
                key={p.slug}
                to="/programs/$programSlug"
                params={{ programSlug: p.slug }}
                className="group block rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-secondary px-2 py-0.5 font-display text-xs font-bold">
                        {p.code}
                      </span>
                      <span className="text-xs text-muted-foreground">{p.level}</span>
                    </div>
                    <h2 className="mt-2 font-display text-xl font-bold">{p.name}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{p.overview}</p>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> {p.durationYears} years
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5" /> {p.specialisations.length}{" "}
                        specialisations
                      </span>
                      <span>{offers.length} universities</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Fees from</p>
                    <p className="font-display text-lg font-bold">{formatINR(lowest)}</p>
                    <span className="mt-2 inline-flex items-center text-xs font-semibold text-primary">
                      Compare universities{" "}
                      <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-2xl bg-surface p-8">
            <h2 className="font-display text-2xl font-bold">Which program suits your profile?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Tell us your qualification and career goal — we'll recommend the right degree level,
              specialisation and university combination.
            </p>
          </div>
          <LeadForm compact title="Get a program recommendation" />
        </div>
      </section>
    </>
  );
}
