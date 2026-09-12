# Online university directory data

This directory records the provenance of the 140-university discovery import
prepared on 12 September 2026 from the supplied CSV and README.

## Safety boundary

- A university row is an institution-level directory record, not proof that a
  specific programme or the latest intake is currently entitled, open, or
  correctly priced.
- The import does not create programme offerings, fees, ratings, rankings, or
  approval badges.
- Programme-level claims must be added separately with current primary-source
  evidence and review dates.
- The public UI excludes directory records from sourced comparisons and makes
  the verification limitation visible.

## Logo delivery

`university-logo-manifest.json` records the reviewed source and output metadata
for every logo. Assets are stored in the public Supabase bucket
`university-logos` under the versioned `v1/` prefix. Raster files are optimized
to a maximum 1080×1080 canvas; vector originals remain SVG. Uploads use a
31,536,000-second browser cache lifetime, so future replacements must use a new
version prefix rather than overwriting a cached public URL.

## Rebuilding

The scripts under `scripts/` resolve, review, optimize, generate, and upload the
directory. The uploader reads its privileged key from a temporary file supplied
with `--key-file`; credentials must never be committed.

The generated database migration is:

`supabase/migrations/20260912230000_university_directory_import.sql`
