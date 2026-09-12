import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  Clock3,
  GraduationCap,
  IndianRupee,
  ShieldCheck,
  UserRoundSearch,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversityLogo } from "@/components/site/university-logo";
import {
  formatINR,
  isVerifiedProgramOffer,
  type ProgramTemplate,
  type University,
  type UniversityProgram,
} from "@/data/universities";

type Offer = { university: University; program: UniversityProgram };
type LearnerProfile = "fresher" | "professional" | "switcher";
type Priority = "budget" | "flexibility" | "career";

const profiles = [
  { value: "fresher" as const, label: "Recent graduate", icon: GraduationCap },
  { value: "professional" as const, label: "Working professional", icon: BriefcaseBusiness },
  { value: "switcher" as const, label: "Career switcher", icon: UserRoundSearch },
];

const priorities = [
  { value: "budget" as const, label: "Keep costs low", icon: WalletCards },
  { value: "flexibility" as const, label: "Maximum flexibility", icon: Clock3 },
  { value: "career" as const, label: "Career lens (no rank)", icon: BriefcaseBusiness },
];

const profileCopy: Record<LearnerProfile, string> = {
  fresher:
    "Prioritise a structured learning calendar, peer interaction and strong academic support.",
  professional:
    "Prioritise recorded access, predictable assessment windows and a manageable weekly workload.",
  switcher:
    "Prioritise practical projects, relevant specialisations and clear links to your target roles.",
};

const trustNotes: [string, string, typeof BadgeCheck][] = [
  [
    "Source-backed comparisons",
    "Only current offerings with cited total-fee evidence enter this planner.",
    BadgeCheck,
  ],
  [
    "No forced application",
    "Explore and shortlist before sharing application details.",
    ShieldCheck,
  ],
  [
    "Clear fee context",
    "Derived monthly splits stay distinct from published payment plans.",
    WalletCards,
  ],
  [
    "Human support",
    "Ask for help when you need eligibility or application clarity.",
    UserRoundSearch,
  ],
];

interface ProgramDecisionStudioProps {
  program: ProgramTemplate;
  offers: Offer[];
}

export function ProgramDecisionStudio({ program, offers }: ProgramDecisionStudioProps) {
  const sourceBackedOffers = useMemo(() => offers.filter(isVerifiedProgramOffer), [offers]);
  const minEmi = sourceBackedOffers.length
    ? Math.min(...sourceBackedOffers.map(({ program: offer }) => offer.emiPerMonth))
    : 0;
  const maxEmi = sourceBackedOffers.length
    ? Math.max(...sourceBackedOffers.map(({ program: offer }) => offer.emiPerMonth))
    : 0;
  const [profile, setProfile] = useState<LearnerProfile>("professional");
  const [priority, setPriority] = useState<Priority>("flexibility");
  const [weeklyHours, setWeeklyHours] = useState(8);
  const [monthlyBudget, setMonthlyBudget] = useState(minEmi);

  useEffect(() => {
    setMonthlyBudget(minEmi);
  }, [program.slug, minEmi, maxEmi]);

  const affordableOffers = useMemo(
    () =>
      [...sourceBackedOffers]
        .filter(({ program: offer }) => offer.emiPerMonth <= monthlyBudget)
        .sort((a, b) => {
          if (priority === "career") return a.university.name.localeCompare(b.university.name);
          if (priority === "budget") return a.program.totalFee - b.program.totalFee;
          return a.program.emiPerMonth - b.program.emiPerMonth;
        }),
    [monthlyBudget, priority, sourceBackedOffers],
  );

  const readiness = weeklyHours >= 10 ? "Strong" : weeklyHours >= 7 ? "Good" : "Needs planning";
  const studyNote =
    weeklyHours >= 10
      ? "You have a healthy study window for classes, revision and project work."
      : weeklyHours >= 7
        ? "Your study window is workable if you protect two focused sessions each week."
        : "Before enrolling, identify two more weekly study hours or choose a lighter assessment rhythm.";

  return (
    <section
      id="decision-tools"
      className="scroll-mt-32 border-b border-border bg-background py-16 lg:py-20"
    >
      <div className="container-page">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 border-l-4 border-[#f47b25] pl-3 text-xs font-extrabold uppercase tracking-[0.16em] text-[#2449ad] dark:text-[#b9ceff]">
            <BadgeCheck className="h-4 w-4" /> Practical decision tools
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl">
            Make a decision that fits your life—not a sales script
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Check your learning fit and payment comfort before shortlisting an online {program.code}
            . These tools are guidance, not an admission or finance guarantee.
          </p>
        </div>

        <div className="mt-10 grid gap-5 xl:grid-cols-[1.06fr_0.94fr]">
          <article className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="border-b border-border bg-[#edf2ff] p-6 dark:bg-[#263653] sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#1768cc] dark:text-[#78b9ff]">
                    Course-fit check
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-extrabold">
                    Build your learner profile
                  </h3>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-[#325dd2] dark:bg-[#1b2942] dark:text-[#b9ceff]">
                  <UserRoundSearch className="h-5 w-5" />
                </span>
              </div>
            </div>

            <div className="space-y-7 p-6 sm:p-8">
              <fieldset>
                <legend className="text-sm font-extrabold">Where are you today?</legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {profiles.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      aria-pressed={profile === item.value}
                      onClick={() => setProfile(item.value)}
                      className={`flex min-h-20 flex-col items-start justify-between rounded-lg border p-3.5 text-left text-xs font-bold transition-colors ${
                        profile === item.value
                          ? "border-[#1768cc] bg-[#edf5ff] text-[#155cb6] dark:bg-[#102a42] dark:text-[#78b9ff]"
                          : "border-border bg-background text-muted-foreground hover:border-[#8db8e8]"
                      }`}
                    >
                      <item.icon className="h-4.5 w-4.5" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-sm font-extrabold">What matters most?</legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {priorities.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      aria-pressed={priority === item.value}
                      onClick={() => setPriority(item.value)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-xs font-bold transition ${
                        priority === item.value
                          ? "border-[#1768cc] bg-[#1768cc] text-white"
                          : "border-border bg-background text-muted-foreground hover:border-[#8db8e8]"
                      }`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div>
                <div className="flex items-center justify-between gap-4">
                  <label htmlFor="weekly-hours" className="text-sm font-extrabold">
                    Weekly study time
                  </label>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-extrabold">
                    {weeklyHours} hours
                  </span>
                </div>
                <input
                  id="weekly-hours"
                  type="range"
                  min="4"
                  max="16"
                  step="1"
                  value={weeklyHours}
                  onChange={(event) => setWeeklyHours(Number(event.target.value))}
                  className="mt-4 w-full accent-[#1768cc]"
                />
              </div>

              <div className="rounded-xl border border-[#aebff0] bg-[#f6f8ff] p-5 dark:border-[#56698c] dark:bg-[#1b2942]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-display text-lg font-extrabold">Your readiness: {readiness}</p>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-[#168258] dark:bg-[#153d30] dark:text-[#69d7a9]">
                    <Check className="h-3.5 w-3.5" /> On-device rule guidance
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {profileCopy[profile]}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{studyNote}</p>
              </div>
            </div>
          </article>

          <article className="overflow-hidden rounded-xl border border-[#3b4350] bg-[#131720] text-white dark:bg-[#0b1018]">
            <div className="border-b border-white/10 p-6 sm:p-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#ff9a50]">
                Budget planner
              </p>
              <h3 className="mt-2 font-display text-2xl font-extrabold">
                Set a comfortable monthly range
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Compare arithmetic monthly splits from source-backed total fees. A split is not a
                lender quote; published monthly plans are labelled separately.
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-end justify-between gap-4">
                <label htmlFor="monthly-budget" className="text-sm font-bold text-white/70">
                  Monthly study budget
                </label>
                <p className="font-display text-2xl font-extrabold text-white">
                  {formatINR(monthlyBudget)}
                  <span className="text-xs font-semibold text-white/50">/mo</span>
                </p>
              </div>
              <input
                id="monthly-budget"
                type="range"
                min={minEmi}
                max={maxEmi}
                step="250"
                value={monthlyBudget}
                onChange={(event) => setMonthlyBudget(Number(event.target.value))}
                className="mt-5 w-full accent-[#f47b25]"
              />
              <div className="mt-2 flex justify-between text-[10px] font-bold text-white/65">
                <span>{formatINR(minEmi)}</span>
                <span>{formatINR(maxEmi)}</span>
              </div>

              <div className="mt-7 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-white/65">
                    Matches
                  </p>
                  <p className="mt-1 font-display text-xl font-extrabold">
                    {affordableOffers.length}{" "}
                    {affordableOffers.length === 1 ? "university" : "universities"}
                  </p>
                  <p className="mt-1 text-[10px] text-white/65">
                    {priority === "career"
                      ? "Shown A–Z; no provider outcome ranking"
                      : "Filtered by the labelled monthly-cost rule"}
                  </p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#252b36] text-[#ff9a50]">
                  <IndianRupee className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {affordableOffers.slice(0, 3).map(({ university, program: offer }) => (
                  <div
                    key={university.slug}
                    className="flex items-center gap-3 rounded-lg border border-[#3b4350] bg-[#252b36] p-3"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                      <UniversityLogo university={university} size="sm" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-extrabold">{university.shortName}</p>
                      <p className="mt-0.5 text-[10px] text-white/50">
                        {offer.emiPerMonthVerified
                          ? "Published monthly amount"
                          : "Derived monthly split"}
                      </p>
                    </div>
                    <p className="text-xs font-extrabold text-[#8bc7ff]">
                      {formatINR(offer.emiPerMonth)}/mo
                    </p>
                  </div>
                ))}
                {affordableOffers.length === 0 ? (
                  <div className="rounded-lg border border-[#6b4a34] bg-[#252b36] p-4 text-sm leading-6 text-white/75">
                    No arithmetic monthly split starts within this range. Review total cost first,
                    then ask the university about a published payment plan.
                  </div>
                ) : null}
              </div>

              <Button
                asChild
                size="lg"
                className="mt-6 w-full rounded-xl bg-[#ff7a24] font-extrabold text-[#111827] hover:bg-[#ee6710]"
              >
                <Link to="/compare">
                  Compare all fees <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </article>
        </div>

        <div className="mt-5 grid overflow-hidden rounded-xl border border-border bg-card sm:grid-cols-2 lg:grid-cols-4">
          {trustNotes.map(([title, description, Icon], index) => (
            <div
              key={String(title)}
              className={`p-5 ${index ? "border-t border-border sm:border-l sm:border-t-0" : ""} ${index === 2 ? "sm:border-t lg:border-t-0" : ""}`}
            >
              <Icon className="h-5 w-5 text-[#1768cc] dark:text-[#78b9ff]" />
              <h3 className="mt-4 text-sm font-extrabold">{String(title)}</h3>
              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                {String(description)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
