import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  Clock3,
  Download,
  GraduationCap,
  IndianRupee,
  Laptop2,
  Medal,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LeadForm } from "@/components/site/lead-form";
import { UniversityLogo } from "@/components/site/university-logo";
import programHero from "@/assets/program-hero.jpg";
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
  const startingFee = Math.min(...offers.map(({ program }) => program.totalFee));
  const startingEmi = Math.min(...offers.map(({ program }) => program.emiPerMonth));
  const averageRating = offers.length
    ? (offers.reduce((sum, { university }) => sum + university.rating, 0) / offers.length).toFixed(
        1,
      )
    : "—";

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
    <div className="bg-[#fbfaf7] text-[#121a28]">
      <section className="relative overflow-hidden bg-[#071d36] text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: `url(${p.heroImageUrl ?? programHero})` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,26,50,0.99)_0%,rgba(5,31,61,0.94)_48%,rgba(8,39,74,0.72)_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[#2677dd]/30 blur-3xl"
          aria-hidden="true"
        />

        <div className="container-page relative py-6 lg:py-9">
          <nav className="flex items-center gap-1 text-xs text-white/55" aria-label="Breadcrumb">
            <Link to="/" className="transition hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/programs" className="transition hover:text-white">
              Programs
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/85">{p.code}</span>
          </nav>

          <div className="mt-6 grid gap-9 lg:grid-cols-[1fr_405px] lg:items-center xl:gap-16">
            <div className="max-w-3xl py-4 lg:py-8">
              <div className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-xs font-extrabold text-[#143967] shadow-lg">
                <BadgeCheck className="h-4 w-4 text-[#df9e20]" />
                UGC-entitled university options
              </div>

              <h1 className="mt-6 max-w-3xl font-display text-[2.8rem] font-extrabold leading-[1.03] tracking-[-0.055em] sm:text-5xl lg:text-[4rem]">
                Online {p.name} <span className="text-[#ffc23f]">({p.code})</span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
                {p.overview}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
                  <Clock3 className="h-4 w-4 text-[#ffc23f]" />
                  {p.durationYears} years · {p.semesters} semesters
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
                  <GraduationCap className="h-4 w-4 text-[#ffc23f]" />
                  {p.level} degree
                </span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-xl bg-[#ffc23f] px-6 font-extrabold text-[#11243b] shadow-[0_16px_34px_-16px_rgba(255,194,63,0.75)] hover:bg-[#ffb819]"
                >
                  <Link to="/contact">
                    Get course brochure
                    <Download className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl border-white/30 bg-white/5 px-6 font-bold text-white hover:bg-white/15 hover:text-white"
                >
                  <a href="#universities">Compare universities</a>
                </Button>
              </div>

              <dl className="mt-9 grid max-w-2xl grid-cols-2 gap-x-4 gap-y-6 border-t border-white/15 pt-7 sm:grid-cols-4">
                {[
                  [offers.length.toString(), "University options"],
                  [formatINR(startingFee), "Fees from"],
                  [formatINR(startingEmi), "Monthly EMI from"],
                  [averageRating, "Avg. rating"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="font-display text-xl font-extrabold text-white">{value}</dt>
                    <dd className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/50">
                      {label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <LeadForm
              compact
              defaultProgram={p.name}
              title={`Plan your online ${p.code}`}
              description="Get an eligibility check, fee comparison and personalised university shortlist."
              className="border-0 bg-white p-6 text-card-foreground shadow-[0_28px_70px_-28px_rgba(0,0,0,0.55)] md:p-7"
            />
          </div>
        </div>
      </section>

      <nav
        className="sticky top-16 z-40 border-b border-[#dfe4ea] bg-white/95 shadow-sm backdrop-blur"
        aria-label="Program page sections"
      >
        <div className="container-page flex gap-1 overflow-x-auto py-2 [scrollbar-width:none]">
          {pageNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-lg px-4 py-2 text-xs font-bold text-[#5c6777] transition hover:bg-[#edf4ff] hover:text-[#155cb6]"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <section
        id="overview"
        className="scroll-mt-32 border-b border-[#e5e7e8] bg-white py-16 lg:py-20"
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
                className="rounded-[1.5rem] border border-[#e2e6e9] bg-[#fbfcfd] p-6 transition hover:-translate-y-1 hover:shadow-[0_20px_45px_-30px_rgba(12,39,71,0.5)]"
              >
                <span
                  className={`${feature.color} flex h-12 w-12 items-center justify-center rounded-2xl`}
                >
                  <feature.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-extrabold tracking-[-0.03em]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#67717f]">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="universities" className="scroll-mt-32 bg-[#f3f7fb] py-16 lg:py-20">
        <div className="container-page">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Compare your options"
              title={`Universities offering online ${p.code}`}
              description="Compare recognition, total fees, monthly EMI and learner ratings before you shortlist."
            />
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#cfe1f5] bg-white px-4 py-2 text-xs font-extrabold text-[#155cb6]">
              <Sparkles className="h-4 w-4" /> Sorted by lowest total fee
            </span>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {offers.map(({ university, program }, index) => (
              <article
                key={university.slug}
                className="group rounded-[1.55rem] border border-[#dce3e9] bg-white p-5 shadow-[0_12px_35px_-30px_rgba(12,39,71,0.45)] transition hover:-translate-y-0.5 hover:border-[#a9c8ea] hover:shadow-[0_22px_48px_-30px_rgba(18,74,140,0.48)] sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#e4e8eb] bg-[#fafbfc]">
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
                      <p className="mt-1 text-xs text-[#77808d]">
                        {university.city} · NAAC {university.naacGrade}
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-[#fff7df] px-2.5 py-1.5 text-xs font-extrabold text-[#8c6811]">
                    <Star className="h-3.5 w-3.5 fill-[#f2b72d] text-[#f2b72d]" />
                    {university.rating}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-[#f7f9fb] p-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#89919c]">
                      Total program fee
                    </p>
                    <p className="mt-1 font-display text-xl font-extrabold">
                      {formatINR(program.totalFee)}
                    </p>
                  </div>
                  <div className="border-l border-[#dfe4e9] pl-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#89919c]">
                      EMI from
                    </p>
                    <p className="mt-1 font-display text-xl font-extrabold text-[#155cb6]">
                      {formatINR(program.emiPerMonth)}
                      <span className="text-xs font-semibold text-[#7f8996]">/mo</span>
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {university.approvals.slice(0, 2).map((approval) => (
                      <span
                        key={approval}
                        className="rounded-full border border-[#dce3e9] px-2.5 py-1 text-[10px] font-bold text-[#606a78]"
                      >
                        {approval}
                      </span>
                    ))}
                  </div>
                  <Link
                    to="/universities/$universitySlug/$programSlug"
                    params={{ universitySlug: university.slug, programSlug: p.slug }}
                    className="inline-flex shrink-0 items-center text-xs font-extrabold text-[#155cb6]"
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

      <section id="curriculum" className="scroll-mt-32 bg-white py-16 lg:py-20">
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
                  className="mb-3 rounded-2xl border border-[#e0e5e9] bg-[#fbfcfd] px-5 data-[state=open]:border-[#b8d0eb] data-[state=open]:bg-[#f5f9ff]"
                >
                  <AccordionTrigger className="py-5 font-display text-base font-extrabold hover:no-underline">
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e4effc] text-xs text-[#155cb6]">
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
                          className="flex items-start gap-2 rounded-xl bg-white px-3 py-2.5 text-sm text-[#566272]"
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
            <div className="overflow-hidden rounded-[1.75rem] bg-[#08213d] text-white shadow-[0_28px_60px_-32px_rgba(8,33,61,0.68)]">
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

      <section id="specialisations" className="scroll-mt-32 bg-[#0b2038] py-16 text-white lg:py-20">
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

      <section id="eligibility" className="scroll-mt-32 bg-[#fbfaf7] py-16 lg:py-20">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.75rem] border border-[#e0e4e6] bg-white p-7 md:p-9">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf3ff] text-[#155cb6]">
              <GraduationCap className="h-5 w-5" />
            </span>
            <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.16em] text-[#e96e22]">
              Eligibility criteria
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.045em]">
              Can you apply?
            </h2>
            <p className="mt-5 text-base leading-8 text-[#596573]">{p.eligibility}</p>
            <ul className="mt-6 space-y-3 text-sm text-[#4f5b69]">
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

          <div className="rounded-[1.75rem] bg-[#fff1e7] p-7 md:p-9">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#e96e22]">
              <Medal className="h-5 w-5" />
            </span>
            <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.16em] text-[#e96e22]">
              Why this program
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.045em]">
              Designed for forward motion
            </h2>
            <p className="mt-5 text-base leading-8 text-[#596573]">
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

      <section className="bg-white py-16 lg:py-20">
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
                className="relative rounded-[1.4rem] border border-[#e1e5e8] bg-[#fafbfc] p-5"
              >
                <span className="font-display text-3xl font-extrabold text-[#c7d9ee]">
                  {number}
                </span>
                <h3 className="mt-5 font-display text-base font-extrabold">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#6c7683]">{description}</p>
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

      <section id="careers" className="scroll-mt-32 bg-[#f0f5fa] py-16 lg:py-20">
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
                className="flex items-center gap-4 rounded-2xl border border-[#dbe3ea] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#a9c8ea] hover:shadow-lg"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf4ff] text-[#155cb6]">
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

      <section id="faqs" className="scroll-mt-32 bg-white py-16 lg:py-20">
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
                className="rounded-2xl border border-[#e0e5e9] px-5"
              >
                <AccordionTrigger className="py-5 text-left font-display text-base font-extrabold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-7 text-[#647080]">
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
        className={`mt-3 font-display text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl ${dark ? "text-white" : "text-[#121a28]"}`}
      >
        {title}
      </h2>
      <p
        className={`mt-4 max-w-2xl text-base leading-7 ${dark ? "text-white/60" : "text-[#66717e]"}`}
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
    <div className="rounded-2xl bg-white/75 p-4">
      <p className="font-display text-xl font-extrabold text-[#17253a]">{value}</p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#78818c]">
        {label}
      </p>
    </div>
  );
}
