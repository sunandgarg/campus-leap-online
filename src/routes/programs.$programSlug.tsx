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
  Sparkles,
  Star,
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

const pageNav = [
  { label: "Overview", href: "#overview" },
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
    color: "bg-[#eaf3ff] text-[#1765c0]",
  },
  {
    title: "Industry-aligned curriculum",
    description: "Build practical knowledge through current subjects, projects and case studies.",
    icon: BookOpenCheck,
    color: "bg-[#fff0e6] text-[#e96e22]",
  },
  {
    title: "Recognised universities",
    description: "Compare only UGC-entitled university options with clear accreditation details.",
    icon: ShieldCheck,
    color: "bg-[#eafaf3] text-[#16865b]",
  },
  {
    title: "Career-focused support",
    description: "Choose a degree and specialisation with your long-term role in mind.",
    icon: Target,
    color: "bg-[#f3edff] text-[#7353c6]",
  },
];

const admissionSteps = [
  ["01", "Shortlist universities", "Compare recognition, fees and learning support."],
  ["02", "Check eligibility", "Confirm your qualification and document requirements."],
  ["03", "Complete application", "Submit your details with expert application support."],
  ["04", "Pay securely", "Select full payment, semester fee or an eligible EMI plan."],
  ["05", "Start learning", "Receive enrolment details and access your digital campus."],
];

function ProgramComparePage() {
  const { program: p, offers } = Route.useLoaderData() as ProgramComparePageData;
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
  const startingFee = Math.min(...offers.map(({ program }) => program.totalFee));
  const startingEmi = Math.min(...offers.map(({ program }) => program.emiPerMonth));
  const averageRating = offers.length
    ? (offers.reduce((sum, { university }) => sum + university.rating, 0) / offers.length).toFixed(
        1,
      )
    : "—";
  const selectedOffers = offers.filter(({ university }) =>
    selectedUniversities.includes(university.slug),
  );

  function toggleUniversity(slug: string) {
    setSelectedUniversities((current) => {
      if (current.includes(slug)) return current.filter((item) => item !== slug);
      if (current.length >= 3) return current;
      return [...current, slug];
    });
  }

  const faqs = [
    {
      question: `Is an online ${p.code} degree valid?`,
      answer: `The universities listed here offer UGC-entitled online programs. Always verify the university and program entitlement for your exact admission session before enrolling.`,
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
      answer: `Yes, several listed universities provide semester-wise payment or EMI options. Current plans for this program start around ${formatINR(startingEmi)} per month, subject to university and lender terms.`,
    },
  ];

  return (
    <div className="bg-background text-foreground transition-colors">
      <section className="relative overflow-hidden border-b border-border bg-[#f6f9fd] dark:bg-[#071522]">
        <div
          className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(30,103,189,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(30,103,189,0.055)_1px,transparent_1px)] [background-size:56px_56px] dark:opacity-30"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-32 -top-40 h-[36rem] w-[36rem] rounded-full bg-[#dcecff] blur-3xl dark:bg-[#0a4a87]/40"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-40 top-8 h-[34rem] w-[34rem] rounded-full bg-[#fff0d2] blur-3xl dark:bg-[#5b3d12]/30"
          aria-hidden="true"
        />

        <div className="container-page relative py-7 lg:py-12">
          <nav
            className="flex items-center gap-1 text-xs text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="transition hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/programs" className="transition hover:text-foreground">
              Programs
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-foreground">{p.code}</span>
          </nav>

          <div className="mt-9 grid gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-center xl:gap-20">
            <div className="max-w-3xl py-2 lg:py-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#b9d5f5] bg-white/80 px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#155cb6] shadow-sm backdrop-blur dark:border-[#27547e] dark:bg-[#0e2840]/80 dark:text-[#8bc2ff]">
                  <BadgeCheck className="h-4 w-4" />
                  UGC-entitled options only
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/75 px-3.5 py-2 text-[11px] font-bold text-muted-foreground backdrop-blur">
                  Updated September 2026
                </span>
              </div>

              <h1 className="mt-7 max-w-3xl font-display text-[2.8rem] font-extrabold leading-[1.02] tracking-[-0.06em] text-foreground sm:text-5xl lg:text-[4.25rem]">
                Online {p.name}{" "}
                <span className="text-[#1768cc] dark:text-[#70b3ff]">({p.code})</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                {p.overview}
              </p>

              <div className="mt-7 flex flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/85 px-4 py-2.5 text-sm font-bold shadow-sm backdrop-blur">
                  <Clock3 className="h-4 w-4 text-[#1768cc] dark:text-[#70b3ff]" />
                  {p.durationYears} years · {p.semesters} semesters
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/85 px-4 py-2.5 text-sm font-bold shadow-sm backdrop-blur">
                  <GraduationCap className="h-4 w-4 text-[#1768cc] dark:text-[#70b3ff]" />
                  {p.level} degree
                </span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-xl bg-[#1768cc] px-6 font-extrabold text-white shadow-[0_16px_34px_-16px_rgba(23,104,204,0.72)] hover:bg-[#0e57b2]"
                >
                  <Link to="/contact">
                    Get my free shortlist
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl border-border bg-background/65 px-6 font-bold text-foreground hover:bg-secondary"
                >
                  <a href="#universities">Compare universities</a>
                </Button>
              </div>

              <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-x-4 gap-y-6 border-t border-border pt-7 sm:grid-cols-4">
                {[
                  [offers.length.toString(), "University options"],
                  [formatINR(startingFee), "Fees from"],
                  [formatINR(startingEmi), "Monthly EMI from"],
                  [averageRating, "Avg. rating"],
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

            <aside className="relative mx-auto w-full max-w-[440px]">
              <div
                className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-[#b9dcff]/60 via-transparent to-[#ffe3a9]/55 blur-xl dark:from-[#1768cc]/25 dark:to-[#bd7b18]/20"
                aria-hidden="true"
              />
              <div className="relative rounded-[1.75rem] border border-white/80 bg-white/90 p-6 shadow-[0_28px_80px_-36px_rgba(25,67,116,0.48)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0d2134]/92 dark:shadow-[0_28px_80px_-32px_rgba(0,0,0,0.75)] sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#1768cc] dark:text-[#70b3ff]">
                      Smart shortlist
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.04em] text-foreground">
                      Compare before you commit.
                    </h2>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e8f3ff] text-[#1768cc] dark:bg-[#143757] dark:text-[#70b3ff]">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Get matched by budget, accreditation, learning format and your career goal—not
                  sales pressure.
                </p>

                <div className="mt-6 space-y-2.5">
                  {[
                    `${offers.length} verified university options compared`,
                    "Transparent fees and EMI in one place",
                    "Free human guidance when you need it",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-border/80 bg-background/70 px-3.5 py-3 text-sm font-semibold"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8f7ef] text-[#148055] dark:bg-[#113d30] dark:text-[#67d6a7]">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-[#f1f6fc] p-4 dark:bg-[#102a42]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      Program fee from
                    </p>
                    <p className="mt-1.5 font-display text-xl font-extrabold">
                      {formatINR(startingFee)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#fff5df] p-4 dark:bg-[#342919]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      Monthly EMI from
                    </p>
                    <p className="mt-1.5 font-display text-xl font-extrabold">
                      {formatINR(startingEmi)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-5">
                  <div className="flex -space-x-2">
                    {offers.slice(0, 3).map(({ university }) => (
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
                    Your information stays private
                  </p>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="mt-5 h-12 w-full rounded-xl bg-[#1768cc] font-extrabold text-white hover:bg-[#0e57b2]"
                >
                  <Link to="/contact">
                    Build my shortlist <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <nav
        className="sticky top-16 z-40 border-b border-border bg-background/92 shadow-sm backdrop-blur-xl"
        aria-label="Program page sections"
      >
        <div className="container-page flex gap-1 overflow-x-auto py-2 [scrollbar-width:none]">
          {pageNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-lg px-4 py-2 text-xs font-bold text-muted-foreground transition hover:bg-secondary hover:text-foreground"
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
              title: "Fees shown upfront",
              text: "See total program fee and monthly EMI together.",
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
            description={`A flexible ${p.durationYears}-year program designed to help you build recognised academic credentials and practical, career-relevant knowledge.`}
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {learningFeatures.map((feature) => (
              <article
                key={feature.title}
                className="rounded-[1.5rem] border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-[0_20px_45px_-30px_rgba(12,39,71,0.5)] dark:hover:border-white/20"
              >
                <span
                  className={`${feature.color} flex h-12 w-12 items-center justify-center rounded-2xl`}
                >
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
            <article className="rounded-[1.75rem] border border-[#bfe4d1] bg-[#f0fbf5] p-7 dark:border-[#20543f] dark:bg-[#0e2b21] md:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#168258] shadow-sm dark:bg-[#153d30] dark:text-[#69d7a9]">
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
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[#168258] dark:text-[#69d7a9]" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-[1.75rem] border border-[#efd9b1] bg-[#fff9eb] p-7 dark:border-[#5d4624] dark:bg-[#2d2517] md:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#a56f0b] shadow-sm dark:bg-[#45351c] dark:text-[#f4bd4f]">
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
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b47b15] dark:bg-[#f4bd4f]" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section id="universities" className="scroll-mt-32 bg-secondary/55 py-16 lg:py-20">
        <div className="container-page">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Compare your options"
              title={`Universities offering online ${p.code}`}
              description="Compare recognition, total fees, monthly EMI and learner ratings before you shortlist."
            />
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-extrabold text-[#155cb6] dark:text-[#70b3ff]">
              <Sparkles className="h-4 w-4" /> Sorted by lowest total fee
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
            <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-[#83b4ea] bg-card shadow-[0_20px_50px_-36px_rgba(23,104,204,0.55)] dark:border-[#2e628f]">
              <div className="flex items-center justify-between border-b border-border bg-[#edf5ff] px-5 py-3 dark:bg-[#102a42]">
                <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.1em] text-[#155cb6] dark:text-[#70b3ff]">
                  <GitCompareArrows className="h-4 w-4" /> Live comparison
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedUniversities([])}
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
                      onClick={() => toggleUniversity(university.slug)}
                      aria-label={`Remove ${university.shortName} from comparison`}
                      className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-3 pr-7">
                      <UniversityLogo university={university} size="sm" />
                      <div>
                        <h3 className="text-sm font-extrabold">{university.shortName}</h3>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          NAAC {university.naacGrade} · ★ {university.rating}
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
                          Monthly EMI
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

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {offers.map(({ university, program }, index) => (
              <article
                key={university.slug}
                className="group rounded-[1.55rem] border border-border bg-card p-5 shadow-[0_12px_35px_-30px_rgba(12,39,71,0.45)] transition hover:-translate-y-0.5 hover:border-[#78a9df] hover:shadow-[0_22px_48px_-30px_rgba(18,74,140,0.48)] sm:p-6"
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
                        {index === 0 ? (
                          <span className="rounded-full bg-[#e9f8f0] px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[#168258]">
                            Lowest fee
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {university.city} · NAAC {university.naacGrade}
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-[#fff7df] px-2.5 py-1.5 text-xs font-extrabold text-[#8c6811]">
                    <Star className="h-3.5 w-3.5 fill-[#f2b72d] text-[#f2b72d]" />
                    {university.rating}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-secondary/60 p-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      Total program fee
                    </p>
                    <p className="mt-1 font-display text-xl font-extrabold">
                      {formatINR(program.totalFee)}
                    </p>
                  </div>
                  <div className="border-l border-border pl-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      EMI from
                    </p>
                    <p className="mt-1 font-display text-xl font-extrabold text-[#155cb6] dark:text-[#70b3ff]">
                      {formatINR(program.emiPerMonth)}
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
                  onClick={() => toggleUniversity(university.slug)}
                  className={`mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl border text-xs font-extrabold transition disabled:cursor-not-allowed disabled:opacity-40 ${
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
                    {university.approvals.slice(0, 2).map((approval) => (
                      <span
                        key={approval}
                        className="rounded-full border border-border px-2.5 py-1 text-[10px] font-bold text-muted-foreground"
                      >
                        {approval}
                      </span>
                    ))}
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
            ))}
          </div>
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
              defaultValue={p.curriculum[0]?.semester}
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
            <div className="overflow-hidden rounded-[1.75rem] bg-[#08213d] text-white shadow-[0_28px_60px_-32px_rgba(8,33,61,0.68)] ring-1 ring-white/10">
              <div className="border-b border-white/10 p-6">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#ffc23f]">
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
                <Fact icon={IndianRupee} label="Starting fee" value={formatINR(startingFee)} />
                <Fact
                  icon={WalletCards}
                  label="EMI from"
                  value={`${formatINR(startingEmi)}/month`}
                />
                <Fact icon={Building2} label="Universities" value={`${offers.length} options`} />
              </div>
              <div className="p-6 pt-0">
                <Button
                  asChild
                  className="h-11 w-full rounded-xl bg-[#ffc23f] font-extrabold text-[#12253b] hover:bg-[#ffb819]"
                >
                  <Link to="/contact">Get a personalised shortlist</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section
        id="specialisations"
        className="scroll-mt-32 bg-[#0b2038] py-16 text-white dark:bg-[#050d15] lg:py-20"
      >
        <div className="container-page">
          <SectionHeading
            dark
            eyebrow="Choose your focus"
            title="Popular specialisations"
            description="Shape the degree around the field and career direction you want to pursue."
          />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {p.specialisations.map((specialisation, index) => (
              <article
                key={specialisation}
                className="group flex min-h-32 items-end justify-between rounded-[1.4rem] border border-white/10 bg-white/[0.06] p-5 transition hover:border-[#ffc23f]/40 hover:bg-white/[0.1]"
              >
                <div>
                  <span className="text-xs font-extrabold text-[#ffc23f]">0{index + 1}</span>
                  <h3 className="mt-3 font-display text-lg font-extrabold">{specialisation}</h3>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 transition group-hover:bg-[#ffc23f] group-hover:text-[#102239]">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-5 rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-display text-xl font-extrabold">
                Not sure which specialisation fits you?
              </h3>
              <p className="mt-1 text-sm text-white/60">
                Get a career-first recommendation from an education expert.
              </p>
            </div>
            <Button
              asChild
              className="rounded-xl bg-white font-extrabold text-[#102239] hover:bg-[#eef3f8]"
            >
              <Link to="/contact">Get personalised guidance</Link>
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
            <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.16em] text-[#e96e22]">
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
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#e96e22] dark:bg-[#3c2e26]">
              <Medal className="h-5 w-5" />
            </span>
            <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.16em] text-[#e96e22]">
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
              <Metric value={`${p.specialisations.length}`} label="Specialisations" />
              <Metric value={p.averageSalaryLpa} label="Typical salary range" />
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
            <div className="mt-7 rounded-2xl bg-[#155cb6] p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">
                Indicative salary range
              </p>
              <p className="mt-2 font-display text-4xl font-extrabold">{p.averageSalaryLpa}</p>
              <p className="mt-2 text-xs leading-5 text-white/65">
                Varies by role, city, experience and employer.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {p.careers.map((career, index) => (
              <article
                key={career}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-[#78a9df] hover:shadow-lg"
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
              className="mt-7 rounded-xl bg-[#102943] font-extrabold text-white hover:bg-[#183b60]"
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

      <section className="bg-[#ffc23f] py-12">
        <div className="container-page flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#6e5110]">
              Your next step
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.045em] text-[#10243b]">
              Find the right university for your online {p.code}.
            </h2>
          </div>
          <Button
            asChild
            size="lg"
            className="h-12 shrink-0 rounded-xl bg-[#10243b] px-6 font-extrabold text-white hover:bg-[#183b60]"
          >
            <Link to="/contact">
              Get my free shortlist <ArrowRight className="ml-2 h-4 w-4" />
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
        className={`text-xs font-extrabold uppercase tracking-[0.17em] ${dark ? "text-[#ffc23f]" : "text-[#e96e22]"}`}
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
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#ffc23f]">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/45">{label}</p>
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
