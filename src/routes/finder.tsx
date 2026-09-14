import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  Check,
  Code2,
  GraduationCap,
  HelpCircle,
  IndianRupee,
  Landmark,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  UserRoundSearch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniversityLogo } from "@/components/site/university-logo";
import { CompactRail } from "@/components/site/compact-rail";
import {
  programCatalog,
  universitiesOfferingProgram,
  type ProgramLevel,
} from "@/data/universities";

type Education = "12th" | "graduate" | "postgraduate" | "diploma";
type Field = "business" | "technology" | "commerce" | "media" | "unsure";
type FinderGoal = "career-growth" | "career-switch" | "lower-fees" | "flexible-study";
type FinderAudience = "student" | "parent" | "professional";
type FinderSearch = {
  goal?: FinderGoal;
  audience?: FinderAudience;
  education?: Education;
  field?: Field;
};

const finderGoals: FinderGoal[] = [
  "career-growth",
  "career-switch",
  "lower-fees",
  "flexible-study",
];
const finderAudiences: FinderAudience[] = ["student", "parent", "professional"];
const finderEducation: Education[] = ["12th", "graduate", "postgraduate", "diploma"];
const finderFields: Field[] = ["business", "technology", "commerce", "media", "unsure"];

const finderGoalDetails: Record<FinderGoal, { label: string; guidance: string }> = {
  "career-growth": {
    label: "Career growth",
    guidance: "Compare the curriculum, projects and learner support for the roles you want next.",
  },
  "career-switch": {
    label: "Career switch",
    guidance: "Check prerequisites and practical subjects before choosing a new direction.",
  },
  "lower-fees": {
    label: "Lower fees",
    guidance: "Compare current total fees and refund terms directly before making a payment.",
  },
  "flexible-study": {
    label: "Flexible study",
    guidance: "Ask for the live-class, recording and exam schedule before applying.",
  },
};

const audienceGuidance: Record<FinderAudience, string> = {
  student: "Discuss the course, total cost and study routine with someone you trust.",
  parent: "Review recognition, total cost, support and refund terms together.",
  professional: "Check weekly study hours and live-class timings against your work schedule.",
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
    if (
      typeof search["education"] === "string" &&
      finderEducation.includes(search["education"] as Education)
    ) {
      validated.education = search["education"] as Education;
    }
    if (typeof search["field"] === "string" && finderFields.includes(search["field"] as Field)) {
      validated.field = search["field"] as Field;
    }
    return validated;
  },
  head: () => ({
    meta: [
      { title: "Online Degree Finder — Choose the Right Course | DekhoCampus" },
      {
        name: "description",
        content:
          "Build a private shortlist of online degree directions from your qualification and study interests—without sharing personal details.",
      },
      { property: "og:title", content: "Explore online degree directions" },
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
    description: "Keep the options broad while you explore.",
    icon: HelpCircle,
  },
];

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

const stepLabels = ["Qualification", "Direction"];

function DegreeFinderPage() {
  const {
    goal: initialGoal,
    audience,
    education: initialEducation,
    field: initialField,
  } = Route.useSearch();
  const [step, setStep] = useState(0);
  const [education, setEducation] = useState<Education | null>(initialEducation ?? null);
  const [field, setField] = useState<Field | null>(initialField ?? null);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const previousStepRef = useRef(step);

  useEffect(() => {
    setStep(0);
    setEducation(initialEducation ?? null);
    setField(initialField ?? null);
  }, [audience, initialEducation, initialField, initialGoal]);

  const recommendations = useMemo(() => {
    if (!education || !field) return [];

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

    return candidates.slice(0, 6).map((program) => ({
      program,
      offers: universitiesOfferingProgram(program.slug),
      reason:
        preferredCodes === null
          ? `Included in the ${program.level.toLowerCase()} options available after your qualification.`
          : preferredCodes.includes(program.code)
            ? `Included because you chose ${fieldChoices.find((choice) => choice.value === field)?.label.toLowerCase()}.`
            : `Included as another ${program.level.toLowerCase()} direction to explore.`,
    }));
  }, [education, field]);

  const selections = [education, field];
  const currentComplete = selections[step] !== null;
  const showingResults = step === stepLabels.length;

  useEffect(() => {
    if (previousStepRef.current === step) return;
    previousStepRef.current = step;
    window.requestAnimationFrame(() => {
      (showingResults ? resultsHeadingRef.current : questionHeadingRef.current)?.focus();
    });
  }, [showingResults, step]);

  function reset() {
    setStep(0);
    setEducation(initialEducation ?? null);
    setField(initialField ?? null);
  }

  return (
    <div className="min-h-[75vh] bg-surface text-foreground dark:bg-background">
      <section className="border-b border-border bg-[#131720] text-white">
        <div className="container-page grid gap-5 py-8 sm:py-10 lg:grid-cols-[1fr_auto] lg:items-end lg:py-12">
          <div>
            <span className="inline-flex items-center gap-2 border-l-4 border-[#f47b25] pl-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/85">
              <GraduationCap className="h-4 w-4" /> Free degree finder
            </span>
            <h1 className="mt-4 max-w-3xl font-display text-3xl font-extrabold tracking-[-0.05em] sm:text-4xl lg:text-5xl">
              Find a course direction that makes sense for you.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
              Answer two simple questions. We’ll build a starting shortlist from your qualification
              and the subject area you want to explore.
            </p>
            {initialGoal || audience ? (
              <p className="mt-4 inline-flex flex-wrap items-center gap-1.5 rounded-lg border border-white/15 bg-[#252b36] px-3.5 py-2 text-xs font-semibold text-white/85">
                Starting with {initialGoal ? finderGoalDetails[initialGoal].label : "your goal"}
                {initialField ? ` · ${initialField} direction` : ""}
                {initialEducation ? ` · ${initialEducation} qualification` : ""}
                {audience ? ` · ${audience} view` : ""}. You can change every answer.
              </p>
            ) : null}
          </div>
          <div className="rounded-xl border border-white/15 bg-[#252b36] p-4 text-sm text-white/85 lg:max-w-xs">
            <p className="flex items-center gap-2 font-bold text-white">
              <ShieldCheck className="h-4 w-4 text-[#78ddb3]" /> Private by design
            </p>
            <p className="mt-1.5 max-w-xs text-xs leading-5">
              No phone number, email or payment is required to see your shortlist.
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
              ? `Shortlist ready with ${recommendations.length} course ${recommendations.length === 1 ? "direction" : "directions"}.`
              : `Question ${step + 1} of ${stepLabels.length}: ${stepLabels[step]}.`}
          </p>

          {!showingResults ? (
            <div className="mt-6 rounded-xl border border-border bg-card">
              <div className="rounded-t-xl border-b border-border bg-secondary/45 px-6 py-5 sm:px-8">
                <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-[#1768cc] dark:text-[#78b9ff]">
                  Question {step + 1} of {stepLabels.length}
                </p>
                <h2
                  ref={questionHeadingRef}
                  tabIndex={-1}
                  className="mt-2 font-display text-2xl font-extrabold tracking-[-0.04em] outline-none sm:text-3xl"
                >
                  {step === 0 && "What have you completed?"}
                  {step === 1 && "Where do you want to grow?"}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step === 0 && "This keeps every recommendation academically relevant."}
                  {step === 1 && "Choose a direction—not a permanent career commitment."}
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
              </div>

              <div className="sticky bottom-[5.25rem] z-20 flex items-center justify-between gap-4 rounded-b-xl border-t border-border bg-card px-5 py-4 shadow-[0_-12px_24px_-24px_rgba(19,23,32,0.7)] sm:static sm:px-8 sm:shadow-none">
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
                  {step === stepLabels.length - 1 ? "Show my shortlist" : "Continue"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-7">
              <div className="flex flex-col gap-5 rounded-xl border border-[#b9dfca] bg-[#effbf5] p-5 dark:border-[#285f4c] dark:bg-[#0f2b23] sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.13em] text-[#168258] dark:text-[#75dcb4]">
                    <BadgeCheck className="h-4 w-4" /> Your shortlist is ready
                  </p>
                  <h2
                    ref={resultsHeadingRef}
                    tabIndex={-1}
                    className="mt-2 font-display text-3xl font-extrabold tracking-[-0.045em] outline-none"
                  >
                    {recommendations.length} course direction
                    {recommendations.length === 1 ? "" : "s"} to explore
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    This shortlist uses only your qualification and chosen subject area. University
                    profiles are shown without a best-university ranking.
                  </p>
                </div>
                <Button variant="outline" onClick={reset} className="shrink-0 rounded-xl bg-card">
                  <RotateCcw className="mr-2 h-4 w-4" /> Start again
                </Button>
              </div>

              {initialGoal || audience ? (
                <div className="mt-5 rounded-xl border border-border bg-card p-4 text-sm leading-6 text-muted-foreground">
                  <p className="font-extrabold text-foreground">Keep in mind</p>
                  {initialGoal ? (
                    <p className="mt-1">{finderGoalDetails[initialGoal].guidance}</p>
                  ) : null}
                  {audience ? <p className="mt-1">{audienceGuidance[audience]}</p> : null}
                </div>
              ) : null}

              <CompactRail label="Course directions from your answers" rows={2} columns={2}>
                {recommendations.map(({ program, offers, reason }) => (
                  <article
                    key={program.slug}
                    className="overflow-hidden rounded-xl border border-border bg-card"
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
                      </div>

                      <p className="mt-4 text-sm font-semibold leading-6 text-foreground">
                        {reason}
                      </p>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {program.overview}
                      </p>

                      <div className="mt-5 grid grid-cols-3 divide-x divide-border rounded-2xl bg-secondary/60 py-4 text-center">
                        <div className="px-2">
                          <p className="font-display font-extrabold">{offers.length}</p>
                          <p className="mt-1 text-[10px] font-bold uppercase text-muted-foreground">
                            University profiles
                          </p>
                        </div>
                        <div className="px-2">
                          <p className="font-display font-extrabold">
                            {program.specialisations.length}
                          </p>
                          <p className="mt-1 text-[10px] font-bold uppercase text-muted-foreground">
                            Specialisations
                          </p>
                        </div>
                        <div className="px-2">
                          <p className="font-display font-extrabold">{program.careers.length}</p>
                          <p className="mt-1 text-[10px] font-bold uppercase text-muted-foreground">
                            Career directions
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-background p-3">
                        <div className="flex -space-x-2">
                          {offers.slice(0, 3).map(({ university }) => (
                            <span
                              key={university.slug}
                              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-white"
                            >
                              <UniversityLogo university={university} size="sm" />
                            </span>
                          ))}
                        </div>
                        <p className="text-xs font-semibold leading-5 text-muted-foreground">
                          {offers.length
                            ? `${offers.length} university ${offers.length === 1 ? "profile" : "profiles"} available to review`
                            : "University profiles are not available for this course yet"}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`grid border-t border-border p-4 ${offers.length ? "grid-cols-2" : "grid-cols-1"}`}
                    >
                      <Button asChild variant="ghost" className="rounded-xl font-bold">
                        <Link to="/programs/$programSlug" params={{ programSlug: program.slug }}>
                          View course
                        </Link>
                      </Button>
                      {offers.length ? (
                        <Button
                          asChild
                          className="rounded-xl bg-[#1768cc] font-extrabold text-white hover:bg-[#0e57b2]"
                        >
                          <Link to="/compare" search={{ program: program.slug }}>
                            Compare universities
                          </Link>
                        </Button>
                      ) : null}
                    </div>
                  </article>
                ))}
              </CompactRail>

              <div className="mt-6 flex flex-col items-start justify-between gap-5 rounded-xl bg-[#131720] p-5 text-white sm:flex-row sm:items-center sm:p-6">
                <div>
                  <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.13em] text-[#8bc7ff]">
                    <UserRoundSearch className="h-4 w-4" /> Optional human check
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-extrabold">
                    Want a counsellor to review this shortlist?
                  </h2>
                  <p className="mt-2 text-sm text-white/85">
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
      className={`group flex min-h-24 items-start gap-3 rounded-xl border p-4 text-left transition ${
        selected
          ? "border-[#f47a20] bg-[#fff3ea] ring-2 ring-[#f47a20]/15 dark:bg-[#382317]"
          : "border-border bg-background hover:border-[#edaa79] hover:bg-secondary/50"
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
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
