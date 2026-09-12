import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type {
  Catalog,
  CatalogSpecialisation,
  ClaimEvidence,
  ProgramLevel,
  ProgramTemplate,
  SettingsValue,
  SiteSettings,
  University,
} from "@/data/universities";

interface DbUniversity {
  slug: string;
  name: string;
  legal_name: string | null;
  hei_id: string | null;
  short_name: string;
  city: string;
  state: string;
  established: number | null;
  domain: string | null;
  logo_url: string | null;
  hero_image_url: string | null;
  accent_color: string;
  highlights: string[];
  about: string;
  profile_depth: "directory" | "complete";
  verification_source_url: string | null;
  verification_academic_session: string | null;
  verified_at: string | null;
  next_review_at: string | null;
}

interface DbProgram {
  slug: string;
  code: string;
  name: string;
  level: string;
  duration_years: number;
  semesters: number;
  eligibility: string;
  overview: string;
  hero_image_url: string | null;
  specialisations: string[];
  curriculum: unknown;
  careers: string[];
}

interface DbOffering {
  id: string;
  university_slug: string;
  program_slug: string;
  total_fee: number | null;
  per_semester_fee: number | null;
  emi_per_month: number | null;
  academic_session: string | null;
  entitlement_status: "verified" | "unverified" | "expired" | "no-admission" | "debarred";
  entitlement_source_url: string | null;
  university_programme_url: string | null;
  official_application_url: string | null;
  verified_at: string | null;
  fees_verified: boolean;
  per_semester_fee_verified: boolean;
  emi_per_month_verified: boolean;
  fee_source_url: string | null;
  fee_verified_at: string | null;
  fee_next_review_at: string | null;
  official_programme_name: string | null;
  delivery_mode: "ONLINE" | "ODL";
  duration_years: number | null;
  semesters: number | null;
  eligibility: string | null;
  exam_mode: string | null;
  curriculum: unknown;
  refund_policy_url: string | null;
  next_review_at: string | null;
  updated_at: string;
  sort_order: number;
}

interface DbOfferingSpecialisation {
  offering_id: string;
  specialisation_id: string;
  university_label: string | null;
  availability_status: "verified" | "unverified" | "withdrawn";
  academic_session: string | null;
  source_url: string | null;
  verified_at: string | null;
  next_review_at: string | null;
  specialisations: { name: string } | { name: string }[] | null;
}

interface DbSpecialisation {
  id: string;
  slug: string;
  name: string;
  program_slug: string | null;
  category: string | null;
  summary: string | null;
  skills: string[];
  career_directions: string[];
  sort_order: number;
}

interface DbClaimEvidence {
  id: string;
  rendered_claim: string;
  claim_type: string;
  university_slug: string | null;
  program_slug: string | null;
  offering_id: string | null;
  source_url: string;
  source_date: string | null;
  academic_session: string | null;
  methodology: string | null;
  verified_at: string;
  expires_at: string;
  published: boolean;
}

const LEVELS: ProgramLevel[] = ["Bachelors", "Masters", "Diploma", "Certificate"];

function toLevel(value: string): ProgramLevel {
  return LEVELS.includes(value as ProgramLevel) ? (value as ProgramLevel) : "Masters";
}

function toCurriculum(value: unknown): ProgramTemplate["curriculum"] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const row = entry as { semester?: unknown; subjects?: unknown };
    if (typeof row.semester !== "string") return [];
    const subjects = Array.isArray(row.subjects)
      ? row.subjects.filter((s): s is string => typeof s === "string")
      : [];
    return [{ semester: row.semester, subjects }];
  });
}

function isPublicSourceUrl(value: string): boolean {
  return Boolean(toPublicHttpUrl(value));
}

function toPublicHttpUrl(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const parsed = new URL(value.trim());
    if (
      (parsed.protocol !== "https:" && parsed.protocol !== "http:") ||
      parsed.username ||
      parsed.password
    ) {
      return undefined;
    }
    return parsed.href;
  } catch {
    return undefined;
  }
}

function toOfficialDomain(value: string | null | undefined): string {
  if (!value) return "";
  try {
    const candidate = value.includes("://") ? value : `https://${value}`;
    const parsed = new URL(candidate);
    if (
      (parsed.protocol !== "https:" && parsed.protocol !== "http:") ||
      parsed.username ||
      parsed.password ||
      parsed.port ||
      parsed.pathname !== "/" ||
      parsed.search ||
      parsed.hash
    ) {
      return "";
    }
    return parsed.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

function toOfficialUniversityUrl(
  value: string | null | undefined,
  universityDomain: string,
): string | undefined {
  const url = toPublicHttpUrl(value);
  if (!url || !universityDomain) return undefined;
  const parsed = new URL(url);
  if (parsed.protocol !== "https:") return undefined;
  const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
  return hostname === universityDomain || hostname.endsWith(`.${universityDomain}`)
    ? url
    : undefined;
}

export const getCatalog = createServerFn({ method: "GET" }).handler(async (): Promise<Catalog> => {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) {
    return { universities: [], programs: [], settings: {}, source: "fallback" };
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });

  const nowIso = new Date().toISOString();
  const [
    uniRes,
    progRes,
    offerRes,
    offeringSpecialisationRes,
    specialisationRes,
    claimRes,
    settingsRes,
  ] = await Promise.all([
    supabase
      .from("universities")
      .select(
        "slug,name,legal_name,hei_id,short_name,city,state,established,domain,logo_url,hero_image_url,accent_color,highlights,about,profile_depth,verification_source_url,verification_academic_session,verified_at,next_review_at",
      )
      .eq("published", true)
      .order("sort_order"),
    supabase
      .from("programs")
      .select(
        "slug,code,name,level,duration_years,semesters,eligibility,overview,hero_image_url,specialisations,curriculum,careers",
      )
      .eq("published", true)
      .order("sort_order"),
    supabase
      .from("university_programs")
      .select(
        "id,university_slug,program_slug,total_fee,per_semester_fee,emi_per_month,official_programme_name,delivery_mode,academic_session,entitlement_status,entitlement_source_url,university_programme_url,official_application_url,verified_at,next_review_at,fees_verified,per_semester_fee_verified,emi_per_month_verified,fee_source_url,fee_verified_at,fee_next_review_at,refund_policy_url,duration_years,semesters,eligibility,exam_mode,curriculum,updated_at,sort_order",
      )
      .eq("published", true)
      .order("sort_order"),
    supabase
      .from("offering_specialisations")
      .select(
        "offering_id,specialisation_id,university_label,availability_status,academic_session,source_url,verified_at,next_review_at,specialisations(name)",
      )
      .eq("published", true)
      .eq("availability_status", "verified"),
    supabase
      .from("specialisations")
      .select("id,slug,name,program_slug,category,summary,skills,career_directions,sort_order")
      .eq("published", true)
      .order("sort_order")
      .order("name"),
    supabase
      .from("claim_evidence")
      .select(
        "id,rendered_claim,claim_type,university_slug,program_slug,offering_id,source_url,source_date,academic_session,methodology,verified_at,expires_at,published",
      )
      .eq("published", true)
      .lte("verified_at", nowIso)
      .gt("expires_at", nowIso)
      .order("verified_at", { ascending: false }),
    supabase.from("site_settings").select("key,value"),
  ]);

  if (uniRes.error || progRes.error || offerRes.error || settingsRes.error) {
    return { universities: [], programs: [], settings: {}, source: "fallback" };
  }

  const dbUniversities = (uniRes.data ?? []) as unknown as DbUniversity[];
  const dbPrograms = (progRes.data ?? []) as unknown as DbProgram[];
  const dbOfferings = (offerRes.data ?? []) as unknown as DbOffering[];
  const dbOfferingSpecialisations = offeringSpecialisationRes.error
    ? []
    : ((offeringSpecialisationRes.data ?? []) as unknown as DbOfferingSpecialisation[]);
  const dbSpecialisations = specialisationRes.error
    ? []
    : ((specialisationRes.data ?? []) as unknown as DbSpecialisation[]);
  const dbClaims = claimRes.error ? [] : ((claimRes.data ?? []) as unknown as DbClaimEvidence[]);
  const specialisationDataAvailable = !specialisationRes.error;
  const now = Date.now();
  const offeringStatus = (offering: DbOffering) => {
    if (
      offering.entitlement_status === "verified" &&
      offering.entitlement_source_url &&
      isPublicSourceUrl(offering.entitlement_source_url) &&
      offering.verified_at &&
      Date.parse(offering.verified_at) <= now &&
      offering.next_review_at &&
      Date.parse(offering.next_review_at) > now
    ) {
      return "verified" as const;
    }
    return offering.entitlement_status === "verified"
      ? ("expired" as const)
      : offering.entitlement_status;
  };
  const statusRank = (offering: DbOffering) => {
    const status = offeringStatus(offering);
    if (status === "verified") return 0;
    if (status === "unverified") return 1;
    if (status === "expired") return 2;
    if (status === "no-admission") return 3;
    return 4;
  };
  const preferredOfferings = [...dbOfferings]
    .sort((a, b) => {
      const byStatus = statusRank(a) - statusRank(b);
      if (byStatus) return byStatus;
      const bySession = (b.academic_session ?? "").localeCompare(a.academic_session ?? "");
      if (bySession) return bySession;
      return Date.parse(b.updated_at) - Date.parse(a.updated_at);
    })
    .filter(
      (offering, index, rows) =>
        rows.findIndex(
          (candidate) =>
            candidate.university_slug === offering.university_slug &&
            candidate.program_slug === offering.program_slug,
        ) === index,
    );

  const claimEvidence: ClaimEvidence[] = dbClaims
    .filter(
      (claim) =>
        claim.published &&
        isPublicSourceUrl(claim.source_url) &&
        Date.parse(claim.verified_at) <= now &&
        Date.parse(claim.expires_at) > now,
    )
    .map((claim) => ({
      id: claim.id,
      renderedClaim: claim.rendered_claim,
      claimType: claim.claim_type,
      universitySlug: claim.university_slug ?? undefined,
      programSlug: claim.program_slug ?? undefined,
      offeringId: claim.offering_id ?? undefined,
      sourceUrl: toPublicHttpUrl(claim.source_url)!,
      sourceDate: claim.source_date ?? undefined,
      academicSession: claim.academic_session ?? undefined,
      methodology: claim.methodology ?? undefined,
      verifiedAt: claim.verified_at,
      expiresAt: claim.expires_at,
      published: claim.published,
    }));

  const preferredOfferingById = new Map(
    preferredOfferings.map((offering) => [offering.id, offering]),
  );
  const specialisationById = new Map(
    dbSpecialisations.map((specialisation) => [specialisation.id, specialisation]),
  );
  const currentOfferingSpecialisations = dbOfferingSpecialisations.flatMap((mapping) => {
    const offering = preferredOfferingById.get(mapping.offering_id);
    if (
      !offering ||
      offeringStatus(offering) !== "verified" ||
      mapping.availability_status !== "verified" ||
      !mapping.academic_session?.trim() ||
      !offering.academic_session ||
      mapping.academic_session !== offering.academic_session ||
      !mapping.source_url ||
      !isPublicSourceUrl(mapping.source_url) ||
      !mapping.verified_at ||
      !mapping.next_review_at ||
      Date.parse(mapping.verified_at) > now ||
      Date.parse(mapping.next_review_at) <= now
    ) {
      return [];
    }

    const taxonomy = specialisationById.get(mapping.specialisation_id);
    const joinedName = Array.isArray(mapping.specialisations)
      ? mapping.specialisations[0]?.name
      : mapping.specialisations?.name;
    const label = mapping.university_label?.trim() || taxonomy?.name || joinedName;
    if ((specialisationDataAvailable && !taxonomy) || !label) return [];
    return [
      {
        offeringId: mapping.offering_id,
        specialisationId: mapping.specialisation_id,
        programSlug: offering.program_slug,
        label,
      },
    ];
  });

  const normalize = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
  const basePrograms: ProgramTemplate[] = dbPrograms.map((p) => ({
    slug: p.slug,
    code: p.code,
    name: p.name,
    level: toLevel(p.level),
    durationYears: Number(p.duration_years),
    semesters: p.semesters,
    eligibility: p.eligibility,
    overview: p.overview,
    specialisations: p.specialisations ?? [],
    curriculum: toCurriculum(p.curriculum),
    careers: p.careers ?? [],
    heroImageUrl: toPublicHttpUrl(p.hero_image_url),
  }));

  const specialisations: CatalogSpecialisation[] = dbSpecialisations.map((specialisation) => {
    const mappings = currentOfferingSpecialisations.filter(
      (mapping) => mapping.specialisationId === specialisation.id,
    );
    const legacyProgramSlugs = basePrograms
      .filter((program) => {
        const category = normalize(specialisation.category ?? "");
        return (
          program.specialisations.some(
            (name) =>
              normalize(name) === normalize(specialisation.name) ||
              normalize(name) === normalize(specialisation.slug),
          ) ||
          Boolean(
            category &&
            [normalize(program.slug), normalize(program.code), normalize(program.name)].includes(
              category,
            ),
          )
        );
      })
      .map((program) => program.slug);
    const programLabels = mappings.filter(
      (mapping, index, rows) =>
        rows.findIndex(
          (candidate) =>
            candidate.programSlug === mapping.programSlug && candidate.label === mapping.label,
        ) === index,
    );

    return {
      id: specialisation.id,
      slug: specialisation.slug,
      name: specialisation.name,
      category: specialisation.category ?? undefined,
      summary: specialisation.summary ?? undefined,
      skills: specialisation.skills ?? [],
      careerDirections: specialisation.career_directions ?? [],
      sortOrder: specialisation.sort_order,
      programSlugs: [
        ...new Set([
          ...(specialisation.program_slug ? [specialisation.program_slug] : []),
          ...legacyProgramSlugs,
          ...mappings.map((m) => m.programSlug),
        ]),
      ],
      programLabels: programLabels.map(({ programSlug, label }) => ({ programSlug, label })),
    };
  });

  const programs: ProgramTemplate[] = basePrograms.map((program) => ({
    ...program,
    specialisations: [
      ...new Set([
        ...program.specialisations,
        ...currentOfferingSpecialisations
          .filter((mapping) => mapping.programSlug === program.slug)
          .map((mapping) => mapping.label),
      ]),
    ],
  }));

  const universities: University[] = dbUniversities.map((u) => {
    const universityClaims = claimEvidence.filter((claim) => claim.universitySlug === u.slug);
    const supportedApprovals = universityClaims
      .filter(
        (claim) =>
          !claim.programSlug &&
          !claim.offeringId &&
          (claim.claimType === "recognition" || claim.claimType === "accreditation"),
      )
      .map((claim) => claim.renderedClaim);
    const domain = toOfficialDomain(u.domain);
    const verificationSourceUrl = toPublicHttpUrl(u.verification_source_url);

    return {
      slug: u.slug,
      name: u.name,
      shortName: u.short_name || u.name,
      city: u.city,
      state: u.state,
      established: u.established ?? 0,
      domain,
      accentColor: u.accent_color,
      naacGrade: "",
      approvals: [],
      claimEvidence: universityClaims,
      supportedApprovals,
      rating: 0,
      reviews: 0,
      studentsEnrolled: "Not independently verified",
      placementPartners: [],
      highlights: u.highlights ?? [],
      about: u.about,
      logoUrl: toPublicHttpUrl(u.logo_url),
      heroImageUrl: toPublicHttpUrl(u.hero_image_url),
      hiringPartnerCount: undefined,
      legalName: u.legal_name ?? undefined,
      heiId: u.hei_id ?? undefined,
      profileDepth: u.profile_depth,
      verificationAcademicYear: u.verification_academic_session ?? undefined,
      verificationSourceUrl,
      lastVerified: u.verified_at ? u.verified_at.slice(0, 10) : undefined,
      verificationNextReviewAt: u.next_review_at ?? undefined,
      verificationCurrent: Boolean(
        verificationSourceUrl &&
        u.verified_at &&
        Date.parse(u.verified_at) <= now &&
        u.next_review_at &&
        Date.parse(u.next_review_at) > now,
      ),
      metricsVerified: false,
      programs: preferredOfferings
        .filter((o) => o.university_slug === u.slug)
        .map((o) => {
          const specialisations = currentOfferingSpecialisations
            .filter((mapping) => mapping.offeringId === o.id)
            .map((mapping) => mapping.label);
          const entitlementStatus = offeringStatus(o);
          const feeSourceUrl = toPublicHttpUrl(o.fee_source_url);
          const feesVerified = Boolean(
            entitlementStatus === "verified" &&
            o.total_fee !== null &&
            o.total_fee > 0 &&
            o.fees_verified &&
            feeSourceUrl &&
            o.fee_verified_at &&
            Date.parse(o.fee_verified_at) <= now &&
            o.fee_next_review_at &&
            Date.parse(o.fee_next_review_at) > now,
          );
          const perSemesterFeeVerified = Boolean(
            entitlementStatus === "verified" &&
            o.per_semester_fee_verified &&
            o.per_semester_fee !== null &&
            o.per_semester_fee > 0 &&
            feeSourceUrl &&
            o.fee_verified_at &&
            Date.parse(o.fee_verified_at) <= now &&
            o.fee_next_review_at &&
            Date.parse(o.fee_next_review_at) > now,
          );
          const emiPerMonthVerified = Boolean(
            entitlementStatus === "verified" &&
            o.emi_per_month_verified &&
            o.emi_per_month !== null &&
            o.emi_per_month > 0 &&
            feeSourceUrl &&
            o.fee_verified_at &&
            Date.parse(o.fee_verified_at) <= now &&
            o.fee_next_review_at &&
            Date.parse(o.fee_next_review_at) > now,
          );
          const feeGuideAvailable = feesVerified || perSemesterFeeVerified || emiPerMonthVerified;

          return {
            slug: o.program_slug,
            offeringId: o.id,
            totalFee: feesVerified ? Number(o.total_fee) : undefined,
            perSemesterFee: perSemesterFeeVerified ? Number(o.per_semester_fee) : undefined,
            emiPerMonth: emiPerMonthVerified ? Number(o.emi_per_month) : undefined,
            feeGuideAvailable,
            feesVerified,
            perSemesterFeeVerified,
            emiPerMonthVerified,
            specialisations: specialisations.length ? specialisations : undefined,
            specialisationsVerified: entitlementStatus === "verified" && specialisations.length > 0,
            entitlementStatus,
            academicSession: o.academic_session ?? undefined,
            entitlementSourceUrl: toPublicHttpUrl(o.entitlement_source_url),
            universityProgramUrl: toOfficialUniversityUrl(o.university_programme_url, domain),
            officialApplicationUrl: toOfficialUniversityUrl(o.official_application_url, domain),
            verifiedAt: o.verified_at ?? undefined,
            officialProgrammeName: o.official_programme_name ?? undefined,
            deliveryMode: o.delivery_mode,
            durationYears: o.duration_years === null ? undefined : Number(o.duration_years),
            semesters: o.semesters ?? undefined,
            eligibility: o.eligibility ?? undefined,
            curriculum: toCurriculum(o.curriculum),
            examMode: o.exam_mode ?? undefined,
            scholarshipSummary: undefined,
            refundPolicyUrl: toOfficialUniversityUrl(o.refund_policy_url, domain),
            feeSourceUrl:
              feesVerified || perSemesterFeeVerified || emiPerMonthVerified
                ? feeSourceUrl
                : undefined,
            feeVerifiedAt:
              feesVerified || perSemesterFeeVerified || emiPerMonthVerified
                ? (o.fee_verified_at ?? undefined)
                : undefined,
            feeNextReviewAt:
              feesVerified || perSemesterFeeVerified || emiPerMonthVerified
                ? (o.fee_next_review_at ?? undefined)
                : undefined,
            // Component-level amounts need their own scoped evidence model.
            // Keep the CMS field internal until that provenance exists.
            feeComponents: undefined,
            seatsFilledPercent: undefined,
          };
        }),
    };
  });

  const settings: SiteSettings = {};
  for (const row of (settingsRes.data ?? []) as { key: string; value: SettingsValue }[]) {
    settings[row.key] = row.value;
  }

  return {
    universities,
    programs,
    claimEvidence,
    specialisations,
    settings,
    source: "database",
  };
});
