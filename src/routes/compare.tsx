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
  Sparkles,
  Trash2,
  WalletCards,
} from "lucide-react";
import { UniversityLogo } from "@/components/site/university-logo";
import { LeadForm } from "@/components/site/lead-form";
import { Button } from "@/components/ui/button";
import {
  formatINR,
  getProgramApprovalClaims,
  programCatalog,
  comparableUniversitiesOfferingProgram,
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
          "Build a side-by-side comparison of current source-backed online offerings, cited total fees and clearly labelled derived payment splits.",
      },
      { property: "og:title", content: "Compare Online Universities in India" },
      {
        property: "og:description",
        content:
          "Compare source-backed offerings and cited total fees; directory and expired records remain excluded.",
      },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  const comparison = useComparison();
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

  const offers = useMemo(() => comparableUniversitiesOfferingProgram(programSlug), [programSlug]);
  const program = programCatalog.find((item) => item.slug === programSlug);
  const selectedSlugs = comparison.programSlug === programSlug ? comparison.universitySlugs : [];
  const selectedOffers = offers.filter(({ university }) => selectedSlugs.includes(university.slug));
  const lowestFee = offers.length
    ? Math.min(...offers.map(({ program: offer }) => offer.totalFee))
    : null;
  const highestFee = offers.length
    ? Math.max(...offers.map(({ program: offer }) => offer.totalFee))
    : null;

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
      <section className="relative overflow-hidden border-b border-border bg-[#071c2e] text-white">
        <div className="pointer-events-none absolute -left-36 -top-40 h-[32rem] w-[32rem] rounded-full bg-[#175fa3]/35 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-8 h-[24rem] w-[24rem] rounded-full bg-[#a96918]/25 blur-3xl" />
        <div className="container-page relative grid gap-10 py-16 lg:grid-cols-[1fr_380px] lg:items-center lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8bc7ff]">
              <Scale className="h-4 w-4" /> Evidence before enquiry
            </span>
            <h1 className="mt-6 max-w-3xl font-display text-4xl font-extrabold tracking-[-0.055em] sm:text-5xl lg:text-6xl">
              Compare online universities side by side.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/65">
              Select one course and up to three source-backed offerings. Directory, editorial and
              expired records do not enter this comparison.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-white/12 bg-white/[0.07] p-6 backdrop-blur">
            <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-white/50">
              Current comparison
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
              className="mt-2 h-12 w-full max-w-xl rounded-xl border border-border bg-background px-4 text-sm font-extrabold text-foreground outline-none focus:border-[#1768cc] focus-visible:ring-2 focus-visible:ring-[#0d5cad] focus-visible:ring-offset-2"
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
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-[#1768cc] text-white hover:bg-[#0e57b2]"
            >
              <Link to="/programs/$programSlug" params={{ programSlug }}>
                Course guide <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container-page py-12 lg:py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#1768cc] dark:text-[#78b9ff]">
              Step 1 · Build your comparison
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.04em]">
              Select universities for {program.code}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose up to three. Your selection stays saved on this device.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-extrabold text-muted-foreground">
            <IndianRupee className="h-4 w-4 text-[#1768cc] dark:text-[#78b9ff]" />
            {lowestFee !== null && highestFee !== null
              ? `Sourced total-fee range ${formatINR(lowestFee)}–${formatINR(highestFee)}`
              : "No priced comparison profiles yet"}
          </span>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                className={`relative flex items-center gap-4 rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  selected
                    ? "border-[#1768cc] bg-[#edf5ff] shadow-[0_18px_36px_-28px_rgba(23,104,204,0.7)] dark:bg-[#102a42]"
                    : "border-border bg-card hover:-translate-y-0.5 hover:border-[#80ace0]"
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
                    Sourced total fee · {formatINR(offer.totalFee)}
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
        </div>

        {offers.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <p className="font-display text-lg font-extrabold">
              No source-backed comparison data yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Directory, editorial and expired records are intentionally excluded until a current
              offering and cited total fee are mapped.
            </p>
          </div>
        ) : null}

        <div className="mt-14">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff0e6] text-[#a94300] dark:bg-[#3d281c] dark:text-[#ffab73]">
              <GitCompareArrows className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-muted-foreground">
                Step 2 · Review trade-offs
              </p>
              <h2 className="font-display text-2xl font-extrabold">Your side-by-side matrix</h2>
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

        <div className="mt-14 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="min-w-0 rounded-[1.75rem] border border-[#bfdaf4] bg-[#f3f8ff] p-7 dark:border-[#295a85] dark:bg-[#0e263b]">
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
  const cheapestSlug = [...offers].sort((a, b) => a.program.totalFee - b.program.totalFee)[0]
    ?.university.slug;

  const rows: { label: string; icon: typeof ShieldCheck; render: (offer: Offer) => ReactNode }[] = [
    {
      label: "Offering evidence",
      icon: ShieldCheck,
      render: ({ program }) => (
        <span>
          {program.deliveryMode ?? "ONLINE"} · {program.academicSession ?? "Session cited"}
          {program.entitlementSourceUrl ? (
            <a
              href={program.entitlementSourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 flex items-center gap-1 text-xs text-[#1768cc] dark:text-[#78b9ff]"
            >
              Open entitlement source <ExternalLink className="h-3 w-3" />
            </a>
          ) : null}
        </span>
      ),
    },
    {
      label: "Sourced total fee",
      icon: IndianRupee,
      render: ({ program }) => `${formatINR(program.totalFee)} (sourced catalogue value)`,
    },
    {
      label: "Fee citation",
      icon: BadgeCheck,
      render: ({ program }) =>
        program.feeSourceUrl ? (
          <a
            href={program.feeSourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[#1768cc] dark:text-[#78b9ff]"
          >
            Source checked {program.feeVerifiedAt?.slice(0, 10) ?? "for this catalogue"}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : (
          "Fee source unavailable—do not rely on this value"
        ),
    },
    {
      label: "Per semester",
      icon: WalletCards,
      render: ({ program }) =>
        `${formatINR(program.perSemesterFee)} (${program.perSemesterFeeVerified ? "sourced" : "derived from total"})`,
    },
    {
      label: "Estimated monthly payment",
      icon: IndianRupee,
      render: ({ program }) =>
        `${formatINR(program.emiPerMonth)} / month (${program.emiPerMonthVerified ? "published monthly amount" : "arithmetic split, not a lender quote"})`,
    },
    {
      label: "Duration",
      icon: GraduationCap,
      render: ({ program }) =>
        `${program.durationVerified ? "Offering duration" : "Typical course duration"}: ${program.durationYears} years · ${program.semesters} semesters`,
    },
    {
      label: "Separate accreditation evidence",
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
                rel="noreferrer"
                className="inline-flex items-start gap-1 text-[#1768cc] dark:text-[#78b9ff]"
              >
                {claim.renderedClaim} <ExternalLink className="mt-1 h-3 w-3 shrink-0" />
              </a>
            ))}
          </span>
        ) : (
          "No current, scope-matched recognition evidence mapped"
        );
      },
    },
    {
      label: "Offering details",
      icon: Sparkles,
      render: ({ program }) =>
        `${program.examMode ? `Exam mode: ${program.examMode}` : "Exam mode: confirm with university"} · ${program.specialisationsVerified ? `${program.specialisations.length} sourced pathways` : "Pathways require confirmation"}`,
    },
  ];

  return (
    <div className="mt-6 overflow-x-auto rounded-[1.75rem] border border-border bg-card shadow-[0_20px_55px_-45px_rgba(12,39,71,0.7)]">
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
                      {university.city}, {university.state}
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
        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /> Total fees link to their catalogue
        source; arithmetic semester or monthly splits are labelled as derived. Fees, recognition and
        support policies can change by intake, so reconfirm before payment.
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
