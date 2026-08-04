import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Clock,
  FileText,
  GraduationCap,
  IndianRupee,
  Laptop,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  getUniversityProgram,
  universitiesOfferingProgram,
  type University,
  type UniversityProgram,
} from "@/data/universities";

interface ProgramPageData {
  university: University;
  program: UniversityProgram;
  alternatives: { university: University; program: UniversityProgram }[];
}

export const Route = createFileRoute("/universities/$universitySlug/$programSlug")({
  loader: ({ params }): ProgramPageData => {
    const match = getUniversityProgram(params.universitySlug, params.programSlug);
    if (!match) throw notFound();
    return {
      ...match,
      alternatives: universitiesOfferingProgram(params.programSlug).filter(
        (a) => a.university.slug !== params.universitySlug,
      ),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Program not found | DekhoCampus Online" }, { name: "robots", content: "noindex" }],
      };
    }
    const { university, program } = loaderData;
    const title = `${program.name} (${program.code}) Online — ${university.shortName} | Fees & Syllabus`;
    const description = `${program.name} online from ${university.name}: ${formatINR(program.totalFee)} total fee, ${program.durationYears}-year duration, ${program.specialisations.length} specialisations, UGC-entitled. Eligibility, syllabus and placements.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProgramPage,
  errorComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Couldn't load this program</h1>
      <p className="mt-2 text-sm text-muted-foreground">Please refresh and try again.</p>
    </div>
  ),
  notFoundComponent: () => {
    const { universitySlug } = Route.useParams();
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Program not offered</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This university doesn't offer that program online.
        </p>
        <Button asChild className="mt-6 bg-ink text-ink-foreground hover:bg-ink-soft">
          <Link to="/universities/$universitySlug" params={{ universitySlug }}>
            See available programs
          </Link>
        </Button>
      </div>
    );
  },
});

function ProgramPage() {
  const {
    university: u,
    program: p,
    alternatives,
  } = Route.useLoaderData() as ProgramPageData;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${p.name} (Online)`,
    description: p.overview,
    provider: { "@type": "CollegeOrUniversity", name: u.name, sameAs: `https://${u.domain}` },
    educationalCredentialAwarded: p.level,
    offers: {
      "@type": "Offer",
      price: p.totalFee,
      priceCurrency: "INR",
      category: "Tuition",
    },
    timeRequired: `P${p.durationYears}Y`,
  };

  const facts = [
    { icon: Clock, k: "Duration", v: `${p.durationYears} years (${p.semesters} semesters)` },
    { icon: IndianRupee, k: "Total fee", v: formatINR(p.totalFee) },
    { icon: FileText, k: "Per semester", v: formatINR(p.perSemesterFee) },
    { icon: TrendingUp, k: "EMI from", v: `${formatINR(p.emiPerMonth)}/month` },
    { icon: Laptop, k: "Mode", v: "100% online · live + recorded" },
    { icon: ShieldCheck, k: "Approvals", v: u.approvals.slice(0, 2).join(", ") },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="hero-ink text-ink-foreground">
        <div className="container-page py-12">
          <nav className="text-xs text-ink-foreground/60">
            <Link to="/universities" className="hover:text-gold">
              Universities
            </Link>
            <span className="mx-2">/</span>
            <Link
              to="/universities/$universitySlug"
              params={{ universitySlug: u.slug }}
              className="hover:text-gold"
            >
              {u.shortName}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink-foreground/85">{p.code}</span>
          </nav>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_380px]">
            <div>
              <div className="flex items-center gap-3">
                <UniversityLogo university={u} size="sm" className="bg-card" />
                <span className="text-sm font-semibold text-ink-foreground/80">{u.name}</span>
              </div>
              <h1 className="mt-5 font-display text-3xl font-extrabold leading-tight md:text-[2.6rem]">
                {p.name} <span className="text-gradient-gold">Online</span>
              </h1>
              <p className="mt-4 max-w-2xl leading-relaxed text-ink-foreground/75">{p.overview}</p>

              <div className="mt-6 flex flex-wrap gap-1.5">
                <Badge className="border-gold/30 bg-gold/15 text-gold hover:bg-gold/15">
                  {p.level}
                </Badge>
                {u.approvals.slice(0, 3).map((a) => (
                  <Badge
                    key={a}
                    className="border-ink-foreground/20 bg-ink-foreground/10 text-ink-foreground hover:bg-ink-foreground/10"
                  >
                    {a}
                  </Badge>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                  <a href="#apply">
                    Apply now <ArrowRight className="ml-1.5 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-ink-foreground/25 bg-transparent text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
                >
                  <Link to="/programs/$programSlug" params={{ programSlug: p.slug }}>
                    Compare universities
                  </Link>
                </Button>
              </div>
            </div>

            <div id="apply" className="scroll-mt-24">
              <LeadForm
                compact
                defaultProgram={p.name}
                defaultUniversity={u.name}
                className="text-card-foreground"
                title="Download brochure & fee details"
                description="A counsellor will share the fee structure, EMI plan and admission deadlines."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key facts */}
      <section className="border-b border-border bg-surface py-8">
        <div className="container-page grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((f) => (
            <div key={f.k} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <f.icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{f.k}</p>
                <p className="mt-0.5 text-sm font-semibold">{f.v}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_340px]">
        <div className="space-y-14">
          <div>
            <h2 className="font-display text-2xl font-bold">Specialisations offered</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Pick a specialisation in your third semester (or second year for bachelor's).
            </p>
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
            <h2 className="font-display text-2xl font-bold">Curriculum & syllabus</h2>
            <Accordion type="single" collapsible className="mt-5" defaultValue={p.curriculum[0]!.semester}>
              {p.curriculum.map((c) => (
                <AccordionItem key={c.semester} value={c.semester}>
                  <AccordionTrigger className="font-display text-base font-semibold">
                    {c.semester}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {c.subjects.map((s) => (
                        <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
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
            <h2 className="font-display text-2xl font-bold">Eligibility & admission process</h2>
            <div className="mt-5 rounded-2xl border border-border bg-card p-6">
              <p className="text-sm leading-relaxed">{p.eligibility}</p>
              <ol className="mt-6 space-y-4">
                {[
                  "Fill the enquiry form and speak to a DekhoCampus counsellor",
                  "Complete the university application form online",
                  "Upload documents: marksheets, ID proof, photograph",
                  "Pay the first-semester fee (full payment or EMI)",
                  "Receive your enrolment number and LMS access",
                ].map((step, i) => (
                  <li key={step} className="flex gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-ink-foreground">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold">Fee structure</h2>
            <div className="mt-5 overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ["Total program fee", formatINR(p.totalFee)],
                    ["Per semester", formatINR(p.perSemesterFee)],
                    ["No-cost EMI (approx.)", `${formatINR(p.emiPerMonth)} / month`],
                    ["Duration", `${p.durationYears} years · ${p.semesters} semesters`],
                    ["Exam mode", "Online proctored"],
                  ].map(([k, v], i) => (
                    <tr key={k} className={i % 2 ? "bg-surface" : "bg-card"}>
                      <th scope="row" className="px-5 py-3.5 text-left font-medium text-muted-foreground">
                        {k}
                      </th>
                      <td className="px-5 py-3.5 text-right font-semibold">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Fees are indicative and may change with university notifications or scholarships.
              Confirm the final structure with your counsellor.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold">Career outcomes</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Average salary range: <span className="font-semibold text-foreground">{p.averageSalaryLpa}</span>
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
            <div className="mt-5 flex flex-wrap gap-2">
              {u.placementPartners.map((c) => (
                <span key={c} className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {alternatives.length > 0 && (
            <div>
              <h2 className="font-display text-2xl font-bold">
                Other universities offering {p.code} online
              </h2>
              <div className="mt-5 space-y-3">
                {alternatives.map(({ university, program }) => (
                  <Link
                    key={university.slug}
                    to="/universities/$universitySlug/$programSlug"
                    params={{ universitySlug: university.slug, programSlug: program.slug }}
                    className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-card"
                  >
                    <UniversityLogo university={university} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{university.name}</p>
                      <p className="text-xs text-muted-foreground">
                        NAAC {university.naacGrade} · {university.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatINR(program.totalFee)}</p>
                      <p className="text-xs text-muted-foreground">total fee</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Program fee</p>
            <p className="mt-1 font-display text-2xl font-bold">{formatINR(p.totalFee)}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              or {formatINR(p.emiPerMonth)}/month EMI
            </p>
            <Button asChild className="mt-5 w-full bg-ink text-ink-foreground hover:bg-ink-soft">
              <a href="#apply">Get fee details</a>
            </Button>
            <ul className="mt-5 space-y-2.5 border-t border-border pt-5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-success" /> UGC-entitled degree
              </li>
              <li className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-success" /> Online proctored exams
              </li>
              <li className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-success" /> Placement assistance
              </li>
              <li className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-success" /> Free counselling
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
