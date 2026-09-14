import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CircleAlert,
  ExternalLink,
  GitCompareArrows,
  GraduationCap,
  IndianRupee,
  Search,
  Scale,
  ShieldCheck,
  Trash2,
  WalletCards,
  X,
} from "lucide-react";
import { UniversityLogo } from "@/components/site/university-logo";
import { LeadForm } from "@/components/site/lead-form";
import { CompactRail } from "@/components/site/compact-rail";
import { Button } from "@/components/ui/button";
import {
  formatINR,
  formatUniversityLocation,
  getProgramApprovalClaims,
  isComparableProgramOffer,
  programCatalog,
  universitiesOfferingProgram,
  type University,
  type UniversityProgram,
} from "@/data/universities";
import { useComparison } from "@/hooks/use-comparison";

type Offer = { university: University; program: UniversityProgram };
type CompareSearch = { program?: string };

export const Route = createFileRoute("/compare")({
  validateSearch: (search: Record<string, unknown>): CompareSearch => {
    const requestedProgram = typeof search["program"] === "string" ? search["program"] : "";
    return programCatalog.some((program) => program.slug === requestedProgram)
      ? { program: requestedProgram }
      : {};
  },
  head: () => ({
    meta: [
      { title: "Compare Online Universities — Fee Guides & Program Details | DekhoCampus" },
      {
        name: "description",
        content:
          "Build a private side-by-side comparison of online university course profiles, with unavailable details clearly marked for confirmation.",
      },
      { property: "og:title", content: "Compare Online Universities in India" },
      {
        property: "og:description",
        content:
          "Compare online university catalogue records without sign-in; missing and unverified fields stay clearly labelled.",
      },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  const { program: requestedProgramSlug } = Route.useSearch();
  const navigate = Route.useNavigate();
  const comparison = useComparison();
  const {
    ready: comparisonReady,
    programSlug: savedProgramSlug,
    universitySlugs: savedUniversitySlugs,
    changeProgram: saveProgram,
    replaceUniversities,
  } = comparison;
  const [programSlug, setProgramSlug] = useState(
    requestedProgramSlug ?? programCatalog[0]?.slug ?? "",
  );
  const [universityQuery, setUniversityQuery] = useState("");
  const [selectionFeedback, setSelectionFeedback] = useState("");

  useEffect(() => {
    if (!comparisonReady) return;

    if (requestedProgramSlug) {
      setProgramSlug(requestedProgramSlug);
      if (savedProgramSlug !== requestedProgramSlug) {
        saveProgram(requestedProgramSlug);
      }
      return;
    }

    if (savedProgramSlug && programCatalog.some((program) => program.slug === savedProgramSlug)) {
      setProgramSlug(savedProgramSlug);
    }
  }, [comparisonReady, requestedProgramSlug, savedProgramSlug, saveProgram]);

  const offers = useMemo(() => universitiesOfferingProgram(programSlug), [programSlug]);
  const feeReadyOffers = useMemo(() => offers.filter(isComparableProgramOffer), [offers]);
  const program = programCatalog.find((item) => item.slug === programSlug);
  const savedSelectedSlugs = savedProgramSlug === programSlug ? savedUniversitySlugs : [];
  const selectedSlugs = savedSelectedSlugs.filter((slug) =>
    offers.some(({ university }) => university.slug === slug),
  );
  const selectedOffers = offers.filter(({ university }) => selectedSlugs.includes(university.slug));
  const filteredOffers = useMemo(() => {
    const query = universityQuery.trim().toLowerCase();
    if (!query) return offers;
    return offers.filter(({ university }) =>
      [university.name, university.shortName, university.city, university.state].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [offers, universityQuery]);
  const lowestFee = feeReadyOffers.length
    ? Math.min(...feeReadyOffers.map(({ program: offer }) => offer.totalFee))
    : null;
  const highestFee = feeReadyOffers.length
    ? Math.max(...feeReadyOffers.map(({ program: offer }) => offer.totalFee))
    : null;

  useEffect(() => {
    if (
      comparisonReady &&
      savedProgramSlug === programSlug &&
      selectedSlugs.length !== savedSelectedSlugs.length
    ) {
      replaceUniversities(programSlug, selectedSlugs);
    }
  }, [
    comparisonReady,
    programSlug,
    replaceUniversities,
    savedProgramSlug,
    savedSelectedSlugs.length,
    selectedSlugs,
  ]);

  function changeProgram(nextSlug: string) {
    setProgramSlug(nextSlug);
    setUniversityQuery("");
    setSelectionFeedback("");
    saveProgram(nextSlug);
    void navigate({ search: { program: nextSlug }, replace: true, resetScroll: false });
  }

  function toggleUniversityChoice(university: University) {
    const selected = selectedSlugs.includes(university.slug);
    if (!selected && selectedSlugs.length >= comparison.maxUniversities) {
      setSelectionFeedback(
        `You can compare up to ${comparison.maxUniversities} universities. Remove one before adding ${university.shortName}.`,
      );
      return;
    }

    const added = comparison.toggleUniversity(programSlug, university.slug);
    setSelectionFeedback(
      added
        ? `${university.shortName} added to your comparison.`
        : `${university.shortName} removed from your comparison.`,
    );
  }

  if (!program) {
    return (
      <div className="container-page flex min-h-[65vh] items-center justify-center py-20 text-center">
        <div className="max-w-xl rounded-[1.75rem] border border-border bg-card p-8">
          <CircleAlert className="mx-auto h-8 w-8 text-[#a94300] dark:text-[#ff9a5b]" />
          <h1 className="mt-5 font-display text-3xl font-extrabold">No published course yet</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            The managed catalogue has no published course to compare. An administrator can publish a
            reviewed course record, or you can request general guidance in the meantime.
          </p>
          <Button asChild className="mt-6 rounded-xl">
            <Link to="/contact">Request general guidance</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground">
      <section className="border-b border-border bg-[#325dd2] text-white">
        <div className="container-page grid gap-7 py-9 sm:py-11 lg:grid-cols-[1fr_380px] lg:items-center lg:py-14">
          <div>
            <span className="inline-flex items-center gap-2 border-l-4 border-[#f47b25] pl-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/85">
              <Scale className="h-4 w-4" /> Compare before you enquire
            </span>
            <h1 className="mt-4 max-w-3xl font-display text-[2.25rem] font-extrabold leading-[1.04] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              Compare online universities side by side.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/85">
              Select one course and up to three universities. Available facts line up in one table,
              and anything that still needs confirmation is clearly marked.
            </p>
          </div>
          <div className="rounded-xl border border-white/25 bg-white/10 p-5 sm:p-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-white/85">
              Current shortlist
            </p>
            <p className="mt-3 font-display text-2xl font-extrabold">{program.code}</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex -space-x-2">
                {selectedOffers.map(({ university }) => (
                  <span
                    key={university.slug}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#071c2e] bg-white"
                  >
                    <UniversityLogo university={university} size="sm" />
                  </span>
                ))}
                {Array.from({ length: Math.max(0, 3 - selectedOffers.length) }).map((_, index) => (
                  <span
                    key={index}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#071c2e] bg-white/10 text-[10px] font-bold text-white/85"
                  >
                    +
                  </span>
                ))}
              </div>
              <p className="text-sm font-bold text-white/85">
                {selectedOffers.length} of 3 selected
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="container-page grid gap-5 py-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <label
              htmlFor="compare-program"
              className="text-xs font-extrabold uppercase tracking-[0.12em] text-muted-foreground"
            >
              Choose one course
            </label>
            <select
              id="compare-program"
              disabled={!comparison.ready}
              value={programSlug}
              onChange={(event) => changeProgram(event.target.value)}
              className="mt-2 h-12 w-full max-w-xl rounded-lg border border-border bg-background px-4 text-sm font-extrabold text-foreground outline-none focus:border-[#325dd2] focus-visible:ring-2 focus-visible:ring-[#325dd2] focus-visible:ring-offset-2"
            >
              {programCatalog.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name} ({item.code})
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            {selectedOffers.length > 0 ? (
              <Button
                size="lg"
                variant="outline"
                onClick={comparison.clearComparison}
                className="rounded-xl"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Clear
              </Button>
            ) : null}
            <Button asChild size="lg" className="bg-[#325dd2] text-white hover:bg-[#2449ad]">
              <Link to="/programs/$programSlug" params={{ programSlug }}>
                Course guide <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container-page py-10 lg:py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#1768cc] dark:text-[#78b9ff]">
              Step 1 · Choose your universities
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.04em]">
              Select universities for {program.code}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose up to three. Your selection stays on this device and never requires sign-in.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-xs font-extrabold text-muted-foreground">
            <IndianRupee className="h-4 w-4 text-[#1768cc] dark:text-[#78b9ff]" />
            {lowestFee !== null && highestFee !== null
              ? `Listed total-fee range ${formatINR(lowestFee)}–${formatINR(highestFee)}`
              : "Current fees are not available yet"}
          </span>
        </div>

        <div className="mt-6 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <label className="relative block" htmlFor="university-search">
            <span className="sr-only">Search universities available for {program.code}</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="university-search"
              type="search"
              value={universityQuery}
              onChange={(event) => setUniversityQuery(event.target.value)}
              placeholder="Search university or location"
              className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm font-semibold outline-none placeholder:text-muted-foreground focus:border-[#325dd2] focus-visible:ring-2 focus-visible:ring-[#325dd2] focus-visible:ring-offset-2"
            />
          </label>
          <p className="text-xs font-semibold text-muted-foreground" aria-live="polite">
            {filteredOffers.length} {filteredOffers.length === 1 ? "option" : "options"} shown
          </p>
        </div>

        <CompactRail label={`Universities available for ${program.code}`} rows={2} columns={3}>
          {filteredOffers.map(({ university, program: offer }) => {
            const selected = selectedSlugs.includes(university.slug);
            const disabled = !selected && selectedSlugs.length >= comparison.maxUniversities;
            return (
              <button
                key={university.slug}
                type="button"
                disabled={!comparison.ready || disabled}
                aria-pressed={selected}
                onClick={() => toggleUniversityChoice(university)}
                className={`relative flex items-center gap-4 rounded-xl border p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  selected
                    ? "border-[#325dd2] bg-[#edf2ff] dark:bg-[#263653]"
                    : "border-border bg-card hover:border-[#80ace0] hover:bg-surface"
                }`}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white">
                  <UniversityLogo university={university} size="sm" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-extrabold">
                    {university.shortName}
                  </span>
                  <span className="mt-1 block text-[11px] text-muted-foreground">
                    {isComparableProgramOffer({ university, program: offer })
                      ? `Listed total fee · ${formatINR(offer.totalFee)}`
                      : university.profileDepth === "directory"
                        ? "Confirm course and fee for this intake"
                        : "Current fee unavailable"}
                  </span>
                </span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${selected ? "border-[#1768cc] bg-[#1768cc] text-white" : "border-border"}`}
                >
                  {selected ? <Check className="h-4 w-4" /> : <span className="text-sm">+</span>}
                </span>
              </button>
            );
          })}
        </CompactRail>

        {offers.length > 0 && filteredOffers.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-border bg-card p-6 text-center">
            <p className="font-display text-base font-extrabold">No university found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a shorter name or search by city or state.
            </p>
            <button
              type="button"
              onClick={() => setUniversityQuery("")}
              className="mt-3 text-sm font-extrabold text-[#1768cc] dark:text-[#78b9ff]"
            >
              Clear search
            </button>
          </div>
        ) : null}

        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {selectionFeedback}
        </p>

        {selectedOffers.length > 0 ? (
          <div className="sticky bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-30 mt-5 rounded-xl border border-[#aebff0] bg-card p-3 shadow-[0_14px_40px_rgba(20,42,87,0.2)] md:bottom-4 md:p-4">
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#1768cc] dark:text-[#78b9ff]">
                  {selectedOffers.length} of {comparison.maxUniversities} selected
                </p>
                <div className="mt-2 flex min-w-0 gap-2 overflow-x-auto [scrollbar-width:none]">
                  {selectedOffers.map(({ university }) => (
                    <span
                      key={university.slug}
                      className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-secondary px-2 py-1.5 text-xs font-bold"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white">
                        <UniversityLogo university={university} size="sm" />
                      </span>
                      <span className="max-w-24 truncate sm:max-w-36">{university.shortName}</span>
                      <button
                        type="button"
                        onClick={() => toggleUniversityChoice(university)}
                        aria-label={`Remove ${university.shortName} from comparison`}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-background hover:text-foreground"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <Button
                asChild
                size="sm"
                className="shrink-0 bg-[#325dd2] text-white hover:bg-[#2449ad]"
              >
                <a href="#comparison-results">
                  Review <ArrowRight className="ml-1.5 h-4 w-4" />
                </a>
              </Button>
            </div>
            {selectedSlugs.length >= comparison.maxUniversities ? (
              <p className="mt-2 text-[11px] font-semibold text-muted-foreground">
                Maximum reached. Remove one to choose another university.
              </p>
            ) : null}
          </div>
        ) : null}

        {offers.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <p className="font-display text-lg font-extrabold">
              No university option is available for this course yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another course or browse the university list. We only show a course when it is
              connected to that university's profile.
            </p>
          </div>
        ) : null}

        <div id="comparison-results" className="mt-10 scroll-mt-28">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff0e6] text-[#a94300] dark:bg-[#3d281c] dark:text-[#ffab73]">
              <GitCompareArrows className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-muted-foreground">
                Step 2 · Review available facts
              </p>
              <h2 className="font-display text-2xl font-extrabold">Your university comparison</h2>
            </div>
          </div>

          {selectedOffers.length === 0 ? (
            <div className="mt-6 rounded-[1.75rem] border border-dashed border-border bg-card p-12 text-center">
              <GitCompareArrows className="mx-auto h-8 w-8 text-muted-foreground" />
              <h3 className="mt-4 font-display text-xl font-extrabold">
                Choose at least one university
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                The detailed comparison will appear here as you add options above.
              </p>
            </div>
          ) : (
            <ComparisonMatrix offers={selectedOffers} programSlug={programSlug} />
          )}
        </div>

        <div className="mt-10 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_390px]">
          <div className="min-w-0 rounded-xl border border-[#bfdaf4] bg-[#f3f8ff] p-6 dark:border-[#295a85] dark:bg-[#0e263b]">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-[#1768cc] dark:text-[#78b9ff]" />
              <h2 className="font-display text-xl font-extrabold">How to use this comparison</h2>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                [
                  "Recognition first",
                  "Verify UGC entitlement for your exact intake before paying.",
                ],
                [
                  "Total cost over EMI",
                  "A low monthly figure can hide a higher total program cost.",
                ],
                [
                  "Learning fit",
                  "Ask about live sessions, recordings, exams and academic support.",
                ],
                [
                  "Outcomes need effort",
                  "A degree supports growth; skills and experience still matter.",
                ],
              ].map(([title, text]) => (
                <div key={title}>
                  <p className="flex items-center gap-2 text-sm font-extrabold">
                    <BadgeCheck className="h-4 w-4 text-[#168258]" /> {title}
                  </p>
                  <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
            <Link
              to="/methodology"
              className="mt-7 inline-flex items-center text-sm font-extrabold text-[#1768cc] dark:text-[#78b9ff]"
            >
              Read our evaluation methodology <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <LeadForm
            compact
            defaultProgramSlug={program.slug}
            title="Need a human second opinion?"
          />
        </div>
      </section>
    </div>
  );
}

function ComparisonMatrix({ offers, programSlug }: { offers: Offer[]; programSlug: string }) {
  const feeReadyOffers = offers.filter(isComparableProgramOffer);
  const cheapestSlug = [...feeReadyOffers].sort(
    (a, b) => a.program.totalFee - b.program.totalFee,
  )[0]?.university.slug;

  const rows: { label: string; icon: typeof ShieldCheck; render: (offer: Offer) => ReactNode }[] = [
    {
      label: "Profile status",
      icon: GraduationCap,
      render: ({ university }) =>
        university.profileDepth === "directory"
          ? university.verificationSourceUrl && university.verificationAcademicYear
            ? `Previous record · ${university.verificationAcademicYear}`
            : "Current university details need review"
          : "Independent guide · not the official prospectus",
    },
    {
      label: "University location",
      icon: GraduationCap,
      render: ({ university }) => formatUniversityLocation(university),
    },
    {
      label: "Current intake",
      icon: ShieldCheck,
      render: ({ university, program }) => {
        const currentEvidence =
          university.verificationCurrent === true &&
          program.entitlementStatus === "verified" &&
          Boolean(program.entitlementSourceUrl) &&
          Boolean(program.academicSession?.trim());
        return (
          <span>
            {currentEvidence
              ? `${program.deliveryMode ?? "ONLINE"} · ${program.academicSession}`
              : "Course, mode and intake still need confirmation"}
            {currentEvidence && program.entitlementSourceUrl ? (
              <a
                href={program.entitlementSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open intake document (opens in new tab)"
                className="mt-1 flex items-center gap-1 text-xs text-[#1768cc] dark:text-[#78b9ff]"
              >
                Open intake document <ExternalLink className="h-3 w-3" />
              </a>
            ) : null}
          </span>
        );
      },
    },
    {
      label: "Listed total fee",
      icon: IndianRupee,
      render: (offer) =>
        isComparableProgramOffer(offer)
          ? formatINR(offer.program.totalFee)
          : "Current total fee unavailable",
    },
    {
      label: "Fee details",
      icon: BadgeCheck,
      render: (offer) =>
        isComparableProgramOffer(offer) && offer.program.feeSourceUrl ? (
          <a
            href={offer.program.feeSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open fee document checked ${offer.program.feeVerifiedAt?.slice(0, 10) ?? "for this catalogue"} (opens in new tab)`}
            className="inline-flex items-center gap-1 text-[#1768cc] dark:text-[#78b9ff]"
          >
            Fee checked {offer.program.feeVerifiedAt?.slice(0, 10) ?? "for this catalogue"}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : (
          "Current fee document unavailable"
        ),
    },
    {
      label: "Per semester",
      icon: WalletCards,
      render: (offer) =>
        isComparableProgramOffer(offer)
          ? `${formatINR(offer.program.perSemesterFee)} (${offer.program.perSemesterFeeVerified ? "listed by the university" : "calculated from the listed total"})`
          : "Not shown without a current total fee",
    },
    {
      label: "Estimated monthly payment",
      icon: IndianRupee,
      render: (offer) =>
        isComparableProgramOffer(offer)
          ? `${formatINR(offer.program.emiPerMonth)} / month (${offer.program.emiPerMonthVerified ? "published monthly amount" : "arithmetic split, not a lender quote"})`
          : "Not shown without a current total fee",
    },
    {
      label: "Duration",
      icon: GraduationCap,
      render: ({ program }) =>
        `${program.durationVerified ? "Offering duration" : "Typical course-category duration"}: ${program.durationYears} years · ${program.semesters} semesters`,
    },
    {
      label: "Recognition details",
      icon: BadgeCheck,
      render: ({ university, program }) => {
        const claims = getProgramApprovalClaims(university, program);
        return claims.length ? (
          <span className="flex flex-col gap-1.5">
            {claims.slice(0, 4).map((claim) => (
              <a
                key={claim.id}
                href={claim.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${claim.renderedClaim} (opens in new tab)`}
                className="inline-flex items-start gap-1 text-[#1768cc] dark:text-[#78b9ff]"
              >
                {claim.renderedClaim} <ExternalLink className="mt-1 h-3 w-3 shrink-0" />
              </a>
            ))}
          </span>
        ) : (
          "Current course recognition details unavailable"
        );
      },
    },
    {
      label: "Offering details",
      icon: GraduationCap,
      render: ({ program }) =>
        `${program.examMode && program.universityProgramUrl ? `Exam mode: ${program.examMode}` : "Exam mode: confirm with university"} · ${program.specialisationsVerified ? `${program.specialisations.length} listed pathways` : "Pathways require confirmation"}`,
    },
  ];

  return (
    <>
      <div className="mt-6 space-y-4 md:hidden">
        <p className="text-xs font-semibold leading-5 text-muted-foreground">
          Each university is shown as a separate card for easier reading on a phone.
        </p>
        {offers.map((offer) => (
          <article
            key={offer.university.slug}
            className="overflow-hidden rounded-xl border border-border bg-card"
          >
            <div className="flex items-start gap-3 border-b border-border bg-secondary/60 p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">
                <UniversityLogo university={offer.university} size="sm" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-base font-extrabold">
                  {offer.university.shortName}
                </h3>
                <p className="mt-1 text-[11px] font-semibold text-muted-foreground">
                  {formatUniversityLocation(offer.university)}
                </p>
                {offer.university.slug === cheapestSlug ? (
                  <span className="mt-2 inline-flex">
                    <InsightPill label="Lowest listed total fee" />
                  </span>
                ) : null}
              </div>
            </div>
            <dl className="divide-y divide-border">
              {rows.map((row) => (
                <div key={row.label} className="grid gap-1.5 px-4 py-3.5">
                  <dt className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.08em] text-muted-foreground">
                    <row.icon className="h-3.5 w-3.5" /> {row.label}
                  </dt>
                  <dd className="text-sm font-bold leading-6">{row.render(offer)}</dd>
                </div>
              ))}
            </dl>
            <div className="border-t border-border p-4">
              <Button asChild variant="outline" className="w-full rounded-xl">
                <Link
                  to="/universities/$universitySlug/$programSlug"
                  params={{ universitySlug: offer.university.slug, programSlug }}
                >
                  View full details <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </article>
        ))}
        <ComparisonNote />
      </div>

      <div
        tabIndex={0}
        aria-label="Scrollable university comparison table"
        className="mt-6 hidden overflow-x-auto rounded-xl border border-border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#325dd2] focus-visible:ring-offset-2 md:block"
      >
        <p className="border-b border-border bg-[#edf2ff] px-4 py-2 text-xs font-semibold text-[#2449ad] dark:bg-[#1b263c] dark:text-[#b9ceff] lg:hidden">
          Scroll sideways to review every selected university.
        </p>
        <table className="w-full min-w-[760px] table-fixed text-sm">
          <thead>
            <tr className="bg-secondary/60">
              <th className="sticky left-0 z-20 w-44 bg-secondary p-5 text-left text-xs font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
                Factor
              </th>
              {offers.map(({ university }) => (
                <th
                  key={university.slug}
                  className="border-l border-border p-5 text-left align-top"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">
                      <UniversityLogo university={university} size="sm" />
                    </span>
                    <div>
                      <p className="font-display text-base font-extrabold">
                        {university.shortName}
                      </p>
                      <p className="mt-1 text-[10px] font-semibold text-muted-foreground">
                        {formatUniversityLocation(university)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {university.slug === cheapestSlug ? (
                      <InsightPill label="Lowest listed total fee" />
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.label} className={index % 2 ? "bg-secondary/30" : "bg-card"}>
                <th
                  scope="row"
                  className={`sticky left-0 z-10 p-5 text-left align-top ${index % 2 ? "bg-secondary" : "bg-card"}`}
                >
                  <span className="flex items-center gap-2 text-xs font-extrabold text-muted-foreground">
                    <row.icon className="h-4 w-4" /> {row.label}
                  </span>
                </th>
                {offers.map((offer) => (
                  <td
                    key={offer.university.slug}
                    className="border-l border-border p-5 align-top font-bold leading-6"
                  >
                    {row.render(offer)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th className="sticky left-0 z-10 bg-card p-5">
                <span className="sr-only">Actions</span>
              </th>
              {offers.map(({ university }) => (
                <td key={university.slug} className="border-l border-border p-5">
                  <Button asChild variant="outline" className="w-full rounded-xl">
                    <Link
                      to="/universities/$universitySlug/$programSlug"
                      params={{ universitySlug: university.slug, programSlug }}
                    >
                      View full details <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <ComparisonNote bordered />
      </div>
    </>
  );
}

function ComparisonNote({ bordered = false }: { bordered?: boolean }) {
  return (
    <div
      className={`flex items-start gap-3 bg-[#fff9eb] p-4 text-xs leading-5 text-[#785914] dark:bg-[#2d2517] dark:text-[#e5bd62] ${bordered ? "border-t border-border" : "rounded-xl border border-[#efd99d] dark:border-[#5d4d27]"}`}
    >
      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /> Fees appear only when a current total and
      supporting document are available. Calculated semester or monthly amounts are clearly
      labelled. Reconfirm fees, recognition and support policies for your intake before payment.
    </div>
  );
}

function InsightPill({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-[#e8f7ef] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[#168258] dark:bg-[#153d30] dark:text-[#69d7a9]">
      {label}
    </span>
  );
}
