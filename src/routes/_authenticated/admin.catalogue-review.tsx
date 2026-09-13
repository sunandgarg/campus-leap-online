import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Database,
  ExternalLink,
  FileCheck2,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";

import { CompactRail } from "@/components/site/compact-rail";
import { UniversityLogo } from "@/components/site/university-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { catalogueImportSummary } from "@/data/catalogue-import-summary";
import { universities } from "@/data/universities";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/catalogue-review")({
  component: CatalogueReviewPage,
});

const PAGE_SIZE = 48;

type ImportBatch = {
  import_id: string;
  dataset_id: string;
  merged_on: string | null;
  source_file_sha256: string;
  import_status: "staging" | "ready" | "failed";
  statistics: Record<string, unknown>;
  acceptance_invariants: Record<string, unknown>;
  ready_at: string | null;
};

type ResearchRecord = {
  course_row_id: string;
  canonical_university_slug: string | null;
  university_display_name: string;
  state_ut: string | null;
  course: string;
  specialisation: string | null;
  import_bucket:
    "HELD_RESEARCH" | "CANDIDATE_REVIEW" | "SEPARATE_CERTIFICATE" | "SEPARATE_BUNDLE_PATHWAY";
  catalogue_candidate: boolean;
  reference_session: string | null;
  checked_on: string | null;
  evidence_status: string | null;
  publication_ready: string | null;
  catalogue_evidence_url: string | null;
  programme_source_url_current: string | null;
  fee_source_url: string | null;
  full_course_fee_inr: number | null;
  fee_evidence_status: string | null;
};

type BucketFilter = "all" | ResearchRecord["import_bucket"];

function labelFromCode(value: string | null) {
  if (!value) return "Not recorded";
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatResearchFee(value: number | null) {
  return value === null ? "Not cleared" : `₹${Number(value).toLocaleString("en-IN")}`;
}

function CatalogueReviewPage() {
  const [search, setSearch] = useState("");
  const [bucket, setBucket] = useState<BucketFilter>("all");
  const [page, setPage] = useState(0);

  const universityBySlug = useMemo(
    () => new Map(universities.map((university) => [university.slug, university])),
    [],
  );

  const batchQuery = useQuery({
    queryKey: ["admin", "catalogue-import", "latest-ready"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("catalogue_import_batches")
        .select(
          "import_id, dataset_id, merged_on, source_file_sha256, import_status, statistics, acceptance_invariants, ready_at",
        )
        .eq("import_status", "ready")
        .order("ready_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as ImportBatch | null;
    },
  });

  const recordsQuery = useQuery({
    queryKey: ["admin", "catalogue-import", batchQuery.data?.import_id, search, bucket, page],
    enabled: Boolean(batchQuery.data?.import_id),
    queryFn: async () => {
      const importId = batchQuery.data?.import_id;
      if (!importId) return { rows: [] as ResearchRecord[], count: 0 };

      let query = supabase
        .from("catalogue_research_records")
        .select(
          "course_row_id, canonical_university_slug, university_display_name, state_ut, course, specialisation, import_bucket, catalogue_candidate, reference_session, checked_on, evidence_status, publication_ready, catalogue_evidence_url, programme_source_url_current, fee_source_url, full_course_fee_inr, fee_evidence_status",
          { count: "exact" },
        )
        .eq("import_id", importId);

      if (bucket !== "all") query = query.eq("import_bucket", bucket);
      const normalizedSearch = search
        .trim()
        .replace(/[^\p{L}\p{N}\s.-]/gu, " ")
        .replace(/\s+/g, " ")
        .slice(0, 80);
      if (normalizedSearch) {
        query = query.textSearch("search_document", normalizedSearch, {
          config: "simple",
          type: "websearch",
        });
      }

      const start = page * PAGE_SIZE;
      const { data, error, count } = await query
        .order("university_display_name", { ascending: true })
        .order("course", { ascending: true })
        .range(start, start + PAGE_SIZE - 1);
      if (error) throw error;
      return { rows: (data ?? []) as ResearchRecord[], count: count ?? 0 };
    },
  });

  const count = recordsQuery.data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const resetPage = () => setPage(0);

  return (
    <div className="min-w-0">
      <div className="flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="brand-kicker">
            <Database className="h-4 w-4" aria-hidden="true" /> Private editorial queue
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.04em]">
            Course research review
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            The complete supplied handoff is preserved here as draft research. Nothing in this queue
            becomes a public offering, approval, fee or ranking until it passes the separate
            catalogue evidence workflow.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#b9dfce] bg-[#eef9f4] px-3 py-2 text-xs font-extrabold text-[#126b4a] dark:border-[#356951] dark:bg-[#153528] dark:text-[#8fe0ba]">
          <ShieldCheck className="h-4 w-4" /> 0 rows auto-published
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          [catalogueImportSummary.universityCount, "university records"],
          [catalogueImportSummary.recordCount, "course research rows"],
          [catalogueImportSummary.candidateCount, "candidate rows"],
          [catalogueImportSummary.sourceCount, "retained sources"],
        ].map(([value, label]) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4">
            <p className="font-display text-2xl font-extrabold text-[#325dd2] dark:text-[#8cb0ff]">
              {Number(value).toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-[11px] font-bold text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-border bg-card p-3">
        <div className="grid min-w-0 gap-3 lg:grid-cols-[1fr_260px_auto]">
          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                resetPage();
              }}
              className="h-11 min-w-0 pl-10"
              placeholder="Search university, course or specialisation"
              aria-label="Search private course research"
            />
          </div>
          <select
            value={bucket}
            onChange={(event) => {
              setBucket(event.target.value as BucketFilter);
              resetPage();
            }}
            className="h-11 min-w-0 rounded-lg border border-input bg-background px-3 text-sm font-semibold"
            aria-label="Filter the research queue"
          >
            <option value="all">All review queues</option>
            <option value="CANDIDATE_REVIEW">Candidate review</option>
            <option value="HELD_RESEARCH">Held research</option>
            <option value="SEPARATE_CERTIFICATE">Certificates</option>
            <option value="SEPARATE_BUNDLE_PATHWAY">Bundles and pathways</option>
          </select>
          <span className="inline-flex h-11 items-center rounded-lg bg-secondary px-4 text-xs font-extrabold text-muted-foreground">
            {count.toLocaleString("en-IN")} matched
          </span>
        </div>
      </div>

      {batchQuery.isPending ? (
        <QueueStatus icon={Database} title="Checking the latest imported dataset" />
      ) : batchQuery.isError ? (
        <QueueStatus
          icon={AlertTriangle}
          title="The private catalogue queue is not available"
          description="Apply the research-queue migration and run the validated import command with a service-role credential. Anonymous users cannot access this data."
        />
      ) : !batchQuery.data ? (
        <QueueStatus
          icon={FileCheck2}
          title="The validated dataset is ready to import"
          description="The repository includes the complete compressed handoff and importer. Run the import after the Supabase migration is applied."
        />
      ) : recordsQuery.isError ? (
        <QueueStatus
          icon={AlertTriangle}
          title="Course research could not be loaded"
          description="Check the import status and the admin-only read policy before retrying."
        />
      ) : recordsQuery.isPending ? (
        <QueueStatus icon={Database} title="Loading private research records" />
      ) : recordsQuery.data?.rows.length ? (
        <>
          <CompactRail label="Private course research records" rows={2} columns={4}>
            {recordsQuery.data.rows.map((record) => {
              const university = record.canonical_university_slug
                ? universityBySlug.get(record.canonical_university_slug)
                : undefined;
              const sourceUrl =
                record.programme_source_url_current ?? record.catalogue_evidence_url;
              return (
                <article
                  key={record.course_row_id}
                  className="flex min-h-48 flex-col rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    {university ? (
                      <UniversityLogo
                        university={university}
                        size="sm"
                        className="h-10 w-12 rounded-lg"
                      />
                    ) : (
                      <span className="flex h-10 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-xs font-extrabold">
                        {record.university_display_name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs font-extrabold leading-4">
                        {record.university_display_name}
                      </p>
                      <p className="mt-1 truncate text-[10px] text-muted-foreground">
                        {record.state_ut ?? "India"}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-md px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide ${
                        record.catalogue_candidate
                          ? "bg-[#edf2ff] text-[#2449ad] dark:bg-[#263653] dark:text-[#b9ceff]"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {record.catalogue_candidate ? "Candidate" : "Held"}
                    </span>
                  </div>

                  <div className="mt-3 min-w-0 border-t border-border pt-3">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#a94300] dark:text-[#ffad70]">
                      {record.course}
                    </p>
                    <h2 className="mt-1 line-clamp-2 font-display text-base font-extrabold leading-5">
                      {record.specialisation ?? "Base programme record"}
                    </h2>
                  </div>

                  <dl className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                    <div className="rounded-lg bg-secondary/65 p-2.5">
                      <dt className="font-bold text-muted-foreground">Evidence</dt>
                      <dd className="mt-1 line-clamp-2 font-extrabold">
                        {labelFromCode(record.evidence_status)}
                      </dd>
                    </div>
                    <div className="rounded-lg bg-secondary/65 p-2.5">
                      <dt className="font-bold text-muted-foreground">Research fee</dt>
                      <dd className="mt-1 truncate font-extrabold">
                        {formatResearchFee(record.full_course_fee_inr)}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-auto flex items-center justify-between gap-3 pt-3 text-[10px] font-bold text-muted-foreground">
                    <span>
                      {record.checked_on ? `Checked ${record.checked_on}` : "Review date missing"}
                    </span>
                    {sourceUrl ? (
                      <a
                        href={sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-9 items-center gap-1 text-[#2449ad] hover:underline dark:text-[#b9ceff]"
                      >
                        Source <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </CompactRail>

          <div className="mt-5 flex items-center justify-between gap-4 border-t border-border pt-4">
            <p className="text-xs font-semibold text-muted-foreground">
              Page {page + 1} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((current) => Math.max(0, current - 1))}
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((current) => current + 1)}
              >
                Next <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <QueueStatus
          icon={BookOpenCheck}
          title="No records match these filters"
          description="Try a broader university, course or specialisation term."
        />
      )}
    </div>
  );
}

function QueueStatus({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Database;
  title: string;
  description?: string;
}) {
  return (
    <div className="mt-6 rounded-xl border border-dashed border-border bg-card p-8 text-center">
      <Icon className="mx-auto h-7 w-7 text-muted-foreground" aria-hidden="true" />
      <h2 className="mt-3 font-display text-lg font-extrabold">{title}</h2>
      {description ? (
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
