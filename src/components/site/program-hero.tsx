import { Link } from "@tanstack/react-router";
import {
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  GitCompareArrows,
  ShieldCheck,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/site/lead-form";
import { UniversityLogo } from "@/components/site/university-logo";
import {
  getProgramApprovalClaims,
  type University,
  type UniversityProgram,
} from "@/data/universities";
import { useComparison } from "@/hooks/use-comparison";
import heroImage from "@/assets/program-hero.webp";

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
  const words = p.name.split(" ");
  const head = words.slice(0, Math.ceil(words.length / 2)).join(" ");
  const tail = words.slice(Math.ceil(words.length / 2)).join(" ");

  const stats = requiresVerification
    ? [
        {
          value: p.academicSession ?? u.verificationAcademicYear ?? "Historical",
          label: "Source session",
        },
        { value: "Required", label: "Current intake check" },
        { value: "Not published", label: "Verified fee here" },
      ]
    : [
        {
          value: approvalClaims.length ? `${approvalClaims.length} current` : "Not mapped",
          label: "Recognition evidence",
        },
        { value: "Required", label: "Intake entitlement check" },
        {
          value: p.specialisationsVerified ? `${p.specialisations.length}` : "Confirm",
          label: "University pathways",
        },
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
    <section className="relative overflow-hidden bg-ink text-ink-foreground">
      <img
        src={heroImage}
        alt=""
        width={1920}
        height={1080}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />

      <div className="container-page relative py-8 md:py-10">
        <nav aria-label="Breadcrumb" className="text-xs text-ink-foreground/65">
          <Link to="/" className="hover:text-gold">
            Home
          </Link>
          <span aria-hidden="true" className="mx-2">
            &gt;
          </span>
          <Link to="/universities" className="hover:text-gold">
            Universities
          </Link>
          <span aria-hidden="true" className="mx-2">
            &gt;
          </span>
          <Link
            to="/universities/$universitySlug"
            params={{ universitySlug: u.slug }}
            className="hover:text-gold"
          >
            {u.shortName}
          </Link>
          <span aria-hidden="true" className="mx-2">
            &gt;
          </span>
          <span aria-current="page" className="text-gold">
            {p.code}
          </span>
        </nav>

        <div className="mt-5 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-8 rounded-3xl lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
          <div className="min-w-0 pt-2 lg:pb-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-lg bg-ink-foreground/95 px-3 py-1.5 text-sm font-bold text-ink">
                <ShieldCheck className="h-4 w-4" />
                {requiresVerification
                  ? isEditorialFallback
                    ? "Editorial guide · verify intake"
                    : "Discovery record · verify intake"
                  : `Source-backed ${p.academicSession ?? "intake"} offering`}
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-ink-foreground/25 px-3 py-1.5 text-sm font-semibold">
                <UniversityLogo university={u} size="sm" className="h-5 w-5 bg-transparent p-0" />
                {u.name}
              </span>
            </div>

            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              {head} <span className="text-gold">{tail}</span>{" "}
              <span className="text-gold">({p.code})</span>
            </h1>

            <p className="mt-5 flex items-center gap-2 text-base font-medium text-ink-foreground/90">
              <Clock className="h-5 w-5" /> {p.durationVerified ? "Offering" : "Typical"} duration:{" "}
              {p.durationYears} years
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-ink-foreground text-ink hover:bg-ink-foreground/90"
              >
                <a href="#apply">
                  {requiresVerification ? "Request verification help" : "Get fee guidance"}
                  <CheckCircle2 className="ml-2 h-4 w-4" />
                </a>
              </Button>
              {!requiresVerification ? (
                <button
                  type="button"
                  onClick={() => comparison.toggleUniversity(p.slug, u.slug)}
                  className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-extrabold transition ${
                    isCompared
                      ? "border-[#77d3ad] bg-[#e9fff5] text-[#126f4b]"
                      : "border-ink-foreground/35 bg-ink-foreground/10 text-ink-foreground hover:bg-ink-foreground/15"
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
                aria-label="Share this program"
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-ink-foreground/35 transition-colors hover:bg-ink-foreground/10"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-10 gap-y-5">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl font-extrabold">{s.value}</p>
                  <p className="text-sm text-ink-foreground/70">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 inline-flex flex-wrap items-center gap-3 rounded-2xl bg-ink-foreground/95 px-5 py-2.5">
              <span className="text-xs font-bold uppercase tracking-wide text-ink">
                {requiresVerification ? "Source status" : "Catalogue markers · verify"}
              </span>
              {hasCurrentOfferingEvidence ? (
                <span className="rounded-full bg-ink/10 px-2.5 py-1 text-xs font-bold text-ink">
                  {p.deliveryMode ?? "ONLINE"} · {p.academicSession ?? "session cited"}
                </span>
              ) : (
                <span className="rounded-full bg-ink/10 px-2.5 py-1 text-xs font-bold text-ink">
                  No current-offering claim
                </span>
              )}
              {approvalClaims.slice(0, 2).map((claim) => (
                <a
                  key={claim.id}
                  href={claim.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full bg-ink/10 px-2.5 py-1 text-xs font-bold text-ink hover:bg-ink/15"
                >
                  {claim.renderedClaim} <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              ))}
            </div>
          </div>

          <div id="apply" className="min-w-0 scroll-mt-28">
            <LeadForm
              compact
              defaultProgramSlug={p.slug}
              defaultUniversitySlug={u.slug}
              className="rounded-2xl border-0 text-card-foreground shadow-lift"
              title={
                requiresVerification
                  ? `Verify this ${p.code} option at ${u.shortName}`
                  : `Review the Online ${p.code} at ${u.shortName}`
              }
              description={
                requiresVerification
                  ? "Request help checking the official intake, current fee and application route."
                  : "Request current fee, eligibility and admission guidance without any payment."
              }
            />
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-ink-foreground/10 px-4 py-3 text-xs leading-5 text-ink-foreground/70">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              Final fees, entitlement and intake availability must be reconfirmed before payment.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const sections = [
  { id: "overview", label: "Program overview" },
  { id: "specialisations", label: "Specialisation" },
  { id: "curriculum", label: "Curriculum" },
  { id: "fees", label: "Fees" },
  { id: "eligibility", label: "Eligibility" },
  { id: "careers", label: "Careers" },
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
      <div className="container-page flex gap-1 overflow-x-auto py-2.5">
        {visibleSections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="inline-flex min-h-10 items-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
