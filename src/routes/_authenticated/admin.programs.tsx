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
  { name: "average_salary_lpa", label: "Salary range", type: "text", help: "e.g. 6 - 18 LPA" },
  { name: "hero_image_url", label: "Hero image URL", type: "text" },
  { name: "overview", label: "Overview", type: "textarea" },
  { name: "eligibility", label: "Eligibility", type: "textarea" },
  { name: "specialisations", label: "Specialisations", type: "list", help: "One per line" },
  { name: "careers", label: "Career paths", type: "list", help: "One per line" },
  {
    name: "curriculum",
    label: "Curriculum (JSON)",
    type: "json",
    help: '[{"semester":"Semester 1","subjects":["Subject A","Subject B"]}]',
  },
  { name: "sort_order", label: "Sort order", type: "number" },
  { name: "published", label: "Published", type: "bool" },
];

function AdminPrograms() {
  return (
    <EntityManager
      table="programs"
      title="Programs"
      description="The shared course template: syllabus, specialisations, eligibility and careers. Linked to universities under Fees & offerings."
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
