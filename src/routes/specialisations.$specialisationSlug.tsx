import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleHelp,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { LeadForm } from "@/components/site/lead-form";
import { UniversityLogo } from "@/components/site/university-logo";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getSpecialisation, type SpecialisationRecord } from "@/data/specialisations";
import { formatINR, universitiesOfferingSpecialisation } from "@/data/universities";

export const Route = createFileRoute("/specialisations/$specialisationSlug")({
  loader: ({ params }): SpecialisationRecord => {
    const specialisation = getSpecialisation(params.specialisationSlug);
    if (!specialisation) throw notFound();
    return specialisation;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Specialisation not found | DekhoCampus" }] };
    const title = `${loaderData.name} Online — Courses, Universities & Career Fit`;
    const hasCurrentOffering =
      universitiesOfferingSpecialisation(loaderData.program.slug, loaderData.name).length > 0;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: `Explore ${loaderData.name} in an online ${loaderData.program.code}: skills, curriculum questions, career directions and a transparent university-availability check.`,
        },
        ...(!hasCurrentOffering ? [{ name: "robots", content: "noindex,follow" }] : []),
      ],
    };
  },
  component: SpecialisationPage,
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-3xl font-extrabold">Specialisation not found</h1>
      <Button asChild className="mt-6">
        <Link to="/specialisations">Browse specialisations</Link>
      </Button>
    </div>
  ),
});

function SpecialisationPage() {
  const specialisation = Route.useLoaderData() as SpecialisationRecord;
  const offers = universitiesOfferingSpecialisation(
    specialisation.program.slug,
    specialisation.name,
  );
  const pricedOffers = offers.filter(({ program }) => program.totalFeeAvailable);
  const startingFee = Math.min(...pricedOffers.map(({ program }) => program.totalFee));

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-[#f3f8ff] dark:bg-[#071723]">
        <div className="container-page relative py-10 lg:py-16">
          <nav
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight aria-hidden="true" className="h-3 w-3" />
            <Link to="/specialisations" className="hover:text-foreground">
              Specialisations
            </Link>
            <ChevronRight aria-hidden="true" className="h-3 w-3" />
            <span aria-current="page" className="text-foreground">
              {specialisation.name}
            </span>
          </nav>

          <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_0.62fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#b9d6f6] bg-white/75 px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.13em] text-[#1768cc] dark:border-[#295a83] dark:bg-[#102a42] dark:text-[#78b9ff]">
                <Sparkles className="h-4 w-4" /> Rule-based pathway guide ·{" "}
                {specialisation.program.code}
              </span>
              <h1 className="mt-6 max-w-4xl font-display text-4xl font-extrabold leading-[1.03] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                {specialisation.name}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                {specialisation.summary}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-xl bg-[#a94300] font-extrabold text-white hover:bg-[#8f3700]"
                >
                  <Link to="/finder">
                    Check my fit <BrainCircuit className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-xl bg-background/70 font-bold"
                >
                  <a href="#universities">Check university availability</a>
                </Button>
              </div>
            </div>

            <aside className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-7">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#a94300] dark:text-[#ff9a5b]">
                Decision snapshot
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  [specialisation.program.code, "Parent degree"],
                  [specialisation.program.durationYears + " years", "Typical duration"],
                  [offers.length.toString(), "Explicitly mapped offers"],
                  [
                    Number.isFinite(startingFee) ? formatINR(startingFee) : "Not mapped",
                    "Verified fee from",
                  ],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl bg-secondary/60 p-4">
                    <p className="font-display text-base font-extrabold">{value}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-4 flex items-start gap-2 text-[11px] leading-5 text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#187a55]" />
                Specialisation names and availability can differ by university and intake.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="container-page grid min-w-0 grid-cols-[minmax(0,1fr)] gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:py-16">
        <div className="min-w-0">
          <section>
            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#1768cc] dark:text-[#78b9ff]">
              Career-first evaluation
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.04em]">
              What this pathway should help you build
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {specialisation.skills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eaf8f1] text-[#187a55] dark:bg-[#123329] dark:text-[#77ddb2]">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-bold">{skill}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff0e6] text-[#a94300] dark:bg-[#3a2518] dark:text-[#ffad70]">
                <BriefcaseBusiness className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-muted-foreground">
                  Career directions
                </p>
                <h2 className="mt-1 font-display text-2xl font-extrabold">
                  Roles this can support
                </h2>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {specialisation.careerDirections.map((career) => (
                <span
                  key={career}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-bold"
                >
                  {career}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              A degree or specialisation does not guarantee employment or salary. Outcomes depend on
              prior experience, portfolio, location, market conditions and demonstrated skills.
            </p>
          </section>

          <section className="mt-14 rounded-[1.75rem] border border-border bg-secondary/35 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <BookOpenCheck className="mt-1 h-6 w-6 shrink-0 text-[#1768cc] dark:text-[#78b9ff]" />
              <div>
                <h2 className="font-display text-2xl font-extrabold">
                  Four curriculum checks before choosing
                </h2>
                <ol className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                  {[
                    "Count the specialisation-specific subjects—not just the label.",
                    "Ask whether projects use current tools, datasets or business cases.",
                    "Confirm whether the specialisation appears on the marksheet or degree.",
                    "Compare faculty access, assessment format and capstone support.",
                  ].map((item, index) => (
                    <li key={item} className="flex gap-3 rounded-xl bg-card p-4">
                      <span className="font-extrabold text-[#a94300] dark:text-[#ff9a5b]">
                        0{index + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section id="universities" className="mt-14 scroll-mt-28">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-[#1768cc] dark:text-[#78b9ff]">
                  Compare providers
                </p>
                <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.04em]">
                  Verified university availability
                </h2>
              </div>
              <Button asChild variant="outline" className="rounded-xl">
                <Link
                  to="/programs/$programSlug"
                  params={{ programSlug: specialisation.program.slug }}
                >
                  Compare all {specialisation.program.code} options
                </Link>
              </Button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {offers.slice(0, 8).map(({ university, program }) => (
                <Link
                  key={university.slug}
                  to="/universities/$universitySlug/$programSlug"
                  params={{ universitySlug: university.slug, programSlug: program.slug }}
                  className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-[#78a8df] hover:shadow-card motion-reduce:transform-none"
                >
                  <div className="flex items-start gap-3">
                    <UniversityLogo university={university} size="sm" />
                    <div className="min-w-0">
                      <h3 className="font-display text-sm font-extrabold">
                        {university.shortName}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {university.state} · Source-backed {program.academicSession ?? "offering"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        {program.totalFeeAvailable
                          ? program.feesVerified
                            ? "Sourced catalogue fee"
                            : "Editorial fee estimate"
                          : "Fee status"}
                      </p>
                      <p className="font-display font-extrabold">
                        {program.totalFeeAvailable ? formatINR(program.totalFee) : "Confirm fee"}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#1768cc] transition group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
            {offers.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-6">
                <p className="font-display text-lg font-extrabold">
                  No university-specific mapping yet
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  This pathway exists in our degree-category library, but we have not verified it
                  against an individual university prospectus. Browse degree-level records and
                  confirm the pathway, curriculum and award wording for your intake.
                </p>
              </div>
            ) : null}
          </section>

          <section className="mt-14">
            <div className="flex items-center gap-3">
              <CircleHelp className="h-6 w-6 text-[#1768cc] dark:text-[#78b9ff]" />
              <h2 className="font-display text-2xl font-extrabold">Questions learners ask</h2>
            </div>
            <Accordion
              type="single"
              collapsible
              className="mt-5 rounded-2xl border border-border bg-card px-5"
            >
              <AccordionItem value="degree">
                <AccordionTrigger>Is {specialisation.name} a separate degree?</AccordionTrigger>
                <AccordionContent className="leading-6 text-muted-foreground">
                  Usually it is a pathway, elective group or named specialisation within the{" "}
                  {specialisation.program.name}. Confirm exactly how the university records it on
                  transcripts and the final award.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="best">
                <AccordionTrigger>
                  Which university is best for this specialisation?
                </AccordionTrigger>
                <AccordionContent className="leading-6 text-muted-foreground">
                  There is no universal best choice. Compare entitlement for your intake, relevant
                  subjects, faculty access, assessment mode, total payable fee and learner support.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="salary">
                <AccordionTrigger>Will it improve my salary?</AccordionTrigger>
                <AccordionContent className="leading-6 text-muted-foreground">
                  It can strengthen role-relevant knowledge, but no legitimate platform can promise
                  a salary increase. Experience, portfolio quality, interview performance and market
                  demand remain important.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>

        <aside className="min-w-0 lg:sticky lg:top-24 lg:h-fit">
          <LeadForm
            compact
            showMatchQuestions
            defaultProgramSlug={specialisation.program.slug}
            title={`Check your ${specialisation.name} fit`}
            description="Get curriculum questions, current university options and an eligibility check."
          />
          <div className="mt-4 rounded-2xl border border-border bg-card p-4 text-xs leading-5 text-muted-foreground">
            <p className="flex items-center gap-2 font-extrabold text-foreground">
              <BadgeCheck className="h-4 w-4 text-[#187a55]" /> No paid admission on DekhoCampus
            </p>
            <p className="mt-2">
              Verify entitlement and complete final payment only through the university's official
              channel.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
