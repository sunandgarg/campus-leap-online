import { createFileRoute } from "@tanstack/react-router";
import { EntityManager, type FieldDef } from "@/components/admin/entity-manager";

export const Route = createFileRoute("/_authenticated/admin/universities")({
  component: AdminUniversities,
});

const fields: FieldDef[] = [
  {
    name: "slug",
    label: "URL slug",
    type: "text",
    required: true,
    help: "e.g. amity-university-online",
  },
  { name: "name", label: "Full name", type: "text", required: true },
  {
    name: "legal_name",
    label: "Legal HEI name",
    type: "text",
    nullable: true,
    help: "Match the regulator record exactly",
  },
  { name: "hei_id", label: "UGC-DEB HEI ID", type: "text", nullable: true },
  { name: "short_name", label: "Short name", type: "text" },
  { name: "city", label: "City", type: "text" },
  { name: "state", label: "State", type: "text" },
  { name: "established", label: "Established year", type: "number", nullable: true },
  {
    name: "domain",
    label: "Official domain",
    type: "text",
    nullable: true,
    help: "Hostname only, e.g. amityonline.com. Public programme, refund and application links must use this domain or one of its subdomains.",
  },
  {
    name: "profile_depth",
    label: "Profile data status",
    type: "select",
    options: ["directory", "complete"],
    defaultValue: "directory",
    required: true,
  },
  {
    name: "verification_academic_session",
    label: "Source academic session",
    type: "text",
    help: "e.g. 2026-27; this does not verify each programme by itself",
  },
  {
    name: "verification_source_url",
    label: "Primary source URL",
    type: "text",
    nullable: true,
    wide: true,
  },
  {
    name: "verified_at",
    label: "Last checked at",
    type: "text",
    nullable: true,
    help: "ISO date/time",
  },
  {
    name: "next_review_at",
    label: "Review again at",
    type: "text",
    nullable: true,
    help: "ISO date/time",
  },
  { name: "logo_url", label: "Logo image URL", type: "text" },
  { name: "hero_image_url", label: "Hero image URL", type: "text" },
  { name: "accent_color", label: "Brand colour", type: "text", help: "hex, e.g. #1b3668" },
  { name: "naac_grade", label: "NAAC grade", type: "text" },
  {
    name: "rating",
    label: "Legacy rating (not public without evidence)",
    type: "number",
    help: "Keep at 0 unless a current claim-evidence record documents source and methodology.",
  },
  {
    name: "reviews",
    label: "Legacy review count (not public without evidence)",
    type: "number",
    help: "This value is hidden on public pages until a sourced review model is connected.",
  },
  {
    name: "students_enrolled",
    label: "Legacy learner count",
    type: "text",
    help: "Hidden publicly without current claim evidence.",
  },
  {
    name: "hiring_partner_count",
    label: "Legacy hiring-partner count",
    type: "text",
    help: "Hidden publicly without current claim evidence.",
  },
  { name: "approvals", label: "Approvals", type: "list", help: "One per line" },
  {
    name: "placement_partners",
    label: "Legacy employer names",
    type: "list",
    help: "One per line; hidden publicly until the relationship and source are documented.",
  },
  { name: "highlights", label: "Highlights", type: "list", help: "One per line" },
  { name: "about", label: "About", type: "textarea" },
  { name: "sort_order", label: "Sort order", type: "number" },
  { name: "published", label: "Published", type: "bool", defaultValue: false },
];

function AdminUniversities() {
  return (
    <EntityManager
      table="universities"
      title="Universities"
      description="Create a directory record first. Publish claims only after attaching current primary-source evidence."
      fields={fields}
      listColumns={[
        { name: "name", label: "University" },
        { name: "slug", label: "Slug" },
        { name: "profile_depth", label: "Data status" },
        { name: "verification_academic_session", label: "Source session" },
        { name: "published", label: "Live" },
      ]}
    />
  );
}
