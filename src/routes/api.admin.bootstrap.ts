import { createFileRoute } from "@tanstack/react-router";
import { programCatalog, universities } from "@/data/universities";
import { getDatabase } from "@/lib/db.server";

const BATCH_SIZE = 50;

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return !import.meta.env.PROD;
  return origin === new URL(request.url).origin;
}

async function runBatches(database: D1Database, statements: D1PreparedStatement[]) {
  for (let index = 0; index < statements.length; index += BATCH_SIZE) {
    await database.batch(statements.slice(index, index + BATCH_SIZE));
  }
}

export const Route = createFileRoute("/api/admin/bootstrap")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!sameOrigin(request))
          return Response.json({ error: "Invalid origin" }, { status: 403 });
        try {
          const database = await getDatabase();
          const complete = await database
            .prepare("SELECT value FROM site_settings WHERE key = 'system.d1_bootstrap_v1'")
            .first();
          if (complete) return Response.json({ ok: true, alreadyComplete: true });

          const universityStatements = universities.map((university, index) =>
            database
              .prepare(
                `INSERT OR IGNORE INTO universities (
                  slug,name,legal_name,hei_id,short_name,city,state,established,domain,logo_url,
                  hero_image_url,accent_color,naac_grade,approvals,rating,reviews,students_enrolled,
                  placement_partners,highlights,about,hiring_partner_count,profile_depth,
                  verification_source_url,verification_academic_session,verified_at,next_review_at,
                  sort_order,published
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)`,
              )
              .bind(
                university.slug,
                university.name,
                university.legalName ?? null,
                university.heiId ?? null,
                university.shortName,
                university.city,
                university.state,
                university.established || null,
                university.domain || null,
                university.logoUrl ?? null,
                university.heroImageUrl ?? null,
                university.accentColor,
                university.naacGrade,
                JSON.stringify(university.approvals),
                university.rating,
                university.reviews,
                university.studentsEnrolled,
                JSON.stringify(university.placementPartners),
                JSON.stringify(university.highlights),
                university.about,
                university.hiringPartnerCount ?? "",
                university.profileDepth ?? "directory",
                university.verificationSourceUrl ?? null,
                university.verificationAcademicYear ?? null,
                university.lastVerified ?? null,
                university.verificationNextReviewAt ?? null,
                index,
              ),
          );
          const programStatements = programCatalog.map((program, index) =>
            database
              .prepare(
                `INSERT OR IGNORE INTO programs (
                  slug,code,name,level,duration_years,semesters,eligibility,overview,hero_image_url,
                  specialisations,curriculum,careers,sort_order,published
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,1)`,
              )
              .bind(
                program.slug,
                program.code,
                program.name,
                program.level,
                program.durationYears,
                program.semesters,
                program.eligibility,
                program.overview,
                program.heroImageUrl ?? null,
                JSON.stringify(program.specialisations),
                JSON.stringify(program.curriculum),
                JSON.stringify(program.careers),
                index,
              ),
          );
          const programSlugs = new Set(programCatalog.map((program) => program.slug));
          const offeringStatements = universities.flatMap((university) =>
            university.programs.flatMap((offering, index) => {
              if (!programSlugs.has(offering.slug)) return [];
              const hasVerifiedTotal = offering.feesVerified === true && offering.totalFee;
              const hasVerifiedSemester =
                offering.perSemesterFeeVerified === true && offering.perSemesterFee;
              const hasVerifiedEmi = offering.emiPerMonthVerified === true && offering.emiPerMonth;
              return [
                database
                  .prepare(
                    `INSERT OR IGNORE INTO university_programs (
                      id,university_slug,program_slug,total_fee,per_semester_fee,emi_per_month,
                      official_programme_name,delivery_mode,academic_session,entitlement_status,
                      entitlement_source_url,university_programme_url,official_application_url,
                      verified_at,next_review_at,fees_verified,per_semester_fee_verified,
                      emi_per_month_verified,fee_source_url,fee_verified_at,fee_next_review_at,
                      refund_policy_url,duration_years,semesters,eligibility,exam_mode,curriculum,
                      sort_order,published
                    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)`,
                  )
                  .bind(
                    `seed:${university.slug}:${offering.slug}`,
                    university.slug,
                    offering.slug,
                    hasVerifiedTotal ? offering.totalFee : null,
                    hasVerifiedSemester ? offering.perSemesterFee : null,
                    hasVerifiedEmi ? offering.emiPerMonth : null,
                    offering.officialProgrammeName ?? null,
                    offering.deliveryMode ?? "ONLINE",
                    offering.academicSession ?? null,
                    offering.entitlementStatus ?? "unverified",
                    offering.entitlementSourceUrl ?? null,
                    offering.universityProgramUrl ?? null,
                    offering.officialApplicationUrl ?? null,
                    offering.verifiedAt ?? null,
                    university.verificationNextReviewAt ?? null,
                    hasVerifiedTotal ? 1 : 0,
                    hasVerifiedSemester ? 1 : 0,
                    hasVerifiedEmi ? 1 : 0,
                    hasVerifiedTotal || hasVerifiedSemester || hasVerifiedEmi
                      ? (offering.feeSourceUrl ?? null)
                      : null,
                    offering.feeVerifiedAt ?? null,
                    offering.feeNextReviewAt ?? null,
                    offering.refundPolicyUrl ?? null,
                    offering.durationYears ?? null,
                    offering.semesters ?? null,
                    offering.eligibility ?? null,
                    offering.examMode ?? null,
                    offering.curriculum ? JSON.stringify(offering.curriculum) : null,
                    index,
                  ),
              ];
            }),
          );

          await runBatches(database, universityStatements);
          await runBatches(database, programStatements);
          await runBatches(database, offeringStatements);
          await database
            .prepare(
              "INSERT INTO site_settings (key,value) VALUES ('system.d1_bootstrap_v1', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
            )
            .bind(JSON.stringify({ completedAt: new Date().toISOString() }))
            .run();

          return Response.json({
            ok: true,
            universities: universityStatements.length,
            programs: programStatements.length,
            offerings: offeringStatements.length,
          });
        } catch (error) {
          console.error("d1_bootstrap_failed", error);
          return Response.json({ error: "D1 bootstrap failed." }, { status: 500 });
        }
      },
    },
  },
});
