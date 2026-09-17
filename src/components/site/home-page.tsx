import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Code2,
  GraduationCap,
  IndianRupee,
  Laptop2,
  Lightbulb,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  WalletCards,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { CompactRail } from "@/components/site/compact-rail";
import { UniversityLogo } from "@/components/site/university-logo";
import { Button } from "@/components/ui/button";
import { getAllSpecialisations } from "@/data/specialisations";
import {
  getSpecialisationCount,
  programCatalog,
  universities,
  universitiesOfferingProgram,
  type University,
} from "@/data/universities";
import { cn } from "@/lib/utils";

const courseTabs = ["Popular", "Masters", "Bachelors", "Diploma"] as const;
type CourseTab = (typeof courseTabs)[number];

const courseTabMeta: Record<CourseTab, { label: string; helper: string }> = {
  Popular: { label: "Popular courses", helper: "MBA, MCA, BBA & more" },
  Masters: { label: "PG courses", helper: "After graduation" },
  Bachelors: { label: "UG courses", helper: "After Class 12" },
  Diploma: { label: "Diploma & certificate", helper: "Build job-ready skills" },
};

// Demand-led ordering for the first browse view. MBA remains the dominant
// online degree category, while MCA/BCA and BBA are the next high-intent
// technology and management directions in the current India market.
const popularCourseOrder = [
  "MBA",
  "MCA",
  "BCA",
  "BBA",
  "M.Com",
  "B.Com",
  "MSc Data Science",
  "BA",
  "MA JMC",
  "MA English",
  "PGD DS",
  "MA Economics",
  "MA Political Science",
  "MSW",
] as const;

const popularCourseRank = new Map(popularCourseOrder.map((code, index) => [code, index]));

function courseMark(code: string) {
  if (code === "MSc Data Science") return "MSc";
  if (code === "PGD DS") return "PGD";
  if (code.startsWith("MA ")) return "MA";
  return code;
}

const heroGoals = [
  { label: "Online degree", value: "flexible-study", icon: Laptop2 },
  {
    label: "MBA & management",
    value: "career-growth",
    education: "graduate",
    field: "business",
    icon: BriefcaseBusiness,
  },
  { label: "After Class 12", value: "career-growth", education: "12th", icon: GraduationCap },
  { label: "Affordable options", value: "lower-fees", icon: IndianRupee },
  { label: "Career clarity", value: "career-switch", field: "unsure", icon: Target },
] as const;

const heroRoles = ["Student", "Parent", "Professional"] as const;

const quickLinks = [
  { label: "Universities", helper: "Browse all", to: "/universities" as const, icon: Building2 },
  { label: "Courses", helper: "Choose a degree", to: "/programs" as const, icon: GraduationCap },
  { label: "Find my fit", helper: "3 quick questions", to: "/finder" as const, icon: Sparkles },
  { label: "Compare", helper: "Keep 3 side by side", to: "/compare" as const, icon: BarChart3 },
] as const;

const heroTrustPoints = [
  { label: "Browse before enquiring", icon: Search },
  { label: "Compare without signing up", icon: BarChart3 },
  { label: "Check your exact intake", icon: ShieldCheck },
  { label: "Human guidance when needed", icon: Users },
] as const;

const decisionTools = [
  {
    title: "Course finder",
    description: "Tell us your goal and get a starting shortlist.",
    icon: Target,
    to: "/finder" as const,
    color: "blue",
  },
  {
    title: "University compare",
    description: "Keep up to three options together while you decide.",
    icon: BarChart3,
    to: "/compare" as const,
    color: "orange",
  },
  {
    title: "Specialisation explorer",
    description: "Connect subjects with the work you want to do.",
    icon: Lightbulb,
    to: "/specialisations" as const,
    color: "green",
  },
  {
    title: "Before-you-pay check",
    description: "Know what to confirm for your exact intake.",
    icon: ShieldCheck,
    to: "/methodology" as const,
    color: "violet",
  },
] as const;

const guides = [
  {
    title: "Is an online degree right for me?",
    description: "Think through time, learning style and your reason for studying.",
    meta: "2 minute read",
    icon: Laptop2,
    to: "/finder" as const,
  },
  {
    title: "How should I compare universities?",
    description: "Focus on the course, total cost, classes, exams and learner support.",
    meta: "Simple checklist",
    icon: BarChart3,
    to: "/compare" as const,
  },
  {
    title: "Which specialisation should I choose?",
    description: "Start with the role you want, then look closely at the subjects.",
    meta: "Career guide",
    icon: Lightbulb,
    to: "/specialisations" as const,
  },
  {
    title: "What should my family ask?",
    description: "A short list for discussing fees, time and support at home.",
    meta: "Family guide",
    icon: Users,
    to: "/contact" as const,
  },
] as const;

const faqs = [
  {
    question: "How do I find an online course that suits me?",
    answer:
      "Start with the qualification you already have, the career direction you want and the time you can study each week. Our course finder turns those answers into a useful starting shortlist.",
  },
  {
    question: "Can I compare universities without sharing my phone number?",
    answer:
      "Yes. You can browse courses, open university pages and compare up to three options before deciding whether you want counselling help.",
  },
  {
    question: "What should I confirm before paying a university?",
    answer:
      "Confirm the legal university name, the exact programme, Online mode, academic session, full fee schedule and refund policy through the university and the relevant official portal.",
  },
  {
    question: "Can Diya choose a university for me?",
    answer:
      "Diya can help you navigate the choices and explain what to compare. Your final decision should still use the university's current official information and your own priorities.",
  },
] as const;

const featuredUniversityOrder = [
  "amity-university-online",
  "manipal-university-online",
  "jain-university-online",
  "chandigarh-university-online",
  "lpu-online",
  "dy-patil-university-online",
  "shoolini-university-online",
  "sikkim-manipal-university-online",
  "uttaranchal-university-online",
  "vignan-university-online",
];

function orderedUniversities() {
  const priority = new Map(featuredUniversityOrder.map((slug, index) => [slug, index]));
  return [...universities].sort((a, b) => {
    const aPriority = priority.get(a.slug) ?? 999;
    const bPriority = priority.get(b.slug) ?? 999;
    return aPriority - bPriority || a.name.localeCompare(b.name);
  });
}

function currentProgramCount(university: University) {
  if (university.profileDepth === "directory" || university.verificationCurrent !== true) return 0;
  return university.programs.filter((program) => program.entitlementStatus === "verified").length;
}

export function HomePage() {
  const [heroGoal, setHeroGoal] = useState<(typeof heroGoals)[number]["label"]>("Online degree");
  const [heroRole, setHeroRole] = useState<(typeof heroRoles)[number]>("Student");
  const [courseLevel, setCourseLevel] = useState<CourseTab>("Popular");

  const selectedHeroGoal = heroGoals.find((goal) => goal.label === heroGoal) ?? heroGoals[0];
  const visibleCourses = useMemo(() => {
    const courses =
      courseLevel === "Popular"
        ? [...programCatalog]
        : programCatalog.filter((program) => program.level === courseLevel);
    return courses.sort(
      (a, b) =>
        (popularCourseRank.get(a.code as (typeof popularCourseOrder)[number]) ?? 999) -
          (popularCourseRank.get(b.code as (typeof popularCourseOrder)[number]) ?? 999) ||
        a.name.localeCompare(b.name),
    );
  }, [courseLevel]);
  const featuredUniversities = useMemo(() => orderedUniversities().slice(0, 12), []);
  const featuredSpecialisations = useMemo(() => getAllSpecialisations().slice(0, 14), []);

  return (
    <div className="overflow-hidden bg-background text-foreground">
      <HeroSection
        heroGoal={heroGoal}
        heroRole={heroRole}
        selectedHeroGoal={selectedHeroGoal}
        onGoalChange={setHeroGoal}
        onRoleChange={setHeroRole}
      />

      <section className="container-page relative z-10 border-b border-border py-5 sm:py-6 lg:py-7">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a94300] dark:text-[#ffad70]">
              Start here
            </p>
            <h2 className="mt-1 font-display text-lg font-extrabold sm:text-xl">
              What would you like to do?
            </h2>
          </div>
          <span className="hidden text-xs font-semibold text-muted-foreground sm:block">
            No sign-up needed
          </span>
        </div>
        <nav aria-label="Popular ways to start" className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {quickLinks.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="group flex min-h-[4.5rem] items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2.5 shadow-card transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-[#86a2e8] hover:shadow-lift active:scale-[0.985] motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#325dd2]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf2ff] text-[#2449ad] transition-colors group-hover:bg-[#325dd2] group-hover:text-white dark:bg-[#263653] dark:text-[#b9ceff]">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-extrabold leading-4">{item.label}</span>
                <span className="mt-1 block text-[10px] font-semibold leading-3 text-muted-foreground sm:text-[11px]">
                  {item.helper}
                </span>
              </span>
            </Link>
          ))}
        </nav>
      </section>

      <section className="container-page py-9 sm:py-11 lg:py-14">
        <SectionIntro
          eyebrow="Course explorer"
          title="Explore courses that match your next step"
          description="Choose your study level, then open a course to see university profiles, specialisations and important details."
          action={<TextLink to="/programs" label="View all courses" />}
        />

        <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <CourseTrustStat
            icon={Building2}
            value={String(universities.length)}
            label="University profiles"
          />
          <CourseTrustStat
            icon={GraduationCap}
            value={String(programCatalog.length)}
            label="Course families"
            bordered
          />
          <CourseTrustStat icon={BarChart3} value="3" label="Compare together" />
        </div>

        <div className="mt-5 min-w-0 lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:items-start lg:gap-5">
          <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-col lg:rounded-2xl lg:border lg:border-border lg:bg-card lg:p-2 lg:shadow-lift">
            <p className="hidden px-3 pb-1 pt-2 text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground lg:block">
              Browse courses
            </p>
            <div
              className="contents lg:flex lg:flex-col lg:gap-1"
              role="group"
              aria-label="Course level"
            >
              {courseTabs.map((tab) => {
                const selected = courseLevel === tab;
                const meta = courseTabMeta[tab];
                const count =
                  tab === "Popular"
                    ? programCatalog.length
                    : programCatalog.filter((program) => program.level === tab).length;

                return (
                  <button
                    key={tab}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setCourseLevel(tab)}
                    className={cn(
                      "flex min-h-11 shrink-0 items-center justify-between gap-3 rounded-full border px-4 text-left text-xs font-extrabold transition-[background-color,border-color,color,transform] active:scale-[0.98] lg:min-h-[3.6rem] lg:w-full lg:rounded-xl lg:border-transparent lg:px-3",
                      selected
                        ? "border-[#325dd2] bg-[#325dd2] text-white shadow-card"
                        : "border-border bg-card text-muted-foreground hover:border-[#86a2e8] hover:bg-[#f6f8fc] hover:text-foreground lg:bg-transparent",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block">{meta.label}</span>
                      <span
                        className={cn(
                          "mt-1 hidden text-[9px] font-bold leading-3 lg:block",
                          selected ? "text-white/75" : "text-[#325dd2] dark:text-[#8cb0ff]",
                        )}
                      >
                        {meta.helper}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "hidden rounded-full px-2 py-0.5 text-[10px] lg:inline-flex",
                        selected ? "bg-white/15 text-white" : "bg-secondary text-muted-foreground",
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
            <Link
              to="/specialisations"
              className="hidden min-h-[3.6rem] flex-col justify-center rounded-xl px-3 text-xs font-extrabold text-foreground hover:bg-[#f6f8fc] lg:flex"
            >
              Specialisations
              <span className="mt-1 text-[9px] font-bold text-[#325dd2] dark:text-[#8cb0ff]">
                Explore career directions
              </span>
            </Link>
            <Link
              to="/compare"
              className="hidden min-h-[3.6rem] flex-col justify-center rounded-xl px-3 text-xs font-extrabold text-foreground hover:bg-[#f6f8fc] lg:flex"
            >
              Compare universities
              <span className="mt-1 text-[9px] font-bold text-[#325dd2] dark:text-[#8cb0ff]">
                Keep three side by side
              </span>
            </Link>
            <Link
              to="/programs"
              className="hidden min-h-11 items-center justify-between border-t border-border px-3 pt-2 text-xs font-extrabold text-[#2449ad] hover:text-[#173b68] dark:text-[#8cb0ff] lg:flex"
            >
              All online courses <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <CompactRail
            label={`${courseLevel} online courses`}
            rows={2}
            columns={4}
            className="mt-2 lg:mt-0"
            railClassName="auto-cols-[47%] gap-2.5 sm:auto-cols-[31.5%] lg:auto-cols-[calc((100%-2.5rem)/6)] lg:gap-2"
          >
            {visibleCourses.map((program, index) => {
              const offers = universitiesOfferingProgram(program.slug);
              const isPriorityCourse = program.code === "MBA" || program.code === "MCA";

              return (
                <Link
                  key={program.slug}
                  to="/programs/$programSlug"
                  params={{ programSlug: program.slug }}
                  aria-label={`Explore Online ${program.code}, ${program.name}`}
                  className="group flex h-[9rem] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-[border-color,box-shadow,transform] duration-300 ease-out active:scale-[0.985] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 hover:-translate-y-1 hover:border-[#7699ee] hover:shadow-lift"
                  style={{ animationDelay: `${Math.min(index, 7) * 45}ms` }}
                >
                  <span className="flex min-h-0 flex-1 flex-col items-center px-2 pb-2 pt-1.5 text-center">
                    <span
                      className={cn(
                        "inline-flex min-h-5 max-w-full items-center truncate rounded-full px-2 text-[9px] font-black",
                        isPriorityCourse
                          ? "bg-[#dff8ec] text-[#0f7553] dark:bg-[#123b30] dark:text-[#77ddb4]"
                          : "bg-[#fff0e0] text-[#a94300] dark:bg-[#3d281c] dark:text-[#ffad70]",
                      )}
                    >
                      {isPriorityCourse ? "Popular" : `${program.durationYears} year course`}
                    </span>
                    <span
                      className={cn(
                        "mt-1.5 flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-black transition-transform duration-300 group-hover:scale-110",
                        program.code === "MBA" || program.code === "BBA"
                          ? "bg-[#fff0e6] text-[#a94300] dark:bg-[#3d281c] dark:text-[#ffad70]"
                          : "bg-[#edf2ff] text-[#2449ad] dark:bg-[#263653] dark:text-[#b9ceff]",
                      )}
                    >
                      {courseMark(program.code)}
                    </span>
                    <span className="mt-1 line-clamp-2 min-h-8 text-[11px] font-extrabold leading-4 text-foreground sm:text-xs">
                      Online {program.code}
                    </span>
                    <span className="mt-auto truncate text-[9px] font-semibold text-muted-foreground sm:text-[10px]">
                      {offers.length
                        ? `${offers.length} university ${offers.length === 1 ? "profile" : "profiles"}`
                        : program.name}
                    </span>
                  </span>
                  <span className="flex min-h-7 shrink-0 items-center justify-center gap-1 bg-[#325dd2] px-2 text-[10px] font-extrabold text-white transition-colors duration-200 group-hover:bg-[#2449ad] sm:text-[11px]">
                    View options
                    <ChevronRight
                      className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              );
            })}
          </CompactRail>
        </div>
      </section>

      <section className="border-y border-border bg-[#f6f8fc] py-9 dark:bg-secondary/25 lg:py-14">
        <div className="container-page">
          <SectionIntro
            eyebrow="Your decision toolkit"
            title="Everything you need in one place"
            description="Explore on your own, then ask Diya or a counsellor when you want help."
          />
          <div className="mt-5 grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
            {decisionTools.map((tool) => (
              <ToolCard key={tool.title} {...tool} />
            ))}
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("dekhocampus:open-diya"))}
            className="mt-4 flex min-h-[4.5rem] w-full items-center gap-3 rounded-2xl bg-[#325dd2] p-3 text-left text-white shadow-card transition-[transform,background-color,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#2449ad] hover:shadow-lift active:scale-[0.99] motion-reduce:transform-none"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
              <img
                src="/diya-ai.webp"
                alt=""
                width={90}
                height={96}
                className="h-12 w-12 object-cover"
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-base font-extrabold">Hi, I’m Diya</span>
              <span className="mt-0.5 block text-xs leading-4 text-white/80">
                Ask me to find a course, university or specialisation.
              </span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className="container-page py-9 lg:py-14">
        <SectionIntro
          eyebrow="Online universities"
          title="Explore popular university profiles"
          description="Start with familiar names or browse every university profile."
          action={<TextLink to="/universities" label={`View all ${universities.length}`} />}
        />
        <CompactRail
          label="Online universities"
          rows={2}
          columns={4}
          railClassName="auto-cols-[minmax(15.5rem,82%)] min-[390px]:auto-cols-[minmax(10.5rem,47%)] lg:auto-cols-[calc((100%-3rem)/4)]"
        >
          {featuredUniversities.map((university, index) => {
            const confirmedCourses = currentProgramCount(university);
            return (
              <Link
                key={university.slug}
                to="/universities/$universitySlug"
                params={{ universitySlug: university.slug }}
                className="group flex min-h-[7.75rem] flex-col rounded-2xl border border-border bg-card p-3 shadow-card transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-[#86a2e8] hover:shadow-lift active:scale-[0.985] motion-reduce:transform-none sm:min-h-[8rem] sm:p-3.5"
              >
                <span className="flex items-start justify-between gap-2">
                  <UniversityLogo
                    university={university}
                    size="md"
                    priority={index < 4}
                    className="h-12 w-[5.75rem] rounded-xl bg-white"
                  />
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[#2449ad]" />
                </span>
                <span className="mt-2 line-clamp-2 font-display text-sm font-extrabold leading-[1.125rem]">
                  {university.shortName}
                </span>
                <span className="mt-auto line-clamp-2 pt-1 text-[10px] font-semibold leading-4 text-muted-foreground">
                  {university.state || "India"} ·{" "}
                  {confirmedCourses
                    ? `${confirmedCourses} current ${confirmedCourses === 1 ? "course" : "courses"}`
                    : university.programs.length
                      ? "Course profiles · confirm availability"
                      : "View university profile"}
                </span>
              </Link>
            );
          })}
        </CompactRail>

        <div className="mt-6 overflow-hidden rounded-2xl bg-[#131720] text-white">
          <div className="grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-7">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#ffad70]">
                Side-by-side view
              </p>
              <h3 className="mt-2 font-display text-xl font-extrabold sm:text-2xl">
                Comparing a few universities?
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
                Keep up to three options together and focus on the differences that matter to you.
              </p>
            </div>
            <Button
              asChild
              className="min-h-12 bg-[#f47b25] font-extrabold text-[#111827] hover:bg-[#e56e1e]"
            >
              <Link to="/compare">
                Start comparing <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-[#f6f8fc] py-9 dark:bg-secondary/25 lg:py-14">
        <div className="container-page">
          <SectionIntro
            eyebrow="Popular specialisations"
            title="Choose a direction, not just a label"
            description="Explore subjects and the kinds of roles they can support."
            action={<TextLink to="/specialisations" label="See all specialisations" />}
          />
          <CompactRail
            label="Popular online degree specialisations"
            rows={2}
            columns={4}
            railClassName="auto-cols-[minmax(15.5rem,82%)] min-[390px]:auto-cols-[minmax(10.5rem,47%)] lg:auto-cols-[calc((100%-3rem)/4)]"
          >
            {featuredSpecialisations.map((specialisation, index) => (
              <Link
                key={specialisation.slug}
                to="/specialisations/$specialisationSlug"
                params={{ specialisationSlug: specialisation.slug }}
                className="group flex min-h-[6.75rem] items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-card transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-[#86a2e8] hover:shadow-lift active:scale-[0.985] motion-reduce:transform-none"
              >
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                    index % 2
                      ? "bg-[#fff0e6] text-[#a94300] dark:bg-[#3d281c] dark:text-[#ffad70]"
                      : "bg-[#edf2ff] text-[#2449ad] dark:bg-[#263653] dark:text-[#b9ceff]",
                  )}
                >
                  {index % 2 ? <WalletCards className="h-5 w-5" /> : <Code2 className="h-5 w-5" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 block text-sm font-extrabold leading-[1.125rem]">
                    {specialisation.name}
                  </span>
                  <span className="mt-1 block text-[10px] font-semibold text-muted-foreground">
                    Online {specialisation.program.code}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </CompactRail>
        </div>
      </section>

      <section className="container-page py-8 lg:py-12">
        <SectionIntro
          eyebrow="A calmer way to decide"
          title="From confused to confident in three steps"
          description="No pressure. Move at your pace and keep your shortlist organised."
        />
        <ol className="mt-6 grid gap-3 md:grid-cols-3">
          {[
            ["01", "Explore", "Browse courses, universities and specialisations."],
            ["02", "Compare", "Keep the options that fit your goals and budget."],
            ["03", "Confirm", "Check current details before you apply or pay."],
          ].map(([step, title, description]) => (
            <li
              key={step}
              className="flex min-h-24 items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card"
            >
              <span className="font-display text-3xl font-black text-[#c8d5f8] dark:text-[#41547d]">
                {step}
              </span>
              <span>
                <span className="block font-display text-base font-extrabold">{title}</span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  {description}
                </span>
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-6 grid grid-cols-3 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <SimpleStat value={String(universities.length)} label="Universities" />
          <SimpleStat value={String(programCatalog.length)} label="Courses" bordered />
          <SimpleStat value={String(getSpecialisationCount())} label="Specialisations" />
        </div>
        <p className="mt-3 text-center text-[11px] leading-5 text-muted-foreground">
          These are the profiles and study options currently available to browse on DekhoCampus.
        </p>
      </section>

      <section className="border-y border-border bg-surface py-8 dark:bg-secondary/25 lg:py-12">
        <div className="container-page">
          <SectionIntro
            eyebrow="Helpful reads"
            title="Guides you can discuss with your family"
            description="Plain answers to the questions that usually come up before enrolment."
          />
          <CompactRail
            label="Online degree guides"
            columns={4}
            railClassName="auto-cols-[minmax(16rem,84%)] min-[390px]:auto-cols-[minmax(10.75rem,47%)] lg:auto-cols-[calc((100%-3rem)/4)]"
          >
            {guides.map((guide) => (
              <Link
                key={guide.title}
                to={guide.to}
                className="group flex min-h-[9.25rem] flex-col rounded-2xl border border-border bg-card p-4 shadow-card transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-[#86a2e8] hover:shadow-lift active:scale-[0.985] motion-reduce:transform-none"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf2ff] text-[#2449ad] dark:bg-[#263653] dark:text-[#b9ceff]">
                    <guide.icon className="h-5 w-5" />
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground">{guide.meta}</span>
                </span>
                <span className="mt-3 block font-display text-sm font-extrabold leading-5">
                  {guide.title}
                </span>
                <span className="mt-1 line-clamp-2 text-[11px] leading-[1.125rem] text-muted-foreground">
                  {guide.description}
                </span>
                <span className="mt-auto flex items-center gap-1 pt-2 text-[11px] font-extrabold text-[#2449ad] dark:text-[#8cb0ff]">
                  Read more{" "}
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </CompactRail>
        </div>
      </section>

      <section className="container-page py-8 lg:py-12">
        <SectionIntro
          eyebrow="Common questions"
          title="Let’s clear up a few doubts"
          description="Quick answers before you begin exploring."
        />
        <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          {faqs.map((faq, index) => (
            <details key={faq.question} className="group" open={index === 0}>
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-extrabold marker:content-none sm:px-5">
                {faq.question}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-lg text-[#2449ad] transition-transform group-open:rotate-45 dark:text-[#8cb0ff]">
                  +
                </span>
              </summary>
              <p className="px-4 pb-5 text-sm leading-6 text-muted-foreground sm:px-5">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="container-page pb-10 pt-2 lg:pb-16">
        <div className="overflow-hidden rounded-[1.75rem] bg-[#325dd2] px-5 py-8 text-white shadow-lift sm:px-8 sm:py-10 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#ffd7ba]">
                <CheckCircle2 className="h-4 w-4" /> Here when you need us
              </span>
              <h2 className="mt-3 max-w-3xl font-display text-2xl font-extrabold leading-tight sm:text-3xl">
                Still unsure? Let’s organise your options together.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">
                Bring your questions, budget and shortlist. A counsellor can help you plan the next
                step.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button
                asChild
                size="lg"
                className="min-h-12 bg-[#f47b25] font-extrabold text-[#111827] hover:bg-[#e56e1e]"
              >
                <Link to="/contact">
                  Talk to a counsellor <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="min-h-12 border-white/35 bg-transparent font-extrabold text-white hover:bg-white hover:text-[#2449ad]"
              >
                <Link to="/finder">Find my course</Link>
              </Button>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/15 pt-5 text-xs font-semibold text-white/80">
            {["Browse before enquiring", "Compare at your pace", "Human help is optional"].map(
              (item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#ffd7ba]" /> {item}
                </span>
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroSection({
  heroGoal,
  heroRole,
  selectedHeroGoal,
  onGoalChange,
  onRoleChange,
}: {
  heroGoal: (typeof heroGoals)[number]["label"];
  heroRole: (typeof heroRoles)[number];
  selectedHeroGoal: (typeof heroGoals)[number];
  onGoalChange: (goal: (typeof heroGoals)[number]["label"]) => void;
  onRoleChange: (role: (typeof heroRoles)[number]) => void;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-[#d8e0f1] bg-white dark:border-border dark:bg-background">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[#f47b25]"
        aria-hidden="true"
      />
      <div className="container-page relative grid min-w-0 gap-8 pb-9 pt-7 sm:pb-12 sm:pt-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.72fr)] lg:items-center lg:gap-14 lg:py-14 xl:min-h-[570px]">
        <div className="min-w-0 max-w-[760px]">
          <div className="inline-flex min-h-8 items-center gap-2 rounded-full border border-[#f0d2bc] bg-[#fff8f3] px-3 text-[10px] font-black uppercase tracking-[0.14em] text-[#a94300] dark:border-[#704128] dark:bg-[#2d211a] dark:text-[#ffad70]">
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
            Compare · choose · move forward
          </div>

          <h1 className="mt-4 max-w-[740px] font-display text-[2.4rem] font-black leading-[1.04] tracking-[-0.052em] text-[#131720] dark:text-foreground min-[390px]:text-[2.7rem] sm:mt-5 sm:text-[3.65rem] xl:text-[4.15rem]">
            Discover your ideal{" "}
            <span className="text-[#325dd2] dark:text-[#8cb0ff]">online path.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#536176] dark:text-muted-foreground sm:mt-5 sm:text-lg sm:leading-8">
            Explore courses, compare universities and understand the next step—all in one calm, easy
            place.
          </p>

          <form action="/search" className="mt-4 max-w-2xl sm:mt-5" role="search">
            <div className="flex min-h-14 items-center gap-2 rounded-2xl border border-input bg-card p-1.5 pl-4 shadow-lift sm:min-h-16 sm:gap-3 sm:pl-5">
              <Search className="h-5 w-5 shrink-0 text-[#667386]" aria-hidden="true" />
              <input
                name="q"
                aria-label="Search universities or online courses"
                placeholder="Search MBA, MCA, BBA, university..."
                className="h-11 min-w-0 flex-1 rounded-md bg-transparent text-sm text-foreground outline-none placeholder:text-[#667386] placeholder:opacity-100 focus-visible:ring-2 focus-visible:ring-[#325dd2] sm:text-base"
              />
              <button
                type="submit"
                aria-label="Search courses and universities"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#325dd2] px-4 text-sm font-extrabold text-white transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-[#2449ad] active:scale-[0.98] sm:h-12 sm:min-w-28 sm:px-5"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                <span>Search</span>
              </button>
            </div>
          </form>

          <div className="mt-3 grid max-w-2xl gap-2 min-[390px]:grid-cols-2">
            <Button
              asChild
              className="min-h-11 w-full bg-[#102a4c] font-extrabold text-white hover:bg-[#173b68]"
            >
              <Link to="/universities">
                <Building2 className="mr-2 h-4 w-4" /> Explore universities
              </Link>
            </Button>
            <Button
              asChild
              className="min-h-11 w-full bg-[#f47b25] font-extrabold text-[#111827] hover:bg-[#e56e1e]"
            >
              <Link to="/contact">
                <Users className="mr-2 h-4 w-4" /> Free counselling
              </Link>
            </Button>
          </div>

          <div className="mt-3 flex max-w-2xl items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="shrink-0 text-[11px] font-bold text-muted-foreground">Popular:</span>
            {[
              { label: "Online MBA", query: "MBA" },
              { label: "Online BBA", query: "BBA" },
              { label: "Online MCA", query: "MCA" },
            ].map((prompt) => (
              <Link
                key={prompt.label}
                to="/search"
                search={{ q: prompt.query }}
                className="inline-flex min-h-9 shrink-0 items-center rounded-full border border-border bg-card px-3 text-[11px] font-bold text-muted-foreground transition-colors hover:border-[#325dd2] hover:text-foreground"
              >
                {prompt.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 grid max-w-2xl grid-cols-2 gap-x-3 gap-y-2 border-t border-[#e2e6ee] pt-4 dark:border-border">
            {heroTrustPoints.map((item) => (
              <span
                key={item.label}
                className="flex min-w-0 items-center gap-2 text-[11px] font-bold leading-4 text-[#344054] dark:text-muted-foreground sm:text-xs"
              >
                <item.icon
                  className="h-4 w-4 shrink-0 text-[#325dd2] dark:text-[#8cb0ff]"
                  aria-hidden="true"
                />
                {item.label}
              </span>
            ))}
          </div>

          <div className="mt-5 lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                Explore university profiles
              </p>
              <Link
                to="/universities"
                className="text-[11px] font-extrabold text-[#2449ad] dark:text-[#8cb0ff]"
              >
                View all
              </Link>
            </div>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {orderedUniversities()
                .slice(0, 6)
                .map((university, index) => (
                  <Link
                    key={university.slug}
                    to="/universities/$universitySlug"
                    params={{ universitySlug: university.slug }}
                    aria-label={`Explore ${university.name}`}
                    className="flex h-14 w-[4.65rem] shrink-0 items-center justify-center rounded-xl border border-border bg-card p-1.5 shadow-card"
                  >
                    <UniversityLogo
                      university={university}
                      size="sm"
                      priority={index < 3}
                      className="h-10 w-full border-0 bg-white"
                    />
                  </Link>
                ))}
            </div>
          </div>
        </div>

        <aside
          className="hidden w-full min-w-0 overflow-hidden rounded-[1.75rem] border border-[#d4dced] bg-[#f7f9fd] p-5 shadow-lift dark:bg-card lg:block sm:p-6"
          aria-label="Find a suitable course"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[#325dd2] shadow-card">
                <img
                  src="/diya-ai.webp"
                  alt=""
                  width={90}
                  height={96}
                  className="h-11 w-11 object-cover"
                />
              </span>
              <span>
                <span className="block text-sm font-extrabold">Start with Diya</span>
                <span className="block text-[10px] font-semibold text-muted-foreground">
                  A simple starting shortlist
                </span>
              </span>
            </span>
            <span className="rounded-full bg-[#eaf7f1] px-2.5 py-1 text-[10px] font-extrabold text-[#166b4e] dark:bg-[#123b30] dark:text-[#77ddb4]">
              1 minute
            </span>
          </div>
          <h2 className="mt-3 font-display text-lg font-extrabold leading-tight sm:mt-4 sm:text-2xl">
            What matters most right now?
          </h2>
          <p className="mt-1.5 text-xs leading-5 text-muted-foreground sm:text-sm">
            Choose one goal. You can change it later.
          </p>

          <fieldset className="mt-3 grid grid-cols-2 gap-2 sm:mt-4">
            <legend className="sr-only">Choose your goal</legend>
            {heroGoals.map((goal, index) => {
              const selected = heroGoal === goal.label;
              return (
                <button
                  key={goal.label}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onGoalChange(goal.label)}
                  className={cn(
                    "flex min-h-11 items-center gap-2 rounded-xl border px-2 text-left text-[10px] font-bold transition-colors sm:min-h-12 sm:px-3 sm:text-xs",
                    index === heroGoals.length - 1 && "col-span-2",
                    selected
                      ? "border-[#325dd2] bg-[#edf2ff] text-[#2449ad] dark:bg-[#263653] dark:text-[#b9ceff]"
                      : "border-border bg-background text-muted-foreground hover:border-[#9bb5f1] hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg sm:h-8 sm:w-8",
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

          <fieldset className="mt-3 sm:mt-4">
            <legend className="mb-2 text-[11px] font-extrabold">I am a</legend>
            <div className="grid grid-cols-3 rounded-xl bg-secondary p-1">
              {heroRoles.map((role) => (
                <button
                  key={role}
                  type="button"
                  aria-pressed={heroRole === role}
                  onClick={() => onRoleChange(role)}
                  className={cn(
                    "min-h-10 rounded-lg px-1 text-[10px] font-extrabold transition-colors sm:text-[11px]",
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
            className="mt-3 min-h-11 w-full bg-[#325dd2] font-extrabold text-white hover:bg-[#2449ad] sm:mt-4 sm:min-h-12"
          >
            <Link
              to="/finder"
              search={{
                goal: selectedHeroGoal.value,
                audience: heroRole.toLowerCase() as Lowercase<typeof heroRole>,
                ...("education" in selectedHeroGoal
                  ? { education: selectedHeroGoal.education }
                  : {}),
                ...("field" in selectedHeroGoal ? { field: selectedHeroGoal.field } : {}),
              }}
            >
              Show my options <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <p className="mt-2 text-center text-[10px] font-semibold text-muted-foreground">
            See your starting options before any enquiry form
          </p>
        </aside>
      </div>
    </section>
  );
}

function ToolCard({ title, description, icon: Icon, to, color }: (typeof decisionTools)[number]) {
  const colorClass = {
    blue: "bg-[#edf2ff] text-[#2449ad] dark:bg-[#263653] dark:text-[#b9ceff]",
    orange: "bg-[#fff0e6] text-[#a94300] dark:bg-[#3d281c] dark:text-[#ffad70]",
    green: "bg-[#eaf7f1] text-[#166b4e] dark:bg-[#123b30] dark:text-[#77ddb4]",
    violet: "bg-[#f2edff] text-[#6243a8] dark:bg-[#302648] dark:text-[#cab8ff]",
  }[color];

  return (
    <Link
      to={to}
      className="group flex min-h-[7.75rem] flex-col rounded-2xl border border-border bg-card p-3 shadow-card transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-[#86a2e8] hover:shadow-lift active:scale-[0.985] motion-reduce:transform-none sm:min-h-[8.25rem] sm:p-4"
    >
      <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", colorClass)}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="mt-3 block text-sm font-extrabold leading-4 sm:text-base sm:leading-5">
        {title}
      </span>
      <span className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">
        {description}
      </span>
      <ArrowRight className="mt-auto h-4 w-4 self-end text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[#2449ad]" />
    </Link>
  );
}

function CourseTrustStat({
  icon: Icon,
  value,
  label,
  bordered = false,
}: {
  icon: typeof Building2;
  value: string;
  label: string;
  bordered?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center justify-center gap-2 px-2 py-3 sm:gap-3 sm:py-4",
        bordered && "border-x border-border",
      )}
    >
      <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf2ff] text-[#2449ad] dark:bg-[#263653] dark:text-[#b9ceff] sm:flex">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 text-center sm:text-left">
        <span className="block font-display text-lg font-black leading-5 text-[#131720] dark:text-foreground sm:text-xl">
          {value}
        </span>
        <span className="mt-0.5 block text-[9px] font-bold leading-3 text-muted-foreground sm:text-[11px]">
          {label}
        </span>
      </span>
    </div>
  );
}

function SimpleStat({
  value,
  label,
  bordered = false,
}: {
  value: string;
  label: string;
  bordered?: boolean;
}) {
  return (
    <div
      className={cn("min-w-0 px-2 py-4 text-center sm:py-5", bordered && "border-x border-border")}
    >
      <p className="font-display text-xl font-extrabold text-[#325dd2] dark:text-[#8cb0ff] sm:text-2xl">
        {value}
      </p>
      <p className="mt-1 text-[10px] font-bold uppercase leading-3 tracking-[0.04em] text-muted-foreground sm:text-[11px]">
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
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-5">
      <div className="max-w-3xl">
        <p className="brand-kicker">{eyebrow}</p>
        <h2 className="mt-2 font-display text-[1.65rem] font-extrabold leading-[1.12] tracking-[-0.04em] text-[#131720] dark:text-foreground sm:text-[2rem] lg:text-[2.35rem]">
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
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
  to: "/programs" | "/universities" | "/specialisations";
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
