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
  type LucideIcon,
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

type CourseVisual = {
  icon: LucideIcon;
  iconClassName: string;
  stageClassName: string;
};

function getCourseVisual(code: string): CourseVisual {
  if (code === "MBA") {
    return {
      icon: BriefcaseBusiness,
      stageClassName: "border-[#f5c9a8] bg-[#fff6ef] dark:border-[#684124] dark:bg-[#34271e]",
      iconClassName: "text-[#d85d12] dark:text-[#ffad70]",
    };
  }

  if (code === "BBA" || code === "M.Com" || code === "B.Com") {
    return {
      icon: code === "BBA" ? BarChart3 : WalletCards,
      stageClassName: "border-[#bcd8cc] bg-[#f1faf6] dark:border-[#285443] dark:bg-[#17332a]",
      iconClassName: "text-[#167453] dark:text-[#78d8b5]",
    };
  }

  if (code === "MCA" || code === "BCA" || code === "MSc Data Science" || code === "PGD DS") {
    return {
      icon: code === "BCA" ? Laptop2 : Code2,
      stageClassName: "border-[#c7d5f6] bg-[#f2f6ff] dark:border-[#345181] dark:bg-[#1d2d4a]",
      iconClassName: "text-[#2458d3] dark:text-[#9bb8ff]",
    };
  }

  if (code === "MSW") {
    return {
      icon: Users,
      stageClassName: "border-[#f0c5cf] bg-[#fff4f6] dark:border-[#6e3948] dark:bg-[#38232a]",
      iconClassName: "text-[#b93f5d] dark:text-[#ff9db4]",
    };
  }

  if (code === "BA" || code.startsWith("MA ")) {
    return {
      icon: BookOpenCheck,
      stageClassName: "border-[#d7ccf2] bg-[#f8f5ff] dark:border-[#504273] dark:bg-[#2a243b]",
      iconClassName: "text-[#6e4db7] dark:text-[#bea8f2]",
    };
  }

  return {
    icon: GraduationCap,
    stageClassName: "border-[#c7d5f6] bg-[#f2f6ff] dark:border-[#345181] dark:bg-[#1d2d4a]",
    iconClassName: "text-[#2458d3] dark:text-[#9bb8ff]",
  };
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
  { label: "Course finder", helper: "2 questions", to: "/finder" as const, icon: Target },
  { label: "Compare", helper: "Up to 3 options", to: "/compare" as const, icon: BarChart3 },
] as const;

const heroTrustPoints = [
  { label: "Browse before enquiring", icon: Search },
  { label: "Compare without signing up", icon: BarChart3 },
  { label: "Check your exact intake", icon: ShieldCheck },
  { label: "Human guidance when needed", icon: Users },
] as const;

const decisionSpotlights = [
  {
    tab: "Fit check",
    eyebrow: "Start with your situation",
    title: "Will an online degree work for me?",
    description: "Check your qualification, goal and available study time before comparing names.",
    icon: Target,
    to: "/finder" as const,
    action: "Check my fit",
  },
  {
    tab: "Compare",
    eyebrow: "See the differences clearly",
    title: "Which university details should I compare?",
    description:
      "Keep up to three profiles together and review course, duration and available fee details.",
    icon: BarChart3,
    to: "/compare" as const,
    action: "Start comparing",
  },
  {
    tab: "Study plan",
    eyebrow: "Make learning sustainable",
    title: "Can I build a study routine around work?",
    description:
      "Think through your weekly time, preferred pace and support needs before you enrol.",
    icon: Clock3,
    to: "/finder" as const,
    action: "Build my starting plan",
  },
] as const;

const preAdmissionTools = [
  { title: "Course finder", icon: Target, to: "/finder" as const, color: "blue" },
  { title: "Compare options", icon: BarChart3, to: "/compare" as const, color: "orange" },
  { title: "Online courses", icon: GraduationCap, to: "/programs" as const, color: "green" },
  { title: "Universities", icon: Building2, to: "/universities" as const, color: "violet" },
  {
    title: "Specialisations",
    icon: Lightbulb,
    to: "/specialisations" as const,
    color: "blue",
  },
  {
    title: "Payment checklist",
    icon: ShieldCheck,
    to: "/methodology" as const,
    color: "orange",
  },
] as const;

const afterAdmissionTools = [
  { title: "Study planner", icon: Clock3, to: "/finder" as const, color: "blue" },
  { title: "Course details", icon: BookOpenCheck, to: "/programs" as const, color: "green" },
  { title: "Universities", icon: Building2, to: "/universities" as const, color: "violet" },
  { title: "Talk to us", icon: Users, to: "/contact" as const, color: "orange" },
  { title: "Compare options", icon: BarChart3, to: "/compare" as const, color: "blue" },
  { title: "Ask Diya", icon: Sparkles, action: "diya" as const, color: "orange" },
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
  const [decisionSpotlight, setDecisionSpotlight] = useState(0);
  const [toolGroup, setToolGroup] = useState<"before" | "after">("before");

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
  const activeSpotlight = decisionSpotlights[decisionSpotlight] ?? decisionSpotlights[0];
  const visibleDecisionTools = toolGroup === "before" ? preAdmissionTools : afterAdmissionTools;

  return (
    <div className="overflow-hidden bg-background text-foreground">
      <HeroSection
        heroGoal={heroGoal}
        heroRole={heroRole}
        selectedHeroGoal={selectedHeroGoal}
        onGoalChange={setHeroGoal}
        onRoleChange={setHeroRole}
      />

      <section className="container-page relative z-10 border-b border-border py-4 sm:py-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#a94300] dark:text-[#ffad70]">
              Start here
            </p>
            <h2 className="mt-1 font-display text-base font-extrabold sm:text-lg">
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
              className="group flex min-h-[3.75rem] items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2 transition-[border-color,box-shadow] duration-200 hover:border-[#86a2e8] hover:shadow-sm active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#325dd2]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#edf2ff] text-[#2449ad] transition-colors group-hover:bg-[#325dd2] group-hover:text-white dark:bg-[#263653] dark:text-[#b9ceff]">
                <item.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-extrabold leading-4 sm:text-[13px]">
                  {item.label}
                </span>
                <span className="block text-[10px] font-semibold leading-3 text-muted-foreground">
                  {item.helper}
                </span>
              </span>
            </Link>
          ))}
        </nav>
      </section>

      <section className="container-page py-7 sm:py-9 lg:py-11">
        <h2 className="sr-only">Explore online courses and universities</h2>

        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-3 py-2 sm:gap-8 lg:gap-16">
          <CourseTrustStat
            icon={Building2}
            value={String(universities.length)}
            label="Universities to explore"
          />
          <CourseTrustStat
            icon={GraduationCap}
            value={String(programCatalog.length)}
            label="Online courses"
          />
          <CourseTrustStat icon={BarChart3} value="3" label="Compare at once" />
        </div>

        <div className="mt-7 min-w-0 lg:grid lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:items-start lg:gap-8">
          <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-col lg:rounded-xl lg:border lg:border-border lg:bg-white lg:p-2 lg:shadow-[0_4px_18px_rgba(15,23,42,0.12)] dark:lg:bg-card">
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
                      "flex min-h-11 shrink-0 items-center justify-between gap-3 rounded-full border px-4 text-left text-xs font-extrabold transition-colors lg:min-h-[3.55rem] lg:w-full lg:rounded-lg lg:border-transparent lg:px-3",
                      selected
                        ? "border-[#2458d3] bg-[#2458d3] text-white"
                        : "border-border bg-card text-muted-foreground hover:border-[#86a2e8] hover:bg-[#f4f7ff] hover:text-foreground lg:bg-transparent",
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
              className="hidden min-h-[3.55rem] flex-col justify-center rounded-lg px-3 text-xs font-extrabold text-foreground hover:bg-[#f4f7ff] lg:flex"
            >
              Specialisations
              <span className="mt-1 text-[9px] font-bold text-[#325dd2] dark:text-[#8cb0ff]">
                Explore career directions
              </span>
            </Link>
            <Link
              to="/compare"
              className="hidden min-h-[3.55rem] flex-col justify-center rounded-lg px-3 text-xs font-extrabold text-foreground hover:bg-[#f4f7ff] lg:flex"
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
            railClassName="auto-cols-[47%] gap-2.5 sm:auto-cols-[31.5%] lg:auto-cols-[calc((100%-3rem)/7)] lg:gap-2"
          >
            {visibleCourses.map((program) => {
              const offers = universitiesOfferingProgram(program.slug);
              const isPriorityCourse = program.code === "MBA" || program.code === "MCA";
              const courseVisual = getCourseVisual(program.code);
              const CourseIcon = courseVisual.icon;

              return (
                <Link
                  key={program.slug}
                  to="/programs/$programSlug"
                  params={{ programSlug: program.slug }}
                  aria-label={`Explore Online ${program.code}, ${program.name}`}
                  className="group flex h-[8.75rem] flex-col overflow-hidden rounded-[0.65rem] border border-[#e1e6ef] bg-white shadow-[0_3px_10px_rgba(15,23,42,0.1)] transition-[border-color,box-shadow] duration-200 active:scale-[0.985] hover:border-[#9ab1e8] hover:shadow-[0_6px_16px_rgba(15,23,42,0.13)] dark:border-border dark:bg-card"
                >
                  <span className="flex min-h-0 flex-1 flex-col items-center px-2 pb-1.5 pt-1 text-center">
                    <span
                      className={cn(
                        "inline-flex min-h-5 max-w-full items-center truncate rounded-full px-2 text-[9px] font-extrabold sm:text-[10px]",
                        isPriorityCourse
                          ? "bg-[#dff8ec] text-[#0f7553] dark:bg-[#123b30] dark:text-[#77ddb4]"
                          : "bg-[#fff0e0] text-[#a94300] dark:bg-[#3d281c] dark:text-[#ffad70]",
                      )}
                    >
                      {isPriorityCourse ? "Popular choice" : `${program.durationYears} year course`}
                    </span>
                    <span
                      className={cn(
                        "relative mt-1 flex h-9 w-9 items-center justify-center rounded-lg border",
                        courseVisual.stageClassName,
                      )}
                    >
                      <CourseIcon
                        className={cn("h-[1.15rem] w-[1.15rem]", courseVisual.iconClassName)}
                        strokeWidth={1.9}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-1 line-clamp-2 min-h-7 text-[11px] font-extrabold leading-3.5 text-foreground">
                      Online {program.code}
                    </span>
                    <span className="mt-auto max-w-full truncate text-[9px] font-semibold text-muted-foreground sm:text-[10px]">
                      {offers.length
                        ? `${offers.length} university ${offers.length === 1 ? "profile" : "profiles"}`
                        : program.name}
                    </span>
                  </span>
                  <span className="flex min-h-7 shrink-0 items-center justify-center gap-1 bg-[#2458d3] px-2 text-[10px] font-extrabold text-white transition-colors duration-200 group-hover:bg-[#1746b8]">
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

      <section className="border-y border-[#dce5f7] bg-[#f6f8fc] py-6 dark:border-border dark:bg-[#172237] lg:py-8">
        <div className="container-page">
          <div className="mx-auto max-w-6xl">
            <div
              className="flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="tablist"
              aria-label="Decision checks"
            >
              {decisionSpotlights.map((item, index) => (
                <button
                  key={item.tab}
                  type="button"
                  role="tab"
                  aria-selected={decisionSpotlight === index}
                  onClick={() => setDecisionSpotlight(index)}
                  className={cn(
                    "min-h-9 shrink-0 rounded-full border px-3 text-[10px] font-extrabold transition-colors active:scale-[0.98] sm:text-[11px]",
                    decisionSpotlight === index
                      ? "border-[#325dd2] bg-[#325dd2] text-white"
                      : "border-[#cbd7ee] bg-white text-[#475569] hover:border-[#86a2e8] hover:text-[#2449ad] dark:border-[#344158] dark:bg-[#1c2739] dark:text-[#d8dfeb]",
                  )}
                >
                  {item.tab}
                </button>
              ))}
            </div>
            <div className="grid items-center gap-4 rounded-2xl border border-[#d7e0ef] bg-white p-4 shadow-sm dark:border-border dark:bg-card sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:p-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#325dd2] text-white">
                <activeSpotlight.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#2449ad] dark:text-[#9eb8f5]">
                  {activeSpotlight.eyebrow}
                </p>
                <h2 className="mt-1 font-display text-xl font-black leading-tight text-[#131720] dark:text-white sm:text-2xl">
                  {activeSpotlight.title}
                </h2>
                <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[#4b5a70] dark:text-[#c6cfdd] sm:text-sm">
                  {activeSpotlight.description}
                </p>
              </div>
              <Button asChild className="min-h-11 bg-[#325dd2] px-5 text-white hover:bg-[#2449ad]">
                <Link to={activeSpotlight.to}>
                  {activeSpotlight.action}{" "}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-7 lg:py-10">
        <SectionIntro
          eyebrow="Decide with clarity"
          title="Helpful tools for every step"
          description="Find a course, compare universities or plan what to check next."
        />
        <div className="mt-4 min-w-0 lg:grid lg:grid-cols-[12rem_minmax(0,1fr)] lg:items-start lg:gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-col lg:overflow-visible lg:pb-0">
            <button
              type="button"
              aria-pressed={toolGroup === "before"}
              onClick={() => setToolGroup("before")}
              className={cn(
                "min-h-10 shrink-0 rounded-lg border px-3 text-xs font-extrabold transition-colors lg:w-full",
                toolGroup === "before"
                  ? "border-[#325dd2] bg-[#edf2ff] text-[#2449ad] dark:bg-[#263653] dark:text-[#b9ceff]"
                  : "border-border bg-card text-muted-foreground hover:border-[#86a2e8] hover:text-foreground",
              )}
            >
              Before admission
            </button>
            <button
              type="button"
              aria-pressed={toolGroup === "after"}
              onClick={() => setToolGroup("after")}
              className={cn(
                "min-h-10 shrink-0 rounded-lg border px-3 text-xs font-extrabold transition-colors lg:w-full",
                toolGroup === "after"
                  ? "border-[#325dd2] bg-[#edf2ff] text-[#2449ad] dark:bg-[#263653] dark:text-[#b9ceff]"
                  : "border-border bg-card text-muted-foreground hover:border-[#86a2e8] hover:text-foreground",
              )}
            >
              After admission
            </button>
            <p className="hidden px-2 pt-2 text-[10px] font-semibold leading-4 text-muted-foreground lg:block">
              Choose a group to keep the page simple and relevant.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:gap-2.5">
            {visibleDecisionTools.map((tool) => (
              <ToolCard key={tool.title} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-[#f8f9fc] py-6 dark:bg-[#162035] lg:py-8">
        <div className="container-page">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-[#d7e0ef] bg-white p-4 shadow-sm dark:border-[#344158] dark:bg-card sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-4 sm:p-5">
            <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-[#325dd2] bg-white">
              <img
                src="/diya-ai.webp"
                alt=""
                width={90}
                height={96}
                className="h-[3.25rem] w-[3.25rem] object-cover"
              />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#a94300] dark:text-[#ffad70]">
                Need a quick starting point?
              </p>
              <h2 className="mt-1 font-display text-xl font-black leading-tight sm:text-2xl">
                Ask Diya or speak with a counsellor
              </h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
                Get help finding a course, understanding a university page or preparing questions
                for a counsellor.
              </p>
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-2 sm:col-span-1 sm:flex">
              <Button
                type="button"
                onClick={() => window.dispatchEvent(new Event("dekhocampus:open-diya"))}
                className="min-h-11 bg-[#325dd2] px-4 text-white hover:bg-[#2449ad]"
              >
                Ask Diya
              </Button>
              <Button asChild variant="outline" className="min-h-11 px-4">
                <Link to="/contact">Talk to us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-7 lg:py-10">
        <SectionIntro
          eyebrow="Online universities"
          title="Explore familiar university names"
          description="Open a university to see its available course information."
          action={<TextLink to="/universities" label={`View all ${universities.length}`} />}
        />
        <CompactRail
          label="Online universities"
          rows={2}
          columns={4}
          railClassName="auto-cols-[minmax(14rem,76%)] min-[390px]:auto-cols-[minmax(10rem,46%)] lg:auto-cols-[calc((100%-4rem)/5)]"
        >
          {featuredUniversities.map((university, index) => {
            const confirmedCourses = currentProgramCount(university);
            return (
              <Link
                key={university.slug}
                to="/universities/$universitySlug"
                params={{ universitySlug: university.slug }}
                className="group flex min-h-[5.75rem] flex-col rounded-xl border border-border bg-card p-2.5 shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-[#86a2e8] hover:shadow-md active:scale-[0.985]"
              >
                <span className="flex items-start justify-between gap-2">
                  <UniversityLogo
                    university={university}
                    size="md"
                    priority={index < 4}
                    className="h-10 w-[4.75rem] rounded-lg bg-white"
                  />
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[#2449ad]" />
                </span>
                <span className="mt-1.5 line-clamp-2 font-display text-xs font-extrabold leading-4 sm:text-[13px]">
                  {university.shortName}
                </span>
                <span className="mt-auto line-clamp-1 pt-1 text-[10px] font-semibold leading-4 text-muted-foreground">
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

        <div className="mt-4 overflow-hidden rounded-xl bg-[#131720] text-white">
          <div className="grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:p-5">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#ffad70]">
                Side-by-side view
              </p>
              <h3 className="mt-1 font-display text-lg font-extrabold sm:text-xl">
                Comparing a few universities?
              </h3>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-white/75 sm:text-sm">
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

      <section className="border-y border-border bg-[#f6f8fc] py-7 dark:bg-secondary/25 lg:py-10">
        <div className="container-page">
          <SectionIntro
            eyebrow="Popular specialisations"
            title="Popular study directions"
            description="Browse specialisations by course and interest."
            action={<TextLink to="/specialisations" label="See all specialisations" />}
          />
          <CompactRail
            label="Popular online degree specialisations"
            rows={2}
            columns={4}
            railClassName="auto-cols-[minmax(14rem,76%)] min-[390px]:auto-cols-[minmax(10rem,46%)] lg:auto-cols-[calc((100%-4rem)/5)]"
          >
            {featuredSpecialisations.map((specialisation, index) => (
              <Link
                key={specialisation.slug}
                to="/specialisations/$specialisationSlug"
                params={{ specialisationSlug: specialisation.slug }}
                className="group flex min-h-[4.75rem] items-center gap-2.5 rounded-xl border border-border bg-card p-2.5 shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-[#86a2e8] hover:shadow-md active:scale-[0.985]"
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    index % 2
                      ? "bg-[#fff0e6] text-[#a94300] dark:bg-[#3d281c] dark:text-[#ffad70]"
                      : "bg-[#edf2ff] text-[#2449ad] dark:bg-[#263653] dark:text-[#b9ceff]",
                  )}
                >
                  {index % 2 ? <WalletCards className="h-4 w-4" /> : <Code2 className="h-4 w-4" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 block text-xs font-extrabold leading-4 sm:text-[13px]">
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

      <section className="container-page py-7 lg:py-10">
        <SectionIntro
          eyebrow="A calmer way to decide"
          title="Three simple steps"
          description="Explore, compare and confirm before you decide."
        />
        <ol className="mt-4 grid gap-2.5 md:grid-cols-3">
          {[
            ["01", "Explore", "Browse courses, universities and specialisations."],
            ["02", "Compare", "Keep the options that fit your goals and budget."],
            ["03", "Confirm", "Check current details before you apply or pay."],
          ].map(([step, title, description]) => (
            <li
              key={step}
              className="flex min-h-20 items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm"
            >
              <span className="font-display text-2xl font-black text-[#c8d5f8] dark:text-[#41547d]">
                {step}
              </span>
              <span>
                <span className="block font-display text-sm font-extrabold">{title}</span>
                <span className="mt-0.5 block text-[11px] leading-4 text-muted-foreground sm:text-xs">
                  {description}
                </span>
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <SimpleStat value={String(universities.length)} label="Universities" />
          <SimpleStat value={String(programCatalog.length)} label="Courses" bordered />
          <SimpleStat value={String(getSpecialisationCount())} label="Specialisations" />
        </div>
        <p className="mt-3 text-center text-[11px] leading-5 text-muted-foreground">
          These are the profiles and study options currently available to browse on DekhoCampus.
        </p>
      </section>

      <section className="border-y border-border bg-surface py-7 dark:bg-secondary/25 lg:py-10">
        <div className="container-page">
          <SectionIntro
            eyebrow="Helpful reads"
            title="Useful guides for you and your family"
            description="Short, practical answers to common admission questions."
          />
          <CompactRail
            label="Online degree guides"
            columns={4}
            railClassName="auto-cols-[minmax(15rem,80%)] min-[390px]:auto-cols-[minmax(10.25rem,46%)] lg:auto-cols-[calc((100%-3rem)/4)]"
          >
            {guides.map((guide) => (
              <Link
                key={guide.title}
                to={guide.to}
                className="group flex min-h-[6.75rem] flex-col rounded-xl border border-border bg-card p-3 shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-[#86a2e8] hover:shadow-md active:scale-[0.985]"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf2ff] text-[#2449ad] dark:bg-[#263653] dark:text-[#b9ceff]">
                    <guide.icon className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground">{guide.meta}</span>
                </span>
                <span className="mt-2 line-clamp-2 block font-display text-xs font-extrabold leading-4 sm:text-sm">
                  {guide.title}
                </span>
                <span className="mt-1 line-clamp-1 text-[10px] leading-4 text-muted-foreground sm:text-[11px]">
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

      <section className="container-page py-7 lg:py-10">
        <SectionIntro
          eyebrow="Common questions"
          title="Let’s clear up a few doubts"
          description="Quick answers before you begin exploring."
        />
        <div className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {faqs.map((faq, index) => (
            <details key={faq.question} className="group" open={index === 0}>
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-4 py-2.5 text-sm font-extrabold marker:content-none sm:px-5">
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

      <section className="container-page pb-9 pt-1 lg:pb-12">
        <div className="overflow-hidden rounded-2xl bg-[#325dd2] px-5 py-6 text-white sm:px-7 sm:py-7 lg:px-9">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#ffd7ba]">
                <CheckCircle2 className="h-4 w-4" /> Here when you need us
              </span>
              <h2 className="mt-2 max-w-3xl font-display text-xl font-extrabold leading-tight sm:text-2xl">
                Still unsure? Let’s organise your options together.
              </h2>
              <p className="mt-2 max-w-2xl text-xs leading-5 text-white/85 sm:text-sm">
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
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/15 pt-4 text-[11px] font-semibold text-white/85 sm:text-xs">
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

type DecisionTool = (typeof preAdmissionTools)[number] | (typeof afterAdmissionTools)[number];

function ToolCard({ tool }: { tool: DecisionTool }) {
  const Icon = tool.icon;
  const colorClass = {
    blue: "bg-[#edf2ff] text-[#2449ad] dark:bg-[#263653] dark:text-[#b9ceff]",
    orange: "bg-[#fff0e6] text-[#a94300] dark:bg-[#3d281c] dark:text-[#ffad70]",
    green: "bg-[#eaf7f1] text-[#166b4e] dark:bg-[#123b30] dark:text-[#77ddb4]",
    violet: "bg-[#f2edff] text-[#6243a8] dark:bg-[#302648] dark:text-[#cab8ff]",
  }[tool.color];

  const content = (
    <>
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105",
          colorClass,
        )}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 line-clamp-2 text-left text-[11px] font-extrabold leading-4 sm:text-xs">
        {tool.title}
      </span>
      <ArrowRight className="hidden h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[#2449ad] sm:block" />
    </>
  );

  const className =
    "group flex min-h-[4.25rem] items-center gap-2.5 rounded-xl border border-border bg-card p-2.5 text-left shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-[#86a2e8] hover:shadow-md active:scale-[0.985]";

  if ("action" in tool) {
    return (
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event("dekhocampus:open-diya"))}
        className={className}
      >
        {content}
      </button>
    );
  }

  return (
    <Link to={tool.to} className={className}>
      {content}
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
        "flex min-w-0 items-center justify-center gap-2 px-1 py-2 sm:gap-2.5 sm:py-3",
        bordered && "border-x border-border",
      )}
    >
      <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#edf2ff] text-[#2449ad] dark:bg-[#263653] dark:text-[#b9ceff] sm:flex">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 text-center sm:text-left">
        <span className="block font-display text-base font-black leading-5 text-[#131720] dark:text-foreground sm:text-lg">
          {value}
        </span>
        <span className="mt-0.5 block text-[9px] font-bold leading-3 text-muted-foreground sm:text-[10px]">
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
      className={cn("min-w-0 px-2 py-3 text-center sm:py-4", bordered && "border-x border-border")}
    >
      <p className="font-display text-lg font-extrabold text-[#325dd2] dark:text-[#8cb0ff] sm:text-xl">
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
        <h2 className="mt-1.5 font-display text-[1.45rem] font-extrabold leading-[1.15] tracking-[-0.035em] text-[#131720] dark:text-foreground sm:text-[1.75rem] lg:text-[2rem]">
          {title}
        </h2>
        <p className="mt-1.5 max-w-2xl text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
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
