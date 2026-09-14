import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  BookOpenCheck,
  Check,
  CheckCircle2,
  Clock3,
  ExternalLink,
  GitCompareArrows,
  GraduationCap,
  IndianRupee,
  Laptop2,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { UniversityLogo } from "@/components/site/university-logo";
import {
  formatINR,
  getProgramApprovalClaims,
  type University,
  type UniversityProgram,
} from "@/data/universities";
import { useComparison } from "@/hooks/use-comparison";

interface ProgramHeroProps {
  university: University;
  program: UniversityProgram;
}

export function ProgramHero({ university: u, program: p }: ProgramHeroProps) {
  const isDirectoryProfile = u.profileDepth === "directory";
  const hasCurrentOfferingEvidence =
    !isDirectoryProfile && u.verificationCurrent === true && p.entitlementStatus === "verified";
  const isEditorialFallback = !isDirectoryProfile && p.entitlementStatus === undefined;
  const requiresVerification = !hasCurrentOfferingEvidence;
  const approvalClaims = getProgramApprovalClaims(u, p);
  const comparison = useComparison(p.slug);
  const isCompared = comparison.universitySlugs.includes(u.slug);
  const mode = hasCurrentOfferingEvidence
    ? p.deliveryMode === "ODL"
      ? "ODL"
      : "Online"
    : "Confirm for this intake";
  const fee =
    hasCurrentOfferingEvidence && p.totalFeeAvailable
      ? formatINR(p.totalFee)
      : "Ask for the current fee";

  const quickFacts = [
    {
      icon: Clock3,
      label:
        hasCurrentOfferingEvidence && p.durationVerified ? "Course duration" : "Typical duration",
      value: `${p.durationYears} years · ${p.semesters} semesters`,
    },
    { icon: GraduationCap, label: "Degree level", value: p.level },
    { icon: Laptop2, label: "Learning mode", value: mode },
    { icon: IndianRupee, label: "Total fee", value: fee },
  ];

  function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      void navigator.share({ title: `${p.name} — ${u.shortName}`, url });
      return;
    }
    void navigator?.clipboard?.writeText(url);
    toast.success("Page link copied");
  }

  return (
    <section className="border-b border-border bg-surface text-foreground">
      <div className="container-page py-6 sm:py-8 lg:py-10">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link to="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/universities" className="transition-colors hover:text-foreground">
            Universities
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            to="/universities/$universitySlug"
            params={{ universitySlug: u.slug }}
            className="max-w-40 truncate transition-colors hover:text-foreground sm:max-w-none"
          >
            {u.shortName}
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-bold text-foreground">
            {p.code}
          </span>
        </nav>

        <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start lg:gap-10">
          <div className="min-w-0 py-1 lg:py-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#bfd0ff] bg-card px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#2449ad] dark:border-[#435a8d] dark:text-[#b9ceff]">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                {requiresVerification
                  ? isEditorialFallback
                    ? "Course guide"
                    : "Course listing"
                  : "Current course details available"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-bold text-muted-foreground">
                <BadgeCheck className="h-3.5 w-3.5 text-[#14845f] dark:text-[#65d5a7]" />
                No-pressure guidance
              </span>
            </div>

            <div className="mt-5 flex items-center gap-3 sm:gap-4">
              <UniversityLogo
                university={u}
                size="lg"
                className="h-16 w-16 rounded-xl sm:h-20 sm:w-20"
              />
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#a94300] dark:text-[#ffad70]">
                  {hasCurrentOfferingEvidence ? "Study online with" : "University course profile"}
                </p>
                <p className="mt-1 text-sm font-extrabold leading-5 sm:text-base">{u.name}</p>
              </div>
            </div>

            <h1 className="mt-6 max-w-4xl break-words font-display text-[2.25rem] font-extrabold leading-[1.04] tracking-[-0.045em] sm:text-5xl lg:text-[3.25rem]">
              {hasCurrentOfferingEvidence ? `Online ${p.code}` : `${p.code} course profile`}{" "}
              <span className="block text-[#325dd2] dark:text-[#7da2ff]">
                {hasCurrentOfferingEvidence ? `from ${u.shortName}` : u.shortName}
              </span>
            </h1>

            <p className="mt-3 text-sm font-bold text-[#536176] dark:text-muted-foreground">
              {p.name} ·{" "}
              {hasCurrentOfferingEvidence
                ? "current course details"
                : "confirm availability for this intake"}
            </p>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              Compare the curriculum, fees, eligibility and study format without chasing multiple
              pages. We keep missing intake details visibly marked for you.
            </p>

            <div className="mt-6 grid grid-cols-[minmax(0,1fr)_3rem] gap-3 sm:flex sm:flex-row sm:flex-wrap">
              <Button
                asChild
                size="lg"
                className={`min-w-0 bg-[#f47b25] px-3 text-[#111827] hover:bg-[#d85f12] sm:w-auto sm:px-6 ${
                  requiresVerification ? "" : "col-span-2 sm:col-span-1"
                }`}
              >
                <a href="#apply">
                  Get free course guidance
                  <CheckCircle2 className="ml-1 h-4 w-4" />
                </a>
              </Button>
              {!requiresVerification ? (
                <button
                  type="button"
                  onClick={() => comparison.toggleUniversity(p.slug, u.slug)}
                  className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border px-5 text-sm font-extrabold transition-colors sm:w-auto ${
                    isCompared
                      ? "border-[#a8dec7] bg-[#eaf9f2] text-[#126f4b] dark:border-[#386f5a] dark:bg-[#153d30] dark:text-[#8de3bd]"
                      : "border-border bg-card text-foreground hover:border-[#325dd2] hover:text-[#2449ad] dark:hover:text-[#b9ceff]"
                  }`}
                >
                  {isCompared ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <GitCompareArrows className="h-4 w-4" />
                  )}
                  {isCompared ? "Added to compare" : "Add to compare"}
                </button>
              ) : null}
              <button
                type="button"
                onClick={share}
                aria-label="Share this course profile"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-bold transition-colors hover:border-[#325dd2] hover:text-[#2449ad] dark:hover:text-[#b9ceff] sm:w-12 sm:px-0"
              >
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share course</span>
              </button>
            </div>

            <p className="mt-4 flex max-w-2xl items-start gap-2 text-xs leading-5 text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#14845f] dark:text-[#65d5a7]" />
              Free independent support. Pay only on the university’s official channel after you
              verify the written fee and intake.
            </p>
          </div>

          <aside className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <div className="h-1.5 bg-[#325dd2]" />
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#a94300] dark:text-[#ffad70]">
                    Course quick view
                  </p>
                  <h2 className="mt-1 font-display text-xl font-extrabold">
                    What you need before shortlisting
                  </h2>
                </div>
                <BookOpenCheck className="h-6 w-6 shrink-0 text-[#325dd2] dark:text-[#7da2ff]" />
              </div>

              <a
                href="#apply"
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#f47b25] px-4 text-sm font-extrabold text-[#111827] transition-colors hover:bg-[#d85f12]"
              >
                Get current fee &amp; intake guidance
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              </a>

              <dl className="mt-5 grid grid-cols-2 gap-2 sm:block sm:divide-y sm:divide-border sm:border-y sm:border-border">
                {quickFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="min-w-0 rounded-lg bg-secondary/65 p-3 sm:grid sm:grid-cols-[1fr_minmax(0,1.2fr)] sm:gap-3 sm:rounded-none sm:bg-transparent sm:px-0 sm:py-3.5"
                  >
                    <dt className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground sm:text-xs">
                      <fact.icon className="h-4 w-4 shrink-0" />
                      {fact.label}
                    </dt>
                    <dd className="mt-2 break-words text-xs font-extrabold leading-5 text-foreground sm:mt-0 sm:text-right">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 rounded-xl bg-[#edf2ff] p-4 dark:bg-[#263653]">
                <p className="flex items-center gap-2 text-xs font-extrabold text-[#2449ad] dark:text-[#dbe6ff]">
                  <ShieldCheck className="h-4 w-4" />
                  {hasCurrentOfferingEvidence
                    ? `${p.academicSession ?? "Current"} course details checked`
                    : "Current availability is not confirmed"}
                </p>
                <p className="mt-2 text-xs leading-5 text-[#475467] dark:text-[#c2cbdb]">
                  {hasCurrentOfferingEvidence
                    ? "Check the linked course document, then reconfirm every payable amount before admission."
                    : "Use this profile to prepare your questions, then confirm the exact course, mode and admission session with the university."}
                </p>
              </div>

              {approvalClaims[0] ? (
                <a
                  href={approvalClaims[0].sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Check recognition details (opens in new tab)"
                  className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold text-[#2449ad] hover:underline dark:text-[#b9ceff]"
                >
                  Check recognition details
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

const sections = [
  { id: "overview", label: "Overview" },
  { id: "curriculum", label: "Curriculum" },
  { id: "specialisations", label: "Specialisations" },
  { id: "fees", label: "Fees" },
  { id: "eligibility", label: "Eligibility" },
  { id: "careers", label: "Careers" },
  { id: "faqs", label: "FAQs" },
  { id: "compare", label: "Compare" },
];

export function ProgramSectionNav({ includeCompare = true }: { includeCompare?: boolean }) {
  const visibleSections = includeCompare
    ? sections
    : sections.filter((section) => section.id !== "compare");
  return (
    <nav
      aria-label="Programme sections"
      className="sticky top-[5.45rem] z-30 border-b border-border bg-card"
    >
      <div className="container-page flex min-w-0 items-center gap-2 py-2">
        <div className="flex min-w-0 flex-1 gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {visibleSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="inline-flex min-h-10 shrink-0 items-center whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:text-sm"
            >
              {section.label}
            </a>
          ))}
        </div>
        <Button
          asChild
          size="sm"
          className="shrink-0 bg-[#f47b25] text-[#111827] hover:bg-[#d85f12]"
        >
          <a href="#apply">Get guidance</a>
        </Button>
      </div>
    </nav>
  );
}
