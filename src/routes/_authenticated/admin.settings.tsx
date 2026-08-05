import { createFileRoute } from "@tanstack/react-router";
import { EntityManager, type FieldDef } from "@/components/admin/entity-manager";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: AdminSettings,
});

const fields: FieldDef[] = [
  {
    name: "key",
    label: "Setting key",
    type: "text",
    required: true,
    help: "brand, announcement or home_hero",
  },
  {
    name: "value",
    label: "Value (JSON)",
    type: "json",
    help: 'e.g. {"enabled":true,"text":"Admissions open","cta":"Talk to us","href":"/contact"}',
    defaultValue: {},
  },
];

function AdminSettings() {
  return (
    <EntityManager
      table="site_settings"
      title="Site settings"
      description="Brand details, the announcement bar and homepage hero copy used across the site."
      fields={fields}
      orderBy="key"
      idColumn="key"
      listColumns={[
        { name: "key", label: "Key" },
        { name: "updated_at", label: "Updated" },
      ]}
    />
  );
}
