import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Briefcase,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  GraduationCap,
  IndianRupee,
  Laptop,
  MessageCircle,
  ShieldCheck,
  TrendingUp,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProgramHero, ProgramSectionNav } from "@/components/site/program-hero";
import { CompactRail } from "@/components/site/compact-rail";
import { AuthorityVerification } from "@/components/site/authority-verification";
import { LeadForm } from "@/components/site/lead-form";
import { UniversityLogo } from "@/components/site/university-logo";

import {
  formatINR,
  formatUniversityLocation,
  getUniversityProgram,
  comparableUniversitiesOfferingProgram,
  type University,
  type UniversityProgram,
} from "@/data/universities";

interface ProgramPageData {
  university: University;
  program: UniversityProgram;
  alternatives: { university: University; program: UniversityProgram }[];
}

function serializeJsonLd(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export const Route = createFileRoute("/universities/$universitySlug/$programSlug")({
  loader: ({ params }): ProgramPageData => {
    const match = getUniversityProgram(params.universitySlug, params.programSlug);
    if (!match) throw notFound();
    return {
      ...match,
      alternatives: comparableUniversitiesOfferingProgram(params.programSlug).filter(
        (a) => a.university.slug !== params.universitySlug,
      ),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Program not found | DekhoCampus Online" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { university, program } = loaderData;
    const hasCurrentOfferingEvidence =
      university.profileDepth !== "directory" &&
      university.verificationCurrent === true &&
      program.entitlementStatus === "verified";
    const title = !hasCurrentOfferingEvidence
      ? `${program.code} Course Profile — ${university.shortName} | Availability Check`
      : `${program.name} (${program.code}) Online — ${university.shortName} | Fees & Syllabus`;
    const description = !hasCurrentOfferingEvidence
      ? `This ${program.name} course profile was previously listed with ${university.name}; current availability is not confirmed. Check the exact course, learning mode, fee and application route before applying.`
      : `${program.name} at ${university.name}: course details checked for the ${program.academicSession ?? "recorded intake"}${program.feesVerified ? ` with a listed total fee of ${formatINR(program.totalFee)}` : ""}. Reconfirm current admission terms before applying.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        ...(!hasCurrentOfferingEvidence ? [{ name: "robots", content: "noindex,follow" }] : []),
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProgramPage,
  errorComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Couldn't load this program</h1>
      <p className="mt-2 text-sm text-muted-foreground">Please refresh and try again.</p>
    </div>
  ),
  notFoundComponent: ProgramNotFound,
});

function ProgramNotFound() {
  const { universitySlug } = Route.useParams();
  return (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Course profile not available</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We do not have a course profile for this university and course combination.
      </p>
      <Button asChild className="mt-6 bg-ink text-ink-foreground hover:bg-ink-soft">
        <Link to="/universities/$universitySlug" params={{ universitySlug }}>
          See university profile
        </Link>
      </Button>
    </div>
  );
}

function ProgramPage() {
  const { university: u, program: p, alternatives } = Route.useLoaderData() as ProgramPageData;
  const isDirectoryProfile = u.profileDepth === "directory";
  const hasCurrentOfferingEvidence =
    !isDirectoryProfile && u.verificationCurrent === true && p.entitlementStatus === "verified";
  const isEditorialFallback = !isDirectoryProfile && p.entitlementStatus === undefined;
  const hideOfferingClaims = !hasCurrentOfferingEvidence;

  const jsonLd = hasCurrentOfferingEvidence
    ? {
        "@context": "https://schema.org",
        "@type": "Course",
        name: `${p.name} (Online)`,
        description: `${p.name} course details for ${u.name}. Reconfirm the current intake with the university before applying.`,
        provider: {
          "@type": "CollegeOrUniversity",
          name: u.name,
          ...(u.domain ? { sameAs: `https://${u.domain}` } : {}),
        },
        educationalCredentialAwarded: p.level,
        ...(p.feesVerified
          ? {
              offers: {
                "@type": "Offer",
                price: p.totalFee,
                priceCurrency: "INR",
                category: "Tuition",
              },
            }
          : {}),
        ...(p.durationVerified ? { timeRequired: `P${p.durationYears}Y` } : {}),
      }
    : {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: `${p.code} course profile — ${u.name}`,
        description: `This course profile was previously listed with ${u.name}. Current availability is not confirmed.`,
      };

  const facts = hideOfferingClaims
    ? [
        { icon: Clock, k: "Typical duration", v: `${p.durationYears} years` },
        { icon: FileText, k: "Fee", v: "Not yet verified by DekhoCampus" },
        { icon: Laptop, k: "Delivery & exams", v: "Confirm with the university" },
        {
          icon: ShieldCheck,
          k: "Intake check",
          v:
            p.entitlementStatus === "expired"
              ? "Previously listed · confirm current availability"
              : "Current availability is not confirmed",
        },
      ]
    : [
        {
          icon: Clock,
          k: p.durationVerified ? "Course duration" : "Typical duration",
          v: `${p.durationYears} years (${p.semesters} semesters)`,
        },
        ...(p.totalFeeAvailable
          ? [
              {
                icon: IndianRupee,
                k: p.feesVerified ? "Listed total fee" : "Estimated fee guide",
                v: formatINR(p.totalFee),
              },
            ]
          : []),
        ...(p.perSemesterFeeAvailable
          ? [
              {
                icon: FileText,
                k: p.perSemesterFeeVerified ? "Listed semester fee" : "Calculated semester split",
                v: formatINR(p.perSemesterFee),
              },
            ]
          : []),
        ...(p.emiPerMonthAvailable
          ? [
              {
                icon: TrendingUp,
                k: p.emiPerMonthVerified ? "Published monthly amount" : "Arithmetic monthly split",
                v: `${formatINR(p.emiPerMonth)}/month`,
              },
            ]
          : []),
        {
          icon: Laptop,
          k: "Mode",
          v: hasCurrentOfferingEvidence
            ? p.deliveryMode === "ODL"
              ? "ODL · confirm attendance requirements"
              : "Online"
            : "Confirm with university",
        },
        {
          icon: ShieldCheck,
          k: "Exam mode",
          v: hasCurrentOfferingEvidence
            ? (p.examMode ?? "Confirm with university")
            : "Confirm with university",
        },
      ];
  const feeRows: { label: string; value: string }[] = [];
  if (!hideOfferingClaims && p.totalFeeAvailable) {
    feeRows.push({
      label: p.feesVerified ? "Listed total programme fee" : "Estimated total-fee guide",
      value: formatINR(p.totalFee),
    });
  }
  if (!hideOfferingClaims && p.perSemesterFeeAvailable) {
    feeRows.push({
      label: p.perSemesterFeeVerified
        ? "Listed semester fee"
        : p.feesVerified
          ? "Derived semester split"
          : "Planning estimate",
      value: formatINR(p.perSemesterFee),
    });
  }
  if (!hideOfferingClaims && p.emiPerMonthAvailable) {
    feeRows.push({
      label: p.emiPerMonthVerified
        ? "Published monthly amount"
        : "Arithmetic monthly split (not a lender quote)",
      value: `${formatINR(p.emiPerMonth)} / month`,
    });
  }

  const sourceUrl = p.entitlementSourceUrl ?? u.verificationSourceUrl;
  const admissionSteps = [
    [
      "01",
      "Check recognition",
      "Match the university, degree, mode and admission session on UGC-DEB.",
    ],
    [
      "02",
      "Read the prospectus",
      "Confirm eligibility, subjects, exam pattern, refund terms and the complete fee.",
    ],
    [
      "03",
      "Apply officially",
      "Use only the university's official application route and document portal.",
    ],
    [
      "04",
      "Verify before paying",
      "Check the written recipient, payable amount and enrolment timeline.",
    ],
  ];
  const faqs = [
    {
      question: `Is this ${p.code} course available for the current intake?`,
      answer: hasCurrentOfferingEvidence
        ? `We checked the university, course and learning mode for the ${p.academicSession ?? "recorded intake"}. Admission availability, the final payable fee and all intake terms should still be reconfirmed on the university's official channel.`
        : `Not yet. We have not confirmed this option for the current intake. Use the page to understand the ${p.code}, then confirm the exact university, programme, learning mode and admission session before applying.`,
    },
    {
      question: `What is the eligibility for this online ${p.code}?`,
      answer: `${p.eligibility} ${hasCurrentOfferingEvidence && p.eligibilityVerified ? "This requirement was checked for the listed intake, but the current document and threshold rules should be reconfirmed." : "This is general course guidance; ask the university for its current written requirement."}`,
    },
    {
      question: "Are the fee and monthly amount final?",
      answer:
        !hideOfferingClaims && p.totalFeeAvailable
          ? `The page explains whether each amount is listed, calculated or estimated. ${formatINR(p.totalFee)} is the displayed total-fee field, but scholarships, taxes, registration charges, financing costs and intake changes can affect the final payable amount.`
          : "A current fee is not available on this page. Ask for the complete written payable amount, payment schedule, scholarship conditions, refund rules and any lender charges before paying.",
    },
    {
      question: "Does DekhoCampus take admission payment?",
      answer:
        "No. DekhoCampus provides independent guidance and verification support. Complete an application or payment only through the university's confirmed official route.",
    },
  ];

  return (
    <div className="bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <ProgramHero university={u} program={p} />
      <ProgramSectionNav includeCompare={alternatives.length > 0} />

      <section className="border-b border-border bg-card" aria-label="Course availability status">
        <div className="container-page flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex max-w-4xl items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#edf2ff] text-[#2449ad] dark:bg-[#263653] dark:text-[#b9ceff]">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-extrabold">
                {hasCurrentOfferingEvidence
                  ? `${p.academicSession ?? "Listed intake"} course details checked — reconfirm before payment`
                  : isEditorialFallback
                    ? "Course profile — confirm availability for the current intake"
                    : "Previously listed course — confirm current availability"}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
                {hasCurrentOfferingEvidence
                  ? `We checked these course details ${p.verifiedAt?.slice(0, 10) ?? "for the listed intake"}. Reconfirm the fee, admission dates and application route with the university.`
                  : "Use this page to understand the course and prepare your questions. Ask the university to confirm the exact course, learning mode and admission session."}
              </p>
            </div>
          </div>
          {sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open supporting document (opens in new tab)"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-xs font-extrabold text-[#2449ad] transition-colors hover:border-[#325dd2] dark:text-[#b9ceff]"
            >
              Open supporting document <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      </section>

      <section
        id="overview"
        className="scroll-mt-32 border-b border-border bg-background py-8 lg:py-10"
      >
        <div className="container-page">
          <SectionHeading
            eyebrow="Course overview"
            title={`Online ${p.code} overview`}
            description={p.overview}
          />

          <dl className="mt-5 grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
            {facts.map((f) => (
              <div key={f.k} className="min-w-0 rounded-xl border border-border bg-card p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#edf2ff] text-[#2449ad] dark:bg-[#263653] dark:text-[#b9ceff]">
                  <f.icon className="h-4 w-4" />
                </span>
                <dt className="mt-3 text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
                  {f.k}
                </dt>
                <dd className="mt-1 break-words text-sm font-extrabold leading-5">{f.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-xl border border-border bg-card">
            {[
              {
                icon: BookOpenCheck,
                title: "Know what you will study",
                copy: "Inspect semester themes and pathway names before you compare brochures.",
              },
              {
                icon: WalletCards,
                title: "See what the fee means",
                copy: "Listed, calculated and unavailable amounts are clearly separated.",
              },
              {
                icon: UsersRound,
                title: "Discuss it with confidence",
                copy: "Save the practical questions your family should ask before admission.",
              },
            ].map((item, index) => (
              <article
                key={item.title}
                className={`min-w-0 p-3 sm:p-5 ${index ? "border-l border-border" : ""}`}
              >
                <item.icon className="h-4 w-4 text-[#f47b25] sm:h-5 sm:w-5" />
                <h3 className="mt-2 text-[10px] font-extrabold leading-3.5 sm:mt-3 sm:text-sm sm:leading-5">
                  {item.title}
                </h3>
                <p className="mt-1 hidden text-xs leading-5 text-muted-foreground sm:block">
                  {item.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-8 lg:py-10">
        <div className="container-page grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="min-w-0 space-y-6">
            <article
              id="curriculum"
              className="scroll-mt-32 rounded-2xl border border-border bg-card p-4 sm:p-6"
            >
              <SectionHeading
                eyebrow="Curriculum"
                title={
                  hasCurrentOfferingEvidence && p.curriculumVerified
                    ? "Course curriculum"
                    : "Typical curriculum themes"
                }
                description={
                  hasCurrentOfferingEvidence && p.curriculumVerified
                    ? `Checked for the ${p.academicSession ?? "listed intake"}. Reconfirm subject names, credits and assessment rules in the current prospectus.`
                    : `This is a general ${p.code} outline, not a confirmed syllabus from ${u.shortName}. Use it to frame questions, then check the current official prospectus.`
                }
                compact
              />

              {p.curriculum.length ? (
                <Accordion
                  type="single"
                  collapsible
                  className="mt-5 overflow-hidden rounded-xl border border-border px-4 sm:px-5"
                  defaultValue={p.curriculum[0]?.semester ?? ""}
                >
                  {p.curriculum.map((term, index) => (
                    <AccordionItem key={term.semester} value={term.semester}>
                      <AccordionTrigger className="py-4 text-left font-display text-sm font-extrabold hover:no-underline sm:text-base">
                        <span className="flex items-center gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#edf2ff] text-xs font-extrabold text-[#2449ad] dark:bg-[#263653] dark:text-[#b9ceff]">
                            {index + 1}
                          </span>
                          {term.semester}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <ul className="grid gap-2 sm:grid-cols-2">
                          {term.subjects.map((subject) => (
                            <li
                              key={subject}
                              className="flex items-start gap-2 rounded-lg bg-secondary/65 px-3 py-2.5 text-xs leading-5 text-muted-foreground sm:text-sm"
                            >
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#14845f] dark:text-[#65d5a7]" />
                              {subject}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="mt-5 rounded-xl border border-dashed border-border bg-secondary/35 p-5 text-sm leading-6 text-muted-foreground">
                  No university-specific curriculum has been added here yet. Use the current
                  official prospectus before comparing subjects or credits.
                </div>
              )}
            </article>

            <article
              id="specialisations"
              className="scroll-mt-32 rounded-2xl border border-border bg-card p-4 sm:p-6"
            >
              <SectionHeading
                eyebrow="Pathways"
                title={
                  hasCurrentOfferingEvidence && p.specialisationsVerified
                    ? "Listed specialisations"
                    : "Specialisations to ask about"
                }
                description={
                  hasCurrentOfferingEvidence && p.specialisationsVerified
                    ? "These pathways were listed for the checked intake. Reconfirm availability for your admission session."
                    : "These are general course examples, not a claim that this university currently offers every pathway. Confirm the exact name and how it appears on the award."
                }
                compact
              />
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {p.specialisations.map((s) => (
                  <div
                    key={s}
                    className="flex min-h-12 items-center gap-3 rounded-lg border border-border bg-background px-3.5 py-3 text-sm font-semibold"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#edf2ff] text-[#2449ad] dark:bg-[#263653] dark:text-[#b9ceff]">
                      <GraduationCap className="h-3.5 w-3.5" />
                    </span>
                    {s}
                  </div>
                ))}
              </div>
            </article>

            <article
              id="fees"
              className="scroll-mt-32 rounded-2xl border border-border bg-card p-4 sm:p-6"
            >
              <SectionHeading
                eyebrow="Fees"
                title="Fees and payment structure"
                description="Amounts can change by admission session. Labels below distinguish university-listed values from calculations or planning estimates."
                compact
              />
              {feeRows.length ? (
                <dl className="mt-5 grid gap-3 sm:grid-cols-3">
                  {feeRows.map((row) => (
                    <div
                      key={row.label}
                      className="rounded-xl border border-border bg-background p-4"
                    >
                      <dt className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-muted-foreground">
                        {row.label}
                      </dt>
                      <dd className="mt-2 break-words font-display text-xl font-extrabold">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <div className="mt-5 rounded-xl border border-[#c9d8e8] bg-[#f4f8fd] p-5 dark:border-[#284760] dark:bg-[#0e2435]">
                  <p className="font-display text-lg font-extrabold">
                    Current fee is not available here yet
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Ask for the complete written payable amount, semester schedule, scholarship
                    conditions, refund rules and any lender charges.
                  </p>
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-xs font-bold">
                {p.feeSourceUrl ? (
                  <a
                    href={p.feeSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open fee document checked ${p.feeVerifiedAt?.slice(0, 10) ?? "for this catalogue"} (opens in new tab)`}
                    className="inline-flex items-center gap-2 text-[#2449ad] hover:underline dark:text-[#b9ceff]"
                  >
                    Fee document · checked {p.feeVerifiedAt?.slice(0, 10) ?? "for this catalogue"}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
                {hasCurrentOfferingEvidence && p.refundPolicyUrl ? (
                  <a
                    href={p.refundPolicyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open refund-policy link (opens in new tab)"
                    className="inline-flex items-center gap-2 text-[#2449ad] hover:underline dark:text-[#b9ceff]"
                  >
                    Refund-policy link <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </div>
            </article>

            <article
              id="eligibility"
              className="scroll-mt-32 rounded-2xl border border-border bg-card p-4 sm:p-6"
            >
              <SectionHeading
                eyebrow="Eligibility"
                title="Who can apply?"
                description={p.eligibility}
                compact
              />
              <p className="mt-3 text-xs font-semibold text-muted-foreground">
                {hasCurrentOfferingEvidence && p.eligibilityVerified
                  ? "Checked for the listed intake; reconfirm the current document rules."
                  : "General course guidance; confirm the exact threshold with the university."}
              </p>
              <div id="admissions" className="scroll-mt-32 border-t border-border pt-5 mt-5">
                <h3 className="font-display text-lg font-extrabold">How admission usually works</h3>
                <ol className="mt-3 grid gap-3 sm:grid-cols-2">
                  {admissionSteps.map(([number, title, copy]) => (
                    <li key={number} className="rounded-xl border border-border bg-background p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#131720] text-xs font-extrabold text-white dark:bg-[#f7f8fa] dark:text-[#131720]">
                          {number}
                        </span>
                        <h4 className="text-sm font-extrabold">{title}</h4>
                      </div>
                      <p className="mt-3 text-xs leading-5 text-muted-foreground">{copy}</p>
                    </li>
                  ))}
                </ol>
              </div>
              {hasCurrentOfferingEvidence &&
              (p.universityProgramUrl || p.officialApplicationUrl) ? (
                <div className="mt-5 flex flex-wrap gap-4 border-t border-border pt-4 text-xs font-extrabold">
                  {p.universityProgramUrl ? (
                    <a
                      href={p.universityProgramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open official programme page (opens in new tab)"
                      className="inline-flex items-center gap-2 text-[#2449ad] hover:underline dark:text-[#b9ceff]"
                    >
                      Official programme page <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                  {p.officialApplicationUrl ? (
                    <a
                      href={p.officialApplicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open official application route (opens in new tab)"
                      className="inline-flex items-center gap-2 text-[#2449ad] hover:underline dark:text-[#b9ceff]"
                    >
                      Official application route <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </div>
              ) : null}
              <AuthorityVerification compact className="mt-5 border-t border-border pt-5" />
            </article>

            <article
              id="careers"
              className="scroll-mt-32 rounded-2xl border border-border bg-card p-4 sm:p-6"
            >
              <SectionHeading
                eyebrow="Career directions"
                title={`Career paths after an online ${p.code}`}
                description={
                  !hasCurrentOfferingEvidence
                    ? "These are general directions for this degree. They are not a salary or placement promise for this unconfirmed course profile."
                    : "These roles are illustrative learning directions—not a placement, role or salary guarantee."
                }
                compact
              />
              <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {p.careers.map((career) => (
                  <div
                    key={career}
                    className="flex min-h-12 items-center gap-3 rounded-lg border border-border bg-background px-3.5 py-3 text-sm font-semibold"
                  >
                    <Briefcase className="h-4 w-4 shrink-0 text-[#325dd2] dark:text-[#7da2ff]" />
                    {career}
                  </div>
                ))}
              </div>
              {hasCurrentOfferingEvidence && u.metricsVerified && u.placementPartners.length ? (
                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
                    Career-support names
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {u.placementPartners.map((partner) => (
                      <span
                        key={partner}
                        className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-bold"
                      >
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>

            <article
              id="faqs"
              className="scroll-mt-32 rounded-2xl border border-border bg-card p-4 sm:p-6"
            >
              <SectionHeading
                eyebrow="Questions families ask"
                title="Frequently asked questions"
                description="Start with what is known, then take the remaining questions to the official university channel."
                compact
              />
              <Accordion type="single" collapsible className="mt-4" defaultValue="faq-0">
                {faqs.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left text-sm font-extrabold hover:no-underline sm:text-base">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-6 text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </article>

            {alternatives.length > 0 ? (
              <article
                id="compare"
                className="scroll-mt-32 rounded-2xl border border-border bg-card p-4 sm:p-6"
              >
                <SectionHeading
                  eyebrow="Compare"
                  title={`Compare current ${p.code} course profiles`}
                  description="Compare the listed intake, full payable fee, delivery, exams and learner support side by side."
                  compact
                />
                <CompactRail label={`Other confirmed ${p.code} courses`} rows={2} columns={2}>
                  {alternatives.map(({ university, program }) => (
                    <Link
                      key={university.slug}
                      to="/universities/$universitySlug/$programSlug"
                      params={{ universitySlug: university.slug, programSlug: program.slug }}
                      className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-background p-3.5 transition-colors hover:border-[#325dd2]"
                    >
                      <UniversityLogo university={university} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold">{university.name}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {formatUniversityLocation(university)}
                        </p>
                        <p className="mt-1 text-xs font-bold">{formatINR(program.totalFee)}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </CompactRail>
              </article>
            ) : null}
          </div>

          <aside className="min-w-0 lg:sticky lg:top-[9.25rem] lg:h-fit">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <div className="h-1.5 bg-[#f47b25]" />
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <UniversityLogo university={u} size="md" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold">{u.shortName}</p>
                    <p className="text-xs text-muted-foreground">
                      {hasCurrentOfferingEvidence
                        ? `Online ${p.code} quick view`
                        : `${p.code} course profile`}
                    </p>
                  </div>
                </div>
                <div className="mt-5 rounded-xl bg-secondary p-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
                    Fee status
                  </p>
                  <p className="mt-1 break-words font-display text-2xl font-extrabold">
                    {!hideOfferingClaims && p.totalFeeAvailable
                      ? formatINR(p.totalFee)
                      : "Confirmation needed"}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {!hideOfferingClaims && p.emiPerMonthAvailable
                      ? `${formatINR(p.emiPerMonth)}/month · ${p.emiPerMonthVerified ? "published amount" : "arithmetic split, not a lender quote"}`
                      : "Ask for a written, all-inclusive amount for this admission session."}
                  </p>
                </div>
                <Button
                  asChild
                  className="mt-4 w-full bg-[#f47b25] text-[#111827] hover:bg-[#d85f12]"
                >
                  <a href="#apply">Talk to a course counsellor</a>
                </Button>
                <ul className="mt-5 space-y-3 border-t border-border pt-5 text-xs leading-5 text-muted-foreground">
                  {[
                    "Free independent guidance",
                    "No payment collected by DekhoCampus",
                    "We help you check current intake details",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#14845f] dark:text-[#65d5a7]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section
        id="apply"
        className="scroll-mt-32 border-y border-border bg-background py-8 lg:py-10"
      >
        <div className="container-page grid min-w-0 gap-7 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:gap-12">
          <div className="min-w-0 py-2 lg:py-8">
            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#a94300] dark:text-[#ffad70]">
              Talk it through
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl">
              One clear conversation before you decide
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              Tell us what you are unsure about. A counsellor can help you separate the course
              category from this university’s current intake, fee and process.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                {
                  icon: MessageCircle,
                  title: "Choose the response",
                  copy: "Call, WhatsApp or email",
                },
                { icon: ShieldCheck, title: "Consent-led", copy: "You control what is shared" },
                { icon: BadgeCheck, title: "No-pressure", copy: "No payment is requested" },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-border bg-card p-4">
                  <item.icon className="h-5 w-5 text-[#325dd2] dark:text-[#7da2ff]" />
                  <p className="mt-3 text-sm font-extrabold">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
          <LeadForm
            compact
            defaultProgramSlug={p.slug}
            defaultUniversitySlug={u.slug}
            title={
              hasCurrentOfferingEvidence
                ? `Ask about ${u.shortName}'s online ${p.code}`
                : `Ask about ${p.code} and ${u.shortName}`
            }
            description={
              hasCurrentOfferingEvidence
                ? "Share only what is needed. A real person will reply on the channel you choose."
                : "We can help you confirm whether this course is available for your intake. Share only what is needed."
            }
            className="min-w-0 rounded-2xl shadow-card"
          />
        </div>
      </section>

      <div className="h-20 lg:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-40 px-3 lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-border bg-card p-2.5 shadow-lift">
          <UniversityLogo university={u} size="sm" className="h-10 w-12 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-extrabold">
              {hasCurrentOfferingEvidence ? `Online ${p.code}` : `${p.code} course profile`}
            </p>
            <p className="truncate text-[10px] text-muted-foreground">{u.shortName}</p>
          </div>
          <Button
            asChild
            className="h-11 shrink-0 bg-[#f47b25] px-4 font-extrabold text-[#111827] hover:bg-[#d85f12]"
          >
            <a href="#apply">Free guidance</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  compact?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#a94300] dark:text-[#ffad70]">
        {eyebrow}
      </p>
      <h2
        className={`mt-2 font-display font-extrabold tracking-[-0.035em] ${compact ? "text-2xl" : "text-2xl sm:text-3xl"}`}
      >
        {title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
    </div>
  );
}
