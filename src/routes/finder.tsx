import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  Check,
  Clock3,
  Code2,
  GraduationCap,
  HelpCircle,
  IndianRupee,
  Landmark,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  UserRoundSearch,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversityLogo } from "@/components/site/university-logo";
import {
  formatINR,
  programCatalog,
  verifiedUniversitiesOfferingProgram,
  type ProgramLevel,
} from "@/data/universities";

type Education = "12th" | "graduate" | "postgraduate" | "diploma";
type Field = "business" | "technology" | "commerce" | "media" | "unsure";
type Priority = "affordability" | "career" | "flexibility" | "reputation";
type FinderGoal = "career-growth" | "career-switch" | "lower-fees" | "flexible-study";
type FinderAudience = "student" | "parent" | "professional";
type FinderSearch = { goal?: FinderGoal; audience?: FinderAudience };

const finderGoals: FinderGoal[] = [
  "career-growth",
  "career-switch",
  "lower-fees",
  "flexible-study",
];
const finderAudiences: FinderAudience[] = ["student", "parent", "professional"];

const finderGoalDetails: Record<FinderGoal, { label: string; priority: Priority }> = {
  "career-growth": { label: "Career growth", priority: "career" },
  "career-switch": { label: "Career switch", priority: "career" },
  "lower-fees": { label: "Lower fees", priority: "affordability" },
  "flexible-study": { label: "Flexible study", priority: "flexibility" },
};

export const Route = createFileRoute("/finder")({
  validateSearch: (search: Record<string, unknown>): FinderSearch => {
    const validated: FinderSearch = {};
    if (typeof search["goal"] === "string" && finderGoals.includes(search["goal"] as FinderGoal)) {
      validated.goal = search["goal"] as FinderGoal;
    }
    if (
      typeof search["audience"] === "string" &&
      finderAudiences.includes(search["audience"] as FinderAudience)
    ) {
      validated.audience = search["audience"] as FinderAudience;
    }
    return validated;
  },
  head: () => ({
    meta: [
      { title: "Online Degree Finder — Get Your Best-Fit Course | DekhoCampus" },
      {
        name: "description",
        content:
          "Find online degree and university options matched to your qualification, career direction, priorities and monthly budget—without sharing personal details.",
      },
      { property: "og:title", content: "Find your best-fit online degree" },
      {
        property: "og:description",
        content: "A free, private guided shortlist of online courses and universities.",
      },
    ],
  }),
  component: DegreeFinderPage,
});

type Choice<T extends string> = {
  value: T;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

const educationChoices: Choice<Education>[] = [
  {
    value: "12th",
    label: "Completed Class 12",
    description: "Explore online bachelor’s degrees.",
    icon: GraduationCap,
  },
  {
    value: "graduate",
    label: "College graduate",
    description: "Explore master’s degrees and PG diplomas.",
    icon: BookOpenCheck,
  },
  {
    value: "postgraduate",
    label: "Postgraduate",
    description: "Upskill, specialise or change direction.",
    icon: BriefcaseBusiness,
  },
  {
    value: "diploma",
    label: "Diploma holder",
    description: "Find a degree that builds on your qualification.",
    icon: Landmark,
  },
];

const fieldChoices: Choice<Field>[] = [
  {
    value: "business",
    label: "Business & management",
    description: "Leadership, marketing, operations and entrepreneurship.",
    icon: BriefcaseBusiness,
  },
  {
    value: "technology",
    label: "Technology & data",
    description: "Software, computer applications, analytics and AI.",
    icon: Code2,
  },
  {
    value: "commerce",
    label: "Finance & commerce",
    description: "Accounting, banking, finance and taxation.",
    icon: IndianRupee,
  },
  {
    value: "media",
    label: "Media & humanities",
    description: "Communication, journalism, language and content.",
    icon: Sparkles,
  },
  {
    value: "unsure",
    label: "Help me discover",
    description: "Keep the options broad and show strong all-round fits.",
    icon: HelpCircle,
  },
];

const priorityChoices: Choice<Priority>[] = [
  {
    value: "affordability",
    label: "Lowest overall cost",
    description: "Prioritise lower total fees and manageable payments.",
    icon: WalletCards,
  },
  {
    value: "career",
    label: "Career progression",
    description: "Filter course categories by direction without ranking salary outcomes.",
    icon: Target,
  },
  {
    value: "flexibility",
    label: "Maximum flexibility",
    description: "Compare a standard monthly split—not a lender payment plan.",
    icon: Clock3,
  },
  {
    value: "reputation",
    label: "University reputation",
    description: "Keep provider ranking off until comparable reputation evidence is mapped.",
    icon: BadgeCheck,
  },
];

const budgets = [
  { value: 4_000, label: "Up to ₹4,000", description: "Keep monthly payments very lean" },
  { value: 7_000, label: "Up to ₹7,000", description: "A balanced monthly range" },
  { value: 10_000, label: "Up to ₹10,000", description: "More university choice" },
  { value: 1_00_000, label: "Budget is flexible", description: "Show the strongest overall fit" },
] as const;

const levelsByEducation: Record<Education, ProgramLevel[]> = {
  "12th": ["Bachelors"],
  graduate: ["Masters", "Diploma", "Certificate"],
  postgraduate: ["Masters", "Diploma", "Certificate"],
  diploma: ["Bachelors", "Diploma", "Certificate"],
};

const codesByField: Record<Exclude<Field, "unsure">, string[]> = {
  business: ["MBA", "BBA"],
  technology: ["MCA", "BCA", "PGD DS"],
  commerce: ["M.Com", "B.Com", "MBA"],
  media: ["MA JMC", "MA English"],
};

const stepLabels = ["Qualification", "Direction", "Priority", "Budget"];

function DegreeFinderPage() {
  const { goal: initialGoal, audience } = Route.useSearch();
  const initialPriority = initialGoal ? finderGoalDetails[initialGoal].priority : null;
  const [step, setStep] = useState(0);
  const [education, setEducation] = useState<Education | null>(null);
  const [field, setField] = useState<Field | null>(null);
  const [priority, setPriority] = useState<Priority | null>(initialPriority);
  const [budget, setBudget] = useState<number | null>(null);

  useEffect(() => {
    setStep(0);
    setEducation(null);
    setField(null);
    setPriority(initialGoal ? finderGoalDetails[initialGoal].priority : null);
    setBudget(null);
  }, [audience, initialGoal]);

  const recommendations = useMemo(() => {
    if (!education || !field || !priority || budget === null) return [];

    const eligibleLevels = levelsByEducation[education];
    const preferredCodes = field === "unsure" ? null : codesByField[field];
    const eligiblePrograms = programCatalog.filter(
      (program) =>
        eligibleLevels.includes(program.level) &&
        (preferredCodes === null || preferredCodes.includes(program.code)),
    );
    const candidates = eligiblePrograms.length
      ? eligiblePrograms
      : programCatalog.filter((program) => eligibleLevels.includes(program.level));

    return candidates
      .map((program) => {
        // A provider enters finder rankings only when the exact offering and
        // total fee both have current source evidence. The course category can
        // still be recommended when that reviewed provider set is empty.
        const offers = verifiedUniversitiesOfferingProgram(program.slug);
        const canRankProvider = priority === "affordability" || priority === "flexibility";
        const rankedOffers = canRankProvider
          ? [...offers].sort((a, b) => a.program.totalFee - b.program.totalFee)
          : offers;
        const typicalMonths = Math.max(1, program.durationYears * 12);
        const monthlySplit = (totalFee: number) => Math.round(totalFee / typicalMonths);
        const withinBudget = rankedOffers.filter(
          ({ program: offer }) => monthlySplit(offer.totalFee) <= budget,
        );
        const bestOffer = canRankProvider
          ? (withinBudget.length ? withinBudget : rankedOffers)[0]
          : undefined;
        const minimumMonthlySplit = offers.length
          ? Math.min(...offers.map(({ program: offer }) => monthlySplit(offer.totalFee)))
          : null;
        const isWithinBudget = minimumMonthlySplit !== null && minimumMonthlySplit <= budget;
        const fitLabel = preferredCodes?.includes(program.code) ? "Strong" : "Good";

        return {
          program,
          offers: rankedOffers,
          bestOffer,
          minimumMonthlySplit,
          isWithinBudget,
          fitLabel,
          providerRankingUnavailable: offers.length > 0 && !canRankProvider,
        };
      })
      .sort((a, b) => {
        if (priority === "affordability" || priority === "flexibility") {
          return (
            (a.minimumMonthlySplit ?? Number.POSITIVE_INFINITY) -
              (b.minimumMonthlySplit ?? Number.POSITIVE_INFINITY) ||
            a.program.name.localeCompare(b.program.name)
          );
        }
        return a.program.name.localeCompare(b.program.name);
      })
      .slice(0, 4);
  }, [budget, education, field, priority]);

  const selections = [education, field, priority, budget];
  const currentComplete = selections[step] !== null;
  const showingResults = step === stepLabels.length;

  function reset() {
    setStep(0);
    setEducation(null);
    setField(null);
    setPriority(initialGoal ? finderGoalDetails[initialGoal].priority : null);
    setBudget(null);
  }

  return (
    <div className="min-h-[75vh] bg-[#f7f9fc] text-foreground dark:bg-background">
      <section className="relative overflow-hidden border-b border-border bg-[#071c2e] text-white">
        <div className="pointer-events-none absolute -right-32 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#1768cc]/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-[#f47a20]/20 blur-3xl" />
        <div className="container-page relative grid gap-8 py-12 lg:grid-cols-[1fr_auto] lg:items-end lg:py-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8bc7ff]">
              <Sparkles className="h-4 w-4" /> Free degree finder
            </span>
            <h1 className="mt-6 max-w-3xl font-display text-4xl font-extrabold tracking-[-0.055em] sm:text-5xl lg:text-6xl">
              Turn uncertainty into a shortlist.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/65">
              Answer four simple questions. We’ll match your qualification, direction and budget
              with courses and universities already in the DekhoCampus catalogue.
            </p>
            {initialGoal || audience ? (
              <p className="mt-4 inline-flex flex-wrap items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-xs font-semibold text-white/80">
                Starting with {initialGoal ? finderGoalDetails[initialGoal].label : "your goal"}
                {audience ? ` · ${audience} view` : ""}. You can change every answer.
              </p>
            ) : null}
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm text-white/70 backdrop-blur">
            <p className="flex items-center gap-2 font-bold text-white">
              <ShieldCheck className="h-4 w-4 text-[#78ddb3]" /> Private by design
            </p>
            <p className="mt-1.5 max-w-xs text-xs leading-5">
              No phone number, email or payment is required to see your matches.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-8 lg:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-4 gap-2" aria-label="Degree finder progress">
            {stepLabels.map((label, index) => {
              const completed = showingResults || index < step;
              const active = index === step;
              return (
                <div key={label}>
                  <div
                    className={`h-1.5 rounded-full transition-colors ${
                      completed || active ? "bg-[#f47a20]" : "bg-border"
                    }`}
                  />
                  <p
                    className={`mt-2 hidden text-[10px] font-extrabold uppercase tracking-[0.1em] sm:block ${
                      active ? "text-[#a94300] dark:text-[#ffad70]" : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {showingResults
              ? `Shortlist ready with ${recommendations.length} course ${recommendations.length === 1 ? "match" : "matches"}.`
              : `Question ${step + 1} of ${stepLabels.length}: ${stepLabels[step]}.`}
          </p>

          {!showingResults ? (
            <div className="mt-7 overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_28px_80px_-58px_rgba(10,42,73,0.8)]">
              <div className="border-b border-border bg-secondary/45 px-6 py-5 sm:px-8">
                <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-[#1768cc] dark:text-[#78b9ff]">
                  Question {step + 1} of {stepLabels.length}
                </p>
                <h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.04em] sm:text-3xl">
                  {step === 0 && "What have you completed?"}
                  {step === 1 && "Where do you want to grow?"}
                  {step === 2 && "What matters most in your decision?"}
                  {step === 3 && "What monthly payment feels comfortable?"}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step === 0 && "This keeps every recommendation academically relevant."}
                  {step === 1 && "Choose a direction—not a permanent career commitment."}
                  {step === 2 && "We use this in a transparent rule-based catalogue sort."}
                  {step === 3 &&
                    "We divide cited total fees across the category’s typical duration; this is not a lender quote."}
                </p>
              </div>

              <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-8">
                {step === 0 &&
                  educationChoices.map((choice) => (
                    <FinderChoice
                      key={choice.value}
                      choice={choice}
                      selected={education === choice.value}
                      onSelect={() => setEducation(choice.value)}
                    />
                  ))}
                {step === 1 &&
                  fieldChoices.map((choice) => (
                    <FinderChoice
                      key={choice.value}
                      choice={choice}
                      selected={field === choice.value}
                      onSelect={() => setField(choice.value)}
                    />
                  ))}
                {step === 2 &&
                  priorityChoices.map((choice) => (
                    <FinderChoice
                      key={choice.value}
                      choice={choice}
                      selected={priority === choice.value}
                      onSelect={() => setPriority(choice.value)}
                    />
                  ))}
                {step === 3 &&
                  budgets.map((choice) => (
                    <button
                      key={choice.value}
                      type="button"
                      aria-pressed={budget === choice.value}
                      onClick={() => setBudget(choice.value)}
                      className={`flex min-h-28 items-center justify-between gap-4 rounded-2xl border p-5 text-left transition ${
                        budget === choice.value
                          ? "border-[#f47a20] bg-[#fff3ea] ring-2 ring-[#f47a20]/15 dark:bg-[#382317]"
                          : "border-border bg-background hover:border-[#edaa79] hover:bg-secondary/50"
                      }`}
                    >
                      <span>
                        <span className="block font-display text-lg font-extrabold">
                          {choice.label}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                          {choice.description}
                        </span>
                      </span>
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                          budget === choice.value
                            ? "border-[#a94300] bg-[#a94300] text-white"
                            : "border-border"
                        }`}
                      >
                        {budget === choice.value ? <Check className="h-4 w-4" /> : null}
                      </span>
                    </button>
                  ))}
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-border px-5 py-4 sm:px-8">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={step === 0}
                  onClick={() => setStep((value) => Math.max(0, value - 1))}
                  className="rounded-xl"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button
                  type="button"
                  disabled={!currentComplete}
                  onClick={() => setStep((value) => value + 1)}
                  className="rounded-xl bg-[#a94300] font-extrabold text-white hover:bg-[#8f3700]"
                >
                  {step === stepLabels.length - 1 ? "Show my matches" : "Continue"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-7">
              <div className="flex flex-col gap-5 rounded-[2rem] border border-[#b9dfca] bg-[#effbf5] p-6 dark:border-[#285f4c] dark:bg-[#0f2b23] sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.13em] text-[#168258] dark:text-[#75dcb4]">
                    <BadgeCheck className="h-4 w-4" /> Your shortlist is ready
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.045em]">
                    {recommendations.length} best-fit course
                    {recommendations.length === 1 ? "" : "s"}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Course categories are filtered from your answers. Providers are ranked only on
                    comparable source-backed cost—not on unsupported reputation or outcome claims.
                  </p>
                </div>
                <Button variant="outline" onClick={reset} className="shrink-0 rounded-xl bg-card">
                  <RotateCcw className="mr-2 h-4 w-4" /> Start again
                </Button>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {recommendations.map(
                  ({
                    program,
                    offers,
                    bestOffer,
                    minimumMonthlySplit,
                    isWithinBudget,
                    fitLabel,
                    providerRankingUnavailable,
                  }) => (
                    <article
                      key={program.slug}
                      className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-card"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="rounded-full bg-[#edf5ff] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-[#1768cc] dark:bg-[#102a42] dark:text-[#78b9ff]">
                              {program.level} · {program.durationYears} years
                            </span>
                            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.14em] text-[#a94300] dark:text-[#ff9a5b]">
                              Online {program.code}
                            </p>
                            <h3 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.04em]">
                              {program.name}
                            </h3>
                          </div>
                          <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#eaf8f1] text-[#168258] dark:bg-[#12372c] dark:text-[#75dcb4]">
                            <span className="font-display text-sm font-extrabold">{fitLabel}</span>
                            <span className="text-[8px] font-bold uppercase">rule fit</span>
                          </span>
                        </div>

                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
                          {program.overview}
                        </p>

                        <div className="mt-5 grid grid-cols-3 divide-x divide-border rounded-2xl bg-secondary/60 py-4 text-center">
                          <div className="px-2">
                            <p className="font-display font-extrabold">{offers.length}</p>
                            <p className="mt-1 text-[9px] font-bold uppercase text-muted-foreground">
                              Sourced offers
                            </p>
                          </div>
                          <div className="px-2">
                            <p className="font-display font-extrabold">
                              {minimumMonthlySplit !== null
                                ? formatINR(minimumMonthlySplit)
                                : "Not mapped"}
                            </p>
                            <p className="mt-1 text-[9px] font-bold uppercase text-muted-foreground">
                              Arithmetic split
                            </p>
                          </div>
                          <div className="px-2">
                            <p className="font-display font-extrabold">{program.careers.length}</p>
                            <p className="mt-1 text-[9px] font-bold uppercase text-muted-foreground">
                              Career directions
                            </p>
                          </div>
                        </div>

                        {bestOffer ? (
                          <div className="mt-5 rounded-2xl border border-border bg-background p-4">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
                                Closest source-backed fit
                              </p>
                              <span
                                className={`text-[10px] font-extrabold ${
                                  isWithinBudget
                                    ? "text-[#168258] dark:text-[#62d3a7]"
                                    : "text-[#a94300] dark:text-[#ffad70]"
                                }`}
                              >
                                {isWithinBudget ? "Within your range" : "Closest budget match"}
                              </span>
                            </div>
                            <Link
                              to="/universities/$universitySlug/$programSlug"
                              params={{
                                universitySlug: bestOffer.university.slug,
                                programSlug: program.slug,
                              }}
                              className="mt-3 flex items-center gap-3 rounded-xl transition hover:bg-secondary"
                            >
                              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-sm">
                                <UniversityLogo university={bestOffer.university} size="sm" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-extrabold">
                                  {bestOffer.university.shortName}
                                </span>
                                <span className="mt-0.5 block text-xs text-muted-foreground">
                                  Sourced total fee · {formatINR(bestOffer.program.totalFee)}
                                </span>
                              </span>
                              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                            </Link>
                          </div>
                        ) : (
                          <div className="mt-5 rounded-2xl border border-dashed border-border bg-background p-4">
                            <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
                              Course-category match only
                            </p>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                              {providerRankingUnavailable
                                ? "Current sourced offerings exist, but this finder does not rank reputation or career outcomes without comparable evidence. Review them in the course guide."
                                : "No university has current offering and total-fee evidence for this finder, so no provider is ranked. Use the course guide to review source records manually."}
                            </p>
                          </div>
                        )}
                      </div>

                      <div
                        className={`grid border-t border-border p-4 ${bestOffer ? "grid-cols-2" : "grid-cols-1"}`}
                      >
                        <Button asChild variant="ghost" className="rounded-xl font-bold">
                          <Link to="/programs/$programSlug" params={{ programSlug: program.slug }}>
                            View course
                          </Link>
                        </Button>
                        {bestOffer ? (
                          <Button
                            asChild
                            className="rounded-xl bg-[#1768cc] font-extrabold text-white hover:bg-[#0e57b2]"
                          >
                            <Link to="/compare">Compare sourced options</Link>
                          </Button>
                        ) : null}
                      </div>
                    </article>
                  ),
                )}
              </div>

              <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-[1.75rem] bg-[#071c2e] p-6 text-white sm:flex-row sm:items-center sm:p-8">
                <div>
                  <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.13em] text-[#8bc7ff]">
                    <UserRoundSearch className="h-4 w-4" /> Optional human check
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-extrabold">
                    Want a counsellor to review these matches?
                  </h2>
                  <p className="mt-2 text-sm text-white/60">
                    Share your details only when you’re ready. Guidance remains free.
                  </p>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="shrink-0 rounded-xl bg-[#a94300] font-extrabold text-white hover:bg-[#8f3700]"
                >
                  <Link to="/contact">
                    Review my shortlist <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function FinderChoice<T extends string>({
  choice,
  selected,
  onSelect,
}: {
  choice: Choice<T>;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`group flex min-h-32 items-start gap-4 rounded-2xl border p-5 text-left transition ${
        selected
          ? "border-[#f47a20] bg-[#fff3ea] ring-2 ring-[#f47a20]/15 dark:bg-[#382317]"
          : "border-border bg-background hover:border-[#edaa79] hover:bg-secondary/50"
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
          selected
            ? "bg-[#a94300] text-white"
            : "bg-secondary text-[#1768cc] group-hover:bg-[#edf5ff] dark:text-[#78b9ff]"
        }`}
      >
        <choice.icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-base font-extrabold">{choice.label}</span>
        <span className="mt-1.5 block text-xs leading-5 text-muted-foreground">
          {choice.description}
        </span>
      </span>
      <span
        className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
          selected ? "border-[#a94300] bg-[#a94300] text-white" : "border-border"
        }`}
      >
        {selected ? <Check className="h-3.5 w-3.5" /> : null}
      </span>
    </button>
  );
}
