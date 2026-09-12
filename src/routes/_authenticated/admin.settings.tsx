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
    help: "Only the announcement key is rendered by this release.",
  },
  {
    name: "value",
    label: "Value (JSON)",
    type: "json",
    help: 'e.g. {"enabled":true,"text":"Use the UGC-DEB checklist before enrolling","cta":"View checklist","href":"/methodology#admission-safety"}',
    defaultValue: {},
  },
];

function AdminSettings() {
  return (
    <EntityManager
      table="site_settings"
      title="Site settings"
      description="Structured configuration for the announcement bar. Only the announcement key is publicly readable; unsupported keys remain administrator-only and are not rendered."
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
