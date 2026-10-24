#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { extname, join, resolve } from "node:path";
import { gunzipSync } from "node:zlib";

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
const databaseName = argumentValue("--database") ?? "dekhocampus-online";
const wranglerProfile = argumentValue("--profile") ?? "chetan-deploy";

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

function sql(value) {
  if (value === null || value === undefined || value === "") return "NULL";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "NULL";
  if (typeof value === "boolean") return value ? "1" : "0";
  return `'${String(value).replaceAll("'", "''")}'`;
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

const importId = sourceFileSha256.slice(0, 32);
const readyAt = new Date().toISOString();
const statements = [
  `INSERT OR IGNORE INTO catalogue_import_batches (
    import_id,dataset_id,merged_on,source_file_sha256,import_status,statistics,
    acceptance_invariants,ready_at
  ) VALUES (${sql(importId)},${sql(payload.dataset_id)},${sql(payload.merged_on)},${sql(sourceFileSha256)},'ready',${sql(JSON.stringify(payload.statistics ?? {}))},${sql(JSON.stringify(payload.acceptance_invariants ?? {}))},${sql(readyAt)});`,
];

for (const record of payload.records) {
  const mapping = mappingByUniversityId.get(record.university_id);
  statements.push(
    `INSERT OR IGNORE INTO catalogue_research_records (
      import_id,course_row_id,canonical_university_slug,university_display_name,state_ut,
      course,specialisation,import_bucket,catalogue_candidate,reference_session,checked_on,
      evidence_status,publication_ready,catalogue_evidence_url,programme_source_url_current,
      fee_source_url,full_course_fee_inr,fee_evidence_status,raw_record
    ) VALUES (${[
      importId,
      record.course_row_id,
      mapping.canonical_slug,
      record.university_display_name,
      nullableText(record.state_ut),
      record.course,
      nullableText(record.specialisation),
      record.import_bucket,
      record.catalogue_candidate,
      nullableText(record.reference_session),
      nullableText(record.checked_on),
      nullableText(record.evidence_status),
      nullableText(record.publication_ready),
      nullableText(record.catalogue_evidence_url),
      nullableText(record.programme_source_url_current),
      nullableText(record.fee_source_url),
      nullablePositiveMoney(
        record.full_course_fee_inr,
        "full_course_fee_inr",
        record.course_row_id,
      ),
      nullableText(record.fee_evidence_status),
      {},
    ]
      .map((value) => sql(typeof value === "object" ? JSON.stringify(value) : value))
      .join(",")});`,
  );
}

const sqlDirectory = await mkdtemp(join(tmpdir(), "dekhocampus-d1-import-"));
const sqlFile = join(sqlDirectory, "catalogue-research.sql");
try {
  await writeFile(sqlFile, statements.join("\n"));
  execFileSync(
    "npx",
    [
      "wrangler",
      "d1",
      "execute",
      databaseName,
      "--remote",
      "--yes",
      "--profile",
      wranglerProfile,
      "--file",
      sqlFile,
    ],
    { stdio: "inherit" },
  );
} finally {
  await rm(sqlDirectory, { recursive: true, force: true });
}

console.log(
  JSON.stringify({ ...validationResult, status: "imported_to_d1", import_id: importId }, null, 2),
);
