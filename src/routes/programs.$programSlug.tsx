import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  Clock3,
  GraduationCap,
  GitCompareArrows,
  IndianRupee,
  Laptop2,
  Medal,
  ShieldCheck,
  Target,
  WalletCards,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UniversityLogo } from "@/components/site/university-logo";
import { ProgramDecisionStudio } from "@/components/site/program-decision-studio";
import { useComparison } from "@/hooks/use-comparison";
import { slugifySpecialisation } from "@/data/specialisations";
import {
  formatINR,
  formatUniversityLocation,
  getProgramApprovalClaims,
  getProgramTemplate,
  isComparableProgramOffer,
  isVerifiedProgramOffer,
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
    const comparableOffers = loaderData.offers.filter(isComparableProgramOffer);
    const discoveryCount = loaderData.offers.filter(
      (offer) => !isComparableProgramOffer(offer),
    ).length;
    const title = `${p.name} (${p.code}) Online — Course Guide & University Records`;
    const description = `Explore an online ${p.code} category guide with ${comparableOffers.length} labelled comparison profiles and ${discoveryCount} catalogue records excluded from ranking. Verify every intake-level detail before applying.`;
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

const pageNav = [
  { label: "Overview", href: "#overview" },
  { label: "Decision tools", href: "#decision-tools" },
  { label: "Universities", href: "#universities" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "Specialisations", href: "#specialisations" },
  { label: "Eligibility", href: "#eligibility" },
  { label: "Careers", href: "#careers" },
  { label: "FAQs", href: "#faqs" },
];

const learningFeatures = [
  {
    title: "Flexible online learning",
    description: "Balance live sessions, recordings and assessments around your schedule.",
    icon: Laptop2,
  },
  {
    title: "Industry-aligned curriculum",
    description:
      "Check whether the syllabus includes practical subjects, projects and case studies.",
    icon: BookOpenCheck,
  },
  {
    title: "Recognition checks first",
    description:
      "Use UGC-DEB and the official prospectus to verify the exact intake before paying.",
    icon: ShieldCheck,
  },
  {
    title: "Career-focused support",
    description: "Choose a degree and specialisation with your long-term role in mind.",
    icon: Target,
  },
];

const admissionSteps = [
  ["01", "Shortlist universities", "Compare recognition, fees and learning support."],
  ["02", "Check eligibility", "Confirm your qualification and document requirements."],
  [
    "03",
    "Use the official portal",
    "Submit documents only through the university's official route.",
  ],
  ["04", "Verify before payment", "Confirm the written total fee, refund policy and recipient."],
  ["05", "Start learning", "Receive enrolment details and access your digital campus."],
];

function ProgramComparePage() {
  const data = Route.useLoaderData() as ProgramComparePageData;

  return <ProgramComparePageContent key={data.program.slug} data={data} />;
}

function ProgramComparePageContent({ data }: { data: ProgramComparePageData }) {
  const { program: p, offers } = data;
  const comparableOffers = offers.filter(isComparableProgramOffer);
  const verifiedOffers = offers.filter(isVerifiedProgramOffer);
  const discoveryOffers = offers.filter((offer) => !isComparableProgramOffer(offer));
  const comparison = useComparison(p.slug);
  const selectedUniversities = comparison.universitySlugs;
  const highestFee = comparableOffers.length
    ? Math.max(...comparableOffers.map(({ program }) => program.totalFee))
    : 0;
  const [feeCeiling, setFeeCeiling] = useState(highestFee);
  const [sortBy, setSortBy] = useState<"fee" | "emi">("fee");
  const [showAllDiscovery, setShowAllDiscovery] = useState(false);
  const monthlyComparisonAmount = (program: UniversityProgram) =>
    program.emiPerMonthVerified
      ? program.emiPerMonth
      : Math.round(program.totalFee / Math.max(1, program.durationYears * 12));
  const startingFee = comparableOffers.length
    ? Math.min(...comparableOffers.map(({ program }) => program.totalFee))
    : 0;
  const startingEmi = comparableOffers.length
    ? Math.min(...comparableOffers.map(({ program }) => monthlyComparisonAmount(program)))
    : 0;
  const selectedOffers = comparableOffers.filter(({ university }) =>
    selectedUniversities.includes(university.slug),
  );
  const displayedOffers = [...comparableOffers]
    .filter(({ program }) => program.totalFee <= feeCeiling)
    .sort((a, b) => {
      if (sortBy === "emi") {
        return monthlyComparisonAmount(a.program) - monthlyComparisonAmount(b.program);
      }
      return a.program.totalFee - b.program.totalFee;
    });

  const faqs = [
    {
      question: `Is an online ${p.code} degree valid?`,
      answer: `Validity depends on the exact university, program, mode and admission session. Use the current UGC-DEB records and the official university prospectus before enrolling.`,
    },
    {
      question: `Who should choose an online ${p.code}?`,
      answer: `${p.eligibility} The online format is especially useful for learners who want to study alongside work, exam preparation or family commitments.`,
    },
    {
      question: "How are classes and examinations conducted?",
      answer:
        "Delivery varies by university, but commonly includes live classes, recorded lectures, digital study material, online assessments and proctored examinations. Compare the exact learning model before applying.",
    },
    {
      question: "Can I pay the program fee in instalments?",
      answer: comparableOffers.length
        ? `Some labelled profiles include arithmetic payment estimates from ${formatINR(startingEmi)} per month. Confirm the current university and lender terms in writing.`
        : "Payment plans have not been reviewed for the catalogue records shown here. Ask the university for the current written fee and financing terms.",
    },
  ];

  return (
    <div className="bg-background text-foreground transition-colors">
      <section className="border-b border-border bg-surface">
        <div className="container-page py-7 lg:py-12">
          <nav
            className="flex items-center gap-1 text-xs text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="transition hover:text-foreground">
              Home
            </Link>
            <ChevronRight aria-hidden="true" className="h-3 w-3" />
            <Link to="/programs" className="transition hover:text-foreground">
              Programs
            </Link>
            <ChevronRight aria-hidden="true" className="h-3 w-3" />
            <span aria-current="page" className="font-semibold text-foreground">
              {p.code}
            </span>
          </nav>

          <div className="mt-9 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-center xl:gap-20">
            <div className="min-w-0 max-w-3xl py-2 lg:py-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-lg border border-[#aebff0] bg-card px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#2449ad] dark:border-[#56698c] dark:text-[#b9ceff]">
                  <BadgeCheck className="h-4 w-4" />
                  Category guide · intake verification required
                </span>
                <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 text-[11px] font-bold text-muted-foreground">
                  Updated September 2026
                </span>
              </div>

              <h1 className="mt-7 max-w-3xl font-display text-[2.8rem] font-extrabold leading-[1.02] tracking-[-0.06em] text-foreground sm:text-5xl lg:text-[4.25rem]">
                Online {p.name}{" "}
                <span className="inline-block text-[#325dd2] dark:text-[#7da2ff]">({p.code})</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                <span className="font-semibold text-foreground">Typical category overview: </span>
                {p.overview}
              </p>

              <div className="mt-7 flex flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-bold">
                  <Clock3 className="h-4 w-4 text-[#a94300] dark:text-[#ff9a5b]" />
                  {p.durationYears} years · {p.semesters} semesters
                </span>
                <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-bold">
                  <GraduationCap className="h-4 w-4 text-[#a94300] dark:text-[#ff9a5b]" />
                  {p.level} degree
                </span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#f47b25] font-extrabold text-[#111827] hover:bg-[#d85f12]"
                >
                  <Link to="/contact">
                    Get free counselling
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-border bg-background font-bold text-foreground hover:bg-secondary"
                >
                  <a href="#universities">Compare universities</a>
                </Button>
              </div>

              <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-x-4 gap-y-6 border-t border-border pt-7 sm:grid-cols-4">
                {[
                  [comparableOffers.length.toString(), "Source-backed offerings"],
                  [discoveryOffers.length.toString(), "Unranked catalogue records"],
                  [
                    comparableOffers.length ? formatINR(startingFee) : "Not mapped",
                    "Fee guide from",
                  ],
                  [
                    comparableOffers.length ? formatINR(startingEmi) : "Not mapped",
                    "Monthly split from",
                  ],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="font-display text-xl font-extrabold text-foreground">{value}</dt>
                    <dd className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      {label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <aside className="relative mx-auto w-full min-w-0 max-w-[440px]">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#a94300] dark:text-[#ff9a5b]">
                      A practical checklist
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.04em] text-foreground">
                      Compare before you commit.
                    </h2>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff0e6] text-[#a94300] dark:bg-[#3a2518] dark:text-[#ff9a5b]">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Compare budget, evidence, learning format and fit at your own pace, without sales
                  pressure.
                </p>

                <div className="mt-6 space-y-2.5">
                  {[
                    `${comparableOffers.length} labelled comparison profiles`,
                    `${discoveryOffers.length} unranked catalogue records kept separate`,
                    "Free human guidance when you need it",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-lg border border-border bg-background px-3.5 py-3 text-sm font-semibold"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8f7ef] text-[#148055] dark:bg-[#113d30] dark:text-[#67d6a7]">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-secondary p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      Catalogue fee guide
                    </p>
                    <p className="mt-1.5 font-display text-xl font-extrabold">
                      {comparableOffers.length ? formatINR(startingFee) : "Not mapped"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-secondary p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      Arithmetic monthly split
                    </p>
                    <p className="mt-1.5 font-display text-xl font-extrabold">
                      {comparableOffers.length ? formatINR(startingEmi) : "Not mapped"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-5">
                  <div className="flex -space-x-2">
                    {comparableOffers.slice(0, 3).map(({ university }) => (
                      <span
                        key={university.slug}
                        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-card bg-background shadow-sm"
                      >
                        <UniversityLogo university={university} size="sm" />
                      </span>
                    ))}
                  </div>
                  <p className="text-right text-[10px] font-semibold leading-4 text-muted-foreground">
                    No payment required
                    <br />
                    Used only for your requested response
                  </p>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="mt-5 w-full rounded-lg bg-[#f47b25] font-extrabold text-[#111827] hover:bg-[#d85f12]"
                >
                  <Link to="/contact">
                    Get free counselling <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <nav
        className="sticky top-[5.45rem] z-40 border-b border-border bg-background shadow-sm"
        aria-label="Program page sections"
      >
        <div className="container-page flex gap-1 overflow-x-auto py-2 [scrollbar-width:none]">
          {pageNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex min-h-10 shrink-0 items-center rounded-lg px-4 py-2 text-xs font-bold text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <section className="border-b border-border bg-card">
        <div className="container-page grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            {
              icon: ShieldCheck,
              title: "Comparable information",
              text: "Every university is shown on the same core fields.",
            },
            {
              icon: IndianRupee,
              title: "Fee provenance upfront",
              text: "See sourced total fees and clearly labelled arithmetic monthly splits.",
            },
            {
              icon: BadgeCheck,
              title: "Verify before enrolment",
              text: "We remind you to reconfirm approval and intake details.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-3 py-5 sm:px-5 first:pl-0 last:pr-0"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-[#1768cc] dark:text-[#70b3ff]">
                <item.icon className="h-4.5 w-4.5" />
              </span>
              <div>
                <h2 className="text-sm font-extrabold">{item.title}</h2>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="overview"
        className="scroll-mt-32 border-b border-border bg-background py-16 lg:py-20"
      >
        <div className="container-page">
          <SectionHeading
            eyebrow="Program overview"
            title={`Build a future-ready career with an online ${p.code}`}
            description={`A category-level ${p.durationYears}-year format guide for comparing curriculum, workload and career directions. Exact institutional delivery requires a current source check.`}
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {learningFeatures.map((feature) => (
              <article
                key={feature.title}
                className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-[#aebff0] dark:hover:border-[#56698c]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#edf2ff] text-[#325dd2] dark:bg-[#263653] dark:text-[#b9ceff]">
                  <feature.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-extrabold tracking-[-0.03em]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background py-16 lg:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Honest decision guide"
            title={`Is an online ${p.code} right for you?`}
            description="A good decision starts with fit—not urgency. Use these signals before comparing universities."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <article className="rounded-xl border border-border bg-card p-7 md:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#edf2ff] text-[#325dd2] dark:bg-[#263653] dark:text-[#b9ceff]">
                  <Check className="h-5 w-5" />
                </span>
                <h3 className="font-display text-xl font-extrabold">Strong fit if you…</h3>
              </div>
              <ul className="mt-6 space-y-3 text-sm leading-6 text-muted-foreground">
                {[
                  "Want to study without relocating or pausing other commitments",
                  "Are comfortable learning through live and recorded online classes",
                  "Value lower overall costs and flexible payment choices",
                  "Can manage your time and study with consistent self-discipline",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[#325dd2] dark:text-[#7da2ff]" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-xl border border-border bg-card p-7 md:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#fff1e7] text-[#a94300] dark:bg-[#3a2518] dark:text-[#ffad70]">
                  <Target className="h-5 w-5" />
                </span>
                <h3 className="font-display text-xl font-extrabold">Compare carefully if you…</h3>
              </div>
              <ul className="mt-6 space-y-3 text-sm leading-6 text-muted-foreground">
                {[
                  "Need a highly social, full-time residential campus experience",
                  "Expect placements without building skills, projects or work experience",
                  "Have not checked the exact program entitlement for your intake",
                  "Are choosing only by the lowest fee instead of academic and learner support",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f47b25]" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {verifiedOffers.length ? (
        <ProgramDecisionStudio program={p} offers={verifiedOffers} />
      ) : (
        <section
          id="decision-tools"
          className="scroll-mt-32 border-b border-border bg-background py-16"
        >
          <div className="container-page">
            <div className="rounded-[1.75rem] border border-dashed border-border bg-card p-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#1768cc] dark:text-[#78b9ff]">
                Decision tools paused for this course
              </p>
              <h2 className="mt-3 font-display text-2xl font-extrabold">
                Source-backed fee inputs are not available yet
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Editorial and directory records remain useful for discovery, but they do not enter
                this planner until current offering and total-fee evidence is mapped.
              </p>
            </div>
          </div>
        </section>
      )}

      <section id="universities" className="scroll-mt-32 bg-secondary/55 py-16 lg:py-20">
        <div className="container-page">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Compare your options"
              title={`Source-backed ${p.code} comparison profiles`}
              description="Compare cited total fees and recognition evidence. Editorial, directory and non-current records stay outside rankings."
            />
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-extrabold text-[#155cb6] dark:text-[#70b3ff]">
              <GitCompareArrows className="h-4 w-4" /> {displayedOffers.length} comparable options
            </span>
          </div>

          <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7f1ff] text-[#1768cc] dark:bg-[#153a5e] dark:text-[#70b3ff]">
                <GitCompareArrows className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-sm font-extrabold">Build a side-by-side comparison</p>
                <p className="text-xs text-muted-foreground">Select up to 3 universities below.</p>
              </div>
            </div>
            <p className="text-xs font-bold text-muted-foreground">
              <span className="text-[#1768cc] dark:text-[#70b3ff]">{selectedOffers.length}</span> of
              3 selected
            </p>
          </div>

          {selectedOffers.length > 0 ? (
            <div className="mt-4 overflow-hidden rounded-xl border border-[#aebff0] bg-card dark:border-[#56698c]">
              <div className="flex items-center justify-between border-b border-border bg-[#edf5ff] px-5 py-3 dark:bg-[#102a42]">
                <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.1em] text-[#155cb6] dark:text-[#70b3ff]">
                  <GitCompareArrows className="h-4 w-4" /> Live comparison
                </p>
                <button
                  type="button"
                  onClick={comparison.clearComparison}
                  className="text-xs font-bold text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </button>
              </div>
              <div className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
                {selectedOffers.map(({ university, program }) => (
                  <div key={university.slug} className="relative p-5">
                    <button
                      type="button"
                      onClick={() => comparison.toggleUniversity(p.slug, university.slug)}
                      aria-label={`Remove ${university.shortName} from comparison`}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-3 pr-7">
                      <UniversityLogo university={university} size="sm" />
                      <div>
                        <h3 className="text-sm font-extrabold">{university.shortName}</h3>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          Sourced total-fee offering
                        </p>
                      </div>
                    </div>
                    <dl className="mt-5 grid grid-cols-2 gap-3">
                      <div>
                        <dt className="text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                          Total fee
                        </dt>
                        <dd className="mt-1 font-display text-base font-extrabold">
                          {formatINR(program.totalFee)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                          {program.emiPerMonthVerified
                            ? "Published monthly amount"
                            : "Arithmetic monthly split"}
                        </dt>
                        <dd className="mt-1 font-display text-base font-extrabold">
                          {formatINR(program.emiPerMonth)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                ))}
                {Array.from({ length: 3 - selectedOffers.length }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="flex min-h-32 items-center justify-center p-5 text-center text-xs font-semibold text-muted-foreground"
                  >
                    Select another university to compare
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  Compare facts first, then speak to a counsellor only if you need help.
                </p>
                <Button
                  asChild
                  size="sm"
                  className="rounded-lg bg-[#1768cc] font-extrabold text-white hover:bg-[#0e57b2]"
                >
                  <Link to="/compare">Open complete comparison</Link>
                </Button>
              </div>
            </div>
          ) : null}

          {comparableOffers.length ? (
            <div className="mt-6 grid gap-5 rounded-[1.5rem] border border-border bg-card p-5 md:grid-cols-[1fr_240px] md:items-end">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <label htmlFor="fee-ceiling" className="text-sm font-extrabold">
                    Maximum total fee
                  </label>
                  <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-extrabold text-[#155cb6] dark:text-[#78b9ff]">
                    {formatINR(feeCeiling)}
                  </span>
                </div>
                <input
                  id="fee-ceiling"
                  type="range"
                  min={startingFee}
                  max={highestFee}
                  step="5000"
                  value={feeCeiling}
                  onChange={(event) => setFeeCeiling(Number(event.target.value))}
                  className="mt-4 w-full accent-[#1768cc]"
                />
                <div className="mt-1 flex justify-between text-[10px] font-bold text-muted-foreground">
                  <span>{formatINR(startingFee)}</span>
                  <span>{formatINR(highestFee)}</span>
                </div>
              </div>
              <div>
                <label htmlFor="sort-offers" className="text-sm font-extrabold">
                  Sort universities
                </label>
                <select
                  id="sort-offers"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as "fee" | "emi")}
                  className="mt-3 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-bold text-foreground outline-none focus:border-[#1768cc] focus-visible:ring-2 focus-visible:ring-[#0d5cad] focus-visible:ring-offset-2"
                >
                  <option value="fee">Lowest total fee</option>
                  <option value="emi">Lowest arithmetic monthly split</option>
                </select>
              </div>
            </div>
          ) : null}

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {displayedOffers.map(({ university, program }, index) => {
              const approvalClaims = getProgramApprovalClaims(university, program);
              return (
                <article
                  key={university.slug}
                  className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-[#aebff0] sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-background">
                        <UniversityLogo university={university} size="md" />
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-base font-extrabold tracking-[-0.025em]">
                            {university.shortName}
                          </h3>
                          {index === 0 && sortBy === "fee" ? (
                            <span className="rounded-full bg-[#e9f8f0] px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[#168258]">
                              Lowest sourced total fee
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatUniversityLocation(university)} · recognition must be checked for
                          the intake
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#fff7df] px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-[#8c6811]">
                      Sourced total fee
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-secondary/60 p-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                        Sourced total fee
                      </p>
                      <p className="mt-1 font-display text-xl font-extrabold">
                        {formatINR(program.totalFee)}
                      </p>
                    </div>
                    <div className="border-l border-border pl-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                        {program.emiPerMonthVerified
                          ? "Published monthly amount"
                          : "Arithmetic monthly split"}
                      </p>
                      <p className="mt-1 font-display text-xl font-extrabold text-[#155cb6] dark:text-[#70b3ff]">
                        {formatINR(monthlyComparisonAmount(program))}
                        <span className="text-xs font-semibold text-muted-foreground">/mo</span>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-pressed={selectedUniversities.includes(university.slug)}
                    disabled={
                      selectedUniversities.length >= 3 &&
                      !selectedUniversities.includes(university.slug)
                    }
                    onClick={() => comparison.toggleUniversity(p.slug, university.slug)}
                    className={`mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-xs font-extrabold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      selectedUniversities.includes(university.slug)
                        ? "border-[#1768cc] bg-[#1768cc] text-white"
                        : "border-border bg-background text-foreground hover:border-[#78a9df] hover:bg-[#edf5ff] dark:hover:bg-[#102a42]"
                    }`}
                  >
                    {selectedUniversities.includes(university.slug) ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <GitCompareArrows className="h-4 w-4" />
                    )}
                    {selectedUniversities.includes(university.slug)
                      ? "Added to comparison"
                      : "Add to comparison"}
                  </button>

                  <div className="mt-5 flex items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-1.5">
                      {approvalClaims.length ? (
                        approvalClaims.slice(0, 2).map((claim) => (
                          <a
                            key={claim.id}
                            href={claim.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-border px-2.5 py-1 text-[10px] font-bold text-muted-foreground"
                          >
                            {claim.renderedClaim}
                          </a>
                        ))
                      ) : (
                        <span className="text-[10px] font-semibold text-muted-foreground">
                          No separate recognition evidence mapped
                        </span>
                      )}
                    </div>
                    <Link
                      to="/universities/$universitySlug/$programSlug"
                      params={{ universitySlug: university.slug, programSlug: p.slug }}
                      className="inline-flex shrink-0 items-center text-xs font-extrabold text-[#155cb6] dark:text-[#70b3ff]"
                    >
                      View details{" "}
                      <ArrowRight className="ml-1 h-3.5 w-3.5 transition group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
          {displayedOffers.length === 0 ? (
            <div className="mt-10 rounded-[1.5rem] border border-dashed border-border bg-card p-10 text-center">
              <WalletCards className="mx-auto h-7 w-7 text-muted-foreground" />
              <h3 className="mt-4 font-display text-lg font-extrabold">
                {comparableOffers.length
                  ? "No option fits this fee range"
                  : "No comparison-ready profile yet"}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {comparableOffers.length
                  ? "Raise your maximum fee to see more universities."
                  : "Unverified and directory records appear separately below and do not enter rankings."}
              </p>
              {comparableOffers.length ? (
                <button
                  type="button"
                  onClick={() => setFeeCeiling(highestFee)}
                  className="mt-4 text-sm font-extrabold text-[#155cb6] dark:text-[#78b9ff]"
                >
                  Reset fee filter
                </button>
              ) : null}
            </div>
          ) : null}

          {discoveryOffers.length ? (
            <div className="mt-12 border-t border-border pt-10">
              <div className="max-w-3xl">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#a66316] dark:text-[#ffc36f]">
                  Discovery catalogue · excluded from rankings
                </p>
                <h3 className="mt-2 font-display text-2xl font-extrabold">
                  {discoveryOffers.length} unranked university records
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  These directory, editorial or non-current records help with discovery. No exact
                  fee, rating, salary, pathway availability or current-intake entitlement is
                  asserted here.
                </p>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(showAllDiscovery ? discoveryOffers : discoveryOffers.slice(0, 12)).map(
                  ({ university, program }) => (
                    <Link
                      key={university.slug}
                      to="/universities/$universitySlug"
                      params={{ universitySlug: university.slug }}
                      className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-[#d09b5d]"
                    >
                      <UniversityLogo university={university} size="sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-extrabold">
                          {university.shortName}
                        </span>
                        <span className="mt-1 block text-[10px] text-muted-foreground">
                          {program.entitlementStatus === undefined &&
                          university.profileDepth !== "directory"
                            ? "Editorial profile · current offering not verified"
                            : program.entitlementStatus === "expired"
                              ? "Offering evidence expired · verify intake"
                              : program.entitlementStatus === "no-admission" ||
                                  program.entitlementStatus === "debarred"
                                ? `${program.entitlementStatus} status · check source`
                                : `${university.verificationAcademicYear ?? program.academicSession ?? "Historical"} source · verify intake`}
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1" />
                    </Link>
                  ),
                )}
              </div>
              {discoveryOffers.length > 12 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAllDiscovery((value) => !value)}
                  className="mt-5 rounded-xl"
                  aria-expanded={showAllDiscovery}
                >
                  {showAllDiscovery
                    ? "Show fewer records"
                    : `Show all ${discoveryOffers.length} records`}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      <section id="curriculum" className="scroll-mt-32 bg-background py-16 lg:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_350px] xl:gap-16">
          <div>
            <SectionHeading
              eyebrow="What you will learn"
              title="Program curriculum"
              description={`Explore the core subjects covered across ${p.semesters} semesters. Exact subjects may differ by university and specialisation.`}
            />
            <Accordion
              type="single"
              collapsible
              defaultValue={p.curriculum[0]?.semester ?? ""}
              className="mt-8"
            >
              {p.curriculum.map((term, index) => (
                <AccordionItem
                  key={term.semester}
                  value={term.semester}
                  className="mb-3 rounded-2xl border border-border bg-card px-5 data-[state=open]:border-[#78a9df] data-[state=open]:bg-secondary/60"
                >
                  <AccordionTrigger className="py-5 font-display text-base font-extrabold hover:no-underline">
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e4effc] text-xs text-[#155cb6] dark:bg-[#153a5e] dark:text-[#70b3ff]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {term.semester}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {term.subjects.map((subject) => (
                        <li
                          key={subject}
                          className="flex items-start gap-2 rounded-xl bg-background px-3 py-2.5 text-sm text-muted-foreground"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#16865b]" />
                          {subject}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <aside className="lg:sticky lg:top-32 lg:h-fit">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#131720] text-white">
              <div className="border-b border-white/10 p-6">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#ff9a50]">
                  Program at a glance
                </p>
                <h3 className="mt-3 font-display text-2xl font-extrabold">Online {p.code}</h3>
              </div>
              <div className="space-y-4 p-6 text-sm">
                <Fact icon={Clock3} label="Duration" value={`${p.durationYears} years`} />
                <Fact
                  icon={BookOpenCheck}
                  label="Academic terms"
                  value={`${p.semesters} semesters`}
                />
                <Fact
                  icon={IndianRupee}
                  label="Fee guide from"
                  value={comparableOffers.length ? formatINR(startingFee) : "Not mapped"}
                />
                <Fact
                  icon={WalletCards}
                  label="Arithmetic monthly split from"
                  value={comparableOffers.length ? `${formatINR(startingEmi)}/month` : "Not mapped"}
                />
                <Fact
                  icon={Building2}
                  label="Source-backed offerings"
                  value={`${comparableOffers.length} options`}
                />
              </div>
              <div className="p-6 pt-0">
                <Button
                  asChild
                  className="w-full rounded-lg bg-[#f47b25] font-extrabold text-[#111827] hover:bg-[#d85f12]"
                >
                  <Link to="/contact">Get free counselling</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section
        id="specialisations"
        className="scroll-mt-32 bg-[#131720] py-16 text-white dark:bg-[#0b1018] lg:py-20"
      >
        <div className="container-page">
          <SectionHeading
            dark
            eyebrow="Choose your focus"
            title="Common specialisation themes"
            description="These are category-level pathways, not a claim that every university offers them. Verify the current prospectus and award wording."
          />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {p.specialisations.map((specialisation, index) => (
              <Link
                key={specialisation}
                to="/specialisations/$specialisationSlug"
                params={{
                  specialisationSlug: `${p.slug.replace(/^online-/, "")}-${slugifySpecialisation(specialisation)}`,
                }}
                className="group flex min-h-32 items-end justify-between rounded-xl border border-[#3b4350] bg-[#252b36] p-5 transition-colors hover:border-[#f47b25]"
              >
                <div>
                  <span className="text-xs font-extrabold text-[#ff9a50]">0{index + 1}</span>
                  <h3 className="mt-3 font-display text-lg font-extrabold">{specialisation}</h3>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#596170] transition-colors group-hover:border-[#f47b25] group-hover:bg-[#f47b25] group-hover:text-[#111827]">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-5 rounded-xl border border-[#3b4350] bg-[#252b36] p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-display text-xl font-extrabold">
                Not sure which specialisation fits you?
              </h3>
              <p className="mt-1 text-sm text-white/70">
                Explore pathways by career direction, then verify the exact university curriculum.
              </p>
            </div>
            <Button
              asChild
              className="rounded-xl bg-white font-extrabold text-[#102239] hover:bg-[#eef3f8]"
            >
              <Link to="/specialisations">Explore all pathways</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="eligibility" className="scroll-mt-32 bg-background py-16 lg:py-20">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.75rem] border border-border bg-card p-7 md:p-9">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf3ff] text-[#155cb6] dark:bg-[#153a5e] dark:text-[#70b3ff]">
              <GraduationCap className="h-5 w-5" />
            </span>
            <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.16em] text-[#a94300] dark:text-[#ff9a5b]">
              Eligibility criteria
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.045em]">
              Can you apply?
            </h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground">{p.eligibility}</p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {[
                "Valid marksheets and identity documents are generally required",
                "No relocation or campus attendance for regular classes",
                "Exact admission rules can vary by university and intake",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e9f8f0] text-[#168258]">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.75rem] bg-[#fff1e7] p-7 dark:bg-[#2b211c] md:p-9">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#a94300] dark:bg-[#3c2e26] dark:text-[#ff9a5b]">
              <Medal className="h-5 w-5" />
            </span>
            <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.16em] text-[#a94300] dark:text-[#ff9a5b]">
              Why this program
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.045em]">
              Designed for forward motion
            </h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground">
              Continue earning, preparing for competitive exams or managing other commitments while
              building a recognised qualification.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <Metric value={`${p.specialisations.length}`} label="Category pathways" />
              <Metric value={`${p.careers.length}`} label="Career directions" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 lg:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Simple and supported"
            title="Your admission journey"
            description="Move from comparison to enrolment with clear steps and expert support when you need it."
          />
          <div className="mt-10 grid gap-3 md:grid-cols-5">
            {admissionSteps.map(([number, title, description], index) => (
              <article
                key={number}
                className="relative rounded-[1.4rem] border border-border bg-card p-5"
              >
                <span className="font-display text-3xl font-extrabold text-[#c7d9ee]">
                  {number}
                </span>
                <h3 className="mt-5 font-display text-base font-extrabold">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{description}</p>
                {index < admissionSteps.length - 1 ? (
                  <span className="absolute -right-2.5 top-1/2 z-10 hidden h-5 w-5 items-center justify-center rounded-full bg-[#155cb6] text-white md:flex">
                    <ChevronRight className="h-3 w-3" />
                  </span>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="careers" className="scroll-mt-32 bg-secondary/55 py-16 lg:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center xl:gap-16">
          <div>
            <SectionHeading
              eyebrow="Career possibilities"
              title={`Where an online ${p.code} can take you`}
              description="Your outcomes depend on prior experience, skills, university support and the opportunities you pursue—not the degree alone."
            />
            <div className="mt-7 rounded-xl bg-[#325dd2] p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">
                Outcome guardrail
              </p>
              <p className="mt-2 font-display text-2xl font-extrabold">No salary promise</p>
              <p className="mt-2 text-xs leading-5 text-white/65">
                Compare skills, projects and role requirements. Salary depends on experience,
                location, evidence of work and market conditions.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {p.careers.map((career, index) => (
              <article
                key={career}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-[#aebff0]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf4ff] text-[#155cb6] dark:bg-[#153a5e] dark:text-[#70b3ff]">
                  <BriefcaseBusiness className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#9aa2ac]">
                    Role {index + 1}
                  </p>
                  <h3 className="mt-1 font-display text-sm font-extrabold">{career}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faqs" className="scroll-mt-32 bg-background py-16 lg:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[0.72fr_1.28fr] xl:gap-20">
          <div>
            <SectionHeading
              eyebrow="Questions, answered"
              title={`Online ${p.code} FAQs`}
              description="The important things to know before you compare and apply."
            />
            <Button
              asChild
              className="mt-7 rounded-lg bg-[#325dd2] font-extrabold text-white hover:bg-[#2449ad]"
            >
              <Link to="/contact">Ask an education expert</Link>
            </Button>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`faq-${index}`}
                className="rounded-2xl border border-border bg-card px-5"
              >
                <AccordionTrigger className="py-5 text-left font-display text-base font-extrabold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-7 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="bg-[#325dd2] py-12 text-white">
        <div className="container-page flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/80">
              Your next step
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.045em] text-white">
              Find the right university for your online {p.code}.
            </h2>
          </div>
          <Button
            asChild
            size="lg"
            className="shrink-0 rounded-lg bg-[#f47b25] font-extrabold text-[#111827] hover:bg-[#d85f12]"
          >
            <Link to="/contact">
              Get free counselling <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  dark?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <p
        className={`text-xs font-extrabold uppercase tracking-[0.17em] ${dark ? "text-[#ff9a50]" : "text-[#a94300]"}`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-3 font-display text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl ${dark ? "text-white" : "text-foreground"}`}
      >
        {title}
      </h2>
      <p
        className={`mt-4 max-w-2xl text-base leading-7 ${dark ? "text-white/60" : "text-muted-foreground"}`}
      >
        {description}
      </p>
    </div>
  );
}

function Fact({ icon: Icon, label, value }: { icon: typeof Clock3; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#252b36] text-[#ff9a50]">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/65">{label}</p>
        <p className="mt-0.5 font-bold">{value}</p>
      </div>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white/75 p-4 dark:bg-white/[0.06]">
      <p className="font-display text-xl font-extrabold text-foreground">{value}</p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
