import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { EntityManager, type FieldDef, type SelectOption } from "@/components/admin/entity-manager";
import { supabase } from "@/integrations/supabase/client";

const db = supabase as unknown as SupabaseClient;

export const Route = createFileRoute("/_authenticated/admin/offering-specialisations")({
  component: AdminOfferingSpecialisations,
});

const fields: FieldDef[] = [
  { name: "offering_id", label: "University offering", type: "select", required: true },
  { name: "specialisation_id", label: "Specialisation", type: "select", required: true },
  { name: "university_label", label: "University’s exact label", type: "text", nullable: true },
  {
    name: "availability_status",
    label: "Availability status",
    type: "select",
    options: ["unverified", "verified", "withdrawn"],
    defaultValue: "unverified",
    required: true,
  },
  { name: "academic_session", label: "Academic session", type: "text", nullable: true },
  { name: "source_url", label: "Official source URL", type: "text", nullable: true, wide: true },
  { name: "verified_at", label: "Checked at", type: "text", nullable: true, help: "ISO date/time" },
  {
    name: "next_review_at",
    label: "Review again at",
    type: "text",
    nullable: true,
    help: "ISO date/time",
  },
  { name: "published", label: "Published", type: "bool", defaultValue: false },
];

function AdminOfferingSpecialisations() {
  const options = useQuery({
    queryKey: ["admin", "offering-specialisation-options"],
    queryFn: async (): Promise<Record<string, SelectOption[]>> => {
      const [offerings, specialisations] = await Promise.all([
        db
          .from("university_programs")
          .select("id,university_slug,program_slug,academic_session")
          .order("university_slug"),
        db.from("specialisations").select("id,name").order("name"),
      ]);
      if (offerings.error) throw offerings.error;
      if (specialisations.error) throw specialisations.error;

      return {
        offering_id: (offerings.data ?? []).map((row) => ({
          value: String(row.id),
          label: `${row.university_slug} · ${row.program_slug}${row.academic_session ? ` · ${row.academic_session}` : ""}`,
        })),
        specialisation_id: (specialisations.data ?? []).map((row) => ({
          value: String(row.id),
          label: String(row.name),
        })),
      };
    },
  });

  return (
    <EntityManager
      table="offering_specialisations"
      title="Offering pathways"
      description="Attach only the specialisations or electives the exact university offering publishes for that academic session."
      fields={fields}
      selectSources={options.data ?? {}}
      listColumns={[
        { name: "university_label", label: "University label" },
        { name: "academic_session", label: "Session" },
        { name: "availability_status", label: "Status" },
        { name: "published", label: "Live" },
      ]}
    />
  );
}
