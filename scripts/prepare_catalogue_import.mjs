#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { gzipSync } from "node:zlib";

const EXPECTED_DATASET_ID = "india-online-catalogue-consolidated-2026-09-13-v1";
const EXPECTED_COUNTS = {
  university_registry_count: 140,
  record_count: 1521,
  catalogue_candidate_count: 649,
  held_count: 851,
  certificate_count: 17,
  bundle_count: 4,
  university_ids_with_records: 139,
};

const sourcePath = resolve(process.argv[2] ?? "");
const outputPath = resolve(process.argv[3] ?? "data/catalogue-import-2026-09-13.json.gz");
const manifestPath = outputPath.replace(/\.json\.gz$/i, ".manifest.json");
const crosswalkPath = outputPath.replace(/\.json\.gz$/i, ".university-crosswalk.json");
const logoManifestPath = resolve("data/university-logo-manifest.json");

if (!process.argv[2]) {
  throw new Error(
    "Usage: node scripts/prepare_catalogue_import.mjs <catalogue_import.json> [output.json.gz]",
  );
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const raw = await readFile(sourcePath);
const payload = JSON.parse(raw.toString("utf8"));
const logoManifest = JSON.parse(await readFile(logoManifestPath, "utf8"));
const invariants = payload.acceptance_invariants ?? {};

assert(payload.schema_version === "1.0.0", "Unsupported catalogue schema version");
assert(payload.dataset_id === EXPECTED_DATASET_ID, "Unexpected catalogue dataset ID");
assert(Array.isArray(payload.universities), "Missing universities array");
assert(Array.isArray(payload.records), "Missing records array");
assert(Array.isArray(payload.sources), "Missing sources array");
assert(Array.isArray(payload.historical_fee_quotes), "Missing historical fee quotes array");
assert(Array.isArray(payload.field_dictionary), "Missing field dictionary");

for (const [field, expected] of Object.entries(EXPECTED_COUNTS)) {
  assert(invariants[field] === expected, `Invariant ${field} must equal ${expected}`);
}
assert(invariants.all_records_draft === true, "Import must be declared draft-only");

assert(
  payload.universities.length === EXPECTED_COUNTS.university_registry_count,
  "University count mismatch",
);
assert(payload.records.length === EXPECTED_COUNTS.record_count, "Course-record count mismatch");
assert(
  payload.sources.length === payload.statistics?.retained_source_references,
  "Source count mismatch",
);
assert(
  payload.historical_fee_quotes.length === payload.statistics?.historical_fee_quotes,
  "Historical fee-quote count mismatch",
);
const actualCounts = {
  university_registry_count: payload.universities.length,
  record_count: payload.records.length,
  catalogue_candidate_count: payload.records.filter((record) => record.catalogue_candidate).length,
  held_count: payload.records.filter((record) => record.import_bucket === "HELD_RESEARCH").length,
  certificate_count: payload.records.filter(
    (record) => record.import_bucket === "SEPARATE_CERTIFICATE",
  ).length,
  bundle_count: payload.records.filter(
    (record) => record.import_bucket === "SEPARATE_BUNDLE_PATHWAY",
  ).length,
  university_ids_with_records: new Set(payload.records.map((record) => record.university_id)).size,
};
for (const [field, expected] of Object.entries(EXPECTED_COUNTS)) {
  assert(actualCounts[field] === expected, `Actual ${field} must equal ${expected}`);
}
assert(
  payload.records.every(
    (record) =>
      record.publication_status === "draft" &&
      record.is_published === false &&
      record.current_intake_approval_status === "NOT_AUDITED_AT_PROGRAMME_SESSION_LEVEL" &&
      record.regulatory_session_clearance === "NOT_CERTIFIED_BY_THIS_EXPORT",
  ),
  "Every imported course record must remain fail-closed",
);
assert(
  payload.universities.every(
    (university) =>
      university.publication_status === "draft" &&
      university.is_published === false &&
      university.current_intake_approval_certified === false,
  ),
  "Every imported university record must remain fail-closed",
);
assert(
  payload.records.every(
    (record) => record.catalogue_candidate === (record.import_bucket === "CANDIDATE_REVIEW"),
  ),
  "Candidate flags and import buckets do not match",
);
assert(
  payload.records.every(
    (record) =>
      record.source_snapshot_id === payload.acceptance_invariants.authoritative_snapshot_id,
  ),
  "Authoritative source snapshot mismatch",
);
assert(
  new Set(payload.records.map((record) => record.course_row_id)).size === payload.records.length,
  "Duplicate course_row_id found",
);
assert(
  new Set(payload.records.map((record) => record.raw_source_row_sha256)).size ===
    payload.records.length &&
    payload.records.every((record) => /^[a-f0-9]{64}$/.test(record.raw_source_row_sha256)),
  "Course source-row checksums are missing or duplicated",
);
assert(
  new Set(payload.universities.map((university) => university.university_id)).size ===
    payload.universities.length,
  "Duplicate university_id found",
);
assert(
  new Set(payload.sources.map((source) => source.source_id)).size === payload.sources.length,
  "Duplicate source_id found",
);
assert(
  new Set(payload.historical_fee_quotes.map((quote) => quote.archived_quote_id)).size ===
    payload.historical_fee_quotes.length,
  "Duplicate archived_quote_id found",
);
const sourceIds = new Set(payload.sources.map((source) => source.source_id));
const recordById = new Map(payload.records.map((record) => [record.course_row_id, record]));
const sourceById = new Map(payload.sources.map((source) => [source.source_id, source]));
assert(
  payload.sources.every(
    (source) =>
      source.freshly_fetched_in_this_merge === false &&
      source.source_status === "RETAINED_SOURCE_REFERENCE_NOT_REVERIFIED_BY_MERGE" &&
      Array.isArray(source.course_row_ids) &&
      new Set(source.course_row_ids).size === source.course_row_ids.length &&
      source.course_row_ids.every((rowId) =>
        recordById.get(rowId)?.source_ids?.includes(source.source_id),
      ),
  ),
  "Retained source metadata or reverse links are invalid",
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
  "Course-to-source links are invalid",
);
assert(
  payload.historical_fee_quotes.every(
    (quote) =>
      quote.usage === "PROVENANCE_ONLY_DO_NOT_AUTOFILL_OR_OVERRIDE_MASTER_FEES" &&
      sourceIds.has(quote.source_id),
  ),
  "Historical fee quote provenance is incomplete",
);
assert(
  Object.keys(invariants.manipal_catalogue_counts ?? {})
    .sort()
    .join(",") === "MAHE,MUJ,SMU" &&
    Object.entries(invariants.manipal_catalogue_counts).every(
      ([universityCode, expectedCount]) =>
        payload.records.filter(
          (record) =>
            record.import_bucket === "CANDIDATE_REVIEW" &&
            record.university_code === universityCode,
        ).length === expectedCount,
    ),
  "Manipal catalogue-count invariant mismatch",
);
const universityIds = new Set(payload.universities.map((university) => university.university_id));
assert(
  universityIds.has(invariants.amity_online_id) &&
    universityIds.has(invariants.amity_rajasthan_id) &&
    invariants.amity_online_id !== invariants.amity_rajasthan_id,
  "Amity identity invariants are incomplete",
);

assert(Array.isArray(logoManifest), "University logo manifest must be an array");
assert(
  logoManifest.length === payload.universities.length,
  "University logo manifest count mismatch",
);
assert(
  new Set(logoManifest.map((entry) => String(entry.serial_no))).size === logoManifest.length,
  "University logo manifest contains duplicate serials",
);
const logoBySerial = new Map(logoManifest.map((entry) => [String(entry.serial_no), entry]));
const crosswalk = payload.universities.map((university) => {
  const sourceSerial = String(university.source_university_serial ?? "");
  const match = logoBySerial.get(sourceSerial);
  assert(match?.slug, `No reviewed canonical slug for university serial ${sourceSerial}`);
  return {
    source_university_serial: sourceSerial,
    source_university_id: university.university_id,
    source_display_name: university.university_display_name,
    canonical_slug: match.slug,
    canonical_display_name: match.university_name,
    mapping_basis: "reviewed directory serial and institution identity",
  };
});
assert(
  new Set(crosswalk.map((entry) => entry.canonical_slug)).size === payload.universities.length,
  "Canonical university mapping is not one-to-one",
);

const compressed = gzipSync(raw, { level: 9, mtime: 0 });
const crosswalkContents = Buffer.from(`${JSON.stringify(crosswalk, null, 2)}\n`, "utf8");
const manifest = {
  schema_version: payload.schema_version,
  dataset_id: payload.dataset_id,
  merged_on: payload.merged_on,
  source_file_sha256: sha256(raw),
  compressed_file_sha256: sha256(compressed),
  university_crosswalk_sha256: sha256(crosswalkContents),
  source_bytes: raw.byteLength,
  compressed_bytes: compressed.byteLength,
  university_crosswalk_bytes: crosswalkContents.byteLength,
  counts: {
    universities: payload.universities.length,
    records: payload.records.length,
    sources: payload.sources.length,
    historical_fee_quotes: payload.historical_fee_quotes.length,
    catalogue_candidates: payload.records.filter((record) => record.catalogue_candidate).length,
    source_links: payload.records.reduce((count, record) => count + record.source_ids.length, 0),
    university_crosswalk: crosswalk.length,
  },
  publication_default: payload.publication_default,
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, compressed);
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(crosswalkPath, crosswalkContents);

console.log(JSON.stringify({ outputPath, manifestPath, crosswalkPath, ...manifest }, null, 2));
