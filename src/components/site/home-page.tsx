import { Link } from "@tanstack/react-router";
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
  PlayCircle,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  TimerReset,
  Users,
  WalletCards,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { CompactRail } from "@/components/site/compact-rail";
import { UniversityLogo } from "@/components/site/university-logo";
import { Button } from "@/components/ui/button";
import {
  getSpecialisationCount,
  getTotalProgramCount,
  programCatalog,
  universities,
  universitiesOfferingProgram,
} from "@/data/universities";
import { cn } from "@/lib/utils";

const studyAreas = [
  {
    title: "Business & leadership",
    description: "MBA and BBA paths for management, strategy and entrepreneurship.",
    icon: BriefcaseBusiness,
    codes: ["MBA", "BBA"],
  },
  {
    title: "Technology & software",
    description: "Computer applications, cloud, cyber security and software careers.",
    icon: Code2,
    codes: ["MCA", "BCA"],
  },
  {
    title: "AI, data & analytics",
    description: "Data science, business analytics and technology-led decision making.",
    icon: BrainCircuit,
    codes: ["MBA", "M.Sc"],
  },
  {
    title: "Finance & commerce",
    description: "Accounting, finance, banking and fintech-focused online degrees.",
    icon: WalletCards,
    codes: ["M.Com", "B.Com"],
  },
  {
    title: "Marketing & communication",
    description: "Brand, performance marketing, media and communication pathways.",
    icon: Megaphone,
    codes: ["MBA", "MA"],
  },
  {
    title: "Healthcare operations",
    description: "Non-clinical management and administration pathways to verify carefully.",
    icon: HeartPulse,
    codes: ["MBA"],
  },
] as const;

const scheduleCards = [
  {
    title: "Live class timing",
    description: "Ask for the weekly timetable and mandatory attendance policy.",
    icon: PlayCircle,
  },
  {
    title: "Recording access",
    description: "Confirm which sessions are recorded and when access expires.",
    icon: BookOpenCheck,
  },
  {
    title: "Assessment calendar",
    description: "Check exam windows, proctoring rules, centres and resit charges.",
    icon: TimerReset,
  },
  {
    title: "Workload you can sustain",
    description: "Match weekly study hours to work, family and connectivity needs.",
    icon: Clock3,
  },
] as const;

const guides = [
  {
    title: "Is this online degree valid?",
    description: "A practical checklist for programme, mode and intake verification.",
    meta: "Verification checklist",
    icon: ShieldCheck,
    to: "/methodology" as const,
  },
  {
    title: "How to compare universities",
    description: "Questions to ask about fees, classes, exams and learner support.",
    meta: "Decision framework",
    icon: BarChart3,
    to: "/compare" as const,
  },
  {
    title: "Choose a specialisation",
    description: "Connect a specialisation to the work you actually want to do.",
    meta: "Career worksheet",
    icon: Lightbulb,
    to: "/specialisations" as const,
  },
  {
    title: "Talk it through together",
    description: "Bring your shortlist and questions to a human counsellor.",
    meta: "Family discussion",
    icon: Users,
    to: "/contact" as const,
  },
] as const;

const heroGoals = [
  { label: "Online degree", value: "flexible-study", icon: Laptop2 },
  { label: "MBA & management", value: "career-growth", icon: BriefcaseBusiness },
  { label: "After Class 12", value: "career-growth", icon: GraduationCap },
  { label: "Affordable options", value: "lower-fees", icon: IndianRupee },
  { label: "Career clarity", value: "career-switch", icon: Target },
] as const;

const heroRoles = ["Student", "Parent", "Professional"] as const;

const featuredUniversityOrder = [
  "amity-university-online",
  "manipal-university-jaipur",
  "jain-university-online",
  "chandigarh-university-online",
  "lovely-professional-university-punjab",
  "gla-university-uttar-pradesh",
];

function orderedUniversities() {
  const priority = new Map(featuredUniversityOrder.map((slug, index) => [slug, index]));
  return [...universities].sort((a, b) => {
    const aPriority = priority.get(a.slug) ?? 999;
    const bPriority = priority.get(b.slug) ?? 999;
    if (aPriority !== bPriority) return aPriority - bPriority;
    if (a.profileDepth !== b.profileDepth) return a.profileDepth === "directory" ? 1 : -1;
    return a.name.localeCompare(b.name);
  });
}

function featuredCourseRecords() {
  const mba = universitiesOfferingProgram("online-mba");
  const bba = universitiesOfferingProgram("online-bba");
  const priority = new Map(featuredUniversityOrder.map((slug, index) => [slug, index]));
  const sortOffers = (offers: typeof mba) =>
    [...offers].sort((a, b) => {
      const aPriority = priority.get(a.university.slug) ?? 999;
      const bPriority = priority.get(b.university.slug) ?? 999;
      return aPriority - bPriority || a.university.name.localeCompare(b.university.name);
    });
  return [...sortOffers(mba), ...sortOffers(bba)].slice(0, 12);
}

export function HomePage() {
  const totalProgramRecords = getTotalProgramCount();
  const totalSpecialisations = getSpecialisationCount();
  const [heroGoal, setHeroGoal] = useState<(typeof heroGoals)[number]["label"]>("Online degree");
  const [heroRole, setHeroRole] = useState<(typeof heroRoles)[number]>("Student");
  const selectedHeroGoal = heroGoals.find((goal) => goal.label === heroGoal) ?? heroGoals[0];
  const featuredUniversities = orderedUniversities().slice(0, 16);
  const courseRecords = featuredCourseRecords();
  const catalogueStats = [
    { value: String(universities.length), label: "university profiles", icon: Building2 },
    { value: String(programCatalog.length), label: "online course guides", icon: GraduationCap },
    { value: String(totalProgramRecords), label: "course relationships", icon: BookOpenCheck },
    { value: String(totalSpecialisations), label: "specialisations mapped", icon: Target },
  ];

  return (
    <div className="overflow-hidden bg-background text-foreground">
      <section className="border-b border-border bg-[#fcfcfd] dark:bg-background">
        <div className="container-page grid gap-9 py-10 sm:py-12 lg:min-h-[610px] lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:gap-14 lg:py-14">
          <div className="max-w-[780px]">
            <div className="inline-flex items-center gap-2 border-l-4 border-[#f47b25] pl-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#a94300] dark:text-[#ffad70]">
              <GraduationCap className="h-4 w-4 text-foreground" aria-hidden="true" />
              Online degrees, explained clearly
            </div>
            <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#536176] dark:text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-[#168258]" />
              Compare privately. Ask a human when you need one.
            </p>

            <h1 className="mt-6 max-w-[760px] font-display text-[2.65rem] font-black leading-[1.02] tracking-[-0.052em] text-[#131720] dark:text-foreground sm:text-6xl lg:text-[4.3rem]">
              Choose an online degree with
              <span className="block text-[#325dd2] dark:text-[#8cb0ff]">
                clarity, not pressure.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#536176] dark:text-muted-foreground sm:text-lg sm:leading-8">
              Explore courses and university records, see what has a source, and understand what
              still needs confirmation before you apply or pay.
            </p>

            <form action="/search" className="mt-6 max-w-2xl" role="search">
              <div className="flex min-h-14 items-center gap-3 rounded-xl border border-input bg-card p-1.5 pl-4 shadow-card sm:pl-5">
                <Search className="h-5 w-5 shrink-0 text-[#667386]" aria-hidden="true" />
                <input
                  name="q"
                  aria-label="Search universities or online courses"
                  placeholder="Search MBA, BBA or a university..."
                  className="h-11 min-w-0 flex-1 rounded-md bg-transparent text-sm text-foreground outline-none placeholder:text-[#667386] focus-visible:ring-2 focus-visible:ring-[#325dd2] focus-visible:ring-offset-2 sm:text-base"
                />
                <button
                  type="submit"
                  aria-label="Search the online degree catalogue"
                  className="inline-flex h-12 min-w-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#f47b25] px-3 text-sm font-extrabold text-[#111827] transition-colors hover:bg-[#d85f12] sm:min-w-28 sm:px-5"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </form>

            <div className="mt-3 flex max-w-2xl flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground">Popular:</span>
              {[
                { label: "Online MBA", query: "MBA" },
                { label: "Online BBA", query: "BBA" },
                { label: "Online MCA", query: "MCA" },
              ].map((prompt) => (
                <Link
                  key={prompt.label}
                  to="/search"
                  search={{ q: prompt.query }}
                  className="inline-flex min-h-9 items-center rounded-lg border border-border bg-card px-3 text-xs font-bold text-muted-foreground transition-colors hover:border-[#325dd2] hover:text-foreground"
                >
                  {prompt.label}
                </Link>
              ))}
            </div>

            <div className="mt-6 grid max-w-2xl grid-cols-3 gap-3 border-t border-border pt-5">
              <HeroMetric value={String(universities.length)} label="universities" />
              <HeroMetric value={String(programCatalog.length)} label="course guides" />
              <HeroMetric value="Free" label="private shortlist" />
            </div>
          </div>

          <aside
            className="mx-auto w-full max-w-[440px] rounded-2xl border border-[#cfd9ec] bg-card p-5 shadow-card sm:p-6"
            aria-label="Free counselling starter"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex min-h-8 items-center gap-2 rounded-lg bg-[#eaf7f1] px-3 text-[10px] font-extrabold text-[#166b4e] dark:bg-[#123b30] dark:text-[#77ddb4]">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Free expert guidance
              </span>
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="h-1.5 w-8 rounded-full bg-[#325dd2]" />
                <span className="h-1.5 w-4 rounded-full bg-[#dce4f2]" />
              </div>
            </div>

            <p className="mt-5 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#a94300] dark:text-[#ffad70]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Personal guidance desk
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.04em]">
              What matters most right now?
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Choose one goal and we will shape a focused starting point.
            </p>

            <fieldset className="mt-5 grid grid-cols-2 gap-2">
              <legend className="sr-only">Select your goal</legend>
              {heroGoals.map((goal, index) => {
                const selected = heroGoal === goal.label;
                return (
                  <button
                    key={goal.label}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setHeroGoal(goal.label)}
                    className={cn(
                      "flex min-h-12 items-center gap-2 rounded-xl border px-3 text-left text-[11px] font-extrabold transition-colors",
                      index === heroGoals.length - 1 && "col-span-2",
                      selected
                        ? "border-[#325dd2] bg-[#edf2ff] text-[#2449ad] dark:bg-[#263653] dark:text-[#b9ceff]"
                        : "border-border bg-background text-muted-foreground hover:border-[#9bb5f1] hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        selected ? "bg-[#325dd2] text-white" : "bg-secondary text-foreground",
                      )}
                    >
                      <goal.icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    {goal.label}
                  </button>
                );
              })}
            </fieldset>

            <fieldset className="mt-5">
              <legend className="mb-2 text-[11px] font-extrabold text-foreground">I am a</legend>
              <div className="grid grid-cols-3 rounded-xl bg-secondary p-1">
                {heroRoles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    aria-pressed={heroRole === role}
                    onClick={() => setHeroRole(role)}
                    className={cn(
                      "min-h-10 rounded-lg px-2 text-[11px] font-extrabold transition-colors",
                      heroRole === role
                        ? "bg-card text-[#2449ad] shadow-sm dark:text-[#8cb0ff]"
                        : "text-muted-foreground",
                    )}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </fieldset>

            <Button
              asChild
              size="lg"
              className="mt-4 w-full bg-[#325dd2] font-extrabold text-white hover:bg-[#2449ad]"
            >
              <Link
                to="/finder"
                search={{
                  goal: selectedHeroGoal.value,
                  audience: heroRole.toLowerCase() as Lowercase<typeof heroRole>,
                }}
              >
                Show my best-fit options <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <p className="mt-3 text-center text-[10px] font-semibold text-muted-foreground">
              About 60 seconds · No personal details required
            </p>
          </aside>
        </div>
      </section>

      <section className="container-page py-14 lg:py-20">
        <SectionIntro
          eyebrow="Choose your direction"
          title="What do you want to study?"
          description="Start with a broad career area. You can narrow the course and university later."
        />
        <CompactRail label="Study areas" columns={3}>
          {studyAreas.map((area) => (
            <Link
              key={area.title}
              to="/search"
              search={{ q: area.codes[0] }}
              className="group flex h-full min-h-52 flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-[#325dd2]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf2ff] text-[#2449ad] dark:bg-[#263653] dark:text-[#b9ceff]">
                <area.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-lg font-extrabold tracking-[-0.03em]">
                {area.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                {area.description}
              </p>
              <span className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs font-extrabold text-[#2449ad] dark:text-[#8cb0ff]">
                {area.codes.join(" · ")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </CompactRail>
      </section>

      <section className="border-y border-border bg-[#f5f7fa] py-14 dark:bg-secondary/25 lg:py-20">
        <div className="container-page">
          <SectionIntro
            eyebrow="Popular course records"
            title="MBA and BBA options, university by university."
            description="Two rows keep the page compact. Each card opens that university-course record so you can inspect its evidence status."
            action={<TextLink to="/programs" label="See every course" />}
          />
          <CompactRail label="Online MBA and BBA university records" rows={2} columns={3}>
            {courseRecords.map(({ university, program }) => (
              <Link
                key={university.slug + "-" + program.slug}
                to="/universities/$universitySlug/$programSlug"
                params={{ universitySlug: university.slug, programSlug: program.slug }}
                className="group flex min-h-36 items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-[#325dd2]"
              >
                <UniversityLogo university={university} size="md" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#a94300] dark:text-[#ffad70]">
                    Online {program.code}
                  </span>
                  <span className="mt-1.5 line-clamp-2 block font-display text-base font-extrabold leading-5">
                    {university.shortName}
                  </span>
                  <span className="mt-2 block text-[11px] leading-4 text-muted-foreground">
                    View course record · confirm current intake
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-[#325dd2]" />
              </Link>
            ))}
          </CompactRail>
        </div>
      </section>

      <section className="container-page py-14 lg:py-20">
        <SectionIntro
          eyebrow="Admission verification"
          title="Two checks before you apply."
          description="A university name is not enough. Confirm the institution first, then the exact programme, mode and intake."
          action={<TextLink to="/methodology" label="See our method" />}
        />
        <div className="mt-7 grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
          <VerificationCard
            step="Step 1"
            title="Check the institution"
            icon={Building2}
            items={["Legal university name", "Official domain", "Current regulator notices"]}
          />
          <div className="flex items-center justify-center" aria-hidden="true">
            <span className="flex h-10 w-10 rotate-90 items-center justify-center rounded-full bg-[#f47b25] text-[#111827] md:rotate-0">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
          <VerificationCard
            step="Step 2"
            title="Check the exact offering"
            icon={Laptop2}
            items={["Programme name", "Online—not ODL—mode", "Academic session"]}
            primary
          />
        </div>
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-border bg-[#f5f7fa] p-4 text-xs leading-5 text-muted-foreground dark:bg-secondary/30 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Keep screenshots or PDFs of the official entitlement, fee schedule and refund policy.
          </span>
          <a
            href="https://deb.ugc.ac.in/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 shrink-0 items-center font-extrabold text-[#2449ad] hover:underline dark:text-[#8cb0ff]"
          >
            Open UGC-DEB <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="border-y border-border bg-[#f5f7fa] py-14 dark:bg-secondary/25 lg:py-20">
        <div className="container-page">
          <SectionIntro
            eyebrow="University directory"
            title="Compare familiar names with visible data status."
            description="Four compact cards stay visible on desktop. Swipe or use the arrows to continue."
            action={<TextLink to="/universities" label={"View all " + universities.length} />}
          />
          <CompactRail label="Featured online university profiles" columns={4}>
            {featuredUniversities.map((university) => (
              <Link
                key={university.slug}
                to="/universities/$universitySlug"
                params={{ universitySlug: university.slug }}
                className="group flex min-h-40 flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-[#325dd2]"
              >
                <div className="flex items-start justify-between gap-3">
                  <UniversityLogo university={university} size="md" />
                  <span className="rounded-md bg-secondary px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-muted-foreground">
                    {university.profileDepth === "directory" ? "Directory" : "Editorial"}
                  </span>
                </div>
                <h3 className="mt-3 line-clamp-2 font-display text-base font-extrabold leading-5">
                  {university.shortName}
                </h3>
                <span className="mt-auto flex items-center justify-between pt-3 text-[11px] font-bold text-muted-foreground">
                  {university.programs.length > 0
                    ? String(university.programs.length) + " course records"
                    : "Profile available"}
                  <ArrowRight className="h-4 w-4 group-hover:text-[#325dd2]" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </CompactRail>

          <details className="mt-5 rounded-xl border border-border bg-card">
            <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-3 px-4 text-sm font-extrabold marker:content-none">
              Browse all {universities.length} university names
              <span className="text-xs font-bold text-[#2449ad] dark:text-[#8cb0ff]">
                Open directory
              </span>
            </summary>
            <div className="grid max-h-96 gap-x-6 overflow-y-auto border-t border-border p-4 sm:grid-cols-2 lg:grid-cols-4">
              {orderedUniversities().map((university) => (
                <Link
                  key={university.slug}
                  to="/universities/$universitySlug"
                  params={{ universitySlug: university.slug }}
                  className="flex min-h-10 items-center text-xs font-semibold text-muted-foreground hover:text-[#2449ad] dark:hover:text-[#8cb0ff]"
                >
                  {university.name}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </section>

      <section className="bg-[#131720] py-14 text-white lg:py-20">
        <div className="container-page">
          <SectionIntro
            dark
            eyebrow="Flexible learning"
            title="Build a schedule you can sustain."
            description="Online does not mean effortless. Check the actual rhythm before you commit."
          />
          <CompactRail label="Online learning schedule checks" rows={2} columns={2} dark>
            {scheduleCards.map((card) => (
              <article
                key={card.title}
                className="flex min-h-36 gap-4 rounded-xl border border-white/15 bg-[#1b202a] p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f47b25] text-[#111827]">
                  <card.icon className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-base font-extrabold">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">{card.description}</p>
                </div>
              </article>
            ))}
          </CompactRail>
          <div className="mt-5 grid gap-3 rounded-xl border border-white/15 bg-[#1b202a] p-4 sm:grid-cols-4">
            {[
              ["Before work", "Live class"],
              ["Lunch break", "Short lesson"],
              ["After work", "Doubt session"],
              ["Weekend", "Assessment"],
            ].map(([time, task], index) => (
              <div key={time} className="flex items-center gap-3 sm:block">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-[#2449ad]">
                  {index + 1}
                </span>
                <div className="sm:mt-2">
                  <p className="text-xs font-extrabold">{time}</p>
                  <p className="mt-0.5 text-[11px] text-white/60">{task}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14 lg:py-20">
        <SectionIntro
          eyebrow="Transparent coverage"
          title="A catalogue you can inspect, not a promise you must trust."
          description="Counts describe this catalogue. They are not rankings, approval claims or outcome guarantees."
        />
        <CompactRail label="Catalogue coverage statistics" columns={4}>
          {catalogueStats.map((stat) => (
            <article
              key={stat.label}
              className="min-h-40 rounded-xl border border-border bg-card p-5"
            >
              <stat.icon
                className="h-5 w-5 text-[#a94300] dark:text-[#ffad70]"
                aria-hidden="true"
              />
              <p className="mt-5 font-display text-4xl font-black tracking-[-0.055em] text-[#325dd2] dark:text-[#8cb0ff]">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-bold text-muted-foreground">{stat.label}</p>
            </article>
          ))}
        </CompactRail>
        <p className="mt-4 rounded-xl border border-border bg-[#f5f7fa] px-5 py-4 text-center text-xs font-semibold leading-5 text-muted-foreground dark:bg-secondary/30">
          Information can change by intake. Reconfirm entitlement, fees and dates before paying.
        </p>
      </section>

      <section className="border-y border-border bg-[#f5f7fa] py-14 dark:bg-secondary/25 lg:py-20">
        <div className="container-page">
          <SectionIntro
            eyebrow="Decision guides"
            title="Guides you can save and discuss with family."
            description="Short, practical tools for making the decision together."
          />
          <CompactRail label="Online degree decision guides" columns={3}>
            {guides.map((guide) => (
              <Link
                key={guide.title}
                to={guide.to}
                className="group flex min-h-56 flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-[#325dd2]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf2ff] text-[#2449ad] dark:bg-[#263653] dark:text-[#b9ceff]">
                    <guide.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#a94300] dark:text-[#ffad70]">
                    {guide.meta}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-extrabold tracking-[-0.035em]">
                  {guide.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                  {guide.description}
                </p>
                <span className="mt-4 flex items-center gap-2 border-t border-border pt-3 text-xs font-extrabold text-[#2449ad] dark:text-[#8cb0ff]">
                  Open guide <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </CompactRail>
        </div>
      </section>

      <section className="container-page py-14 lg:py-20">
        <div className="rounded-2xl bg-[#325dd2] px-6 py-10 text-center text-white md:px-12 md:py-12">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#f47b25] text-[#111827]">
            <BadgeCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="mx-auto mt-5 max-w-3xl font-display text-3xl font-extrabold tracking-[-0.045em] md:text-4xl">
            Shortlist calmly. Verify carefully. Apply confidently.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/85 md:text-base">
            Browse first, compare what is documented, then speak with a counsellor if you want help
            organising the next step.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-[#f47b25] font-extrabold text-[#111827] hover:bg-[#d85f12]"
            >
              <Link to="/contact">
                Talk to a counsellor <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent font-extrabold text-white hover:bg-white hover:text-[#2449ad]"
            >
              <Link to="/universities">Explore all universities</Link>
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold text-white/85">
            {["No result gate", "Visible source status", "Human help available"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#ffd7ba]" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroMetric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-xl font-black text-[#131720] dark:text-foreground sm:text-2xl">
        {value}
      </p>
      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground sm:text-[11px]">
        {label}
      </p>
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
  action?: ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <p
          className={cn(
            "text-[11px] font-extrabold uppercase tracking-[0.17em]",
            dark ? "text-[#ffad70]" : "text-[#a94300] dark:text-[#ffad70]",
          )}
        >
          {eyebrow}
        </p>
        <h2
          className={cn(
            "mt-2.5 font-display text-3xl font-extrabold leading-tight tracking-[-0.045em] md:text-4xl",
            dark ? "text-white" : "text-[#131720] dark:text-foreground",
          )}
        >
          {title}
        </h2>
        <p
          className={cn(
            "mt-3 max-w-2xl text-sm leading-6 md:text-base md:leading-7",
            dark ? "text-white/70" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function TextLink({
  to,
  label,
}: {
  to: "/programs" | "/universities" | "/methodology";
  label: string;
}) {
  return (
    <Link
      to={to}
      className="inline-flex min-h-11 items-center gap-2 text-sm font-extrabold text-[#2449ad] hover:underline dark:text-[#8cb0ff]"
    >
      {label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

function VerificationCard({
  step,
  title,
  icon: Icon,
  items,
  primary = false,
}: {
  step: string;
  title: string;
  icon: typeof Building2;
  items: string[];
  primary?: boolean;
}) {
  return (
    <article
      className={cn(
        "rounded-xl border p-5",
        primary
          ? "border-[#325dd2] bg-[#325dd2] text-white"
          : "border-border bg-card text-foreground",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            primary ? "bg-white text-[#2449ad]" : "bg-[#edf2ff] text-[#2449ad]",
          )}
        >
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        <div>
          <p
            className={cn(
              "text-[10px] font-extrabold uppercase tracking-[0.14em]",
              primary ? "text-white/80" : "text-[#a94300] dark:text-[#ffad70]",
            )}
          >
            {step}
          </p>
          <h3 className="mt-0.5 font-display text-lg font-extrabold">{title}</h3>
        </div>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-3">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-xs font-semibold">
            <Check
              className={cn("h-3.5 w-3.5 shrink-0", primary ? "text-[#ffd7ba]" : "text-[#168258]")}
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
