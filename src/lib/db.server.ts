const tableDefinitions = {
  universities: {
    id: "id",
    columns: [
      "id",
      "slug",
      "name",
      "legal_name",
      "hei_id",
      "short_name",
      "city",
      "state",
      "established",
      "domain",
      "logo_url",
      "hero_image_url",
      "accent_color",
      "naac_grade",
      "approvals",
      "rating",
      "reviews",
      "students_enrolled",
      "placement_partners",
      "highlights",
      "about",
      "hiring_partner_count",
      "profile_depth",
      "verification_source_url",
      "verification_academic_session",
      "verified_at",
      "next_review_at",
      "sort_order",
      "published",
      "created_at",
      "updated_at",
    ],
    write: [
      "slug",
      "name",
      "legal_name",
      "hei_id",
      "short_name",
      "city",
      "state",
      "established",
      "domain",
      "logo_url",
      "hero_image_url",
      "accent_color",
      "naac_grade",
      "approvals",
      "rating",
      "reviews",
      "students_enrolled",
      "placement_partners",
      "highlights",
      "about",
      "hiring_partner_count",
      "profile_depth",
      "verification_source_url",
      "verification_academic_session",
      "verified_at",
      "next_review_at",
      "sort_order",
      "published",
    ],
    json: ["approvals", "placement_partners", "highlights"],
    bool: ["published"],
  },
  programs: {
    id: "id",
    columns: [
      "id",
      "slug",
      "code",
      "name",
      "level",
      "duration_years",
      "semesters",
      "eligibility",
      "overview",
      "hero_image_url",
      "specialisations",
      "curriculum",
      "careers",
      "average_salary_lpa",
      "sort_order",
      "published",
      "created_at",
      "updated_at",
    ],
    write: [
      "slug",
      "code",
      "name",
      "level",
      "duration_years",
      "semesters",
      "eligibility",
      "overview",
      "hero_image_url",
      "specialisations",
      "curriculum",
      "careers",
      "sort_order",
      "published",
    ],
    json: ["specialisations", "curriculum", "careers"],
    bool: ["published"],
  },
  university_programs: {
    id: "id",
    columns: [
      "id",
      "university_slug",
      "program_slug",
      "total_fee",
      "per_semester_fee",
      "emi_per_month",
      "official_programme_name",
      "delivery_mode",
      "academic_session",
      "entitlement_status",
      "entitlement_source_url",
      "university_programme_url",
      "official_application_url",
      "verified_at",
      "next_review_at",
      "fees_verified",
      "per_semester_fee_verified",
      "emi_per_month_verified",
      "fee_source_url",
      "fee_verified_at",
      "fee_next_review_at",
      "fee_components",
      "refund_policy_url",
      "duration_years",
      "semesters",
      "eligibility",
      "exam_mode",
      "curriculum",
      "scholarship_summary",
      "sort_order",
      "published",
      "created_at",
      "updated_at",
    ],
    write: [
      "university_slug",
      "program_slug",
      "total_fee",
      "per_semester_fee",
      "emi_per_month",
      "official_programme_name",
      "delivery_mode",
      "academic_session",
      "entitlement_status",
      "entitlement_source_url",
      "university_programme_url",
      "official_application_url",
      "verified_at",
      "next_review_at",
      "fees_verified",
      "per_semester_fee_verified",
      "emi_per_month_verified",
      "fee_source_url",
      "fee_verified_at",
      "fee_next_review_at",
      "fee_components",
      "refund_policy_url",
      "duration_years",
      "semesters",
      "eligibility",
      "exam_mode",
      "curriculum",
      "scholarship_summary",
      "sort_order",
      "published",
    ],
    json: ["fee_components", "curriculum"],
    bool: ["fees_verified", "per_semester_fee_verified", "emi_per_month_verified", "published"],
  },
  specialisations: {
    id: "id",
    columns: [
      "id",
      "slug",
      "name",
      "program_slug",
      "category",
      "summary",
      "skills",
      "career_directions",
      "sort_order",
      "published",
      "created_at",
      "updated_at",
    ],
    write: [
      "slug",
      "name",
      "program_slug",
      "category",
      "summary",
      "skills",
      "career_directions",
      "sort_order",
      "published",
    ],
    json: ["skills", "career_directions"],
    bool: ["published"],
  },
  offering_specialisations: {
    id: "id",
    columns: [
      "id",
      "offering_id",
      "specialisation_id",
      "university_label",
      "availability_status",
      "academic_session",
      "source_url",
      "verified_at",
      "next_review_at",
      "published",
      "created_at",
      "updated_at",
    ],
    write: [
      "offering_id",
      "specialisation_id",
      "university_label",
      "availability_status",
      "academic_session",
      "source_url",
      "verified_at",
      "next_review_at",
      "published",
    ],
    json: [],
    bool: ["published"],
  },
  claim_evidence: {
    id: "id",
    columns: [
      "id",
      "rendered_claim",
      "claim_type",
      "university_slug",
      "program_slug",
      "offering_id",
      "source_url",
      "source_date",
      "academic_session",
      "methodology",
      "verified_at",
      "expires_at",
      "published",
      "created_at",
      "updated_at",
    ],
    write: [
      "rendered_claim",
      "claim_type",
      "university_slug",
      "program_slug",
      "offering_id",
      "source_url",
      "source_date",
      "academic_session",
      "methodology",
      "verified_at",
      "expires_at",
      "published",
    ],
    json: [],
    bool: ["published"],
  },
  site_settings: {
    id: "key",
    columns: ["key", "value", "updated_at"],
    write: ["key", "value"],
    json: ["value"],
    bool: [],
  },
  leads: {
    id: "id",
    columns: [
      "id",
      "full_name",
      "phone",
      "email",
      "university_slug",
      "program_slug",
      "source_path",
      "message",
      "contact_channels",
      "consent_given",
      "consent_version",
      "consent_text",
      "consent_at",
      "share_with_university",
      "university_share_consent_at",
      "university_share_consent_version",
      "university_share_consent_text",
      "qualification",
      "goal",
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "referrer",
      "status",
      "internal_notes",
      "created_at",
    ],
    write: ["status", "internal_notes"],
    json: ["contact_channels"],
    bool: ["consent_given", "share_with_university"],
  },
} as const;

export type AdminTable = keyof typeof tableDefinitions;

export async function getDatabase(): Promise<D1Database> {
  const { env } = await import("cloudflare:workers");
  if (!env.CATALOG_DB) throw new Error("CATALOG_DB binding is unavailable");
  return env.CATALOG_DB;
}

export function getTableDefinition(table: string) {
  if (!(table in tableDefinitions)) throw new Error("Unsupported admin table");
  return tableDefinitions[table as AdminTable];
}

export function parseDatabaseRow(table: AdminTable, row: object): Record<string, unknown> {
  const definition = tableDefinitions[table];
  const parsed: Record<string, unknown> = { ...row };
  for (const column of definition.json) {
    const value = parsed[column];
    if (typeof value !== "string") continue;
    try {
      parsed[column] = JSON.parse(value) as unknown;
    } catch {
      parsed[column] = null;
    }
  }
  for (const column of definition.bool) {
    if (column in parsed) parsed[column] = Boolean(parsed[column]);
  }
  return parsed;
}

export function serializeAdminPayload(table: AdminTable, payload: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Invalid record payload");
  }
  const definition = tableDefinitions[table];
  const allowed = new Set<string>(definition.write);
  const jsonColumns = new Set<string>(definition.json);
  const booleanColumns = new Set<string>(definition.bool);
  const serialized: Record<string, string | number | null> = {};

  for (const [column, value] of Object.entries(payload)) {
    if (!allowed.has(column)) throw new Error(`Unsupported field: ${column}`);
    if (value === undefined) continue;
    if (jsonColumns.has(column)) {
      serialized[column] = JSON.stringify(value);
    } else if (booleanColumns.has(column)) {
      if (typeof value !== "boolean") throw new Error(`Invalid boolean: ${column}`);
      serialized[column] = value ? 1 : 0;
    } else if (value === null || typeof value === "string" || typeof value === "number") {
      serialized[column] = value;
    } else {
      throw new Error(`Invalid value: ${column}`);
    }
  }

  if (!Object.keys(serialized).length) throw new Error("No fields to save");
  return serialized;
}
