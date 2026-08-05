import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EntityManager, type FieldDef } from "@/components/admin/entity-manager";

export const Route = createFileRoute("/_authenticated/admin/offerings")({
  component: AdminOfferings,
});

const fields: FieldDef[] = [
  { name: "university_slug", label: "University", type: "select", required: true },
  { name: "program_slug", label: "Program", type: "select", required: true },
  { name: "total_fee", label: "Total fee (₹)", type: "number" },
  { name: "per_semester_fee", label: "Per semester fee (₹)", type: "number" },
  { name: "emi_per_month", label: "EMI per month (₹)", type: "number" },
  { name: "seats_filled_percent", label: "Seats filled (%)", type: "number" },
  { name: "sort_order", label: "Sort order", type: "number" },
  { name: "published", label: "Published", type: "bool" },
];

function AdminOfferings() {
  const slugs = useQuery({
    queryKey: ["admin", "slugs"],
    queryFn: async () => {
      const [u, p] = await Promise.all([
        supabase.from("universities").select("slug").order("name"),
        supabase.from("programs").select("slug").order("name"),
      ]);
      return {
        university_slug: (u.data ?? []).map((r) => r.slug),
        program_slug: (p.data ?? []).map((r) => r.slug),
      };
    },
  });

  return (
    <EntityManager
      table="university_programs"
      title="Fees & offerings"
      description="Links a university to a program and sets its fees. Each row creates a course page at /universities/<university>/<program>."
      fields={fields}
      selectSources={slugs.data ?? {}}
      listColumns={[
        { name: "university_slug", label: "University" },
        { name: "program_slug", label: "Program" },
        { name: "total_fee", label: "Total fee" },
        { name: "published", label: "Live" },
      ]}
    />
  );
}
