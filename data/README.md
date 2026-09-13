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

## Course research handoff

The 13 September 2026 course handoff is stored as the deterministic compressed
artifact `catalogue-import-2026-09-13.json.gz`. Its manifest records both the
uncompressed source checksum and compressed artifact checksum. The two supplied
CSV files are byte-identical exports of that JSON and are intentionally not
duplicated in the repository.

The handoff contains 140 university records, 1,521 course research rows, 392
retained source references and 433 historical fee quotes. Every row is marked
draft, unpublished and not certified for the current programme/session. The
data therefore enters private `catalogue_research_*` tables only. It never
updates public universities, programme offerings, fees, specialisations or
claim evidence automatically.

`catalogue-import-2026-09-13.university-crosswalk.json` is the explicit reviewed
mapping from the handoff's university identities to the site's canonical 140
slugs. It avoids fuzzy or abbreviation-only matching during import.

Validate the committed artifact without credentials:

```sh
npm run catalogue:validate
```

After applying `20260914013000_catalogue_research_queue.sql`, stage it with a
server-only service-role credential:

```sh
SUPABASE_URL=https://PROJECT.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=... \
npm run catalogue:import
```

For a short-lived credential file (preferred over shell history), use:

```sh
npm run catalogue:import -- \
  --url https://PROJECT.supabase.co \
  --key-file /absolute/path/to/temporary-secret
```

Each attempt receives an immutable import ID. Chunk uploads remain invisible
to the admin review screen until the final database function atomically checks
the package counts, checksums and fail-closed publication fields and marks that
run ready. A failed attempt is retained for diagnosis; an already-ready package
is idempotent and is never destructively replaced.
