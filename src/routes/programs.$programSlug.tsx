import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Briefcase, Clock, GraduationCap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LeadForm } from "@/components/site/lead-form";
import { UniversityLogo } from "@/components/site/university-logo";
import {
  formatINR,
  getProgramTemplate,
  universitiesOfferingProgram,
  type ProgramTemplate,
  type University,
  type UniversityProgram,
} from "@/data/universities";

interface ProgramComparePageData {
  program: ProgramTemplate;
  offers: { university: University; program: UniversityProgram }[];
}

export const Route = createFileRoute("/programs/$programSlug")({
  loader: ({ params }): ProgramComparePageData => {
    const program = getProgramTemplate(params.programSlug);
    if (!program) throw notFound();
    return { program, offers: universitiesOfferingProgram(params.programSlug) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Program not found | DekhoCampus Online" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const p = loaderData.program;
    const title = `${p.name} (${p.code}) Online — Fees, Syllabus & Best Universities`;
    const description = `Compare ${loaderData.offers.length} UGC-entitled universities offering an online ${p.code}. Fees from ${formatINR(loaderData.offers[0]?.program.totalFee ?? 0)}, ${p.durationYears}-year duration, ${p.specialisations.length} specialisations.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProgramComparePage,
  errorComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Couldn't load this program</h1>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Program not found</h1>
      <Button asChild className="mt-6 bg-ink text-ink-foreground hover:bg-ink-soft">
        <Link to="/programs">Browse all programs</Link>
      </Button>
    </div>
  ),
});

function ProgramComparePage() {
  const { program: p, offers } = Route.useLoaderData() as ProgramComparePageData;

  return (
    <>
      <section className="hero-ink text-ink-foreground">
        <div className="container-page py-12">
          <nav className="text-xs text-ink-foreground/60">
            <Link to="/programs" className="hover:text-gold">
              Programs
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink-foreground/85">{p.code}</span>
          </nav>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_380px]">
            <div>
              <h1 className="font-display text-3xl font-extrabold leading-tight md:text-[2.6rem]">
                Online {p.name}
              </h1>
              <p className="mt-4 max-w-2xl leading-relaxed text-ink-foreground/75">{p.overview}</p>
              <div className="mt-6 flex flex-wrap gap-1.5">
                <Badge className="border-gold/30 bg-gold/15 text-gold hover:bg-gold/15">
                  {p.level}
                </Badge>
                <Badge className="border-ink-foreground/20 bg-ink-foreground/10 text-ink-foreground hover:bg-ink-foreground/10">
                  {p.durationYears} years
                </Badge>
                <Badge className="border-ink-foreground/20 bg-ink-foreground/10 text-ink-foreground hover:bg-ink-foreground/10">
                  {offers.length} universities
                </Badge>
              </div>
            </div>
            <LeadForm
              compact
              defaultProgram={p.name}
              title={`Compare ${p.code} universities`}
              description="Get a fee comparison sheet and eligibility check on WhatsApp."
              className="text-card-foreground"
            />
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <h2 className="font-display text-2xl font-bold">
          Universities offering online {p.code} (cheapest first)
        </h2>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-surface text-left">
              <tr>
                <th className="px-5 py-3.5 font-semibold">University</th>
                <th className="px-5 py-3.5 font-semibold">NAAC</th>
                <th className="px-5 py-3.5 font-semibold">Rating</th>
                <th className="px-5 py-3.5 font-semibold">Total fee</th>
                <th className="px-5 py-3.5 font-semibold">EMI</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {offers.map(({ university, program }) => (
                <tr key={university.slug} className="border-t border-border bg-card">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <UniversityLogo university={university} size="sm" />
                      <div>
                        <p className="font-semibold">{university.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {university.city}, {university.state}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">{university.naacGrade}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                      {university.rating}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold">{formatINR(program.totalFee)}</td>
                  <td className="px-5 py-4">{formatINR(program.emiPerMonth)}/mo</td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      to="/universities/$universitySlug/$programSlug"
                      params={{ universitySlug: university.slug, programSlug: p.slug }}
                      className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
                    >
                      View <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_340px]">
          <div className="space-y-12">
            <div>
              <h2 className="font-display text-2xl font-bold">Specialisations</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {p.specialisations.map((s) => (
                  <div
                    key={s}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm font-medium"
                  >
                    <GraduationCap className="h-4 w-4 shrink-0 text-primary" />
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold">Syllabus overview</h2>
              <Accordion type="single" collapsible className="mt-5">
                {p.curriculum.map((c) => (
                  <AccordionItem key={c.semester} value={c.semester}>
                    <AccordionTrigger className="font-display text-base font-semibold">
                      {c.semester}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {c.subjects.map((s) => (
                          <li
                            key={s}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold">Eligibility</h2>
              <p className="mt-3 rounded-2xl border border-border bg-card p-6 text-sm leading-relaxed">
                {p.eligibility}
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold">Career paths</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Average salary range:{" "}
                <span className="font-semibold text-foreground">{p.averageSalaryLpa}</span>
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {p.careers.map((c) => (
                  <div
                    key={c}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm font-medium"
                  >
                    <Briefcase className="h-4 w-4 shrink-0 text-primary" />
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Program facts</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" /> {p.durationYears} years ·{" "}
                  {p.semesters} semesters
                </li>
                <li className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" /> {p.level} degree
                </li>
                <li className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-success" /> UGC-entitled universities only
                </li>
              </ul>
              <Button asChild className="mt-5 w-full bg-ink text-ink-foreground hover:bg-ink-soft">
                <Link to="/contact">Talk to a counsellor</Link>
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
