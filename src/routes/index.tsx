import { createFileRoute, Link } from "@tanstack/react-router";
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
  Download,
  GraduationCap,
  HeartPulse,
  IndianRupee,
  Laptop2,
  Lightbulb,
  Megaphone,
  MoonStar,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Target,
  TimerReset,
  TrendingUp,
  Users,
  WalletCards,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/site/lead-form";
import { UniversityLogo } from "@/components/site/university-logo";
import {
  universities,
  programCatalog,
  getSpecialisationCount,
  getTotalProgramCount,
} from "@/data/universities";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Find Your Best Online Degree from India's Top Universities | DekhoCampus Online",
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

const programStartingFees: Record<string, number> = {
  MBA: 94000,
  BBA: 72000,
  MCA: 108800,
  BCA: 75000,
  "M.Com": 65000,
  "B.Com": 60000,
  MA: 60000,
};

const outcomeStats = [
  {
    value: "87%",
    label: "learners reported career growth within a year",
    icon: TrendingUp,
  },
  {
    value: "9 in 10",
    label: "said the degree opened new career possibilities",
    icon: Target,
  },
  {
    value: "3 in 4",
    label: "received a role or promotion opportunity",
    icon: BriefcaseBusiness,
  },
  {
    value: "92%",
    label: "would recommend online learning to others",
    icon: Users,
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
    meta: "Parent checklist · 1 page",
    icon: ShieldCheck,
  },
  {
    title: "How to compare online universities",
    description:
      "The key questions to ask about fees, live classes, exams, placements and learner support.",
    meta: "Comparison guide · 2 pages",
    icon: BarChart3,
  },
  {
    title: "Choosing the right specialisation",
    description:
      "A career-first framework for selecting a specialisation that matches your goals.",
    meta: "Career guide · 2 pages",
    icon: Lightbulb,
  },
];

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

  return (
    <div className="overflow-hidden bg-[#fbfaf7] text-[#171a17]">
      <section className="relative border-b border-black/5">
        <div
          className="pointer-events-none absolute -left-40 top-16 h-96 w-96 rounded-full bg-[#dbe9ff] blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[#ffe6cf] blur-3xl"
          aria-hidden="true"
        />

        <div className="container-page relative grid gap-12 py-14 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:py-20 xl:gap-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#bdd4f3] bg-white/75 px-4 py-2 text-sm font-semibold text-[#174e8f] shadow-sm backdrop-blur">
              <BadgeCheck className="h-4 w-4" />
              Trusted guidance for 45,000+ learners
            </div>

            <h1 className="mt-7 max-w-3xl font-display text-[2.75rem] font-extrabold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-[4.35rem]">
              Find the online degree
              <span className="block text-[#0d5cad]">that is built for you.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5d625c]">
              No confusing sales pitch. Compare recognised online degrees, transparent fees,
              flexible learning and career outcomes—then choose with confidence.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-[#f47a20] px-6 font-bold text-white shadow-[0_14px_30px_-14px_rgba(244,122,32,0.75)] hover:bg-[#dc6818]"
              >
                <Link to="/universities">
                  Find my best matches
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-[#cfd6cd] bg-white/70 px-6 font-bold text-[#242824] hover:bg-white"
              >
                <Link to="/compare">Compare universities</Link>
              </Button>
            </div>

            <dl className="mt-11 grid max-w-2xl grid-cols-3 gap-4 border-t border-black/10 pt-7">
              <div>
                <dt className="font-display text-2xl font-extrabold tracking-[-0.04em] sm:text-3xl">
                  {universities.length}+
                </dt>
                <dd className="mt-1 text-xs leading-5 text-[#6d726c] sm:text-sm">
                  verified universities
                </dd>
              </div>
              <div>
                <dt className="font-display text-2xl font-extrabold tracking-[-0.04em] sm:text-3xl">
                  {totalPrograms}+
                </dt>
                <dd className="mt-1 text-xs leading-5 text-[#6d726c] sm:text-sm">
                  online degrees
                </dd>
              </div>
              <div>
                <dt className="font-display text-2xl font-extrabold tracking-[-0.04em] sm:text-3xl">
                  {totalSpecialisations}+
                </dt>
                <dd className="mt-1 text-xs leading-5 text-[#6d726c] sm:text-sm">
                  specialisations
                </dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-5 rotate-2 rounded-[2.25rem] bg-[#0d5cad]"
              aria-hidden="true"
            />
            <LeadForm
              compact
              showMatchQuestions
              className="relative rounded-[2rem] border-0 bg-white p-6 shadow-[0_30px_80px_-28px_rgba(28,48,73,0.42)] md:p-8"
              title="What matters most to you?"
              description="Tell us your priority. We will match you with the right university and program."
            />
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
              className={`${domain.background} group rounded-[1.75rem] border border-black/[0.06] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_-25px_rgba(20,30,45,0.38)]`}
            >
              <div
                className={`${domain.iconBackground} flex h-12 w-12 items-center justify-center rounded-2xl`}
              >
                <domain.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold tracking-[-0.035em]">
                {domain.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#656a64]">{domain.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {domain.codes.map((code) => (
                  <span
                    key={code}
                    className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-bold"
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
            const matchingUniversities = universities
              .filter((university) =>
                university.programs.some((item) => item.slug === program.slug),
              )
              .slice(0, 3);
            const startingFee = programStartingFees[program.code];

            return (
              <Link
                key={program.slug}
                to="/programs/$programSlug"
                params={{ programSlug: program.slug }}
                className="group rounded-[1.6rem] border border-[#dfe3dc] bg-white p-6 shadow-[0_10px_30px_-24px_rgba(23,26,23,0.4)] transition duration-300 hover:-translate-y-1 hover:border-[#adc8e8] hover:shadow-[0_24px_50px_-30px_rgba(13,92,173,0.55)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-[#eaf3ff] px-3 py-1.5 text-xs font-extrabold text-[#0d5cad]">
                    {program.level}
                  </span>
                  <span className="text-xs font-semibold text-[#777c76]">
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

                <div className="mt-6 grid grid-cols-2 gap-4 border-y border-[#eceeea] py-4">
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
                        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#f7f7f4] shadow-sm"
                        title={university.shortName}
                      >
                        <UniversityLogo university={university} size="sm" />
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-[#6d726c]">
                    {matchingUniversities.length > 0
                      ? `${matchingUniversities.length}+ universities`
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
              className="rounded-full border-[#ccd3ca] bg-white px-5 font-bold"
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
              className="group flex min-h-44 flex-col items-center justify-center rounded-[1.4rem] border border-[#e0e4de] bg-white p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-[#b6cde8] hover:shadow-[0_18px_36px_-26px_rgba(13,92,173,0.55)]"
            >
              <UniversityLogo university={university} size="lg" />
              <h3 className="mt-4 line-clamp-2 text-sm font-bold">{university.shortName}</h3>
              <p className="mt-1 text-[11px] text-[#777c76]">
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

      <section className="bg-[#eff4f8] py-20 lg:py-28">
        <div className="container-page">
          <SectionIntro
            eyebrow="Cost advantage"
            title="Same ambition. A much lighter cost."
            description="Pay for learning and the degree—not hostel, food, transport and relocation."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-[#dbe0db] bg-white p-7 md:p-9">
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
                className="group flex min-h-40 flex-col justify-between rounded-[1.4rem] border border-[#e0e4de] bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#b9cee6] hover:shadow-[0_18px_36px_-26px_rgba(13,92,173,0.5)]"
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
                  <p className="mt-1 line-clamp-1 text-xs text-[#777c76]">{program.name}</p>
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
          eyebrow="Career outcomes"
          title="What can happen after graduation?"
          description="Online education works best when program choice, university support and learner effort align."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {outcomeStats.map((stat) => (
            <div
              key={stat.value}
              className="rounded-[1.5rem] border border-[#e0e4de] bg-white p-6"
            >
              <stat.icon className="h-5 w-5 text-[#f47a20]" />
              <p className="mt-7 font-display text-4xl font-extrabold tracking-[-0.055em] text-[#0d5cad]">
                {stat.value}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#686d67]">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-[#e0e4de] bg-white px-6 py-5">
          <p className="text-center text-xs font-semibold leading-5 text-[#858a84]">
            Career outcomes vary by learner profile, experience, program, market conditions and
            individual effort. Figures should be replaced with your verified internal survey data
            before publishing.
          </p>
        </div>
      </section>

      <section className="bg-[#f2f5f1] py-20 lg:py-28">
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
                className="group overflow-hidden rounded-[1.75rem] border border-[#dfe4dd] bg-white"
              >
                <div
                  className={`relative h-52 p-6 ${
                    index === 0
                      ? "bg-[#dceaff]"
                      : index === 1
                        ? "bg-[#ffe8d8]"
                        : "bg-[#e5f5ec]"
                  }`}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <guide.icon className="h-5 w-5 text-[#0d5cad]" />
                  </span>
                  <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-black/5 bg-white/80 p-4 shadow-sm backdrop-blur">
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
                  <p className="mt-3 text-sm leading-6 text-[#6c716b]">{guide.description}</p>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-6 w-full rounded-full border-[#ccd3ca] font-bold"
                  >
                    <Link to="/contact">
                      <Download className="mr-2 h-4 w-4" />
                      Get this guide
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
              Every semester you delay is time you do not get back.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70">
              One free counselling session can help you compare programs, verify university claims,
              understand fees and complete the application correctly.
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
            dark ? "text-white" : "text-[#171a17]"
          }`}
        >
          {title}
        </h2>
        <p
          className={`mt-4 max-w-2xl text-base leading-7 ${
            dark ? "text-white/60" : "text-[#696e68]"
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
          <h3 className="mt-3 font-display text-2xl font-extrabold tracking-[-0.04em]">
            {title}
          </h3>
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
        <div
          className="h-full rounded-full bg-[#c5cbc3]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
