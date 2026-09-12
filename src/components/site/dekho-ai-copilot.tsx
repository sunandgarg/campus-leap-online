import { useMemo, useRef, useState, type FormEvent } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUp,
  BadgeCheck,
  BookOpenCheck,
  Bot,
  ExternalLink,
  GraduationCap,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  formatINR,
  programCatalog,
  universities,
  universitiesOfferingProgram,
  type ProgramTemplate,
  type University,
  type UniversityProgram,
} from "@/data/universities";
import { cn } from "@/lib/utils";

type CopilotSuggestion = {
  label: string;
  detail: string;
  href: string;
  external?: boolean;
};

type CopilotAnswer = {
  eyebrow: string;
  title: string;
  body: string;
  suggestions: CopilotSuggestion[];
  why: string;
};

type CatalogueOffer = {
  university: University;
  program: UniversityProgram;
};

const quickPrompts = [
  { label: "Compare MBA fees", query: "Show affordable online MBA options" },
  { label: "I work full-time", query: "What should a working professional explore?" },
  { label: "After Class 12", query: "Show bachelor degrees after Class 12" },
  { label: "Tech & data", query: "Show online technology and data programs" },
  { label: "Verify a programme", query: "How do I verify UGC-DEB entitlement?" },
] as const;

const verificationWords = [
  "ugc",
  "deb",
  "valid",
  "validity",
  "recognised",
  "recognized",
  "recognition",
  "verify",
  "verification",
  "approved",
  "approval",
  "deb id",
];

const budgetWords = ["affordable", "budget", "cheap", "cheapest", "fee", "fees", "cost", "emi"];

const universitySearchStopWords = new Set([
  "best",
  "college",
  "course",
  "degree",
  "explore",
  "india",
  "online",
  "option",
  "options",
  "program",
  "programme",
  "show",
  "university",
]);

function normalise(value: string) {
  return value
    .toLocaleLowerCase("en-IN")
    .replace(/,/g, "")
    .replace(/[^a-z0-9₹.+\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function includesAny(value: string, words: readonly string[]) {
  return words.some((word) => value.includes(word));
}

function hasEditorialDepth(university: University) {
  return university.profileDepth !== "directory";
}

function hasReviewedFee(program: UniversityProgram) {
  return program.feesVerified === true && program.totalFee > 0;
}

function hasReviewedMonthlyPayment(program: UniversityProgram) {
  return (
    (program as UniversityProgram & { emiPerMonthVerified?: boolean }).emiPerMonthVerified ===
      true && program.emiPerMonth > 0
  );
}

function programmeHref(program: ProgramTemplate) {
  return `/programs/${program.slug}`;
}

function offerHref(offer: CatalogueOffer) {
  return `/universities/${offer.university.slug}/${offer.program.slug}`;
}

function detailedOffers(programSlug: string): CatalogueOffer[] {
  return universitiesOfferingProgram(programSlug).filter(({ university }) =>
    hasEditorialDepth(university),
  );
}

function reviewedFeeOffers(programSlug: string): CatalogueOffer[] {
  return detailedOffers(programSlug).filter(({ program }) => hasReviewedFee(program));
}

function catalogueFeeDetail(offer: CatalogueOffer) {
  return hasReviewedFee(offer.program)
    ? `${formatINR(offer.program.totalFee)} sourced catalogue fee · confirm the current intake`
    : "Fee needs source review · compare the programme profile first";
}

function programmeMatch(query: string) {
  const terms = query.split(" ").filter((term) => term.length > 1);
  return programCatalog
    .map((program) => {
      const code = normalise(program.code);
      const name = normalise(program.name);
      const specialisations = normalise(program.specialisations.join(" "));
      const exactCode = new RegExp(
        `(^|\\s)${code.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`,
      ).test(query);
      const score =
        (exactCode ? 8 : 0) +
        (query.includes(name) ? 7 : 0) +
        terms.filter(
          (term) =>
            term.length > 2 &&
            (name.includes(term) || code.includes(term) || specialisations.includes(term)),
        ).length;
      return { program, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);
}

function explicitlyNamesProgramme(query: string, program: ProgramTemplate) {
  const code = normalise(program.code);
  const escapedCode = code.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return (
    new RegExp(`(^|\\s)${escapedCode}(\\s|$)`).test(query) ||
    query.includes(normalise(program.name))
  );
}

function universityMatch(query: string, detailedUniversities: University[]) {
  const distinctiveTerms = query
    .split(" ")
    .filter((term) => term.length > 3 && !universitySearchStopWords.has(term));

  return detailedUniversities
    .map((university) => {
      const fullName = normalise(university.name);
      const shortName = normalise(university.shortName);
      const location = normalise(`${university.city} ${university.state}`);
      const score =
        (query.includes(fullName) ? 8 : 0) +
        (shortName.length > 3 && query.includes(shortName) ? 5 : 0) +
        distinctiveTerms.filter((term) => fullName.includes(term) || location.includes(term))
          .length;
      return { university, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);
}

function feeLimitFromQuery(query: string) {
  const patterns = [
    /(?:₹|rs\.?|inr)\s*(\d+(?:\.\d+)?)\s*(lakh|lac|k|thousand)?/i,
    /(\d+(?:\.\d+)?)\s*(lakh|lac|k|thousand)\b/i,
    /(?:under|below|within|up\s*to|upto|budget(?:\s+of)?)\s*(\d+(?:\.\d+)?)\s*(lakh|lac|k|thousand)?/i,
  ];
  const amount = patterns.map((pattern) => query.match(pattern)).find(Boolean);
  if (!amount) return null;
  const value = Number(amount[1]);
  if (!Number.isFinite(value)) return null;
  const unit = amount[2]?.toLowerCase();
  if (unit === "lakh" || unit === "lac") return value * 100_000;
  if (unit === "k" || unit === "thousand") return value * 1_000;
  return value;
}

function buildAnswer(rawQuery: string, detailedUniversities: University[]): CopilotAnswer {
  const query = normalise(rawQuery);
  const allReviewedFeeOffers = programCatalog.flatMap((program) => reviewedFeeOffers(program.slug));

  if (includesAny(query, verificationWords)) {
    return {
      eyebrow: "Admission safety check",
      title: "Verify the exact university, programme, mode and intake",
      body: "Entitlement can change by academic session. Dekho AI does not perform a live regulatory check, so use the official UGC-DEB portal before you apply or pay.",
      suggestions: [
        {
          label: "Open the official UGC-DEB portal",
          detail: "Check the entitled HEI and programme list for your academic session.",
          href: "https://deb.ugc.ac.in/",
          external: true,
        },
        {
          label: "Understand DEB-ID",
          detail: "Read the official student guidance before admission.",
          href: "https://deb.ugc.ac.in/studentDEBID",
          external: true,
        },
        {
          label: "Use our verification checklist",
          detail: "See what we check, what can change and what you should confirm.",
          href: "/methodology",
        },
      ],
      why: "This answer is a safety workflow, not a claim that a current intake is approved.",
    };
  }

  const matchedUniversity = universityMatch(query, detailedUniversities)[0]?.university;
  if (matchedUniversity) {
    const matchedPrograms = matchedUniversity.programs
      .map((reference) => programCatalog.find((program) => program.slug === reference.slug))
      .filter((program): program is ProgramTemplate => Boolean(program))
      .slice(0, 3);

    return {
      eyebrow: "Catalogue match",
      title: `Explore ${matchedUniversity.name}`,
      body: `I found this university in DekhoCampus's detailed catalogue. Review programme-specific details, then re-check the current session on the university and UGC-DEB websites.`,
      suggestions: [
        {
          label: `${matchedUniversity.name} profile`,
          detail: `${matchedUniversity.city}, ${matchedUniversity.state} · ${matchedPrograms.length || matchedUniversity.programs.length} programme paths shown`,
          href: `/universities/${matchedUniversity.slug}`,
        },
        ...matchedPrograms.map((program) => ({
          label: `${program.code} at ${matchedUniversity.shortName}`,
          detail: `${program.durationYears} year${program.durationYears === 1 ? "" : "s"} · ${program.level}`,
          href: `/universities/${matchedUniversity.slug}/${program.slug}`,
        })),
      ],
      why: "Matched against university name and location fields in detailed catalogue profiles.",
    };
  }

  const matchedPrograms = programmeMatch(query);
  const directProgramMatch = matchedPrograms[0];
  const directProgram = directProgramMatch?.program;
  const asksForBudget = includesAny(query, budgetWords);
  const asksBroadlyForTechnology =
    query.includes("technology") ||
    query.includes("tech") ||
    query.includes("software") ||
    query.includes("coding") ||
    query.includes("data") ||
    query.includes("computer");

  if (
    directProgram &&
    (explicitlyNamesProgramme(query, directProgram) || directProgramMatch.score >= 2) &&
    (!asksBroadlyForTechnology || explicitlyNamesProgramme(query, directProgram))
  ) {
    const catalogueOffers = detailedOffers(directProgram.slug);
    const pricedOffers = reviewedFeeOffers(directProgram.slug);
    const feeLimit = asksForBudget ? feeLimitFromQuery(query) : null;
    const queryLooksMonthly =
      query.includes("month") || query.includes("monthly") || query.includes("emi");
    const offers = asksForBudget
      ? pricedOffers.filter(({ program }) =>
          queryLooksMonthly ? hasReviewedMonthlyPayment(program) : true,
        )
      : catalogueOffers;
    const eligibleOffers = feeLimit
      ? offers.filter(({ program }) =>
          queryLooksMonthly ? program.emiPerMonth <= feeLimit : program.totalFee <= feeLimit,
        )
      : offers;
    const rankedOffers = [...(eligibleOffers.length ? eligibleOffers : offers)].sort((a, b) => {
      if (!asksForBudget) return a.university.name.localeCompare(b.university.name);
      return queryLooksMonthly
        ? a.program.emiPerMonth - b.program.emiPerMonth
        : a.program.totalFee - b.program.totalFee;
    });

    return {
      eyebrow: asksForBudget ? "Fee-first catalogue view" : "Programme match",
      title: `${directProgram.code}: ${catalogueOffers.length} detailed ${catalogueOffers.length === 1 ? "profile" : "profiles"}`,
      body: asksForBudget
        ? pricedOffers.length
          ? `${eligibleOffers.length ? "These sourced-fee options fit" : "No sourced-fee option fits"} the amount in your question. Fees, taxes, scholarships and payment terms can change.`
          : "No detailed profile has a current sourced fee for this comparison, so I will not estimate or rank a provider by price."
        : `Compare the programme structure across ${catalogueOffers.length} detailed university profiles. Current entitlement, fees and admission terms still require an intake check.`,
      suggestions: [
        ...rankedOffers.slice(0, 3).map((offer) => ({
          label: `${offer.program.code} · ${offer.university.shortName}`,
          detail: catalogueFeeDetail(offer),
          href: offerHref(offer),
        })),
        {
          label: `Compare every ${directProgram.code} option`,
          detail: "Review curriculum, eligibility and source status side by side.",
          href: programmeHref(directProgram),
        },
      ],
      why: asksForBudget
        ? `Matched “${directProgram.code}” and ranked only profiles with the required sourced fee field.`
        : `Matched “${directProgram.code}” and ordered detailed profiles alphabetically without inventing a “best” ranking.`,
    };
  }

  if (
    query.includes("12th") ||
    query.includes("class 12") ||
    query.includes("school") ||
    query.includes("bachelor") ||
    query.includes("undergraduate")
  ) {
    const bachelors = programCatalog
      .filter((program) => program.level === "Bachelors")
      .map((program) => ({ program, count: detailedOffers(program.slug).length }))
      .filter(({ count }) => count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return {
      eyebrow: "Qualification pathway",
      title: "Bachelor's paths to explore after Class 12",
      body: "Your stream, board result and each university's current eligibility rules still matter. Start with these catalogue paths, then confirm the official prospectus.",
      suggestions: [
        ...bachelors.map(({ program, count }) => ({
          label: `${program.code} · ${program.name}`,
          detail: `${count} detailed university ${count === 1 ? "option" : "options"}`,
          href: programmeHref(program),
        })),
        {
          label: "Get a private course shortlist",
          detail: "Use the ungated degree finder—no phone number required.",
          href: "/finder",
        },
      ],
      why: "Filtered the catalogue to bachelor's-level programmes; this is not an eligibility decision.",
    };
  }

  if (asksBroadlyForTechnology) {
    const technologyPrograms = programCatalog
      .filter((program) => ["MCA", "BCA", "PGD DS", "M.Sc DS"].includes(program.code))
      .map((program) => ({ program, count: detailedOffers(program.slug).length }))
      .filter(({ count }) => count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return {
      eyebrow: "Career-direction match",
      title: "Technology and data paths in the detailed catalogue",
      body: "Choose by entry qualification and the work you want to practise—not by a trendy specialisation name alone.",
      suggestions: [
        ...technologyPrograms.map(({ program, count }) => ({
          label: `${program.code} · ${program.name}`,
          detail: `${count} detailed university ${count === 1 ? "option" : "options"}`,
          href: programmeHref(program),
        })),
        {
          label: "Explore specialisations",
          detail: "See skills and programme pathways without a forced enquiry.",
          href: "/specialisations",
        },
      ],
      why: "Matched programme codes and curriculum themes in the current catalogue.",
    };
  }

  if (
    query.includes("work") ||
    query.includes("job") ||
    query.includes("professional") ||
    query.includes("flexib")
  ) {
    const masters = programCatalog
      .filter((program) => program.level === "Masters")
      .map((program) => ({ program, count: detailedOffers(program.slug).length }))
      .filter(({ count }) => count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return {
      eyebrow: "Working-learner checklist",
      title: "Start with time fit, then shortlist the degree",
      body: "The catalogue cannot verify your weekly schedule. Compare live-class attendance, recording access, exam windows and workload directly with each university before enrolling.",
      suggestions: [
        {
          label: "Build a private best-fit shortlist",
          detail:
            "Match qualification, direction, priority and budget without sharing contact details.",
          href: "/finder",
        },
        ...masters.slice(0, 2).map(({ program, count }) => ({
          label: `Explore ${program.code}`,
          detail: `${count} detailed university ${count === 1 ? "option" : "options"}`,
          href: programmeHref(program),
        })),
      ],
      why: "No schedule claim was inferred; the answer highlights questions a working learner should verify.",
    };
  }

  if (asksForBudget) {
    const feeLimit = feeLimitFromQuery(query);
    const queryLooksMonthly =
      query.includes("month") || query.includes("monthly") || query.includes("emi");
    const ranked = [...allReviewedFeeOffers]
      .filter(({ program }) =>
        feeLimit
          ? queryLooksMonthly
            ? hasReviewedMonthlyPayment(program) && program.emiPerMonth <= feeLimit
            : program.totalFee <= feeLimit
          : queryLooksMonthly
            ? hasReviewedMonthlyPayment(program)
            : true,
      )
      .sort((a, b) =>
        queryLooksMonthly
          ? a.program.emiPerMonth - b.program.emiPerMonth
          : a.program.totalFee - b.program.totalFee,
      )
      .filter(
        (offer, index, list) =>
          list.findIndex((candidate) => candidate.program.slug === offer.program.slug) === index,
      )
      .slice(0, 3);

    return {
      eyebrow: "Fee-first catalogue view",
      title: feeLimit ? "Options within the amount you entered" : "Lower-fee paths to compare",
      body: "These are sorted from reviewed catalogue figures only. Confirm the final fee, scholarship conditions, taxes and any lender terms before deciding.",
      suggestions: ranked.length
        ? ranked.map((offer) => ({
            label: `${offer.program.code} · ${offer.university.shortName}`,
            detail: catalogueFeeDetail(offer),
            href: offerHref(offer),
          }))
        : [
            {
              label: "Adjust your priorities in Degree Finder",
              detail: "See nearby options without submitting personal details.",
              href: "/finder",
            },
          ],
      why: "Sorted only source-reviewed fee fields; no scholarship or loan approval was assumed.",
    };
  }

  return {
    eyebrow: "No grounded match yet",
    title: "Try a degree, university, goal or budget",
    body: "I could not tie that question confidently to the current catalogue, so I will not invent an answer. Try “MBA under ₹2 lakh”, a university name, or a goal like “technology after Class 12”.",
    suggestions: [
      {
        label: "Use the guided Degree Finder",
        detail: "Build a private shortlist in four clear steps.",
        href: "/finder",
      },
      {
        label: "Browse all programmes",
        detail: "Explore the catalogue by level, duration and learning path.",
        href: "/programs",
      },
      {
        label: "Search DekhoCampus",
        detail: "Search universities, courses and specialisations directly.",
        href: "/search",
      },
    ],
    why: "The copilot only answers when it can map your words to structured catalogue fields.",
  };
}

export function DekhoAICopilot() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [askedQuery, setAskedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const detailedUniversities = useMemo(() => universities.filter(hasEditorialDepth), []);
  const [answer, setAnswer] = useState<CopilotAnswer>(() => ({
    eyebrow: "Catalogue decision support",
    title: "What would you like to compare?",
    body: `Ask about a degree, budget, university, learner goal or verification step. Results use ${detailedUniversities.length} detailed catalogue profiles and never pretend to be a live UGC check.`,
    suggestions: [
      {
        label: "Find my course direction",
        detail: "Use a private four-step shortlist with no contact form gate.",
        href: "/finder",
      },
      {
        label: "See how catalogue checks work",
        detail: "Understand sources, limitations and what you should verify.",
        href: "/methodology",
      },
    ],
    why: "Your question stays in this browser tab and is not sent to an external AI service.",
  }));

  if (pathname.startsWith("/admin") || pathname === "/auth") return null;

  function ask(nextQuery: string) {
    const cleanedQuery = nextQuery.trim().slice(0, 180);
    if (!cleanedQuery) {
      inputRef.current?.focus();
      return;
    }
    setQuery(cleanedQuery);
    setAskedQuery(cleanedQuery);
    setAnswer(buildAnswer(cleanedQuery, detailedUniversities));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask(query);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group fixed bottom-[5.8rem] right-4 z-40 inline-flex h-13 items-center gap-2.5 rounded-2xl border border-white/20 bg-[#0a2741] px-3.5 text-white shadow-[0_18px_55px_-16px_rgba(3,32,58,0.78)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#0d3457] hover:shadow-[0_22px_65px_-14px_rgba(3,32,58,0.85)] lg:bottom-6 lg:right-6"
        >
          <span className="sr-only sm:hidden">Ask Dekho AI catalogue copilot</span>
          <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#6fb9ff] to-[#1768cc] shadow-inner">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0a2741] bg-[#52d49e]" />
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-[10px] font-extrabold uppercase tracking-[0.12em] text-white/55">
              Catalogue copilot
            </span>
            <span className="block text-xs font-extrabold">Ask Dekho AI</span>
          </span>
        </button>
      </DialogTrigger>

      <DialogContent
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          inputRef.current?.focus();
        }}
        className="left-0 top-auto bottom-0 h-[min(90dvh,52rem)] w-full max-w-none translate-x-0 translate-y-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden rounded-t-[1.75rem] border-x-0 border-b-0 bg-background p-0 shadow-[0_-30px_90px_-42px_rgba(3,24,43,0.85)] [&>button:last-child]:text-white [&>button:last-child]:hover:bg-white/10 sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:h-[min(82dvh,48rem)] sm:max-w-[56rem] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[2rem] sm:border"
      >
        <div className="relative overflow-hidden border-b border-white/10 bg-[#071f35] px-5 py-5 text-white sm:px-7 sm:py-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-[#1768cc]/40 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 left-1/4 h-48 w-48 rounded-full bg-[#f47a20]/20 blur-3xl"
          />
          <div className="relative flex items-start gap-3 pr-9">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-[#8cc7ff] shadow-inner">
              <Bot className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <DialogTitle className="font-display text-lg font-extrabold tracking-[-0.025em] sm:text-xl">
                  Dekho AI
                </DialogTitle>
                <span className="rounded-full border border-[#79c9a9]/25 bg-[#58c99a]/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#8be0bd]">
                  Catalogue copilot
                </span>
              </div>
              <DialogDescription className="mt-1.5 max-w-xl text-xs leading-5 text-white/60 sm:text-sm">
                Structured decision support from DekhoCampus data—not a live UGC verification,
                counsellor or admission decision.
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 overflow-hidden md:grid-cols-[13.5rem_1fr]">
          <aside className="hidden border-r border-border bg-surface/65 p-5 md:block">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
              Useful starting points
            </p>
            <div className="mt-3 space-y-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt.label}
                  type="button"
                  onClick={() => ask(prompt.query)}
                  className="group flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border border-transparent px-3 py-2.5 text-left text-xs font-bold text-muted-foreground transition hover:border-border hover:bg-background hover:text-foreground"
                >
                  <span>{prompt.label}</span>
                  <ArrowRight
                    className="h-3.5 w-3.5 shrink-0 opacity-35 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-[#b9d8f6] bg-[#edf6ff] p-3.5 dark:border-[#285578] dark:bg-[#102a40]">
              <div className="flex items-center gap-2 text-[#1768cc] dark:text-[#82c2ff]">
                <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                <p className="text-[10px] font-extrabold uppercase tracking-[0.1em]">
                  Private by design
                </p>
              </div>
              <p className="mt-2 text-[11px] leading-4.5 text-muted-foreground">
                Questions are matched in this tab. Nothing is sent to an external AI service.
              </p>
            </div>
          </aside>

          <div className="min-h-0 overflow-y-auto">
            <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
              {askedQuery ? `Dekho AI response updated: ${answer.title}` : "Dekho AI is ready."}
            </p>
            <div className="p-5 sm:p-7">
              <div
                className="flex gap-2 overflow-x-auto pb-2 md:hidden"
                aria-label="Suggested questions"
              >
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt.label}
                    type="button"
                    onClick={() => ask(prompt.query)}
                    className="min-h-10 shrink-0 rounded-full border border-border bg-card px-3.5 text-[11px] font-extrabold text-muted-foreground shadow-sm transition hover:border-[#86b7e8] hover:text-foreground"
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>

              {askedQuery ? (
                <p className="mt-3 text-xs text-muted-foreground md:mt-0">
                  <span className="font-bold text-foreground">You asked:</span> “{askedQuery}”
                </p>
              ) : null}

              <div className={cn("max-w-2xl", askedQuery ? "mt-5" : "mt-4 md:mt-0")}>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf5ff] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#1768cc] dark:bg-[#102a42] dark:text-[#83c1ff]">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  {answer.eyebrow}
                </span>
                <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight tracking-[-0.04em] text-foreground sm:text-3xl">
                  {answer.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{answer.body}</p>
              </div>

              <div className="mt-6 space-y-2.5">
                {answer.suggestions.map((suggestion) => (
                  <a
                    key={`${suggestion.href}-${suggestion.label}`}
                    href={suggestion.href}
                    target={suggestion.external ? "_blank" : undefined}
                    rel={suggestion.external ? "noreferrer" : undefined}
                    className="group flex min-h-16 items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-[0_10px_30px_-26px_rgba(11,43,72,0.65)] transition hover:-translate-y-0.5 hover:border-[#8db8e8] hover:shadow-[0_18px_38px_-26px_rgba(11,43,72,0.75)]"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-[#1768cc] dark:text-[#83c1ff]">
                      {suggestion.external ? (
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      ) : suggestion.href.includes("methodology") ? (
                        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                      ) : suggestion.href.includes("program") ? (
                        <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
                      ) : suggestion.href.includes("universit") ? (
                        <GraduationCap className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Search className="h-4 w-4" aria-hidden="true" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-extrabold leading-5 text-foreground">
                        {suggestion.label}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-4 text-muted-foreground sm:text-xs">
                        {suggestion.detail}
                      </span>
                    </span>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-muted-foreground/45 transition group-hover:translate-x-0.5 group-hover:text-[#1768cc]"
                      aria-hidden="true"
                    />
                  </a>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-border bg-surface/70 p-4">
                <div className="flex items-start gap-2.5">
                  <BadgeCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#168258] dark:text-[#65d3a3]"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-foreground">
                      Why this answer
                    </p>
                    <p className="mt-1 text-[11px] leading-4.5 text-muted-foreground">
                      {answer.why}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-background px-4 py-4 sm:px-6">
          <form onSubmit={submit} className="flex items-center gap-2">
            <label htmlFor="dekho-ai-question" className="sr-only">
              Ask about an online degree, university, budget or verification
            </label>
            <input
              ref={inputRef}
              id="dekho-ai-question"
              type="search"
              value={query}
              maxLength={180}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try “MBA under ₹2 lakh”"
              autoComplete="off"
              className="h-12 min-w-0 flex-1 rounded-2xl border border-input bg-surface px-4 text-sm text-foreground shadow-inner outline-none placeholder:text-muted-foreground focus-visible:border-[#4b94d9] focus-visible:ring-2 focus-visible:ring-[#4b94d9] focus-visible:ring-offset-2"
            />
            <button
              type="submit"
              aria-label="Ask Dekho AI"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1768cc] text-white shadow-[0_10px_28px_-12px_rgba(23,104,204,0.9)] transition hover:bg-[#145bab] active:scale-95"
            >
              <ArrowUp className="h-4.5 w-4.5" aria-hidden="true" />
            </button>
          </form>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[9px] leading-4 text-muted-foreground sm:text-[10px]">
            <ShieldCheck className="h-3 w-3 shrink-0" aria-hidden="true" />
            Decision support only. Always confirm entitlement, eligibility, fees and dates with the
            official sources.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
