#!/usr/bin/env python3
"""Generate the audited directory fallback, logo manifest and SQL import."""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
from pathlib import Path


PROJECT_URL = "https://tzhjdxewkwjftuofaelk.supabase.co"
BUCKET = "university-logos"
ASSET_VERSION = "v1"

# Existing public URLs are preserved for backwards compatibility and SEO.
CANONICAL_SLUGS = {
    "adichunchanagiri-university-karnataka": "adichunchanagiri-university-online",
    "alliance-university-karnataka": "alliance-university-online",
    "amity-university-uttar-pradesh-uttar-pradesh": "amity-university-online",
    "andhra-university-andhra-pradesh": "andhra-university-online",
    "assam-down-town-university-assam": "assam-down-town-university-online",
    "bangalore-university-karnataka": "bangalore-university-online",
    "birla-institute-of-technology-jharkhand": "bit-mesra-online",
    "central-university-of-himachal-pradesh-himachal-pradesh": "central-university-himachal-online",
    "chandigarh-university-punjab": "chandigarh-university-online",
    "charotar-university-of-science-and-technology-gujarat": "charusat-online",
    "christ-deemed-to-be-university-karnataka": "christ-university-online",
    "dayananda-sagar-university-karnataka": "dayananda-sagar-university-online",
    "devi-ahilya-vishwavidyalaya-madhya-pradesh": "devi-ahilya-vishwavidyalaya-online",
    "dr-babasaheb-ambedkar-open-university-gujarat": "baou-online",
    "dr-d-y-patil-vidyapeeth-pune-maharashtra": "dy-patil-university-online",
    "gls-university-gujarat": "gls-university-online",
    "gujarat-technological-university-gujarat": "gujarat-technological-university-online",
    "gujarat-university-gujarat": "gujarat-university-online",
    "guru-ghasidas-vishwavidyalaya-chhattisgarh": "guru-ghasidas-vishwavidyalaya-online",
    "guru-gobind-singh-indraprastha-university-delhi": "ggsipu-online",
    "guru-jambheshwar-university-of-science-and-technology-haryana": "gjust-online",
    "indian-institute-of-foreign-trade-delhi": "iift-online",
    "jain-deemed-to-be-university-karnataka": "jain-university-online",
    "jamia-hamdard-delhi": "jamia-hamdard-online",
    "jamia-millia-islamia-delhi": "jamia-millia-islamia-online",
    "karnataka-state-open-university-karnataka": "karnataka-state-open-university-online",
    "koneru-lakshmaiah-education-foundation-andhra-pradesh": "kl-university-online",
    "kurukshetra-university-haryana": "kurukshetra-university-online",
    "lovely-professional-university-punjab": "lpu-online",
    "maharishi-markandeshwar-deemed-to-be-university-haryana": "maharishi-markandeshwar-online",
    "maharshi-dayanand-university-haryana": "maharshi-dayanand-university-online",
    "mahatma-gandhi-university-kerala": "mahatma-gandhi-university-online",
    "manav-rachna-international-institute-of-research-and-studies-haryana": "manav-rachna-online",
    "manipal-university-jaipur-rajasthan": "manipal-university-online",
    "marwadi-university-gujarat": "marwadi-university-online",
    "mats-university-chhattisgarh": "mats-university-online",
    "mohan-babu-university-andhra-pradesh": "mohan-babu-university-online",
    "p-p-savani-university-gujarat": "pp-savani-university-online",
    "parul-university-gujarat": "parul-university-online",
    "sage-university-madhya-pradesh": "sage-university-online",
    "shoolini-university-of-biotechnology-and-management-sciences-himachal-pradesh": "shoolini-university-online",
    "shree-guru-gobind-singh-tricentenary-university-haryana": "sgt-university-online",
    "sikkim-manipal-university-sikkim": "sikkim-manipal-university-online",
    "university-of-jammu-jammu-and-kashmir": "university-of-jammu-online",
    "university-of-kerala-kerala": "university-of-kerala-online",
    "university-of-mysore-karnataka": "university-of-mysore-online",
    "uttaranchal-university-uttarakhand": "uttaranchal-university-online",
    "vignan-s-foundation-for-science-technology-and-research-andhra-pradesh": "vignan-university-online",
    "visvesvaraya-technological-university-karnataka": "vtu-online",
    "yenepoya-deemed-to-be-university-karnataka": "yenepoya-university-online",
}

EDITORIAL_SLUGS = {
    "amity-university-online",
    "chandigarh-university-online",
    "dy-patil-university-online",
    "jain-university-online",
    "lpu-online",
    "manipal-university-online",
    "shoolini-university-online",
    "sikkim-manipal-university-online",
    "uttaranchal-university-online",
    "vignan-university-online",
}


def sql(value: object) -> str:
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "TRUE" if value else "FALSE"
    if isinstance(value, (int, float)):
        return str(value)
    return "'" + str(value).replace("'", "''") + "'"


def ts(value: object) -> str:
    return json.dumps(value, ensure_ascii=False)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("csv_path", type=Path)
    parser.add_argument("logo_manifest", type=Path)
    parser.add_argument("repo_manifest", type=Path)
    parser.add_argument("directory_ts", type=Path)
    parser.add_argument("migration_sql", type=Path)
    args = parser.parse_args()

    with args.csv_path.open(encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))
    logos = {
        item["university_id"]: item for item in json.loads(args.logo_manifest.read_text())
    }
    if len(rows) != 140 or len(logos) != 140:
        raise SystemExit("Expected exactly 140 CSV and manifest records")

    prepared = []
    for row in rows:
        source_id = row["university_id"]
        slug = CANONICAL_SLUGS.get(source_id, source_id)
        logo = logos[source_id]
        extension = Path(logo.get("storage_file", "")).suffix.lower()
        storage_path = f"{ASSET_VERSION}/{slug}{extension}" if extension else None
        logo_url = (
            f"{PROJECT_URL}/storage/v1/object/public/{BUCKET}/{storage_path}"
            if storage_path
            else None
        )
        checked = dt.date.fromisoformat(row["checked_on"])
        review = checked + dt.timedelta(days=30)
        alias = next(
            (value.strip() for value in row["also_known_as"].split(";") if value.strip()),
            row["university_name"],
        )
        prepared.append(
            {
                **row,
                "slug": slug,
                "short_name": alias,
                "logo_url": logo_url,
                "logo": logo,
                "storage_path": storage_path,
                "verified_at": f"{checked.isoformat()}T12:00:00+05:30",
                "next_review_at": f"{review.isoformat()}T23:59:59+05:30",
            }
        )

    if len({item["slug"] for item in prepared}) != 140:
        raise SystemExit("Canonical slug mapping produced duplicates")

    manifest = []
    for item in prepared:
        manifest.append(
            {
                "serial_no": int(item["serial_no"]),
                "slug": item["slug"],
                "university_name": item["university_name"],
                "status": item["logo"]["status"],
                "local_file": item["logo"].get("storage_file"),
                "storage_path": item["storage_path"],
                "public_url": item["logo_url"],
                "source_url": item["logo"].get("source_url"),
                "source_page": item["logo"].get("source_page"),
                "source_method": item["logo"].get("source_method"),
                "source_entity_id": item["logo"].get("source_entity_id"),
                "source_entity_label": item["logo"].get("source_entity_label"),
                "match_score": item["logo"].get("match_score"),
                "content_type": item["logo"].get("content_type"),
                "width": item["logo"].get("width"),
                "height": item["logo"].get("height"),
                "size_bytes": item["logo"].get("size_bytes"),
                "sha256": item["logo"].get("sha256"),
                "license": item["logo"].get("license"),
                "license_url": item["logo"].get("license_url"),
                "artist": item["logo"].get("artist"),
                "credit": item["logo"].get("credit"),
            }
        )
    args.repo_manifest.parent.mkdir(parents=True, exist_ok=True)
    args.repo_manifest.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")

    directory = [item for item in prepared if item["slug"] not in EDITORIAL_SLUGS]
    ts_lines = [
        'import type { University } from "@/data/universities";',
        "",
        "interface DirectoryUniversityInput {",
        "  slug: string;",
        "  name: string;",
        "  shortName: string;",
        "  state: string;",
        "  universityType: string;",
        "  evidenceCategory: string;",
        "  referencePeriod: string;",
        "  sourceUrl: string;",
        "  checkedOn: string;",
        "  nextReviewAt: string;",
        "  logoUrl?: string;",
        "}",
        "",
        "function createDirectoryUniversity(input: DirectoryUniversityInput): University {",
        "  return {",
        "    slug: input.slug,",
        "    name: input.name,",
        "    shortName: input.shortName,",
        '    city: "",',
        "    state: input.state,",
        "    established: 0,",
        '    domain: "",',
        '    accentColor: "#325DD2",',
        '    naacGrade: "",',
        "    approvals: [],",
        "    rating: 0,",
        "    reviews: 0,",
        '    studentsEnrolled: "Not independently verified",',
        "    placementPartners: [],",
        "    highlights: [",
        "      `University type: ${input.universityType}`,",
        "      input.evidenceCategory,",
        "      `Reference period: ${input.referencePeriod}`,",
        '      "Programme and intake-specific verification required",',
        "    ],",
        "    about: `${input.name} is included in the DekhoCampus researched directory of Indian universities with evidence of online degree provision. This directory record covers ${input.referencePeriod}; it does not confirm that every programme or the latest intake is currently approved or open. Verify the exact programme, online mode, academic session and official application route before applying or paying.`,",
        "    programs: [],",
        '    profileDepth: "directory",',
        "    verificationAcademicYear: input.referencePeriod,",
        "    verificationSourceUrl: input.sourceUrl,",
        "    lastVerified: input.checkedOn,",
        "    verificationNextReviewAt: input.nextReviewAt,",
        "    verificationCurrent: Date.parse(input.nextReviewAt) > Date.now(),",
        "    metricsVerified: false,",
        "    logoUrl: input.logoUrl,",
        "  };",
        "}",
        "",
        "export const universityLogoUrls: Partial<Record<string, string>> = {",
    ]
    for item in prepared:
        if item["logo_url"]:
            ts_lines.append(f"  {ts(item['slug'])}: {ts(item['logo_url'])},")
    ts_lines.extend(["};", "", "const directoryInputs: DirectoryUniversityInput[] = ["])
    for item in directory:
        ts_lines.extend(
            [
                "  {",
                f"    slug: {ts(item['slug'])},",
                f"    name: {ts(item['university_name'])},",
                f"    shortName: {ts(item['short_name'])},",
                f"    state: {ts(item['state_or_ut'])},",
                f"    universityType: {ts(item['university_type'])},",
                f"    evidenceCategory: {ts(item['evidence_category'])},",
                f"    referencePeriod: {ts(item['reference_period'])},",
                f"    sourceUrl: {ts(item['source_url'])},",
                f"    checkedOn: {ts(item['checked_on'])},",
                f"    nextReviewAt: {ts(item['next_review_at'])},",
                *([f"    logoUrl: {ts(item['logo_url'])},"] if item["logo_url"] else []),
                "  },",
            ]
        )
    ts_lines.extend(
        [
            "];",
            "",
            "export const directoryUniversities = directoryInputs.map(createDirectoryUniversity);",
            "",
        ]
    )
    args.directory_ts.write_text("\n".join(ts_lines))

    values = []
    for item in prepared:
        about = (
            f"{item['university_name']} is included in the DekhoCampus researched directory "
            f"of Indian universities with evidence of online degree provision. This record "
            f"covers {item['reference_period']}; it does not confirm that every programme or "
            "the latest intake is currently approved or open. Verify the exact programme, "
            "online mode, academic session and official application route before applying or paying."
        )
        highlights = [
            item["evidence_category"],
            f"Reference period: {item['reference_period']}",
            item["latest_intake_verification"],
        ]
        values.append(
            "(" + ", ".join(
                [
                    sql(item["slug"]),
                    sql(item["university_name"]),
                    sql(item["university_name"]),
                    sql(item["short_name"]),
                    sql(""),
                    sql(item["state_or_ut"]),
                    "NULL",
                    "NULL",
                    sql(item["logo_url"]),
                    "NULL",
                    sql("#325DD2"),
                    "ARRAY[" + ", ".join(sql(value) for value in highlights) + "]::text[]",
                    sql(about),
                    sql("directory"),
                    sql(item["source_url"]),
                    sql(item["reference_period"]),
                    sql(item["verified_at"]),
                    sql(item["next_review_at"]),
                    sql(int(item["serial_no"])),
                    "TRUE",
                ]
            ) + ")"
        )

    migration = f"""-- Import the researched 12 September 2026 online-university directory.
-- These are institution-level discovery records only. No programmes, fees,
-- approval claims or current-intake availability are inferred by this import.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  '{BUCKET}',
  '{BUCKET}',
  TRUE,
  8388608,
  ARRAY['image/svg+xml', 'image/png', 'image/webp', 'image/jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "admins manage university logos" ON storage.objects;
CREATE POLICY "admins manage university logos"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = '{BUCKET}' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = '{BUCKET}' AND public.has_role(auth.uid(), 'admin'));

INSERT INTO public.universities (
  slug, name, legal_name, short_name, city, state, established, domain,
  logo_url, hero_image_url, accent_color, highlights, about, profile_depth,
  verification_source_url, verification_academic_session, verified_at,
  next_review_at, sort_order, published
)
VALUES
  {',\n  '.join(values)}
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  legal_name = EXCLUDED.legal_name,
  short_name = EXCLUDED.short_name,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  established = EXCLUDED.established,
  domain = EXCLUDED.domain,
  logo_url = EXCLUDED.logo_url,
  hero_image_url = EXCLUDED.hero_image_url,
  accent_color = EXCLUDED.accent_color,
  highlights = EXCLUDED.highlights,
  about = EXCLUDED.about,
  profile_depth = EXCLUDED.profile_depth,
  verification_source_url = EXCLUDED.verification_source_url,
  verification_academic_session = EXCLUDED.verification_academic_session,
  verified_at = EXCLUDED.verified_at,
  next_review_at = EXCLUDED.next_review_at,
  sort_order = EXCLUDED.sort_order,
  published = EXCLUDED.published,
  updated_at = now();
"""
    args.migration_sql.write_text(migration)

    resolved = sum(item["logo"]["status"] == "resolved" for item in prepared)
    print(f"Generated 140 rows, {len(directory)} fallback directory rows, {resolved} logos")


if __name__ == "__main__":
    main()
