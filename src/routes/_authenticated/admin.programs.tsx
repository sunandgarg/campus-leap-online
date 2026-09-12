import { createFileRoute } from "@tanstack/react-router";
import { EntityManager, type FieldDef } from "@/components/admin/entity-manager";

export const Route = createFileRoute("/_authenticated/admin/programs")({
  component: AdminPrograms,
});

const fields: FieldDef[] = [
  { name: "slug", label: "URL slug", type: "text", required: true, help: "e.g. online-mba" },
  { name: "code", label: "Short code", type: "text", required: true, help: "e.g. MBA" },
  { name: "name", label: "Full name", type: "text", required: true },
  {
    name: "level",
    label: "Level",
    type: "select",
    options: ["Bachelors", "Masters", "Diploma", "Certificate"],
  },
  { name: "duration_years", label: "Duration (years)", type: "number" },
  { name: "semesters", label: "Semesters", type: "number" },
  { name: "hero_image_url", label: "Hero image URL", type: "text" },
  { name: "overview", label: "Overview", type: "textarea" },
  { name: "eligibility", label: "Eligibility", type: "textarea" },
  {
    name: "specialisations",
    label: "Common pathway ideas",
    type: "list",
    help: "Category guidance only. Verify availability separately for each university offering.",
  },
  { name: "careers", label: "Career paths", type: "list", help: "One per line" },
  {
    name: "curriculum",
    label: "Curriculum (JSON)",
    type: "json",
    help: '[{"semester":"Semester 1","subjects":["Subject A","Subject B"]}]',
  },
  { name: "sort_order", label: "Sort order", type: "number" },
  { name: "published", label: "Published", type: "bool", defaultValue: false },
];

function AdminPrograms() {
  return (
    <EntityManager
      table="programs"
      title="Programs"
      description="A category guide. University-specific eligibility, syllabus and pathways belong to a verified offering."
      fields={fields}
      listColumns={[
        { name: "name", label: "Program" },
        { name: "code", label: "Code" },
        { name: "level", label: "Level" },
        { name: "published", label: "Live" },
      ]}
    />
  );
}
