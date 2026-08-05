import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type {
  Catalog,
  ProgramLevel,
  ProgramTemplate,
  SettingsValue,
  SiteSettings,
  University,
} from "@/data/universities";

interface DbUniversity {
  slug: string;
  name: string;
  short_name: string;
  city: string;
  state: string;
  established: number | null;
  domain: string | null;
  logo_url: string | null;
  hero_image_url: string | null;
  accent_color: string;
  naac_grade: string;
  approvals: string[];
  rating: number;
  reviews: number;
  students_enrolled: string;
  placement_partners: string[];
  highlights: string[];
  about: string;
  hiring_partner_count: string;
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
  average_salary_lpa: string;
}

interface DbOffering {
  university_slug: string;
  program_slug: string;
  total_fee: number;
  per_semester_fee: number;
  emi_per_month: number;
  seats_filled_percent: number;
  sort_order: number;
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

export const getCatalog = createServerFn({ method: "GET" }).handler(async (): Promise<Catalog> => {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return { universities: [], programs: [], settings: {} };

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

  const [uniRes, progRes, offerRes, settingsRes] = await Promise.all([
    supabase
      .from("universities")
      .select(
        "slug,name,short_name,city,state,established,domain,logo_url,hero_image_url,accent_color,naac_grade,approvals,rating,reviews,students_enrolled,placement_partners,highlights,about,hiring_partner_count",
      )
      .eq("published", true)
      .order("sort_order"),
    supabase
      .from("programs")
      .select(
        "slug,code,name,level,duration_years,semesters,eligibility,overview,hero_image_url,specialisations,curriculum,careers,average_salary_lpa",
      )
      .eq("published", true)
      .order("sort_order"),
    supabase
      .from("university_programs")
      .select(
        "university_slug,program_slug,total_fee,per_semester_fee,emi_per_month,seats_filled_percent,sort_order",
      )
      .eq("published", true)
      .order("sort_order"),
    supabase.from("site_settings").select("key,value"),
  ]);

  const dbUniversities = (uniRes.data ?? []) as unknown as DbUniversity[];
  const dbPrograms = (progRes.data ?? []) as unknown as DbProgram[];
  const dbOfferings = (offerRes.data ?? []) as unknown as DbOffering[];

  const programs: ProgramTemplate[] = dbPrograms.map((p) => ({
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
    averageSalaryLpa: p.average_salary_lpa,
    heroImageUrl: p.hero_image_url ?? undefined,
  }));

  const universities: University[] = dbUniversities.map((u) => ({
    slug: u.slug,
    name: u.name,
    shortName: u.short_name || u.name,
    city: u.city,
    state: u.state,
    established: u.established ?? 0,
    domain: u.domain ?? "",
    accentColor: u.accent_color,
    naacGrade: u.naac_grade,
    approvals: u.approvals ?? [],
    rating: Number(u.rating),
    reviews: u.reviews,
    studentsEnrolled: u.students_enrolled,
    placementPartners: u.placement_partners ?? [],
    highlights: u.highlights ?? [],
    about: u.about,
    logoUrl: u.logo_url ?? undefined,
    heroImageUrl: u.hero_image_url ?? undefined,
    hiringPartnerCount: u.hiring_partner_count,
    programs: dbOfferings
      .filter((o) => o.university_slug === u.slug)
      .map((o) => ({
        slug: o.program_slug,
        totalFee: o.total_fee,
        perSemesterFee: o.per_semester_fee,
        emiPerMonth: o.emi_per_month,
        seatsFilledPercent: o.seats_filled_percent,
      })),
  }));

  const settings: SiteSettings = {};
  for (const row of (settingsRes.data ?? []) as { key: string; value: SettingsValue }[]) {
    settings[row.key] = row.value;
  }

  return { universities, programs, settings };
});
