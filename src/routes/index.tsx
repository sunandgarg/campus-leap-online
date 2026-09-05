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
  FileCheck2,
  GraduationCap,
  HeartPulse,
  IndianRupee,
  Laptop2,
  Lightbulb,
  Megaphone,
  MoonStar,
  Newspaper,
  PlayCircle,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  TimerReset,
  Users,
  WalletCards,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversityLogo } from "@/components/site/university-logo";
import heroImage from "@/assets/program-hero.jpg";
import {
  universities,
  programCatalog,
  getSpecialisationCount,
  getTotalProgramCount,
  universitiesOfferingProgram,
} from "@/data/universities";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Find Your Best Online Degree from India's Top Universities | DekhoCampus Online",
      },
      {
        name: "description",
        content:
          "Compare UGC-entitled online MBA, BBA, MCA, BCA and other degrees by university, fees, specialisations and career outcomes. Get a free personalised shortlist.",
      },
      {
        property: "og:title",
        content: "Find the online degree built around your ambition",
      },
      {
        property: "og:description",
        content:
          "Transparent fees, verified universities and free expert counselling from DekhoCampus Online.",
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
    background: "bg-[#e9f2ff]",
    iconBackground: "bg-[#d4e6ff]",
  },
  {
    title: "Tech & Software",
    description: "Computer applications, cloud, cyber security and full-stack.",
    icon: Code2,
    codes: ["MCA", "BCA"],
    background: "bg-[#e9fbf5]",
    iconBackground: "bg-[#cdf3e6]",
  },
  {
    title: "Finance & Banking",
    description: "Accounting, finance, fintech and banking leadership.",
    icon: WalletCards,
    codes: ["MBA", "B.Com"],
    background: "bg-[#fff5df]",
    iconBackground: "bg-[#ffe8b4]",
  },
  {
    title: "Marketing & Digital",
    description: "Brand, performance marketing, strategy and communication.",
    icon: Megaphone,
    codes: ["MBA", "BBA"],
    background: "bg-[#fff0eb]",
    iconBackground: "bg-[#ffd9cc]",
  },
  {
    title: "Business & Entrepreneurship",
    description: "Leadership, operations, startups and general management.",
    icon: BriefcaseBusiness,
    codes: ["MBA", "BBA"],
    background: "bg-[#f1edff]",
    iconBackground: "bg-[#ddd4ff]",
  },
  {
    title: "Healthcare Management",
    description: "Healthcare operations, hospital administration and leadership.",
    icon: HeartPulse,
    codes: ["MBA"],
    background: "bg-[#ffedf3]",
    iconBackground: "bg-[#ffd6e4]",
  },
];

const studyBenefits = [
  {
    title: "Live at your hour",
    description: "Choose morning, evening or weekend learning windows.",
    icon: PlayCircle,
  },
  {
    title: "Recorded lectures",
    description: "Pause, rewind and revisit difficult concepts anytime.",
    icon: BookOpenCheck,
  },
  {
    title: "Flexible exam windows",
    description: "Plan assessments around work and personal commitments.",
    icon: TimerReset,
  },
  {
    title: "Zero commute",
    description: "Your classroom works wherever your laptop does.",
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
  { label: "Online degree", icon: Laptop2 },
  { label: "Compare universities", icon: Building2 },
  { label: "Fees & EMI", icon: IndianRupee },
  { label: "Career clarity", icon: Target },
  { label: "Admission help", icon: GraduationCap },
];

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
  const [heroGoal, setHeroGoal] = useState(heroGoals[0].label);
  const [heroRole, setHeroRole] = useState<(typeof heroRoles)[number]>("Student");
  const catalogStats = [
    { value: universities.length.toString(), label: "university profiles", icon: Building2 },
    { value: programCatalog.length.toString(), label: "degree pathways", icon: GraduationCap },
    { value: totalPrograms.toString(), label: "university-program options", icon: BookOpenCheck },
    { value: totalSpecialisations.toString(), label: "specialisations mapped", icon: Target },
  ];

  const heroShortcuts = [
    {
      label: `${universities.length}+`,
      caption: "Universities",
      icon: GraduationCap,
      to: "/universities" as const,
      className: "border-[#f1dfe2] bg-[#fff2f3]",
      iconClassName: "bg-[#ffe0df] text-[#e97367]",
    },
    {
      label: `${totalPrograms}+`,
      caption: "Programs",
      icon: BookOpenCheck,
      to: "/programs" as const,
      className: "border-[#d7eaf1] bg-[#effaff]",
      iconClassName: "bg-[#d8f1fa] text-[#1685aa]",
    },
    {
      label: `${totalSpecialisations}+`,
      caption: "Specialisations",
      icon: FileCheck2,
      to: "/programs" as const,
      className: "border-[#e7e0f4] bg-[#f5f1ff]",
      iconClassName: "bg-[#e8dfff] text-[#7860bc]",
    },
    {
      label: "Application",
      caption: "Support",
      icon: CheckCircle2,
      to: "/contact" as const,
      className: "border-[#d4eee2] bg-[#effcf5]",
      iconClassName: "bg-[#d8f5e6] text-[#288b5c]",
    },
    {
      label: "Compare",
      caption: "Universities",
      icon: BarChart3,
      to: "/compare" as const,
      className: "border-[#efe3be] bg-[#fff9e8]",
      iconClassName: "bg-[#ffefbd] text-[#b17b12]",
    },
    {
      label: "Career",
      caption: "Guidance",
      icon: Newspaper,
      to: "/contact" as const,
      className: "border-[#d8edf0] bg-[#effcfd]",
      iconClassName: "bg-[#d8f3f5] text-[#168690]",
    },
  ];

  return (
    <div className="overflow-hidden bg-[#fbfaf7] text-[#171a17] transition-colors dark:bg-background dark:text-foreground">
      <section className="relative overflow-hidden border-b border-[#eadfd4] bg-[#fffaf2] dark:border-border dark:bg-[#081722]">
        <div
          className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(32,42,57,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(32,42,57,0.045)_1px,transparent_1px)] [background-size:52px_52px] dark:opacity-20"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-52 top-24 h-[31rem] w-[31rem] rounded-full border-[4.5rem] border-[#f7dcc7]/55 dark:border-[#f47a20]/10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-44 top-20 h-[34rem] w-[34rem] rounded-full border-[4.5rem] border-[#fee7ac]/55 dark:border-[#1768cc]/10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_48%_48%,rgba(255,255,255,0.92),transparent_34%)] dark:bg-[radial-gradient(circle_at_48%_48%,rgba(20,48,67,0.45),transparent_38%)]"
          aria-hidden="true"
        />

        <div className="container-page relative grid gap-12 py-14 lg:min-h-[720px] lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-16 xl:gap-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ffc9ac] bg-[#fff0e8]/90 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.17em] text-[#ef783b] shadow-sm backdrop-blur">
              <GraduationCap className="h-3.5 w-3.5 text-[#17202d]" />
              Built for online learners
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#647083] dark:text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full bg-[#2bc58b] shadow-[0_0_0_4px_rgba(43,197,139,0.1)]" />
              Comparison-first guidance, with human help
            </div>

            <h1 className="mt-7 max-w-3xl font-display text-[3.05rem] font-extrabold leading-[0.98] tracking-[-0.065em] text-[#0d1726] dark:text-foreground sm:text-6xl lg:text-[4.55rem]">
              An online degree for your
              <span className="relative mt-2 block w-fit text-[#2864da] dark:text-[#72b4ff]">
                next big move.
                <span className="absolute -bottom-2 left-1 h-1.5 w-[88%] -rotate-1 rounded-full bg-[#f47a20]" />
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#536176] dark:text-muted-foreground">
              Search verified universities and recognised programs, then move forward with clear
              guidance, transparent fees and human support when you need it.
            </p>

            <form action="/search" className="mt-7 max-w-2xl" role="search">
              <div className="flex items-center gap-3 rounded-full border border-white bg-white p-1.5 pl-5 shadow-[0_18px_40px_-22px_rgba(43,69,104,0.42)] ring-1 ring-[#dfe6f0] dark:border-border dark:bg-card dark:ring-border">
                <Search className="h-5 w-5 shrink-0 text-[#7d899b]" />
                <input
                  name="q"
                  aria-label="Search universities or programs"
                  placeholder="Search universities, programs or specialisations..."
                  className="h-11 min-w-0 flex-1 bg-transparent text-sm text-[#192333] outline-none placeholder:text-[#9ba5b4] dark:text-foreground sm:text-base"
                />
                <button
                  type="submit"
                  className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-[#ff762b] px-5 text-sm font-extrabold text-white shadow-[0_10px_24px_-10px_rgba(255,118,43,0.8)] transition hover:bg-[#ed651c]"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </form>

            <div className="mt-3 flex max-w-2xl flex-wrap items-center gap-2 text-[11px] text-[#788395] dark:text-muted-foreground">
              <span className="flex items-center gap-1.5 font-bold">
                <Zap className="h-3.5 w-3.5 text-[#ff762b]" /> Try:
              </span>
              {["Best online MBA?", "Compare MCA fees", "Which degree fits my career?"].map(
                (prompt) => (
                  <span
                    key={prompt}
                    className="rounded-full border border-[#e1e6ed] bg-white/75 px-2.5 py-1 dark:border-border dark:bg-card/75"
                  >
                    {prompt}
                  </span>
                ),
              )}
            </div>

            <div className="mt-6 grid max-w-[44rem] grid-cols-3 gap-2 sm:grid-cols-6">
              {heroShortcuts.map((item) => (
                <Link
                  key={`${item.label}-${item.caption}`}
                  to={item.to}
                  className={`${item.className} group flex min-h-[108px] flex-col items-center justify-center rounded-[1.35rem] border px-2 py-3 text-center transition hover:-translate-y-1 hover:shadow-lg dark:border-border dark:bg-card`}
                >
                  <span
                    className={`${item.iconClassName} flex h-10 w-10 items-center justify-center rounded-xl transition group-hover:scale-105`}
                  >
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span className="mt-2 text-xs font-extrabold leading-4 text-[#17202d] dark:text-foreground">
                    {item.label}
                  </span>
                  <span className="text-[10px] font-semibold leading-3 text-[#697486] dark:text-muted-foreground">
                    {item.caption}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[470px]">
            <div className="absolute -inset-4 rounded-[2.8rem] bg-gradient-to-br from-[#ffd6b8]/70 via-transparent to-[#c9ddff]/65 blur-2xl dark:from-[#f47a20]/15 dark:to-[#1768cc]/20" />
            <div className="relative rounded-[2.25rem] border border-white/90 bg-white/70 p-3 shadow-[0_34px_75px_-30px_rgba(31,55,83,0.58)] backdrop-blur dark:border-white/10 dark:bg-card/80">
              <div className="relative h-[330px] overflow-hidden rounded-[1.7rem] sm:h-[360px]">
                <img
                  src={heroImage}
                  alt="Professionals planning their next online degree"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101923]/75 via-transparent to-transparent" />
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#101923]/72 px-3 py-2 text-[11px] font-extrabold text-white backdrop-blur">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#8be2bb]" />
                  {universities.length} university profiles
                </div>
                <p className="absolute bottom-5 left-5 right-5 font-display text-xl font-extrabold leading-snug text-white">
                  Ambition looks different for everyone. Your shortlist should too.
                </p>
              </div>

              <div className="relative -mt-4 rounded-[1.6rem] border border-border bg-card p-5 shadow-xl sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#ef783b]">
                      <Sparkles className="h-3.5 w-3.5" /> Plan your next move
                    </p>
                    <h2 className="mt-1.5 font-display text-xl font-extrabold tracking-[-0.04em] text-foreground">
                      What matters most to you?
                    </h2>
                  </div>
                  <span className="rounded-full bg-[#e8fff5] px-2.5 py-1.5 text-[10px] font-extrabold text-[#268a68] dark:bg-[#123b30] dark:text-[#77ddb4]">
                    Free
                  </span>
                </div>

                <fieldset className="mt-4 flex flex-wrap gap-2">
                  <legend className="sr-only">Select your goal</legend>
                  {heroGoals.map((goal) => {
                    const selected = heroGoal === goal.label;
                    return (
                      <button
                        key={goal.label}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setHeroGoal(goal.label)}
                        className={`rounded-full border px-3 py-2 text-[11px] font-extrabold transition ${
                          selected
                            ? "border-[#f47a20] bg-[#fff0e6] text-[#d85e12] dark:bg-[#3a2518] dark:text-[#ffad70]"
                            : "border-border bg-background text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {goal.label}
                      </button>
                    );
                  })}
                </fieldset>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <div className="grid flex-1 grid-cols-3 rounded-full bg-secondary p-1">
                    {heroRoles.map((role) => (
                      <button
                        key={role}
                        type="button"
                        aria-pressed={heroRole === role}
                        onClick={() => setHeroRole(role)}
                        className={`h-9 rounded-full text-[10px] font-extrabold transition ${
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
                    className="rounded-full bg-[#f47a20] px-5 font-extrabold text-white hover:bg-[#dd6818]"
                  >
                    <Link to="/contact">
                      Get my shortlist <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <p className="mt-3 text-center text-[10px] font-semibold text-muted-foreground">
                  Private guidance · No payment required
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-20 lg:py-28">
        <SectionIntro
          eyebrow="Explore by ambition"
          title="Online degrees built around your career."
          description="Start with the domain you want to enter—not a long, confusing university list."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {domainCards.map((domain) => (
            <article
              key={domain.title}
              className={`${domain.background} group rounded-[1.75rem] border border-black/[0.06] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_-25px_rgba(20,30,45,0.38)] dark:border-border dark:bg-card`}
            >
              <div
                className={`${domain.iconBackground} flex h-12 w-12 items-center justify-center rounded-2xl`}
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
            const matchingOffers = universitiesOfferingProgram(program.slug);
            const matchingUniversities = matchingOffers
              .map(({ university }) => university)
              .slice(0, 3);
            const startingFee = matchingOffers.length
              ? Math.min(...matchingOffers.map(({ program: offer }) => offer.totalFee))
              : null;

            return (
              <Link
                key={program.slug}
                to="/programs/$programSlug"
                params={{ programSlug: program.slug }}
                className="group rounded-[1.6rem] border border-[#dfe3dc] bg-white p-6 shadow-[0_10px_30px_-24px_rgba(23,26,23,0.4)] transition duration-300 hover:-translate-y-1 hover:border-[#adc8e8] hover:shadow-[0_24px_50px_-30px_rgba(13,92,173,0.55)] dark:border-border dark:bg-card"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-[#eaf3ff] px-3 py-1.5 text-xs font-extrabold text-[#0d5cad]">
                    {program.level}
                  </span>
                  <span className="text-xs font-semibold text-[#777c76] dark:text-muted-foreground">
                    {program.durationYears} years
                  </span>
                </div>

                <div className="mt-5 flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f47a20]">
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
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a8f89]">
                      Starts from
                    </p>
                    <p className="mt-1 font-display text-base font-bold">
                      {startingFee ? formatCurrency(startingFee) : "Compare fees"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a8f89]">
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
                      ? `${matchingOffers.length} universities`
                      : "View universities"}
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
            eyebrow="Degree validity"
            title="One degree. Zero distinctions."
            description="For UGC-entitled programs, the qualification carries the same academic validity. The difference is where and how you study."
          />

          <div className="relative mt-12 grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
            <DegreeCard
              label="On-campus"
              title="UGC-entitled degree"
              points={["Fixed timetable", "Campus attendance", "Location dependent"]}
              icon={Building2}
            />

            <div className="relative z-10 flex items-center justify-center lg:-mx-3">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border-8 border-[#101713] bg-[#f47a20] font-display text-2xl font-extrabold text-white shadow-xl">
                =
              </span>
            </div>

            <DegreeCard
              featured
              label="Online"
              title="UGC-entitled degree"
              points={["Flexible timetable", "Learn from anywhere", "Work while studying"]}
              icon={Laptop2}
            />
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {[
              "Eligible for government and private-sector roles",
              "Eligible for higher education, subject to institution rules",
              "Can be evaluated for international study and employment",
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
        </div>
      </section>

      <section className="container-page py-20 lg:py-28">
        <SectionIntro
          eyebrow="Verified universities"
          title="Start with a name you already trust."
          description="Explore UGC-entitled online universities with clear program, fee and accreditation information."
          action={
            <Button
              asChild
              variant="outline"
              className="rounded-full border-[#ccd3ca] bg-white px-5 font-bold dark:border-border dark:bg-card"
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
              className="group flex min-h-44 flex-col items-center justify-center rounded-[1.4rem] border border-[#e0e4de] bg-white p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-[#b6cde8] hover:shadow-[0_18px_36px_-26px_rgba(13,92,173,0.55)] dark:border-border dark:bg-card"
            >
              <UniversityLogo university={university} size="lg" />
              <h3 className="mt-4 line-clamp-2 text-sm font-bold">{university.shortName}</h3>
              <p className="mt-1 text-[11px] text-[#777c76] dark:text-muted-foreground">
                {university.programs.length} courses
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12 overflow-hidden rounded-[2rem] bg-[#0d5cad] text-white shadow-[0_28px_70px_-35px_rgba(13,92,173,0.72)]">
          <div className="grid gap-8 p-7 md:grid-cols-[1fr_auto] md:items-center md:p-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ffc18f]">
                Personal shortlist
              </p>
              <h2 className="mt-3 max-w-3xl font-display text-3xl font-extrabold tracking-[-0.045em] md:text-4xl">
                So, where should you actually enrol?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75 md:text-base">
                Get your best-fit university shortlist based on qualification, budget, career goal
                and learning preference.
              </p>
            </div>

            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-[#f47a20] px-6 font-bold text-white hover:bg-[#dd6818]"
            >
              <Link to="/contact">
                Find my top matches
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-[#eff4f8] py-20 dark:bg-secondary/35 lg:py-28">
        <div className="container-page">
          <SectionIntro
            eyebrow="Cost advantage"
            title="Same ambition. A much lighter cost."
            description="Pay for learning and the degree—not hostel, food, transport and relocation."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-[#dbe0db] bg-white p-7 dark:border-border dark:bg-card md:p-9">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7e837d]">
                    On-campus · annual
                  </p>
                  <p className="mt-3 font-display text-4xl font-extrabold tracking-[-0.055em]">
                    ₹3,00,000+
                  </p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1f1ee]">
                  <Building2 className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-8 space-y-4">
                <CostLine label="Tuition" value="₹1.2L+" percentage={40} />
                <CostLine label="Hostel or rent" value="₹80K+" percentage={27} />
                <CostLine label="Food and daily costs" value="₹50K+" percentage={17} />
                <CostLine label="Travel and relocation" value="₹30K+" percentage={10} />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] bg-[#0d5cad] p-7 text-white shadow-[0_28px_65px_-35px_rgba(13,92,173,0.75)] md:p-9">
              <div
                className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#f47a20]/30 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">
                    Online · annual
                  </p>
                  <p className="mt-3 font-display text-4xl font-extrabold tracking-[-0.055em]">
                    ₹70K–₹1.5L
                  </p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <Laptop2 className="h-5 w-5" />
                </span>
              </div>

              <div className="relative mt-8 rounded-2xl border border-white/10 bg-white/[0.07] p-5">
                <p className="font-display text-5xl font-extrabold tracking-[-0.06em] text-[#ff9a50]">
                  40–60%
                </p>
                <p className="mt-2 font-bold">potential annual saving</p>
                <p className="mt-1 text-sm leading-6 text-white/65">
                  Plus monthly EMI options on selected university programs.
                </p>
              </div>

              <div className="relative mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Add industry certifications",
                  "Build an emergency cushion",
                  "Avoid education debt",
                  "Continue earning while learning",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-white/75">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ff9a50]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-20 lg:py-28">
        <SectionIntro
          eyebrow="Popular degrees"
          title="Great careers begin with the right program."
          description="Explore recognised online degrees across management, technology, commerce and humanities."
        />

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {programCatalog.slice(0, 8).map((program, index) => {
            const icons = [
              BriefcaseBusiness,
              GraduationCap,
              Code2,
              Laptop2,
              BarChart3,
              IndianRupee,
              BookOpenCheck,
              Sparkles,
            ];
            const ProgramIcon = icons[index % icons.length];

            return (
              <Link
                key={program.slug}
                to="/programs/$programSlug"
                params={{ programSlug: program.slug }}
                className="group flex min-h-40 flex-col justify-between rounded-[1.4rem] border border-[#e0e4de] bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#b9cee6] hover:shadow-[0_18px_36px_-26px_rgba(13,92,173,0.5)] dark:border-border dark:bg-card"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf3ff] text-[#0d5cad]">
                    <ProgramIcon className="h-4.5 w-4.5" />
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#9ba09a] transition group-hover:translate-x-1 group-hover:text-[#0d5cad]" />
                </div>
                <div className="mt-5">
                  <h3 className="font-display text-xl font-extrabold tracking-[-0.04em]">
                    {program.code}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-xs text-[#777c76] dark:text-muted-foreground">
                    {program.name}
                  </p>
                  <p className="mt-3 text-xs font-semibold text-[#0d5cad]">
                    {program.specialisations.length} specialisations
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-[#101713] py-20 text-white lg:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div>
            <SectionIntro
              dark
              eyebrow="Flexible learning"
              title="Study when your brain is ready."
              description="The degree fits around your life—not the other way around."
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {studyBenefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.055] p-5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f47a20] text-white">
                    <benefit.icon className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/60">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 md:p-9">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold">Your learning day</p>
              <span className="rounded-full bg-[#f47a20] px-3 py-1 text-xs font-bold">
                24/7 access
              </span>
            </div>

            <div className="relative mt-14">
              <div className="absolute left-0 right-0 top-4 h-1 rounded-full bg-white/10" />
              <div className="absolute left-[18%] right-[12%] top-4 h-1 rounded-full bg-gradient-to-r from-[#4ba3ff] via-[#f47a20] to-[#ffb37d]" />

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
                <p className="font-display text-lg font-bold">Learn without pausing your career</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Combine live classes, recorded content and weekend assessments around your work
                schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-20 lg:py-28">
        <SectionIntro
          eyebrow="Transparent coverage"
          title="A catalog you can inspect, not a promise you must trust."
          description="Every figure below is calculated from the university and program information currently available on this platform."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {catalogStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[1.5rem] border border-[#e0e4de] bg-white p-6 dark:border-border dark:bg-card"
            >
              <stat.icon className="h-5 w-5 text-[#f47a20]" />
              <p className="mt-7 font-display text-4xl font-extrabold tracking-[-0.055em] text-[#0d5cad]">
                {stat.value}
              </p>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#686d67] dark:text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-[#e0e4de] bg-white px-6 py-5 dark:border-border dark:bg-card">
          <p className="text-center text-xs font-semibold leading-5 text-[#858a84] dark:text-muted-foreground">
            Catalog information can change by intake. Reconfirm entitlement, fees and admission
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
                className="group overflow-hidden rounded-[1.75rem] border border-[#dfe4dd] bg-white dark:border-border dark:bg-card"
              >
                <div
                  className={`relative h-52 p-6 ${
                    index === 0 ? "bg-[#dceaff]" : index === 1 ? "bg-[#ffe8d8]" : "bg-[#e5f5ec]"
                  }`}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-card">
                    <guide.icon className="h-5 w-5 text-[#0d5cad]" />
                  </span>
                  <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-black/5 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-border dark:bg-card/90">
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#f47a20]">
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
                    className="mt-6 w-full rounded-full border-[#ccd3ca] font-bold"
                  >
                    <Link to={index === 0 ? "/methodology" : index === 1 ? "/compare" : "/contact"}>
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
        <div className="relative overflow-hidden rounded-[2.25rem] bg-[#0d5cad] px-6 py-12 text-center text-white shadow-[0_32px_80px_-38px_rgba(13,92,173,0.78)] md:px-12 md:py-16">
          <div
            className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#4ba3ff]/30 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-[#f47a20]/35 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-3xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f47a20]">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="mt-6 font-display text-3xl font-extrabold leading-tight tracking-[-0.045em] md:text-5xl">
              Make your next degree decision with clarity.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70">
              Compare programs, verify university claims, understand fees and ask for human help
              only when you need it.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-[#f47a20] px-7 font-bold text-white hover:bg-[#dd6818]"
              >
                <Link to="/contact">
                  Book my free session
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-white/25 bg-white/5 px-7 font-bold text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/universities">Explore universities</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3 text-xs font-semibold text-white/65">
              {["Free guidance", "No hidden fee", "Human counsellors", "Verified information"].map(
                (item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#ff9a50]" />
                    {item}
                  </span>
                ),
              )}
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
            dark ? "text-[#ff9a50]" : "text-[#f47a20]"
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
          ? "border-[#f47a20]/45 bg-[#f47a20] text-white"
          : "border-white/10 bg-white/[0.055] text-white"
      }`}
    >
      <div className="flex items-start justify-between gap-5">
        <div>
          <p
            className={`text-xs font-extrabold uppercase tracking-[0.18em] ${
              featured ? "text-white/65" : "text-[#ff9a50]"
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
          <span className="font-bold">Recognised qualification</span>
        </div>
      </div>

      <ul className="mt-6 space-y-3">
        {points.map((point) => (
          <li key={point} className="flex items-center gap-3 text-sm text-white/75">
            <Check className="h-4 w-4 shrink-0" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CostLine({
  label,
  value,
  percentage,
}: {
  label: string;
  value: string;
  percentage: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-semibold text-[#60655f]">{label}</span>
        <span className="font-bold">{value}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-[#eff1ed]">
        <div className="h-full rounded-full bg-[#c5cbc3]" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
