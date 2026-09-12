import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Clock,
  ExternalLink,
  FileText,
  GraduationCap,
  IndianRupee,
  Laptop,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProgramHero, ProgramSectionNav } from "@/components/site/program-hero";
import { UniversityLogo } from "@/components/site/university-logo";

import {
  formatINR,
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
      ? `${program.name} Online — ${university.shortName} | Verification Guide`
      : `${program.name} (${program.code}) Online — ${university.shortName} | Fees & Syllabus`;
    const description = !hasCurrentOfferingEvidence
      ? `${university.name} and ${program.name} are presented as a discovery or editorial record, not a verified current admission offer. Verify the exact program, mode, intake, fee and application route.`
      : `${program.name} at ${university.name}: a source-backed ${program.academicSession ?? "intake"} offering${program.feesVerified ? ` with a cited total fee of ${formatINR(program.totalFee)}` : ""}. Category-level fields remain clearly labelled.`;
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
      <h1 className="font-display text-2xl font-bold">No current catalogue record</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This programme is not listed for this university in our current catalogue.
      </p>
      <Button asChild className="mt-6 bg-ink text-ink-foreground hover:bg-ink-soft">
        <Link to="/universities/$universitySlug" params={{ universitySlug }}>
          See available programs
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
  const hideOfferingClaims =
    isDirectoryProfile || Boolean(p.entitlementStatus && p.entitlementStatus !== "verified");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${p.name} (Online)`,
    description: `${p.name} category record for ${u.name}. Current intake details require verification with UGC-DEB and the university.`,
    provider: {
      "@type": "CollegeOrUniversity",
      name: u.name,
      ...(u.domain ? { sameAs: `https://${u.domain}` } : {}),
    },
    educationalCredentialAwarded: p.level,
    ...(hasCurrentOfferingEvidence && p.feesVerified
      ? {
          offers: {
            "@type": "Offer",
            price: p.totalFee,
            priceCurrency: "INR",
            category: "Tuition",
          },
        }
      : {}),
    ...(hasCurrentOfferingEvidence && p.durationVerified
      ? { timeRequired: `P${p.durationYears}Y` }
      : {}),
  };

  const facts = hideOfferingClaims
    ? [
        { icon: Clock, k: "Typical duration", v: `${p.durationYears} years` },
        { icon: FileText, k: "Fee", v: "Not yet verified by DekhoCampus" },
        { icon: Laptop, k: "Delivery & exams", v: "Confirm with the university" },
        {
          icon: ShieldCheck,
          k: "Source status",
          v: `${p.entitlementStatus ?? "unverified"} · ${p.academicSession ?? u.verificationAcademicYear ?? "session not mapped"}`,
        },
      ]
    : [
        {
          icon: Clock,
          k: p.durationVerified ? "Sourced offering duration" : "Typical category duration",
          v: `${p.durationYears} years (${p.semesters} semesters)`,
        },
        ...(p.totalFeeAvailable
          ? [
              {
                icon: IndianRupee,
                k: p.feesVerified ? "Sourced total fee" : "Editorial fee guide",
                v: formatINR(p.totalFee),
              },
            ]
          : []),
        ...(p.perSemesterFeeAvailable
          ? [
              {
                icon: FileText,
                k: p.perSemesterFeeVerified ? "Sourced per-semester fee" : "Derived semester split",
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
      label: p.feesVerified ? "Sourced total program fee" : "Editorial total-fee estimate",
      value: formatINR(p.totalFee),
    });
  }
  if (!hideOfferingClaims && p.perSemesterFeeAvailable) {
    feeRows.push({
      label: p.perSemesterFeeVerified
        ? "Sourced per-semester fee"
        : p.feesVerified
          ? "Derived semester split"
          : "Editorial semester estimate",
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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <ProgramHero university={u} program={p} />
      <ProgramSectionNav includeCompare={alternatives.length > 0} />

      <section className="border-b border-[#e9cb9c] bg-[#fff8e8] dark:border-[#604b29] dark:bg-[#2c2518]">
        <div className="container-page flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <p className="font-display text-base font-bold">
              {hasCurrentOfferingEvidence
                ? `Evidence-backed ${p.academicSession ?? "intake"} record — reconfirm before payment`
                : isEditorialFallback
                  ? "Editorial category guide — not a verified current admission offer"
                  : "Directory or non-current record — not a current admission offer"}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {hasCurrentOfferingEvidence
                ? `The university-programme-mode-session tuple is linked to source evidence reviewed ${p.verifiedAt?.slice(0, 10) ?? "for this catalogue"}. Fee and pathway fields remain hidden unless they carry their own evidence.`
                : isEditorialFallback
                  ? "The overview, eligibility, curriculum and pathway names are category-level guidance. Bundled fee figures are editorial estimates, not a current quote; verify the current prospectus before applying."
                  : `This relationship is ${p.entitlementStatus ?? "directory-stage"}. DekhoCampus has not verified the current fee, monthly plan, pathway, exam mode, placement claims or entitlement for your intake.`}
            </p>
          </div>
          {p.entitlementSourceUrl || u.verificationSourceUrl ? (
            <a
              href={p.entitlementSourceUrl ?? u.verificationSourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#b88b48] bg-white px-4 text-xs font-extrabold text-[#704913] dark:bg-[#3b3020] dark:text-[#ffd293]"
            >
              Check cited UGC-DEB notice <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      </section>

      {/* Program overview + key facts */}
      <section id="overview" className="scroll-mt-32 border-b border-border bg-surface py-10">
        <div className="container-page">
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            {!hasCurrentOfferingEvidence
              ? `Review the ${p.code} degree category before checking this intake`
              : `Explore this online ${p.code} with an intake-level verification checklist`}
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
            {hasCurrentOfferingEvidence
              ? `Offering-specific fields are used only where the reviewed record supplies them. Remaining overview, curriculum, eligibility and career text is category guidance; check the official ${p.academicSession ?? "intake"} prospectus.`
              : `This category guide covers common curriculum themes, eligibility questions and career directions for an online ${p.name}. It does not describe a verified current offering at ${u.shortName}; check the official prospectus for your intake.`}
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {facts.map((f) => (
              <div
                key={f.k}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
              >
                <f.icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{f.k}</p>
                  <p className="mt-0.5 text-sm font-semibold">{f.v}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_340px]">
        <div className="space-y-14">
          <div id="specialisations" className="scroll-mt-32">
            <h2 className="font-display text-2xl font-bold">
              {p.specialisationsVerified ? "Verified specialisations" : "Common pathways to check"}
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {p.specialisationsVerified
                ? "These pathways have been mapped to this university offering. Reconfirm them for your intake."
                : "These are degree-category examples, not a claim that this university offers each one. Check the current prospectus and how the pathway appears on the award."}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {p.specialisations.map((s) => (
                <div
                  key={s}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm font-medium"
                >
                  <GraduationCap className="h-4 w-4 shrink-0 text-primary" />
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div id="curriculum" className="scroll-mt-32">
            <h2 className="font-display text-2xl font-bold">
              {p.curriculumVerified ? "Offering curriculum" : "Typical curriculum themes"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {p.curriculumVerified
                ? `This curriculum was mapped from the reviewed ${p.academicSession ?? "offering"} record. Reconfirm subject names, credits and assessment rules in the current prospectus.`
                : `This shared category guide is not the verified syllabus for ${u.shortName}. Check the current official prospectus for subject names, credits and assessment rules.`}
            </p>

            {p.curriculum.length ? (
              <Accordion
                type="single"
                collapsible
                className="mt-5"
                defaultValue={p.curriculum[0]?.semester ?? ""}
              >
                {p.curriculum.map((c) => (
                  <AccordionItem key={c.semester} value={c.semester}>
                    <AccordionTrigger className="font-display text-base font-semibold">
                      {c.semester}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {c.subjects.map((s) => (
                          <li
                            key={s}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-border bg-secondary/35 p-5 text-sm leading-6 text-muted-foreground">
                No curriculum outline is mapped for this record yet. Use the current official
                prospectus before comparing subjects or credits.
              </div>
            )}
          </div>

          <div id="eligibility" className="scroll-mt-32">
            <h2 className="font-display text-2xl font-bold">Eligibility & admission process</h2>

            <div className="mt-5 rounded-2xl border border-border bg-card p-6">
              <p className="text-sm leading-relaxed">
                <span className="font-semibold">
                  {p.eligibilityVerified
                    ? "Offering-specific source field: "
                    : "Typical category guidance: "}
                </span>
                {p.eligibility} Confirm the exact threshold and document rules with the university.
              </p>
              <ol className="mt-6 space-y-4">
                {[
                  "Verify the exact university, program, mode and intake on UGC-DEB",
                  "Read the current prospectus and refund policy on the official university site",
                  "Complete the application only through the university's official route",
                  "Upload documents only to the official university system",
                  "Pay only after the written fee schedule and recipient are confirmed",
                  "Receive your enrolment number and LMS access",
                ].map((step, i) => (
                  <li key={step} className="flex gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-ink-foreground">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              {hasCurrentOfferingEvidence &&
              (p.universityProgramUrl || p.officialApplicationUrl) ? (
                <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5">
                  {p.universityProgramUrl ? (
                    <a
                      href={p.universityProgramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#1768cc] dark:text-[#78b9ff]"
                    >
                      Official programme page <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                  {p.officialApplicationUrl ? (
                    <a
                      href={p.officialApplicationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#1768cc] dark:text-[#78b9ff]"
                    >
                      Official application route <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <div id="fees" className="scroll-mt-32">
            <h2 className="font-display text-2xl font-bold">Fee structure</h2>
            {feeRows.length ? (
              <div className="mt-5 overflow-hidden rounded-2xl border border-border">
                <table className="w-full text-sm">
                  <tbody>
                    {feeRows.map((row, i) => (
                      <tr key={row.label} className={i % 2 ? "bg-surface" : "bg-card"}>
                        <th
                          scope="row"
                          className="px-5 py-3.5 text-left font-medium text-muted-foreground"
                        >
                          {row.label}
                        </th>
                        <td className="px-5 py-3.5 text-right font-semibold">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-border bg-card p-6">
                <p className="font-display text-lg font-bold">No evidenced fee is published here</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Ask the university for a written total payable amount, semester schedule,
                  scholarship conditions, refund rules and any lender charges.
                </p>
              </div>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              University fees and finance terms can change by intake. Confirm the final written
              structure on the official university channel before payment.
            </p>
            {p.feeSourceUrl ? (
              <a
                href={p.feeSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#1768cc] dark:text-[#78b9ff]"
              >
                Open fee source · checked {p.feeVerifiedAt?.slice(0, 10) ?? "for this catalogue"}
                {p.feeNextReviewAt ? ` · review by ${p.feeNextReviewAt.slice(0, 10)}` : ""}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}
            {hasCurrentOfferingEvidence && p.refundPolicyUrl ? (
              <div className="mt-5 rounded-2xl border border-border bg-card p-5 text-sm">
                <a
                  href={p.refundPolicyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-bold text-[#1768cc] dark:text-[#78b9ff]"
                >
                  Read reviewed refund-policy link <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ) : null}
          </div>

          <div id="careers" className="scroll-mt-32">
            <h2 className="font-display text-2xl font-bold">Career outcomes</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {!hasCurrentOfferingEvidence
                ? "These role directions come from the degree category; no salary or placement outcome is asserted for this discovery record."
                : "Career directions are illustrative and do not guarantee a role, placement or salary."}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {p.careers.map((c) => (
                <div
                  key={c}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm font-medium"
                >
                  <Briefcase className="h-4 w-4 shrink-0 text-primary" />
                  {c}
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {hasCurrentOfferingEvidence &&
                u.metricsVerified &&
                u.placementPartners.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium"
                  >
                    {c}
                  </span>
                ))}
            </div>
          </div>

          {alternatives.length > 0 && (
            <div id="compare" className="scroll-mt-32">
              <h2 className="font-display text-2xl font-bold">
                Other universities offering {p.code} online
              </h2>
              <div className="mt-5 space-y-3">
                {alternatives.map(({ university, program }) => (
                  <Link
                    key={university.slug}
                    to="/universities/$universitySlug/$programSlug"
                    params={{ universitySlug: university.slug, programSlug: program.slug }}
                    className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-card"
                  >
                    <UniversityLogo university={university} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{university.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Source-backed {program.academicSession ?? "offering"} · {university.city}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatINR(program.totalFee)}</p>
                      <p className="text-xs text-muted-foreground">sourced total fee</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Fee status</p>
            <p className="mt-1 font-display text-2xl font-bold">
              {!hideOfferingClaims && p.totalFeeAvailable
                ? formatINR(p.totalFee)
                : "Confirmation required"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {!hideOfferingClaims && p.emiPerMonthAvailable
                ? `${formatINR(p.emiPerMonth)}/month ${p.emiPerMonthVerified ? "published amount" : "arithmetic split—not a lender quote"}`
                : "No exact fee or monthly amount is shown for this unverified record."}
            </p>
            <Button asChild className="mt-5 w-full bg-ink text-ink-foreground hover:bg-ink-soft">
              <a href="#apply">Get fee details</a>
            </Button>
            <ul className="mt-5 space-y-2.5 border-t border-border pt-5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-success" /> Verify exact intake on UGC-DEB
              </li>
              <li className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-success" /> Confirm exam and delivery mode
              </li>
              <li className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-success" /> Ask what career support includes
              </li>
              <li className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-success" /> Free counselling
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
