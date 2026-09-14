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
  Scale,
  ShieldCheck,
  Trash2,
  WalletCards,
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

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare Online Universities — Fee Guides & Program Details | DekhoCampus" },
      {
        name: "description",
        content:
          "Build a private side-by-side comparison of online university catalogue records, with cited facts separated from details that still need verification.",
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
  const comparison = useComparison();
  const {
    ready: comparisonReady,
    programSlug: savedProgramSlug,
    universitySlugs: savedUniversitySlugs,
    replaceUniversities,
  } = comparison;
  const [programSlug, setProgramSlug] = useState(programCatalog[0]?.slug ?? "");
  const [programChosen, setProgramChosen] = useState(false);

  useEffect(() => {
    if (
      comparison.ready &&
      !programChosen &&
      comparison.programSlug &&
      programCatalog.some((program) => program.slug === comparison.programSlug)
    ) {
      setProgramSlug(comparison.programSlug);
    }
  }, [comparison.programSlug, comparison.ready, programChosen]);

  const offers = useMemo(() => universitiesOfferingProgram(programSlug), [programSlug]);
  const sourcedOffers = useMemo(() => offers.filter(isComparableProgramOffer), [offers]);
  const program = programCatalog.find((item) => item.slug === programSlug);
  const savedSelectedSlugs = savedProgramSlug === programSlug ? savedUniversitySlugs : [];
  const selectedSlugs = savedSelectedSlugs.filter((slug) =>
    offers.some(({ university }) => university.slug === slug),
  );
  const selectedOffers = offers.filter(({ university }) => selectedSlugs.includes(university.slug));
  const lowestFee = sourcedOffers.length
    ? Math.min(...sourcedOffers.map(({ program: offer }) => offer.totalFee))
    : null;
  const highestFee = sourcedOffers.length
    ? Math.max(...sourcedOffers.map(({ program: offer }) => offer.totalFee))
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
    setProgramChosen(true);
    setProgramSlug(nextSlug);
    comparison.changeProgram(nextSlug);
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
      <section className="border-b border-border bg-[#131720] text-white">
        <div className="container-page grid gap-10 py-14 lg:grid-cols-[1fr_380px] lg:items-center lg:py-16">
          <div>
            <span className="inline-flex items-center gap-2 border-l-4 border-[#f47b25] pl-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/85">
              <Scale className="h-4 w-4" /> Evidence before enquiry
            </span>
            <h1 className="mt-6 max-w-3xl font-display text-4xl font-extrabold tracking-[-0.055em] sm:text-5xl lg:text-6xl">
              Compare online universities side by side.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/65">
              Select one course and up to three catalogue records. We show source-backed facts when
              available and mark every missing or unverified field clearly.
            </p>
          </div>
          <div className="rounded-xl border border-white/15 bg-[#252b36] p-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-white/70">
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
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#071c2e] bg-white/10 text-[10px] font-bold text-white/65"
                  >
                    +
                  </span>
                ))}
              </div>
              <p className="text-sm font-bold text-white/70">
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
              Step 1 · Build your catalogue shortlist
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.04em]">
              Select university records for {program.code}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose up to three. Your selection stays on this device and never requires sign-in.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-xs font-extrabold text-muted-foreground">
            <IndianRupee className="h-4 w-4 text-[#1768cc] dark:text-[#78b9ff]" />
            {lowestFee !== null && highestFee !== null
              ? `Sourced total-fee range ${formatINR(lowestFee)}–${formatINR(highestFee)}`
              : "No current sourced fee range yet"}
          </span>
        </div>

        <CompactRail label={`Universities available for ${program.code}`} rows={2} columns={3}>
          {offers.map(({ university, program: offer }) => {
            const selected = selectedSlugs.includes(university.slug);
            const disabled = !selected && selectedSlugs.length >= 3;
            return (
              <button
                key={university.slug}
                type="button"
                disabled={!comparison.ready || disabled}
                aria-pressed={selected}
                onClick={() => comparison.toggleUniversity(programSlug, university.slug)}
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
                      ? `Sourced total fee · ${formatINR(offer.totalFee)}`
                      : university.profileDepth === "directory"
                        ? "Directory record · verify this intake"
                        : "Catalogue record · fee not currently cited"}
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

        {offers.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <p className="font-display text-lg font-extrabold">
              No catalogue relationship is mapped yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another course or browse the university directory. We do not infer a university–
              course relationship from its name alone.
            </p>
          </div>
        ) : null}

        <div className="mt-10">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff0e6] text-[#a94300] dark:bg-[#3d281c] dark:text-[#ffab73]">
              <GitCompareArrows className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-muted-foreground">
                Step 2 · Review available facts
              </p>
              <h2 className="font-display text-2xl font-extrabold">
                Your side-by-side evidence table
              </h2>
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
  const sourcedFeeOffers = offers.filter(isComparableProgramOffer);
  const cheapestSlug = [...sourcedFeeOffers].sort(
    (a, b) => a.program.totalFee - b.program.totalFee,
  )[0]?.university.slug;

  const rows: { label: string; icon: typeof ShieldCheck; render: (offer: Offer) => ReactNode }[] = [
    {
      label: "Catalogue record",
      icon: GraduationCap,
      render: ({ university }) =>
        university.profileDepth === "directory"
          ? university.verificationSourceUrl && university.verificationAcademicYear
            ? `Historical directory record · ${university.verificationAcademicYear}`
            : "Directory research record · source review needed"
          : "Editorial profile · not an official prospectus",
    },
    {
      label: "University location",
      icon: GraduationCap,
      render: ({ university }) => formatUniversityLocation(university),
    },
    {
      label: "Offering evidence",
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
              : "No current programme–mode–session evidence mapped"}
            {currentEvidence && program.entitlementSourceUrl ? (
              <a
                href={program.entitlementSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open entitlement source (opens in new tab)"
                className="mt-1 flex items-center gap-1 text-xs text-[#1768cc] dark:text-[#78b9ff]"
              >
                Open entitlement source <ExternalLink className="h-3 w-3" />
              </a>
            ) : null}
          </span>
        );
      },
    },
    {
      label: "Sourced total fee",
      icon: IndianRupee,
      render: (offer) =>
        isComparableProgramOffer(offer)
          ? `${formatINR(offer.program.totalFee)} (cited catalogue value)`
          : "No current cited total fee",
    },
    {
      label: "Fee citation",
      icon: BadgeCheck,
      render: (offer) =>
        isComparableProgramOffer(offer) && offer.program.feeSourceUrl ? (
          <a
            href={offer.program.feeSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open fee source checked ${offer.program.feeVerifiedAt?.slice(0, 10) ?? "for this catalogue"} (opens in new tab)`}
            className="inline-flex items-center gap-1 text-[#1768cc] dark:text-[#78b9ff]"
          >
            Source checked {offer.program.feeVerifiedAt?.slice(0, 10) ?? "for this catalogue"}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : (
          "No current fee citation"
        ),
    },
    {
      label: "Per semester",
      icon: WalletCards,
      render: (offer) =>
        isComparableProgramOffer(offer)
          ? `${formatINR(offer.program.perSemesterFee)} (${offer.program.perSemesterFeeVerified ? "cited" : "arithmetic split from cited total"})`
          : "Not shown without a cited total fee",
    },
    {
      label: "Estimated monthly payment",
      icon: IndianRupee,
      render: (offer) =>
        isComparableProgramOffer(offer)
          ? `${formatINR(offer.program.emiPerMonth)} / month (${offer.program.emiPerMonthVerified ? "published monthly amount" : "arithmetic split, not a lender quote"})`
          : "Not shown without a cited total fee",
    },
    {
      label: "Duration",
      icon: GraduationCap,
      render: ({ program }) =>
        `${program.durationVerified ? "Offering duration" : "Typical course-category duration"}: ${program.durationYears} years · ${program.semesters} semesters`,
    },
    {
      label: "Cited programme-context sources",
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
          "No current programme-scoped recognition evidence mapped"
        );
      },
    },
    {
      label: "Offering details",
      icon: GraduationCap,
      render: ({ program }) =>
        `${program.examMode && program.universityProgramUrl ? `Exam mode: ${program.examMode}` : "Exam mode: confirm with university"} · ${program.specialisationsVerified ? `${program.specialisations.length} cited pathways` : "Pathways require confirmation"}`,
    },
  ];

  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[760px] table-fixed text-sm">
        <thead>
          <tr className="bg-secondary/60">
            <th className="w-44 p-5 text-left text-xs font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
              Factor
            </th>
            {offers.map(({ university }) => (
              <th key={university.slug} className="border-l border-border p-5 text-left align-top">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">
                    <UniversityLogo university={university} size="sm" />
                  </span>
                  <div>
                    <p className="font-display text-base font-extrabold">{university.shortName}</p>
                    <p className="mt-1 text-[10px] font-semibold text-muted-foreground">
                      {formatUniversityLocation(university)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {university.slug === cheapestSlug ? (
                    <InsightPill label="Lowest sourced total fee" />
                  ) : null}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.label} className={index % 2 ? "bg-secondary/30" : "bg-card"}>
              <th scope="row" className="p-5 text-left align-top">
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
            <th className="p-5">
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
      <div className="flex items-start gap-3 border-t border-border bg-[#fff9eb] p-4 text-xs leading-5 text-[#785914] dark:bg-[#2d2517] dark:text-[#e5bd62]">
        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /> A blank cell is intentional. Exact fees
        appear only with current cited evidence; arithmetic semester or monthly splits are labelled
        as derived. Reconfirm fees, recognition and support policies for your intake before payment.
      </div>
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
