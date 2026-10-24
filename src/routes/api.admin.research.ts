import { createFileRoute } from "@tanstack/react-router";
import { getDatabase } from "@/lib/db.server";

const PAGE_SIZE = 48;
const BUCKETS = new Set([
  "HELD_RESEARCH",
  "CANDIDATE_REVIEW",
  "SEPARATE_CERTIFICATE",
  "SEPARATE_BUNDLE_PATHWAY",
]);

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function parseJson(value: unknown) {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/api/admin/research")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const database = await getDatabase();
          const url = new URL(request.url);
          const batch = await database
            .prepare(
              "SELECT import_id,dataset_id,merged_on,source_file_sha256,import_status,statistics,acceptance_invariants,ready_at FROM catalogue_import_batches WHERE import_status = 'ready' ORDER BY ready_at DESC LIMIT 1",
            )
            .first<Record<string, unknown>>();
          const parsedBatch = batch
            ? {
                ...batch,
                statistics: parseJson(batch["statistics"]),
                acceptance_invariants: parseJson(batch["acceptance_invariants"]),
              }
            : null;
          if (url.searchParams.get("mode") === "batch" || !batch) {
            return json({ batch: parsedBatch });
          }

          const bucket = url.searchParams.get("bucket") ?? "all";
          if (bucket !== "all" && !BUCKETS.has(bucket))
            return json({ error: "Invalid bucket" }, 400);
          const page = Math.max(0, Number.parseInt(url.searchParams.get("page") ?? "0", 10) || 0);
          const search = (url.searchParams.get("search") ?? "")
            .trim()
            .replace(/[^\p{L}\p{N}\s.-]/gu, " ")
            .replace(/\s+/g, " ")
            .slice(0, 80);
          const filters = ["import_id = ?"];
          const values: unknown[] = [batch["import_id"]];
          if (bucket !== "all") {
            filters.push("import_bucket = ?");
            values.push(bucket);
          }
          if (search) {
            filters.push(
              "(university_display_name LIKE ? OR course LIKE ? OR specialisation LIKE ?)",
            );
            const pattern = `%${search}%`;
            values.push(pattern, pattern, pattern);
          }
          const where = filters.join(" AND ");
          const columns =
            "course_row_id,canonical_university_slug,university_display_name,state_ut,course,specialisation,import_bucket,catalogue_candidate,reference_session,checked_on,evidence_status,publication_ready,catalogue_evidence_url,programme_source_url_current,fee_source_url,full_course_fee_inr,fee_evidence_status";
          const [rows, count] = await Promise.all([
            database
              .prepare(
                `SELECT ${columns} FROM catalogue_research_records WHERE ${where} ORDER BY university_display_name,course LIMIT ? OFFSET ?`,
              )
              .bind(...values, PAGE_SIZE, page * PAGE_SIZE)
              .all(),
            database
              .prepare(`SELECT count(*) AS count FROM catalogue_research_records WHERE ${where}`)
              .bind(...values)
              .first<{ count: number }>(),
          ]);
          return json({ rows: rows.results, count: count?.count ?? 0 });
        } catch (error) {
          console.error("research_queue_failed", error);
          return json({ error: "Research queue is unavailable." }, 500);
        }
      },
    },
  },
});
