import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EntityManager, type FieldDef } from "@/components/admin/entity-manager";

export const Route = createFileRoute("/_authenticated/admin/specialisations")({
  component: AdminSpecialisations,
});

const fields: FieldDef[] = [
  { name: "slug", label: "URL slug", type: "text", required: true },
  { name: "name", label: "Name", type: "text", required: true },
  {
    name: "program_slug",
    label: "Parent programme",
    type: "select",
    nullable: true,
    help: "Required for a standalone public pathway page unless a verified offering mapping supplies the programme.",
  },
  { name: "category", label: "Category", type: "text" },
  { name: "summary", label: "Category summary", type: "textarea" },
  { name: "skills", label: "Skills to explore", type: "list", help: "One per line" },
  {
    name: "career_directions",
    label: "Career directions",
    type: "list",
    help: "Directional roles only; do not add salary or placement guarantees",
  },
  { name: "sort_order", label: "Sort order", type: "number" },
  { name: "published", label: "Published", type: "bool", defaultValue: false },
];

function AdminSpecialisations() {
  const programs = useQuery({
    queryKey: ["admin", "specialisation-programs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("programs").select("slug,name").order("name");
      if (error) throw error;
      return (data ?? []).map((program) => ({ value: program.slug, label: program.name }));
    },
  });

  return (
    <EntityManager
      table="specialisations"
      title="Specialisations"
      description="Manage the reusable taxonomy. Availability must still be verified for every university offering and intake."
      fields={fields}
      selectSources={{ program_slug: programs.data ?? [] }}
      listColumns={[
        { name: "name", label: "Specialisation" },
        { name: "program_slug", label: "Programme" },
        { name: "category", label: "Category" },
        { name: "published", label: "Live" },
      ]}
    />
  );
}
