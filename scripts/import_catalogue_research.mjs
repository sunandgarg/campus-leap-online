#!/usr/bin/env node

import { createHash, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { gunzipSync } from "node:zlib";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_INPUT = "data/catalogue-import-2026-09-13.json.gz";
function argumentValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const inputArgument = process.argv.find(
  (argument, index) =>
    !argument.startsWith("--") &&
    process.argv[index - 1] !== "--key-file" &&
    process.argv[index - 1] !== "--url" &&
    (argument.endsWith(".json") || argument.endsWith(".json.gz")),
);
const inputPath = resolve(inputArgument ?? DEFAULT_INPUT);
const validateOnly = process.argv.includes("--validate-only");
const directSourceJson = extname(inputPath) === ".json";
const importManifestPath = directSourceJson
  ? resolve("data/catalogue-import-2026-09-13.manifest.json")
  : inputPath.replace(/\.json\.gz$/i, ".manifest.json");
const crosswalkPath = directSourceJson
  ? resolve("data/catalogue-import-2026-09-13.university-crosswalk.json")
  : inputPath.replace(/\.json\.gz$/i, ".university-crosswalk.json");
const supabaseUrl = argumentValue("--url") ?? process.env.SUPABASE_URL;
const serviceRoleKeyFile = argumentValue("--key-file");
const serviceRoleKey = serviceRoleKeyFile
  ? (await readFile(resolve(serviceRoleKeyFile), "utf8")).trim()
  : process.env.SUPABASE_SERVICE_ROLE_KEY;

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function nullableText(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function nullablePositiveMoney(value, field, rowId) {
  if (value === null || value === undefined || value === "") return null;
  const text = String(value);
  if (!/^\d+(?:\.\d{1,2})?$/.test(text) || Number(text) <= 0) {
    throw new Error(`${field} is invalid for ${rowId}`);
  }
  return text;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function insertChunks(client, table, rows, size = 100) {
  for (let start = 0; start < rows.length; start += size) {
    const chunk = rows.slice(start, start + size);
    const { error } = await client.from(table).insert(chunk);
    if (error)
      throw new Error(`${table} rows ${start + 1}-${start + chunk.length}: ${error.message}`);
  }
}

const stored = await readFile(inputPath);
const raw = extname(inputPath) === ".gz" ? gunzipSync(stored) : stored;
const payload = JSON.parse(raw.toString("utf8"));
const sourceFileSha256 = sha256(raw);
const importManifest = JSON.parse(await readFile(importManifestPath, "utf8"));
const crosswalkContents = await readFile(crosswalkPath);
const crosswalk = JSON.parse(crosswalkContents.toString("utf8"));
const mappingByUniversityId = new Map(
  crosswalk.map((entry) => [entry.source_university_id, entry]),
);

assert(payload.schema_version === "1.0.0", "Unsupported catalogue schema version");
assert(
  payload.dataset_id === "india-online-catalogue-consolidated-2026-09-13-v1",
  "Unexpected dataset ID",
);
assert(
  importManifest.schema_version === payload.schema_version &&
    importManifest.dataset_id === payload.dataset_id &&
    importManifest.merged_on === payload.merged_on &&
    importManifest.source_bytes === raw.byteLength,
  "Import manifest metadata mismatch",
);
assert(
  payload.acceptance_invariants?.all_records_draft === true,
  "Import is not declared draft-only",
);
assert(
  payload.universities.length === payload.acceptance_invariants.university_registry_count,
  "University count mismatch",
);
assert(
  payload.records.length === payload.acceptance_invariants.record_count,
  "Course-record count mismatch",
);
assert(importManifest.source_file_sha256 === sourceFileSha256, "Source-file checksum mismatch");
assert(
  importManifest.university_crosswalk_sha256 === sha256(crosswalkContents),
  "University-crosswalk checksum mismatch",
);
if (extname(inputPath) === ".gz") {
  assert(
    importManifest.compressed_file_sha256 === sha256(stored) &&
      importManifest.compressed_bytes === stored.byteLength,
    "Compressed-file checksum mismatch",
  );
}
assert(
  importManifest.university_crosswalk_bytes === crosswalkContents.byteLength,
  "University-crosswalk byte count mismatch",
);
assert(
  crosswalk.length === payload.universities.length &&
    mappingByUniversityId.size === payload.universities.length,
  "University crosswalk count mismatch",
);
assert(
  new Set(crosswalk.map((entry) => entry.canonical_slug)).size === payload.universities.length,
  "University crosswalk is not one-to-one",
);
assert(
  payload.universities.every((university) => {
    const mapping = mappingByUniversityId.get(university.university_id);
    return (
      mapping?.source_university_serial === String(university.source_university_serial) &&
      mapping?.source_display_name === university.university_display_name &&
      typeof mapping?.canonical_slug === "string" &&
      mapping.canonical_slug.length > 0
    );
  }),
  "A university does not match the reviewed crosswalk",
);
assert(
  payload.records.every(
    (record) =>
      record.publication_status === "draft" &&
      record.is_published === false &&
      record.current_intake_approval_status === "NOT_AUDITED_AT_PROGRAMME_SESSION_LEVEL" &&
      record.regulatory_session_clearance === "NOT_CERTIFIED_BY_THIS_EXPORT",
  ),
  "Import contains a course record that is not fail-closed",
);
assert(
  payload.universities.every(
    (university) =>
      university.publication_status === "draft" &&
      university.is_published === false &&
      university.current_intake_approval_certified === false,
  ),
  "Import contains a university record that is not fail-closed",
);

const recordById = new Map(payload.records.map((record) => [record.course_row_id, record]));
const sourceById = new Map(payload.sources.map((source) => [source.source_id, source]));
const universityById = new Map(
  payload.universities.map((university) => [university.university_id, university]),
);
const archivedQuoteIds = new Set(
  payload.historical_fee_quotes.map((quote) => quote.archived_quote_id),
);
assert(recordById.size === payload.records.length, "Duplicate course_row_id found");
assert(sourceById.size === payload.sources.length, "Duplicate source_id found");
assert(universityById.size === payload.universities.length, "Duplicate university_id found");
assert(
  archivedQuoteIds.size === payload.historical_fee_quotes.length,
  "Duplicate archived_quote_id found",
);
assert(
  new Set(payload.records.map((record) => record.raw_source_row_sha256)).size ===
    payload.records.length &&
    payload.records.every((record) => /^[a-f0-9]{64}$/.test(record.raw_source_row_sha256)),
  "Course source-row checksums are missing or duplicated",
);
assert(
  payload.records.every(
    (record) =>
      universityById.has(record.university_id) &&
      record.catalogue_candidate === (record.import_bucket === "CANDIDATE_REVIEW") &&
      record.source_snapshot_id === payload.acceptance_invariants.authoritative_snapshot_id,
  ),
  "Course identity, bucket or source-snapshot invariant mismatch",
);
assert(
  payload.records.every((record) => {
    const mapping = mappingByUniversityId.get(record.university_id);
    return mapping?.source_university_serial === String(record.university_serial);
  }),
  "A course record does not match the reviewed university crosswalk",
);
assert(
  payload.records.every(
    (record) =>
      Array.isArray(record.source_ids) &&
      new Set(record.source_ids).size === record.source_ids.length &&
      record.source_ids.every((sourceId) =>
        sourceById.get(sourceId)?.course_row_ids?.includes(record.course_row_id),
      ),
  ),
  "Course-to-source references are incomplete or not bidirectional",
);
assert(
  payload.sources.every(
    (source) =>
      Array.isArray(source.course_row_ids) &&
      new Set(source.course_row_ids).size === source.course_row_ids.length &&
      source.course_row_ids.every((rowId) =>
        recordById.get(rowId)?.source_ids?.includes(source.source_id),
      ),
  ),
  "Source-to-course references are incomplete or not bidirectional",
);
assert(
  payload.sources.every(
    (source) =>
      source.freshly_fetched_in_this_merge === false &&
      source.source_status === "RETAINED_SOURCE_REFERENCE_NOT_REVERIFIED_BY_MERGE",
  ),
  "A retained source was incorrectly represented as freshly verified",
);
assert(
  payload.historical_fee_quotes.every(
    (quote) =>
      quote.usage === "PROVENANCE_ONLY_DO_NOT_AUTOFILL_OR_OVERRIDE_MASTER_FEES" &&
      sourceById.has(quote.source_id),
  ),
  "Historical fee quote provenance is incomplete",
);

const actualCounts = {
  universities: payload.universities.length,
  records: payload.records.length,
  sources: payload.sources.length,
  historical_fee_quotes: payload.historical_fee_quotes.length,
  catalogue_candidates: payload.records.filter((record) => record.catalogue_candidate).length,
  held: payload.records.filter((record) => record.import_bucket === "HELD_RESEARCH").length,
  certificates: payload.records.filter((record) => record.import_bucket === "SEPARATE_CERTIFICATE")
    .length,
  bundles: payload.records.filter((record) => record.import_bucket === "SEPARATE_BUNDLE_PATHWAY")
    .length,
  source_links: payload.records.reduce((count, record) => count + record.source_ids.length, 0),
  university_crosswalk: crosswalk.length,
  university_ids_with_records: new Set(payload.records.map((record) => record.university_id)).size,
};
assert(
  actualCounts.catalogue_candidates === payload.acceptance_invariants.catalogue_candidate_count &&
    actualCounts.held === payload.acceptance_invariants.held_count &&
    actualCounts.certificates === payload.acceptance_invariants.certificate_count &&
    actualCounts.bundles === payload.acceptance_invariants.bundle_count &&
    actualCounts.university_ids_with_records ===
      payload.acceptance_invariants.university_ids_with_records,
  "Acceptance-invariant counts do not match the payload",
);
for (const field of [
  "universities",
  "records",
  "sources",
  "historical_fee_quotes",
  "catalogue_candidates",
  "source_links",
  "university_crosswalk",
]) {
  assert(importManifest.counts?.[field] === actualCounts[field], `Manifest ${field} mismatch`);
}
assert(
  Object.keys(payload.acceptance_invariants.manipal_catalogue_counts ?? {})
    .sort()
    .join(",") === "MAHE,MUJ,SMU" &&
    Object.entries(payload.acceptance_invariants.manipal_catalogue_counts).every(
      ([universityCode, expectedCount]) =>
        payload.records.filter(
          (record) =>
            record.import_bucket === "CANDIDATE_REVIEW" &&
            record.university_code === universityCode,
        ).length === expectedCount,
    ),
  "Manipal catalogue-count invariant mismatch",
);
assert(
  universityById.has(payload.acceptance_invariants.amity_online_id) &&
    universityById.has(payload.acceptance_invariants.amity_rajasthan_id) &&
    payload.acceptance_invariants.amity_online_id !==
      payload.acceptance_invariants.amity_rajasthan_id,
  "Amity identity invariants are incomplete",
);

const validationResult = {
  status: "validated",
  dataset_id: payload.dataset_id,
  source_file_sha256: sourceFileSha256,
  universities: payload.universities.length,
  records: payload.records.length,
  candidates: payload.records.filter((record) => record.catalogue_candidate).length,
  sources: payload.sources.length,
  source_links: payload.records.reduce((count, record) => count + record.source_ids.length, 0),
  historical_fee_quotes: payload.historical_fee_quotes.length,
  automatically_published: payload.records.filter((record) => record.is_published).length,
};

if (validateOnly) {
  console.log(JSON.stringify(validationResult, null, 2));
  process.exit(0);
}

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "SUPABASE_URL plus SUPABASE_SERVICE_ROLE_KEY or --key-file are required after validation",
  );
}
if (!/^https:\/\/[a-z0-9]+\.supabase\.co\/?$/i.test(supabaseUrl)) {
  throw new Error("SUPABASE_URL must be a hosted Supabase project URL");
}

const client = createClient(supabaseUrl.replace(/\/$/, ""), serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: existingBatch, error: existingError } = await client
  .from("catalogue_import_batches")
  .select("import_id, dataset_id, import_status, source_file_sha256, ready_at")
  .eq("dataset_id", payload.dataset_id)
  .eq("import_status", "ready")
  .order("ready_at", { ascending: false })
  .limit(1)
  .maybeSingle();
if (existingError) throw new Error(`Could not inspect existing import: ${existingError.message}`);

if (existingBatch) {
  if (existingBatch.source_file_sha256 !== sourceFileSha256) {
    throw new Error(
      `Dataset ${payload.dataset_id} is already ready with a different checksum; publish a new dataset ID instead of replacing it`,
    );
  }
  console.log(
    JSON.stringify(
      { ...validationResult, status: "already_ready", import_id: existingBatch.import_id },
      null,
      2,
    ),
  );
  process.exit(0);
}

const importId = randomUUID();
const batch = {
  import_id: importId,
  dataset_id: payload.dataset_id,
  schema_version: payload.schema_version,
  merged_on: payload.merged_on,
  source_file_sha256: sourceFileSha256,
  import_status: "staging",
  scope: payload.scope,
  source_precedence: payload.source_precedence,
  money_encoding: payload.money_encoding,
  publication_default: payload.publication_default,
  statistics: payload.statistics,
  field_dictionary: payload.field_dictionary,
  acceptance_invariants: payload.acceptance_invariants,
  failure_reason: null,
  ready_at: null,
};
const { error: batchError } = await client.from("catalogue_import_batches").insert(batch);
if (batchError) throw new Error(`Could not create import batch: ${batchError.message}`);

try {
  const universities = payload.universities.map((university) => ({
    import_id: importId,
    university_id: university.university_id,
    canonical_slug: mappingByUniversityId.get(university.university_id).canonical_slug,
    university_display_name: university.university_display_name,
    legal_university_name: nullableText(university.legal_university_name),
    state_ut: nullableText(university.state_ut),
    registry_status: nullableText(university.registry_status),
    publication_status: university.publication_status,
    is_published: university.is_published,
    current_intake_approval_certified: university.current_intake_approval_certified,
    source_url: nullableText(university.source_url),
    source_reference_period: nullableText(university.source_reference_period),
    identity_rechecked_on: nullableText(university.identity_rechecked_on),
    raw_record: university,
  }));
  await insertChunks(client, "catalogue_research_universities", universities);

  const records = payload.records.map((record) => ({
    import_id: importId,
    course_row_id: record.course_row_id,
    university_id: record.university_id,
    canonical_university_slug: mappingByUniversityId.get(record.university_id).canonical_slug,
    university_display_name: record.university_display_name,
    legal_university_name: nullableText(record.legal_university_name),
    state_ut: nullableText(record.state_ut),
    course: record.course,
    specialisation: nullableText(record.specialisation),
    collaboration_partner: nullableText(record.collaboration_partner),
    import_bucket: record.import_bucket,
    record_kind: nullableText(record.record_kind),
    course_level: nullableText(record.course_level),
    publication_status: record.publication_status,
    is_published: record.is_published,
    catalogue_candidate: record.catalogue_candidate,
    online_mode_evidence_status: nullableText(record.online_mode_evidence_status),
    current_intake_approval_status: nullableText(record.current_intake_approval_status),
    regulatory_session_clearance: nullableText(record.regulatory_session_clearance),
    audit_disposition: nullableText(record.audit_disposition),
    audit_reason: nullableText(record.audit_reason),
    publication_ready: nullableText(record.publication_ready),
    evidence_status: nullableText(record.evidence_status),
    evidence_type: nullableText(record.evidence_type),
    reference_session: nullableText(record.reference_session),
    checked_on: nullableText(record.checked_on),
    catalogue_evidence_url: nullableText(record.catalogue_evidence_url),
    programme_source_url_current: nullableText(record.programme_source_url_current),
    fee_source_url: nullableText(record.fee_source_url),
    fee_checked_on: nullableText(record.fee_checked_on),
    per_semester_fee_inr: nullablePositiveMoney(
      record.per_semester_fee_inr,
      "per_semester_fee_inr",
      record.course_row_id,
    ),
    per_year_fee_inr: nullablePositiveMoney(
      record.per_year_fee_inr,
      "per_year_fee_inr",
      record.course_row_id,
    ),
    full_course_fee_inr: nullablePositiveMoney(
      record.full_course_fee_inr,
      "full_course_fee_inr",
      record.course_row_id,
    ),
    fee_evidence_status: nullableText(record.fee_evidence_status),
    fee_display_note: nullableText(record.fee_display_note),
    quality_flags: Array.isArray(record.quality_flags) ? record.quality_flags : [],
    source_ids: Array.isArray(record.source_ids) ? record.source_ids : [],
    selected_fee_quote_id: nullableText(record.selected_fee_quote_id),
    parent_programme_id: nullableText(record.parent_programme_id),
    parent_programme_title: nullableText(record.parent_programme_title),
    track_name: nullableText(record.track_name),
    raw_source_row_sha256: record.raw_source_row_sha256,
    raw_record: record,
  }));
  await insertChunks(client, "catalogue_research_records", records, 75);

  const sources = payload.sources.map((source) => ({
    import_id: importId,
    source_id: source.source_id,
    url: source.url,
    roles: source.roles ?? [],
    course_row_ids: source.course_row_ids ?? [],
    recorded_checked_on_dates: source.recorded_checked_on_dates ?? [],
    freshly_fetched_in_this_merge: source.freshly_fetched_in_this_merge === true,
    source_status: source.source_status,
    raw_record: source,
  }));
  await insertChunks(client, "catalogue_research_sources", sources);

  const recordSources = payload.records.flatMap((record) =>
    record.source_ids.map((sourceId) => ({
      import_id: importId,
      course_row_id: record.course_row_id,
      source_id: sourceId,
    })),
  );
  await insertChunks(client, "catalogue_research_record_sources", recordSources);

  const feeQuotes = payload.historical_fee_quotes.map((quote) => ({
    import_id: importId,
    archived_quote_id: quote.archived_quote_id,
    source_quote_id: nullableText(quote.source_quote_id),
    source_snapshot: nullableText(quote.source_snapshot),
    source_id: quote.source_id,
    usage: quote.usage,
    raw_record: quote,
  }));
  await insertChunks(client, "catalogue_research_fee_quotes", feeQuotes);

  const { data, error } = await client.rpc("finalize_catalogue_research_import", {
    p_import_id: importId,
    p_source_file_sha256: sourceFileSha256,
  });
  if (error) throw new Error(`Could not finalize import: ${error.message}`);
  console.log(JSON.stringify(data, null, 2));
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown catalogue import error";
  const { error: failureError } = await client.rpc("fail_catalogue_research_import", {
    p_import_id: importId,
    p_failure_reason: message,
  });
  if (failureError) {
    console.error(`Could not mark catalogue import failed: ${failureError.message}`);
  }
  throw error;
}
