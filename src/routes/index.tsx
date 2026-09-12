import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  Clock3,
  Code2,
  GraduationCap,
  HeartPulse,
  IndianRupee,
  Laptop2,
  Lightbulb,
  Megaphone,
  MoonStar,
  PlayCircle,
  Search,
  Send,
  ShieldCheck,
  Target,
  TimerReset,
  Users,
  WalletCards,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversityLogo } from "@/components/site/university-logo";
import heroImage from "@/assets/program-hero.webp";
import {
  universities,
  programCatalog,
  getSpecialisationCount,
  getTotalProgramCount,
  universitiesOfferingProgram,
  verifiedUniversitiesOfferingProgram,
} from "@/data/universities";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Find the Right Online Degree in India | DekhoCampus Online",
      },
      {
        name: "description",
        content:
          "Explore online MBA, BBA, MCA, BCA and other degrees by university, source status, fees where verified and specialisation. Get a private, free shortlist.",
      },
      {
        property: "og:title",
        content: "Find the online degree built around your ambition",
      },
      {
        property: "og:description",
        content:
          "Clear source status, ungated comparison and optional expert counselling from DekhoCampus Online.",
      },
    ],
  }),
  component: HomePage,
});

const domainCards = [
  {
    title: "AI, Data & Analytics",
    description: "Data science, AI, business analytics and emerging technology.",
    icon: BrainCircuit,
    codes: ["MBA", "MCA"],
    background: "bg-card",
    iconBackground: "bg-[#edf2ff]",
  },
  {
    title: "Tech & Software",
    description: "Computer applications, cloud, cyber security and full-stack.",
    icon: Code2,
    codes: ["MCA", "BCA"],
    background: "bg-card",
    iconBackground: "bg-[#edf2ff]",
  },
  {
    title: "Finance & Banking",
    description: "Accounting, finance, fintech and banking leadership.",
    icon: WalletCards,
    codes: ["MBA", "B.Com"],
    background: "bg-card",
    iconBackground: "bg-[#edf2ff]",
  },
  {
    title: "Marketing & Digital",
    description: "Brand, performance marketing, strategy and communication.",
    icon: Megaphone,
    codes: ["MBA", "BBA"],
    background: "bg-card",
    iconBackground: "bg-[#edf2ff]",
  },
  {
    title: "Business & Entrepreneurship",
    description: "Leadership, operations, startups and general management.",
    icon: BriefcaseBusiness,
    codes: ["MBA", "BBA"],
    background: "bg-card",
    iconBackground: "bg-[#edf2ff]",
  },
  {
    title: "Non-clinical Healthcare Operations",
    description:
      "Management-focused operations and administration; verify prohibited-domain rules.",
    icon: HeartPulse,
    codes: ["MBA"],
    background: "bg-card",
    iconBackground: "bg-[#edf2ff]",
  },
];

const studyBenefits = [
  {
    title: "Plan around work",
    description: "Compare the live-class timing each university actually publishes.",
    icon: PlayCircle,
  },
  {
    title: "Recordings where offered",
    description: "Confirm recording access, expiry and attendance rules before enrolling.",
    icon: BookOpenCheck,
  },
  {
    title: "Assessment clarity",
    description: "Check exam windows, proctoring, centres and resit rules upfront.",
    icon: TimerReset,
  },
  {
    title: "Zero commute",
    description: "Study without a daily campus journey, subject to device and connectivity needs.",
    icon: Laptop2,
  },
];

const guides = [
  {
    title: "Is this online degree valid?",
    description:
      "A practical checklist to verify UGC entitlement, accreditation and university claims.",
    meta: "Verification checklist",
    icon: ShieldCheck,
  },
  {
    title: "How to compare online universities",
    description:
      "The key questions to ask about fees, live classes, exams, placements and learner support.",
    meta: "Decision framework",
    icon: BarChart3,
  },
  {
    title: "Choosing the right specialisation",
    description: "A career-first framework for selecting a specialisation that matches your goals.",
    meta: "Career worksheet",
    icon: Lightbulb,
  },
];

const heroGoals = [
  { label: "Career growth", value: "career-growth", icon: BriefcaseBusiness },
  { label: "Career switch", value: "career-switch", icon: Target },
  { label: "Lower fees", value: "lower-fees", icon: IndianRupee },
  { label: "Flexible study", value: "flexible-study", icon: Clock3 },
] as const;

const heroRoles = ["Student", "Parent", "Professional"] as const;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function HomePage() {
  const totalPrograms = getTotalProgramCount();
  const totalSpecialisations = getSpecialisationCount();
  const [heroGoal, setHeroGoal] = useState<(typeof heroGoals)[number]["label"]>("Career growth");
  const [heroRole, setHeroRole] = useState<(typeof heroRoles)[number]>("Student");
  const selectedHeroGoal = heroGoals.find((goal) => goal.label === heroGoal)!;
  const catalogStats = [
    { value: universities.length.toString(), label: "university profiles", icon: Building2 },
    { value: programCatalog.length.toString(), label: "degree pathways", icon: GraduationCap },
    { value: totalPrograms.toString(), label: "university-program options", icon: BookOpenCheck },
    { value: totalSpecialisations.toString(), label: "specialisations mapped", icon: Target },
  ];

  return (
    <div className="overflow-hidden bg-background text-foreground">
      <section className="border-b border-border bg-background">
        <div className="container-page grid gap-10 py-10 sm:py-12 lg:min-h-[640px] lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-14 xl:gap-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border-l-4 border-[#f47b25] pl-3 text-[11px] font-extrabold uppercase tracking-[0.17em] text-[#a94300] dark:text-[#ffad70]">
              <GraduationCap className="h-3.5 w-3.5 text-foreground" />
              Independent online-degree discovery
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#647083] dark:text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full bg-[#14845f]" />
              Compare in private. Talk to a counsellor when you are ready.
            </div>

            <h1 className="mt-6 max-w-3xl font-display text-[2.55rem] font-black leading-[1.03] tracking-[-0.052em] text-[#131720] dark:text-foreground sm:text-6xl lg:mt-7 lg:text-[3.9rem] lg:leading-[1]">
              Find the online degree for your{" "}
              <span className="mt-2 block w-fit text-[#325dd2] dark:text-[#8cb0ff]">
                next career move.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-[#536176] dark:text-muted-foreground sm:text-lg sm:leading-8">
              Compare online courses, university evidence and verified fees in plain language.
              Browse freely, then ask a person when you need help.
            </p>

            <form action="/search" className="mt-6 max-w-2xl" role="search">
              <div className="flex min-h-14 items-center gap-3 rounded-xl border border-input bg-card p-1.5 pl-4 shadow-card dark:border-border sm:pl-5">
                <Search className="h-5 w-5 shrink-0 text-[#7d899b]" />
                <input
                  name="q"
                  aria-label="Search universities or programs"
                  placeholder="Search MBA, BCA or a university..."
                  className="h-11 min-w-0 flex-1 rounded-md bg-transparent text-sm text-[#192333] outline-none placeholder:text-[#667386] focus-visible:ring-2 focus-visible:ring-[#0d5cad] focus-visible:ring-offset-2 dark:text-foreground dark:placeholder:text-muted-foreground sm:text-base"
                />
                <button
                  type="submit"
                  aria-label="Search the degree catalogue"
                  className="inline-flex h-12 min-w-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#f47b25] px-3 text-sm font-extrabold text-[#111827] transition-colors hover:bg-[#d85f12] sm:min-w-28 sm:px-5"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </form>

            <div className="mt-3 flex max-w-2xl flex-wrap items-center gap-2 text-xs text-[#788395] dark:text-muted-foreground">
              <span className="flex items-center gap-1.5 font-bold">
                <Zap className="h-3.5 w-3.5 text-[#ff762b]" /> Try:
              </span>
              {[
                { label: "Explore online MBA", query: "MBA" },
                { label: "Compare MCA fees", query: "MCA" },
                { label: "Data science options", query: "data science" },
              ].map((prompt) => (
                <Link
                  key={prompt.label}
                  to="/search"
                  search={{ q: prompt.query }}
                  className="inline-flex min-h-9 items-center rounded-lg border border-border bg-card px-3 py-1.5 font-semibold transition-colors hover:border-[#f47b25] hover:text-foreground"
                >
                  {prompt.label}
                </Link>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-[#5f6b7d] dark:text-muted-foreground">
              {["Fee source status", "Exact-offering checks", "Free comparison"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#208960]" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-[470px]">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <div className="relative h-[230px] overflow-hidden sm:h-[260px]">
                <img
                  src={heroImage}
                  alt="Professionals planning their next online degree"
                  width={1280}
                  height={720}
                  decoding="async"
                  fetchPriority="high"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-[#101923]/55" />
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-lg bg-[#131720] px-3 py-2 text-[11px] font-extrabold text-white">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#8be2bb]" />
                  {universities.length} university profiles
                </div>
                <p className="absolute bottom-5 left-5 right-5 font-display text-xl font-extrabold leading-snug text-white">
                  Ambition looks different for everyone. Your shortlist should too.
                </p>
              </div>

              <div className="border-t border-border bg-card p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#a94300]">
                      <Target className="h-3.5 w-3.5" /> A simple starting point
                    </p>
                    <h2 className="mt-1.5 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">
                      What matters most right now?
                    </h2>
                  </div>
                  <span className="rounded-md bg-[#e8f6ef] px-2.5 py-1.5 text-[10px] font-extrabold text-[#166b4e] dark:bg-[#123b30] dark:text-[#77ddb4]">
                    Free
                  </span>
                </div>

                <fieldset className="mt-4 grid grid-cols-2 gap-2">
                  <legend className="sr-only">Select your goal</legend>
                  {heroGoals.map((goal) => {
                    const selected = heroGoal === goal.label;
                    return (
                      <button
                        key={goal.label}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setHeroGoal(goal.label)}
                        className={`flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-left text-[11px] font-extrabold transition-colors ${
                          selected
                            ? "border-[#325dd2] bg-[#edf2ff] text-[#2449ad] dark:bg-[#263653] dark:text-[#b9ceff]"
                            : "border-border bg-background text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <goal.icon className="h-4 w-4 shrink-0" />
                        {goal.label}
                      </button>
                    );
                  })}
                </fieldset>

                <div className="mt-4">
                  <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
                    I am a
                  </p>
                  <div className="grid grid-cols-3 rounded-lg bg-secondary p-1">
                    {heroRoles.map((role) => (
                      <button
                        key={role}
                        type="button"
                        aria-pressed={heroRole === role}
                        onClick={() => setHeroRole(role)}
                        className={`h-10 rounded-lg text-[10px] font-extrabold transition sm:text-[11px] ${
                          heroRole === role
                            ? "bg-card text-[#1768cc] shadow-sm dark:text-[#70b3ff]"
                            : "text-muted-foreground"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                  <Button
                    asChild
                    size="lg"
                    className="mt-3 w-full bg-[#f47b25] font-extrabold text-[#111827] hover:bg-[#d85f12]"
                  >
                    <Link
                      to="/finder"
                      search={{
                        goal: selectedHeroGoal.value,
                        audience: heroRole.toLowerCase() as Lowercase<typeof heroRole>,
                      }}
                    >
                      View suitable courses <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <p className="mt-3 text-center text-[10px] font-semibold text-muted-foreground">
                  Takes about 60 seconds · No personal details required
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background py-8 dark:bg-[#0a1823]">
        <div className="container-page grid gap-5 lg:grid-cols-[0.72fr_2.28fr] lg:items-center">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#a94300]">
              One clear next step
            </p>
            <h2 className="mt-1.5 font-display text-xl font-extrabold tracking-[-0.035em]">
              Start with what you know.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                icon: BookOpenCheck,
                title: "I know my course",
                text: "Browse MBA, BBA, MCA and more.",
                to: "/programs" as const,
              },
              {
                icon: Building2,
                title: "I know a university",
                text: "Check recognition, fees and programs.",
                to: "/universities" as const,
              },
              {
                icon: Target,
                title: "I need help deciding",
                text: "Answer four questions and get matched.",
                to: "/finder" as const,
              },
            ].map((step) => (
              <Link
                key={step.title}
                to={step.to}
                className="group flex min-h-24 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 transition hover:-translate-y-0.5 hover:border-[#f4a46c] hover:shadow-md"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-[#1768cc] dark:text-[#70b3ff]">
                  <step.icon className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-sm font-extrabold">
                    {step.title}
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-4 text-muted-foreground">
                    {step.text}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20 lg:py-28">
        <SectionIntro
          eyebrow="Explore courses"
          title="Choose what you want to study."
          description="Explore by career area or compare the most popular online degree types directly."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {domainCards.map((domain) => (
            <article
              key={domain.title}
              className={`${domain.background} group rounded-xl border border-border p-6 transition-colors hover:border-[#9bb5f1] dark:bg-card`}
            >
              <div
                className={`${domain.iconBackground} flex h-12 w-12 items-center justify-center rounded-2xl text-[#17202d] dark:text-[#17202d]`}
              >
                <domain.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold tracking-[-0.035em]">
                {domain.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#656a64] dark:text-muted-foreground">
                {domain.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {domain.codes.map((code) => (
                  <span
                    key={code}
                    className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-bold dark:border-border dark:bg-secondary"
                  >
                    {code}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {programCatalog.slice(0, 6).map((program) => {
            const matchingOffers = universitiesOfferingProgram(program.slug).filter(
              ({ university }) => university.profileDepth !== "directory",
            );
            const sourcedFeeOffers = verifiedUniversitiesOfferingProgram(program.slug);
            const matchingUniversities = matchingOffers
              .map(({ university }) => university)
              .slice(0, 3);
            const startingFee = sourcedFeeOffers.length
              ? Math.min(...sourcedFeeOffers.map(({ program: offer }) => offer.totalFee))
              : null;

            return (
              <Link
                key={program.slug}
                to="/programs/$programSlug"
                params={{ programSlug: program.slug }}
                className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-[#9bb5f1]"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-[#eaf3ff] px-3 py-1.5 text-xs font-extrabold text-[#0d5cad]">
                    {program.level}
                  </span>
                  <span className="text-xs font-semibold text-[#656a64] dark:text-muted-foreground">
                    {program.durationYears} years
                  </span>
                </div>

                <div className="mt-5 flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#a94300]">
                      {program.code}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-bold leading-snug tracking-[-0.035em]">
                      {program.name}
                    </h3>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dfe3dc] transition group-hover:border-[#0d5cad] group-hover:bg-[#0d5cad] group-hover:text-white">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 border-y border-[#eceeea] py-4 dark:border-border">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#656a64]">
                      {startingFee ? "Sourced from" : "Fee status"}
                    </p>
                    <p className="mt-1 font-display text-base font-bold">
                      {startingFee ? formatCurrency(startingFee) : "Needs source review"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#656a64]">
                      Options
                    </p>
                    <p className="mt-1 font-display text-base font-bold">
                      {program.specialisations.length} specialisations
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-4">
                  <div className="flex -space-x-2">
                    {matchingUniversities.map((university) => (
                      <span
                        key={university.slug}
                        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#f7f7f4] shadow-sm dark:border-card dark:bg-secondary"
                        title={university.shortName}
                      >
                        <UniversityLogo university={university} size="sm" />
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-[#6d726c] dark:text-muted-foreground">
                    {matchingOffers.length > 0
                      ? `${matchingOffers.length} reviewed profiles`
                      : "Explore the course guide"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-[#101713] py-20 text-white lg:py-28">
        <div className="container-page">
          <SectionIntro
            dark
            eyebrow="Admission verification"
            title="A university name is only the first check."
            description="Confirm the exact programme, Online mode and admission session on UGC-DEB. A directory listing never substitutes for current programme-level evidence."
          />

          <div className="relative mt-12 grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
            <DegreeCard
              label="Step 1"
              title="Check the institution"
              points={[
                "Match the legal university name",
                "Use the official university domain",
                "Review current regulator notices",
              ]}
              icon={Building2}
            />

            <div className="relative z-10 flex items-center justify-center lg:-mx-3">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border-8 border-[#101713] bg-[#a94300] text-white shadow-xl">
                <ArrowRight className="h-6 w-6" />
              </span>
            </div>

            <DegreeCard
              featured
              label="Step 2"
              title="Check the exact offering"
              points={[
                "Exact programme nomenclature",
                "Online—not ODL—mode",
                "Your academic session and status",
              ]}
              icon={Laptop2}
            />
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {[
              "Academic equivalence depends on UGC rules and the exact entitled offering.",
              "Job and higher-study eligibility remains subject to the receiving organisation’s rules.",
              "International use may require a separate evaluation by the receiving institution or authority.",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-4 text-sm leading-6 text-white/75"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#ff9a50]" />
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="https://deb.ugc.ac.in/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#f47b25] px-5 text-sm font-extrabold text-[#111827] transition-colors hover:bg-[#d85f12]"
            >
              Open official UGC-DEB portal
            </a>
            <Link
              to="/methodology"
              hash="admission-safety"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 bg-white/[0.06] px-5 text-sm font-extrabold text-white transition hover:bg-white/[0.12]"
            >
              View the four-step safety checklist
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-20 lg:py-28">
        <SectionIntro
          eyebrow="University directory"
          title="Compare familiar names with visible data status."
          description="Research-complete and directory-stage profiles are labelled separately, so missing evidence is never disguised as certainty."
          action={
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-[#ccd3ca] bg-white font-bold dark:border-border dark:bg-card"
            >
              <Link to="/universities">
                View all universities
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          }
        />

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {universities.slice(0, 12).map((university) => (
            <Link
              key={university.slug}
              to="/universities/$universitySlug"
              params={{ universitySlug: university.slug }}
              className="group flex min-h-44 flex-col items-center justify-center rounded-xl border border-border bg-card p-5 text-center transition-colors hover:border-[#9bb5f1]"
            >
              <UniversityLogo university={university} size="lg" />
              <h3 className="mt-4 line-clamp-2 text-sm font-bold">{university.shortName}</h3>
              <p className="mt-1 text-[11px] text-[#656a64] dark:text-muted-foreground">
                {university.programs.length} courses
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl bg-[#325dd2] text-white">
          <div className="grid gap-8 p-7 md:grid-cols-[1fr_auto] md:items-center md:p-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ffe1cb]">
                Course shortlist
              </p>
              <h2 className="mt-3 max-w-3xl font-display text-3xl font-extrabold tracking-[-0.045em] md:text-4xl">
                So, where should you actually enrol?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85 md:text-base">
                Answer four clear questions. We will organise relevant catalogue options around your
                qualification, budget and study preference.
              </p>
            </div>

            <Button
              asChild
              size="lg"
              className="bg-[#f47b25] font-bold text-[#111827] hover:bg-[#d85f12]"
            >
              <Link to="/finder">
                Start the course finder
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-[#eff4f8] py-20 dark:bg-secondary/35 lg:py-28">
        <div className="container-page">
          <SectionIntro
            eyebrow="Cost clarity"
            title="Compare the whole cost—not a headline EMI."
            description="Online study may remove some campus expenses, but the real decision starts with a source-checked total and every compulsory charge."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-7 md:p-9">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#646963]">
                    Potentially avoided
                  </p>
                  <p className="mt-3 max-w-sm font-display text-3xl font-extrabold tracking-[-0.045em]">
                    Costs outside the degree
                  </p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1f1ee]">
                  <Building2 className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  "Hostel or relocation",
                  "Daily campus commute",
                  "Campus living costs",
                  "A full-time career pause",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex min-h-16 items-center gap-3 rounded-2xl bg-[#f3f5f1] p-4 text-sm font-bold dark:bg-secondary"
                  >
                    <Check className="h-4 w-4 shrink-0 text-[#168258]" /> {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-[#325dd2] p-7 text-white md:p-9">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/85">
                    Always verify
                  </p>
                  <p className="mt-3 max-w-sm font-display text-3xl font-extrabold tracking-[-0.045em]">
                    The full payable amount
                  </p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <Laptop2 className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-8 rounded-xl border border-white/20 bg-[#2449ad] p-5">
                <p className="font-display text-2xl font-extrabold tracking-[-0.04em] text-[#ffb078]">
                  No synthetic fee estimates
                </p>
                <p className="mt-1 text-sm leading-6 text-white/90">
                  DekhoCampus shows a fee only when the offering is marked source-checked. EMI is
                  illustrative until a university or lender confirms eligibility and terms.
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Total tuition",
                  "Registration and exam charges",
                  "Financing cost and lender terms",
                  "Device and connectivity needs",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-white/85">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ff9a50]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#131720] py-20 text-white lg:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div>
            <SectionIntro
              dark
              eyebrow="Flexible learning"
              title="Build a schedule you can sustain."
              description="Online formats can fit around work and family, but live classes, recordings and exams still vary by university."
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {studyBenefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.055] p-5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#a94300] text-white">
                    <benefit.icon className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/60">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-[#252b36] p-6 md:p-9">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold">One possible study plan</p>
              <span className="rounded-full bg-[#a94300] px-3 py-1 text-xs font-bold">
                Example only
              </span>
            </div>

            <div className="relative mt-14">
              <div className="absolute left-0 right-0 top-4 h-1 rounded-full bg-white/10" />
              <div className="absolute left-[18%] right-[12%] top-4 h-1 rounded-full bg-[#f47b25]" />

              <div className="relative grid grid-cols-4 text-center">
                {[
                  { time: "6 AM", label: "Live batch", icon: Zap },
                  { time: "12 PM", label: "Recorded lesson", icon: PlayCircle },
                  { time: "6 PM", label: "Doubt session", icon: Users },
                  { time: "10 PM", label: "Replay", icon: MoonStar },
                ].map((slot) => (
                  <div key={slot.time} className="px-1">
                    <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border-4 border-[#101713] bg-white text-[#0d5cad]">
                      <slot.icon className="h-3.5 w-3.5" />
                    </span>
                    <p className="mt-4 text-xs font-bold">{slot.time}</p>
                    <p className="mt-1 text-[11px] leading-4 text-white/50">{slot.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 rounded-2xl bg-white/[0.06] p-5">
              <div className="flex items-center gap-3">
                <Clock3 className="h-5 w-5 text-[#ff9a50]" />
                <p className="font-display text-lg font-bold">Ask before you enrol</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Confirm the actual weekly workload, mandatory attendance, recording access and
                assessment calendar for your exact programme.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-20 lg:py-28">
        <SectionIntro
          eyebrow="Transparent coverage"
          title="A catalogue you can inspect, not a promise you must trust."
          description="Every figure below comes from the university and course information currently available on this platform."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {catalogStats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-6">
              <stat.icon className="h-5 w-5 text-[#a94300]" />
              <p className="mt-7 font-display text-4xl font-extrabold tracking-[-0.055em] text-[#325dd2] dark:text-[#8cb0ff]">
                {stat.value}
              </p>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#686d67] dark:text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-border bg-card px-6 py-5">
          <p className="text-center text-xs font-semibold leading-5 text-[#656a64] dark:text-muted-foreground">
            Catalogue information can change by intake. Reconfirm entitlement, fees and admission
            dates with the university before paying.
          </p>
        </div>
      </section>

      <section className="bg-[#f2f5f1] py-20 dark:bg-secondary/35 lg:py-28">
        <div className="container-page">
          <SectionIntro
            eyebrow="Decision guides"
            title="Guides you can save and discuss with family."
            description="Simple, practical resources that make online-degree decisions easier."
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {guides.map((guide, index) => (
              <article
                key={guide.title}
                className="group overflow-hidden rounded-xl border border-border bg-card"
              >
                <div className="relative h-52 bg-[#edf2ff] p-6 dark:bg-[#263653]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-card">
                    <guide.icon className="h-5 w-5 text-[#0d5cad]" />
                  </span>
                  <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-black/5 bg-white p-4 dark:border-border dark:bg-card">
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#a94300]">
                      DekhoCampus guide
                    </p>
                    <p className="mt-1 font-display text-base font-bold">{guide.meta}</p>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-display text-xl font-bold tracking-[-0.035em]">
                    {guide.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#6c716b] dark:text-muted-foreground">
                    {guide.description}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-6 w-full rounded-xl border-[#ccd3ca] font-bold"
                  >
                    <Link
                      to={
                        index === 0 ? "/methodology" : index === 1 ? "/compare" : "/specialisations"
                      }
                    >
                      Open this guide
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20 lg:py-28">
        <div className="overflow-hidden rounded-2xl bg-[#325dd2] px-6 py-12 text-center text-white md:px-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#f47b25]">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h2 className="mt-6 font-display text-3xl font-extrabold leading-tight tracking-[-0.045em] md:text-5xl">
              Make your next degree decision with clarity.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/85">
              Compare programs, verify university claims, understand fees and ask for human help
              only when you need it.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-[#f47b25] font-bold text-[#111827] hover:bg-[#d85f12]"
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
                className="rounded-xl border-white/25 bg-white/5 font-bold text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/universities">Explore universities</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3 text-xs font-semibold text-white/85">
              {[
                "Free guidance",
                "No result gate",
                "Human counsellors",
                "Visible source status",
              ].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#ff9a50]" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
  action,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <p
          className={`text-xs font-extrabold uppercase tracking-[0.18em] ${
            dark ? "text-[#ff9a50]" : "text-[#a94300]"
          }`}
        >
          {eyebrow}
        </p>
        <h2
          className={`mt-3 font-display text-3xl font-extrabold leading-tight tracking-[-0.045em] md:text-5xl ${
            dark ? "text-white" : "text-[#171a17] dark:text-foreground"
          }`}
        >
          {title}
        </h2>
        <p
          className={`mt-4 max-w-2xl text-base leading-7 ${
            dark ? "text-white/60" : "text-[#696e68] dark:text-muted-foreground"
          }`}
        >
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function DegreeCard({
  label,
  title,
  points,
  icon: Icon,
  featured = false,
}: {
  label: string;
  title: string;
  points: string[];
  icon: typeof Building2;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-[2rem] border p-7 md:p-9 ${
        featured
          ? "border-[#f47a20]/45 bg-[#9f470d] text-white"
          : "border-white/10 bg-white/[0.055] text-white"
      }`}
    >
      <div className="flex items-start justify-between gap-5">
        <div>
          <p
            className={`text-xs font-extrabold uppercase tracking-[0.18em] ${
              featured ? "text-white/90" : "text-[#ff9a50]"
            }`}
          >
            {label}
          </p>
          <h3 className="mt-3 font-display text-2xl font-extrabold tracking-[-0.04em]">{title}</h3>
        </div>
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            featured ? "bg-white/15" : "bg-white/10"
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-black/10 p-5">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5" />
          <span className="font-bold">
            {featured ? "Programme-level evidence" : "Institution identity"}
          </span>
        </div>
      </div>

      <ul className="mt-6 space-y-3">
        {points.map((point) => (
          <li
            key={point}
            className={`flex items-center gap-3 text-sm ${
              featured ? "text-white/90" : "text-white/75"
            }`}
          >
            <Check className="h-4 w-4 shrink-0" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}
