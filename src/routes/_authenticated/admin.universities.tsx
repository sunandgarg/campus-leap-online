import { createFileRoute } from "@tanstack/react-router";
import { EntityManager, type FieldDef } from "@/components/admin/entity-manager";

export const Route = createFileRoute("/_authenticated/admin/universities")({
  component: AdminUniversities,
});

const fields: FieldDef[] = [
  { name: "slug", label: "URL slug", type: "text", required: true, help: "e.g. amity-university-online" },
  { name: "name", label: "Full name", type: "text", required: true },
  { name: "short_name", label: "Short name", type: "text" },
  { name: "city", label: "City", type: "text" },
  { name: "state", label: "State", type: "text" },
  { name: "established", label: "Established year", type: "number" },
  { name: "domain", label: "Official domain", type: "text", help: "e.g. amityonline.com" },
  { name: "logo_url", label: "Logo image URL", type: "text" },
  { name: "hero_image_url", label: "Hero image URL", type: "text" },
  { name: "accent_color", label: "Brand colour", type: "text", help: "hex, e.g. #1b3668" },
  { name: "naac_grade", label: "NAAC grade", type: "text" },
  { name: "rating", label: "Rating (0-5)", type: "number" },
  { name: "reviews", label: "Review count", type: "number" },
  { name: "students_enrolled", label: "Learners enrolled", type: "text", help: "e.g. 1,50,000+" },
  { name: "hiring_partner_count", label: "Hiring partners", type: "text", help: "e.g. 450+" },
  { name: "approvals", label: "Approvals", type: "list", help: "One per line" },
  { name: "placement_partners", label: "Placement partners", type: "list", help: "One per line" },
  { name: "highlights", label: "Highlights", type: "list", help: "One per line" },
  { name: "about", label: "About", type: "textarea" },
  { name: "sort_order", label: "Sort order", type: "number" },
  { name: "published", label: "Published", type: "bool" },
];

function AdminUniversities() {
  return (
    <EntityManager
      table="universities"
      title="Universities"
      description="Each record creates a full university page with logo, accreditation, highlights and program list."
      fields={fields}
      listColumns={[
        { name: "name", label: "University" },
        { name: "slug", label: "Slug" },
        { name: "naac_grade", label: "NAAC" },
        { name: "published", label: "Live" },
      ]}
    />
  );
}
