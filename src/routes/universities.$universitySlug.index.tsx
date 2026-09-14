import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Building2,
  CalendarDays,
  Clock,
  ExternalLink,
  FileCheck2,
  GraduationCap,
  HelpCircle,
  Laptop2,
  MessageCircle,
  ShieldCheck,
  Star,
  Users,
  WalletCards,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LeadForm } from "@/components/site/lead-form";
import { CompactRail } from "@/components/site/compact-rail";
import { AuthorityVerification } from "@/components/site/authority-verification";
import { UniversityLogo } from "@/components/site/university-logo";
import {
  formatINR,
  formatUniversityLocation,
  getUniversityApprovalClaims,
  getUniversityRankingClaims,
  getUniversity,
  getUniversityPrograms,
  type University,
  type UniversityProgram,
} from "@/data/universities";
import { classifyEvidenceSource, evidenceSourceLinkLabel } from "@/lib/evidence-source";

export const Route = createFileRoute("/universities/$universitySlug/")({
  loader: ({ params }): { university: University; programs: UniversityProgram[] } => {
    const university = getUniversity(params.universitySlug);
    if (!university) throw notFound();
    return { university, programs: getUniversityPrograms(university) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "University not found | DekhoCampus Online" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const u = loaderData.university;
    const shouldNoIndex = u.profileDepth === "directory" || !u.verificationCurrent;
    const title = `${u.name} — Online Courses & Admission Guide`;
    const description =
      u.profileDepth === "directory"
        ? `Explore online courses associated with ${u.name} and use the intake checklist to confirm current availability and fees before applying.`
        : `Explore ${loaderData.programs.length} online course options at ${u.name}, compare available fee details and review the intake checklist before applying.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        ...(shouldNoIndex ? [{ name: "robots", content: "noindex,follow" }] : []),
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: UniversityPage,
  errorComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Couldn't load this university</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Please refresh or browse all universities.
      </p>
    </div>
  ),
  notFoundComponent: UniversityNotFound,
});

function UniversityNotFound() {
  const { universitySlug } = Route.useParams();
  return (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-2xl font-bold">University not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        No university exists at “{universitySlug}”.
      </p>
      <Button asChild className="mt-6 bg-ink text-ink-foreground hover:bg-ink-soft">
        <Link to="/universities">Browse all universities</Link>
      </Button>
    </div>
  );
}

const universitySections = [
  { id: "about", label: "About" },
  { id: "highlights", label: "Highlights" },
  { id: "programs", label: "Courses & fees" },
  { id: "admissions", label: "Admissions" },
  { id: "placements", label: "Placements" },
  { id: "faqs", label: "FAQs" },
];

function UniversitySectionNav() {
  return (
    <nav
      aria-label="University sections"
      className="sticky top-[5.45rem] z-30 border-b border-border bg-card"
    >
      <div className="container-page flex gap-1 overflow-x-auto py-2.5 [scrollbar-width:none]">
        {universitySections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="inline-flex min-h-10 items-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {section.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

function UniversityPage() {
  const { university: u, programs } = Route.useLoaderData() as {
    university: University;
    programs: UniversityProgram[];
  };
  const isDirectoryProfile = u.profileDepth === "directory";
  const hasDirectorySource = Boolean(u.verificationSourceUrl && u.verificationAcademicYear);
  const approvalClaims = getUniversityApprovalClaims(u);
  const rankingClaims = getUniversityRankingClaims(u);
  const verificationSourceKind = classifyEvidenceSource(u.verificationSourceUrl, u.domain);

  return (
    <>
      <section className="border-b border-border bg-[#eef4ff] text-foreground dark:bg-[#111b2b]">
        <div className="container-page py-7 sm:py-9 lg:py-10">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <Link to="/" className="hover:text-[#2449ad] dark:hover:text-[#b9ceff]">
              Home
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <Link to="/universities" className="hover:text-[#2449ad] dark:hover:text-[#b9ceff]">
              Universities
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <span aria-current="page" className="font-semibold text-foreground">
              {u.shortName}
            </span>
          </nav>

          <div className="mt-5 grid min-w-0 gap-5 md:grid-cols-[minmax(0,1fr)_310px] md:items-start lg:gap-8">
            <div className="min-w-0 rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="flex min-w-0 items-start gap-4 sm:gap-5">
                <UniversityLogo
                  university={u}
                  size="lg"
                  className="h-16 w-16 shrink-0 rounded-xl bg-card sm:h-20 sm:w-20"
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.11em] text-[#a94300] dark:text-[#ffad70]">
                    Online university profile
                  </p>
                  <h1 className="mt-1 break-words font-display text-[1.75rem] font-extrabold leading-[1.1] tracking-[-0.035em] sm:text-4xl">
                    {u.name}
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {formatUniversityLocation(u)}
                    {u.established ? ` · Established ${u.established}` : ""}
                    {approvalClaims.length
                      ? ` · ${approvalClaims.length} recognition detail${approvalClaims.length === 1 ? "" : "s"} available`
                      : ""}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {approvalClaims.length
                      ? approvalClaims.slice(0, 3).map((claim) => (
                          <a
                            key={claim.id}
                            href={claim.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${claim.renderedClaim} (opens in new tab)`}
                          >
                            <Badge className="border-[#b7c8f6] bg-[#edf2ff] text-[#2449ad] hover:bg-[#edf2ff] dark:border-[#435a8d] dark:bg-[#263653] dark:text-[#b9ceff]">
                              <BadgeCheck className="mr-1 h-3 w-3" /> {claim.renderedClaim}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </Badge>
                          </a>
                        ))
                      : ["Recognition markers need refresh", "Verify exact intake"].map((label) => (
                          <Badge
                            key={label}
                            className="border-border bg-secondary text-muted-foreground hover:bg-secondary"
                          >
                            <ShieldCheck className="mr-1 h-3 w-3" /> {label}
                          </Badge>
                        ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap">
                <Button
                  asChild
                  className="min-h-11 bg-[#f47b25] font-extrabold text-[#111827] hover:bg-[#d85f12]"
                >
                  <a href="#counselling">
                    <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                    Free guidance
                  </a>
                </Button>
                <Button asChild variant="outline" className="min-h-11 bg-card font-bold">
                  <a href="#programs">
                    View courses
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </a>
                </Button>
              </div>
            </div>
            {isDirectoryProfile ? (
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="flex items-center gap-2 font-display text-base font-bold text-[#126f4b] dark:text-[#8de3bd]">
                  <ShieldCheck className="h-5 w-5" />
                  {hasDirectorySource ? "University details available" : "University profile added"}
                </p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {hasDirectorySource
                    ? `Last recorded for ${u.verificationAcademicYear}.`
                    : "The current university details are still being reviewed."}{" "}
                  Confirm the exact course and intake before applying.
                </p>
              </div>
            ) : u.metricsVerified ? (
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="flex items-center gap-1.5 font-display text-2xl font-bold text-[#2449ad] dark:text-[#b9ceff]">
                  <Star className="h-5 w-5 fill-[#f47b25] text-[#f47b25]" />
                  {u.rating}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {u.reviews.toLocaleString("en-IN")} student reviews
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  <Users className="mr-1 inline h-3.5 w-3.5" />
                  {u.studentsEnrolled} learners
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="font-display text-base font-bold">Quick check before you apply</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Ratings and learner totals are hidden until they can be checked. Use the course
                  list and official links to build your shortlist.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <UniversitySectionNav />

      {isDirectoryProfile ? (
        <section className="border-b border-[#bcdaca] bg-[#eefaf4] dark:border-[#265b48] dark:bg-[#0e2b22]">
          <div className="container-page flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex max-w-3xl items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#187a55] dark:text-[#77ddb2]" />
              <div>
                <p className="text-sm font-extrabold text-[#115f41] dark:text-[#8ae5bd]">
                  Check the current intake before you apply
                </p>
                <p className="mt-1 text-xs leading-5 text-[#3e6758] dark:text-[#a8c8ba]">
                  {u.verificationCurrent
                    ? `Record checked ${u.lastVerified ?? "for this catalogue"}; next review ${u.verificationNextReviewAt?.slice(0, 10) ?? "scheduled"}.`
                    : `Historical record${u.lastVerified ? ` checked ${u.lastVerified}` : ""}; a fresh review is still required.`}{" "}
                  Programme entitlement, fees and admissions can change by academic session.
                </p>
              </div>
            </div>
            {u.verificationSourceUrl ? (
              <a
                href={u.verificationSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${evidenceSourceLinkLabel(verificationSourceKind)} (opens in new tab)`}
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#73aa91] bg-white px-4 text-xs font-extrabold text-[#115f41] transition hover:bg-[#f7fffa] dark:border-[#39755e] dark:bg-[#12392c] dark:text-[#8ae5bd]"
              >
                {evidenceSourceLinkLabel(verificationSourceKind)}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </div>
        </section>
      ) : null}

      {!isDirectoryProfile ? (
        <section className="border-b border-[#c7d9ec] bg-[#f3f8ff] dark:border-[#2b557c] dark:bg-[#102538]">
          <div className="container-page py-5">
            <p className="font-display text-sm font-extrabold text-[#155b9f] dark:text-[#8bc7ff]">
              Independent university guide — not the official prospectus
            </p>
            <p className="mt-1 max-w-4xl text-xs leading-5 text-muted-foreground">
              Fees, ratings, learner totals and employer claims are hidden when they have not been
              checked for this profile.{" "}
              {u.verificationCurrent
                ? `The university details were checked ${u.lastVerified ?? "for this catalogue"} and are scheduled for review by ${u.verificationNextReviewAt?.slice(0, 10) ?? "the recorded review date"}. `
                : "The university details are due for a fresh review. "}
              Reconfirm everything on UGC-DEB and the university’s official website.
            </p>
          </div>
        </section>
      ) : null}

      <section className="border-b border-border bg-surface dark:bg-secondary/25">
        <div className="container-page py-6">
          <AuthorityVerification compact />
        </div>
      </section>

      <section className="container-page grid min-w-0 grid-cols-[minmax(0,1fr)] gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <h2 id="about" className="scroll-mt-32 font-display text-2xl font-bold">
            About {u.shortName}
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{u.about}</p>

          {u.legalName || u.heiId ? (
            <dl className="mt-5 grid gap-3 rounded-2xl border border-border bg-card p-5 text-sm sm:grid-cols-2">
              {u.legalName ? (
                <div>
                  <dt className="text-xs font-semibold text-muted-foreground">Legal HEI name</dt>
                  <dd className="mt-1 font-bold">{u.legalName}</dd>
                </div>
              ) : null}
              {u.heiId ? (
                <div>
                  <dt className="text-xs font-semibold text-muted-foreground">UGC-DEB HEI ID</dt>
                  <dd className="mt-1 font-bold">{u.heiId}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          <h2 id="highlights" className="mt-10 scroll-mt-32 font-display text-2xl font-bold">
            Why learners shortlist {u.shortName}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isDirectoryProfile
              ? "What is currently known, and what still needs confirmation for your intake."
              : "Useful points to investigate before choosing a course."}
          </p>
          <CompactRail label={`${u.shortName} catalogue notes`} rows={2} columns={2}>
            {u.highlights.map((h) => (
              <article
                key={h}
                className="flex gap-3 rounded-xl border border-border bg-card p-4 text-sm"
              >
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                {h}
              </article>
            ))}
          </CompactRail>

          <h2 id="programs" className="mt-10 scroll-mt-32 font-display text-2xl font-bold">
            Online courses at {u.shortName} ({programs.length})
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isDirectoryProfile
              ? hasDirectorySource
                ? "These courses appeared in the last available catalogue. Open one and confirm that it is available for your intake."
                : "These courses are listed for discovery while the current university documents are reviewed."
              : "Availability, mode, curriculum, pathways and eligibility must still be confirmed for the exact intake."}
          </p>

          <CompactRail label={`${u.shortName} course records`} rows={2} columns={2}>
            {programs.map((p) => (
              <Link
                key={p.slug}
                to="/universities/$universitySlug/$programSlug"
                params={{ universitySlug: u.slug, programSlug: p.slug }}
                className="group block rounded-xl border border-border bg-card p-4 transition-colors hover:border-[#325dd2]"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-secondary px-2 py-0.5 font-display text-xs font-bold">
                        {p.code}
                      </span>
                      <span className="text-xs text-muted-foreground">{p.level}</span>
                    </div>
                    <h3 className="mt-2 font-display text-lg font-bold">{p.name}</h3>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />{" "}
                        {p.durationVerified ? "Course" : "Typical"} duration: {p.durationYears}{" "}
                        {p.durationYears === 1 ? "year" : "years"} · {p.semesters}{" "}
                        {p.semesters === 1 ? "semester" : "semesters"}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5" />
                        {p.specialisationsVerified
                          ? `${p.specialisations.length} specialisation pathways`
                          : "Pathways vary by university"}
                      </span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-display text-lg font-bold">
                      {p.totalFeeAvailable ? formatINR(p.totalFee) : "Confirm current fee"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {!p.totalFeeAvailable
                        ? "Ask for the latest written fee"
                        : p.perSemesterFeeVerified
                          ? `${formatINR(p.perSemesterFee)}/semester · listed fee`
                          : `${formatINR(p.perSemesterFee)}/semester · ${p.feesVerified ? "calculated split" : "estimated amount"}`}
                    </p>
                    <span className="mt-2 inline-flex items-center text-xs font-semibold text-primary">
                      View program{" "}
                      <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </CompactRail>

          <div id="admissions" className="mt-10 scroll-mt-32">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf5ff] text-[#1768cc] dark:bg-[#102a42] dark:text-[#78b9ff]">
                <FileCheck2 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#1768cc] dark:text-[#78b9ff]">
                  Application roadmap
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold">
                  How admission usually works
                </h2>
              </div>
            </div>

            <CompactRail label={`${u.shortName} admission steps`} rows={2} columns={2}>
              {[
                [
                  "01",
                  "Choose the exact course",
                  "Compare the fee, eligibility and specialisation for your intake.",
                ],
                [
                  "02",
                  "Prepare your documents",
                  "Keep marksheets, a valid ID and a recent photograph ready.",
                ],
                [
                  "03",
                  "Apply on the university portal",
                  "Complete the official application and upload clear documents.",
                ],
                [
                  "04",
                  "Verify before paying",
                  "Recheck entitlement, refund rules and the full fee schedule.",
                ],
              ].map(([number, title, description]) => (
                <article key={number} className="rounded-xl border border-border bg-card p-4">
                  <span className="text-xs font-extrabold text-[#a94300] dark:text-[#ff9a5b]">
                    STEP {number}
                  </span>
                  <h3 className="mt-2 font-display text-base font-bold">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{description}</p>
                </article>
              ))}
            </CompactRail>

            <div className="mt-5 rounded-[1.5rem] border border-[#f0d8c5] bg-[#fff8f1] p-6 dark:border-[#5a3b28] dark:bg-[#2b2119]">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#df651b] shadow-sm dark:bg-[#3a2b20] dark:text-[#ffad70]">
                  <WalletCards className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold">
                    Four questions to ask before payment
                  </h3>
                  <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                    <li>Is this exact program entitled for the current session?</li>
                    <li>Are examinations fully online or centre-based?</li>
                    <li>Does the EMI include interest or processing charges?</li>
                    <li>What is the cancellation and refund window?</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <h2 id="placements" className="mt-10 scroll-mt-32 font-display text-2xl font-bold">
            Placement & career support
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Employer-network claims appear only when independently evidenced. Any placement
            assistance still cannot guarantee a job or salary outcome.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {u.metricsVerified && u.placementPartners.length ? (
              u.placementPartners.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium"
                >
                  {p}
                </span>
              ))
            ) : (
              <p className="rounded-xl border border-dashed border-border bg-secondary/35 px-4 py-3 text-sm text-muted-foreground">
                Employer-network details are not yet independently verified for this profile.
              </p>
            )}
          </div>

          <CompactRail label={`${u.shortName} profile facts`} columns={3}>
            {[
              { icon: Building2, k: "Location", v: formatUniversityLocation(u) },
              {
                icon: CalendarDays,
                k: "Established",
                v: u.established ? String(u.established) : "Verify with university",
              },
              {
                icon: BadgeCheck,
                k: isDirectoryProfile ? "Last catalogue update" : "University recognition",
                v: isDirectoryProfile
                  ? (u.verificationAcademicYear ?? "Update date unavailable")
                  : (approvalClaims.find((claim) => claim.claimType === "accreditation")
                      ?.renderedClaim ?? "Check current recognition"),
              },
              ...(rankingClaims[0]
                ? [
                    {
                      icon: Award,
                      k: "Annual ranking context",
                      v: rankingClaims[0].renderedClaim,
                    },
                  ]
                : []),
            ].map((s) => (
              <div key={s.k} className="rounded-xl border border-border bg-card p-5">
                <s.icon className="h-4 w-4 text-muted-foreground" />
                <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">{s.k}</p>
                <p className="mt-1 font-semibold">{s.v}</p>
              </div>
            ))}
          </CompactRail>

          <div id="faqs" className="mt-10 scroll-mt-32">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-[#1768cc] dark:text-[#78b9ff]">
                <HelpCircle className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
                  Clear answers
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold">
                  Frequently asked about {u.shortName}
                </h2>
              </div>
            </div>

            <Accordion
              type="single"
              collapsible
              className="mt-5 rounded-2xl border border-border bg-card px-5"
            >
              <AccordionItem value="validity">
                <AccordionTrigger>Are {u.shortName} online degrees valid?</AccordionTrigger>
                <AccordionContent className="leading-6 text-muted-foreground">
                  {approvalClaims.length ? (
                    <>
                      Current recognition details:{" "}
                      {approvalClaims.map((claim, index) => (
                        <span key={claim.id}>
                          {index ? "; " : ""}
                          <a
                            href={claim.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${claim.renderedClaim} (opens in new tab)`}
                            className="font-semibold text-[#1768cc] underline-offset-4 hover:underline dark:text-[#78b9ff]"
                          >
                            {claim.renderedClaim}
                          </a>
                        </span>
                      ))}
                      .{" "}
                    </>
                  ) : (
                    "We do not have a current recognition document for this university profile. "
                  )}
                  Recognition must still be verified for the exact program and admission session on
                  the UGC-DEB and university websites before enrolment.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="fees">
                <AccordionTrigger>How much do the online programs cost?</AccordionTrigger>
                <AccordionContent className="leading-6 text-muted-foreground">
                  {isDirectoryProfile
                    ? "DekhoCampus does not publish an amount when the current fee has not been confirmed. Request the latest written total fee, semester schedule, scholarship conditions and financing charges from the university before paying."
                    : "Course cards show a fee only when a current fee document is available. Universities can revise fees, scholarships and financing plans by intake, so request the latest written fee schedule before paying."}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="learning">
                <AccordionTrigger>How are classes and exams delivered?</AccordionTrigger>
                <AccordionContent className="leading-6 text-muted-foreground">
                  Online programs commonly combine live classes, recordings, digital study material
                  and proctored assessments. The exact mix can differ by course. Confirm attendance
                  rules, exam mode and weekend support for your chosen program.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="placements">
                <AccordionTrigger>Does placement support guarantee employment?</AccordionTrigger>
                <AccordionContent className="leading-6 text-muted-foreground">
                  No. Career services may include resume support, workshops, job portals or
                  interview opportunities, but no university or counsellor can guarantee a role or
                  salary. Evaluate the support offered for your experience level and career goal.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <aside id="counselling" className="min-w-0 scroll-mt-32 lg:sticky lg:top-24 lg:h-fit">
          <LeadForm
            compact
            defaultUniversitySlug={u.slug}
            title={`Review ${u.shortName}`}
            description="Check current eligibility, fees, entitlement and the official application route."
          />
          <Link
            to="/finder"
            className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-sm font-bold transition hover:border-[#80ace0] hover:bg-secondary/55"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edf5ff] text-[#1768cc] dark:bg-[#102a42] dark:text-[#78b9ff]">
              <Laptop2 className="h-4 w-4" />
            </span>
            <span className="flex-1">Not sure? Get a private course match</span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>
        </aside>
      </section>
    </>
  );
}
