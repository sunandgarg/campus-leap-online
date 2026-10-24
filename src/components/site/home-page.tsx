import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  IndianRupee,
  Laptop2,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { useState } from "react";
import { HomeSections } from "@/components/site/home-sections";
import { programCatalog } from "@/data/universities";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

const heroTrustPoints = [
  { label: "Browse before enquiring", icon: Search },
  { label: "Compare without signing up", icon: BarChart3 },
  { label: "Check your exact intake", icon: ShieldCheck },
  { label: "Human guidance when needed", icon: Users },
] as const;

export function HomePage() {
  return (
    <div className="overflow-hidden bg-background text-foreground">
      <HeroSection />
      <HomeSections />
    </div>
  );
}

function HeroSection() {
  const [heroGoal, setHeroGoal] = useState<string>("Online degree");
  const [heroRole, setHeroRole] = useState<(typeof heroRoles)[number]>("Student");
  const selectedGoal = heroGoals.find((goal) => goal.label === heroGoal)!;
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  function askDiya(query = searchQuery) {
    window.dispatchEvent(new CustomEvent("dekhocampus:open-diya", { detail: { query } }));
  }

  return (
    <section
      className="dc-home-hero relative isolate overflow-hidden border-b border-[#e5eaf3] dark:border-border"
      aria-labelledby="home-hero-title"
    >
      <div
        className="pointer-events-none absolute -left-64 top-32 h-[30rem] w-[30rem] rounded-full border-[3rem] border-[#f8dbcc]/20 dark:border-white/[0.02]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-64 top-24 h-[34rem] w-[34rem] rounded-full border-[4rem] border-[#ccdefa]/25 dark:border-white/[0.02]"
        aria-hidden="true"
      />
      <div className="container-page relative grid min-w-0 gap-8 py-8 sm:py-12 lg:min-h-[680px] lg:grid-cols-[minmax(0,1fr)_390px] lg:items-center lg:gap-16 lg:py-14 xl:grid-cols-[minmax(0,1fr)_410px] xl:gap-24">
        <div className="min-w-0 max-w-[700px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f8cdb5] bg-[#ffe8db]/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-[#bb4f14] dark:border-[#67452f] dark:bg-[#35271f] dark:text-[#ffad70] sm:text-[11px]">
            <GraduationCap
              className="h-3.5 w-3.5 text-[#131720] dark:text-[#ffad70]"
              aria-hidden="true"
            />
            Built by IIT Delhi alumni
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#667085] dark:text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-[#25b58c]" aria-hidden="true" />
            AI-first guidance · human support
          </p>

          <h1
            id="home-hero-title"
            className="mt-6 font-display text-[2.5rem] font-black leading-[1.12] tracking-[-0.055em] text-[#131720] dark:text-foreground min-[390px]:text-[2.85rem] sm:text-[4rem] lg:text-[3.5rem] xl:text-[4.5rem]"
          >
            Discover Your Ideal{" "}
            <span className="block text-[#325dd2] dark:text-[#8cb0ff]">Online Degree</span>
          </h1>
          <p className="mt-5 max-w-[610px] text-[15px] leading-7 text-[#536176] dark:text-muted-foreground sm:text-base sm:leading-7">
            Explore online universities, courses and specialisations. Compare your options with
            clear information and get human guidance whenever you need it.
          </p>

          <form
            role="search"
            aria-label="Search online education"
            onSubmit={(event) => {
              event.preventDefault();
              void navigate({ to: "/search", search: { q: searchQuery.trim() } });
            }}
            className="mt-6 flex min-h-14 items-center gap-2 rounded-full border border-white bg-white p-1.5 shadow-[0_8px_30px_-16px_rgba(42,54,83,0.3)] focus-within:ring-2 focus-within:ring-[#325dd2]/30 dark:border-border dark:bg-card sm:min-h-16"
          >
            <button
              type="submit"
              aria-label="Search courses and universities"
              className="flex h-11 w-10 shrink-0 items-center justify-center rounded-full text-[#7d879b] hover:bg-secondary hover:text-primary"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>
            <label htmlFor="home-course-search" className="sr-only">
              Search universities, courses or a question for Diya
            </label>
            <input
              id="home-course-search"
              type="search"
              maxLength={180}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search courses, universities or ask Diya…"
              className="h-11 min-w-0 flex-1 rounded-lg bg-transparent text-xs outline-none placeholder:text-[#667085] focus-visible:outline-none sm:text-sm"
            />
            <button
              type="button"
              onClick={() => askDiya()}
              className="flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#f47b25] px-4 text-xs font-bold text-white transition-colors hover:bg-[#db6619] sm:px-5 sm:text-sm"
            >
              <Send className="h-4 w-4" aria-hidden="true" /> Ask Diya
            </button>
          </form>
          <nav aria-label="Popular online courses" className="mt-4 flex flex-wrap gap-2">
            {["online-mba", "online-mca", "online-bba", "online-bca"].map((slug) => {
              const program = programCatalog.find((item) => item.slug === slug)!;
              return (
                <Link
                  key={slug}
                  to="/programs/$programSlug"
                  params={{ programSlug: slug }}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#d5deed] bg-card px-4 text-xs font-semibold hover:border-primary hover:text-primary"
                >
                  Online {program.code}
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              );
            })}
          </nav>
          <nav aria-label="Choose how to explore" className="study-path-nav mt-5">
            <a href="#explore-courses">
              <span className="font-bold">
                Start with a course <ArrowRight className="h-3.5 w-3.5" />
              </span>
              <small>Browse interests, courses & fees</small>
            </a>
            <a href="#explore-universities">
              <span className="font-bold">
                Start with a university <ArrowRight className="h-3.5 w-3.5" />
              </span>
              <small>Explore universities & their courses</small>
            </a>
          </nav>
          <div className="mt-2 flex flex-wrap gap-x-5 text-xs font-semibold text-primary">
            <Link to="/compare" className="inline-flex min-h-11 items-center gap-1">
              Compare options <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <aside
          className="dc-guidance-panel w-full min-w-0 rounded-[28px] border border-white/90 p-5 backdrop-blur-md dark:border-border sm:p-6 lg:mt-6"
          aria-label="Find a suitable course"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e7fcf1] px-3 py-2 text-[10px] font-bold text-[#258567]">
            <ShieldCheck className="h-3.5 w-3.5" /> Free expert guidance
          </span>
          <p className="mt-5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#c96623]">
            <Sparkles className="h-3.5 w-3.5" /> Personal guidance desk
          </p>
          <h2 className="mt-2 text-xl font-extrabold tracking-tight">
            What would you like to plan next?
          </h2>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            Choose one goal and we’ll shape it into a focused shortlist with the next best steps.
          </p>
          <fieldset className="mt-4 grid grid-cols-2 gap-2">
            <legend className="sr-only">Choose your goal</legend>
            {heroGoals.map((goal, index) => (
              <button
                key={goal.label}
                type="button"
                aria-pressed={heroGoal === goal.label}
                onClick={() => setHeroGoal(goal.label)}
                className={cn(
                  "relative flex min-h-12 items-center gap-2 rounded-full border px-3 text-left text-[11px] font-semibold transition-colors",
                  index === 4 && "col-span-2",
                  heroGoal === goal.label
                    ? "border-[#b8cdfa] bg-[#dbe6ff] text-[#325dd2] dark:bg-accent"
                    : "border-transparent bg-card/85 hover:border-primary/30",
                )}
              >
                <goal.icon className="h-4 w-4 shrink-0" /> {goal.label}
                {heroGoal === goal.label && (
                  <CheckCircle2 className="ml-auto h-3.5 w-3.5 shrink-0" />
                )}
              </button>
            ))}
          </fieldset>
          <fieldset className="mt-4">
            <legend className="mb-2 text-xs font-semibold">I am a</legend>
            <div className="grid grid-cols-3 rounded-full bg-secondary/80 p-1">
              {heroRoles.map((role) => (
                <button
                  key={role}
                  type="button"
                  aria-pressed={heroRole === role}
                  onClick={() => setHeroRole(role)}
                  className={cn(
                    "min-h-10 rounded-full text-[11px] font-bold",
                    heroRole === role ? "bg-card text-primary shadow-sm" : "text-muted-foreground",
                  )}
                >
                  {role}
                </button>
              ))}
            </div>
          </fieldset>
          <Button asChild size="lg" className="mt-4 min-h-12 w-full rounded-full">
            <Link
              to="/finder"
              search={{
                goal: selectedGoal.value,
                audience: heroRole.toLowerCase() as Lowercase<typeof heroRole>,
                ...("education" in selectedGoal ? { education: selectedGoal.education } : {}),
                ...("field" in selectedGoal ? { field: selectedGoal.field } : {}),
              }}
            >
              Show my best-fit options <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <p className="mt-3 text-center text-[10px] leading-5 text-muted-foreground">
            Guidance at your pace. No sign-up to explore.
          </p>
        </aside>
      </div>
      <div className="relative border-t border-[#e3e8f2] bg-white/65 py-3 text-[#536176] dark:border-border dark:bg-card dark:text-muted-foreground">
        <div className="container-page flex gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:justify-center">
          {heroTrustPoints.map((item) => (
            <span
              key={item.label}
              className="flex min-h-6 shrink-0 items-center gap-2 text-[11px] font-medium"
            >
              <item.icon
                className="h-3.5 w-3.5 text-[#325dd2] dark:text-[#8cb0ff]"
                aria-hidden="true"
              />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
