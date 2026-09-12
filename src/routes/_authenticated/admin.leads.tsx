import { createFileRoute } from "@tanstack/react-router";
import { EntityManager, type FieldDef } from "@/components/admin/entity-manager";

export const Route = createFileRoute("/_authenticated/admin/leads")({
  component: AdminLeads,
});

const fields: FieldDef[] = [
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["new", "contacted", "qualified", "enrolled", "lost"],
    defaultValue: "new",
  },
  { name: "message", label: "Notes", type: "textarea" },
];

function AdminLeads() {
  return (
    <EntityManager
      table="leads"
      title="Enquiries"
      description="Consent-aware counselling requests, newest first. Enquiry and consent evidence is read-only here; staff can update only status and internal notes."
      fields={fields}
      allowCreate={false}
      orderBy="created_at"
      orderAscending={false}
      listColumns={[
        { name: "full_name", label: "Name" },
        { name: "phone", label: "Phone" },
        { name: "contact_channels", label: "Requested channel" },
        { name: "university_slug", label: "Named university" },
        { name: "share_with_university", label: "Share allowed" },
        { name: "university_share_consent_at", label: "Share consent at" },
        { name: "university_share_consent_version", label: "Share disclosure version" },
        {
          name: "university_share_consent_text",
          label: "Exact share disclosure",
          maxLength: 220,
        },
        { name: "consent_at", label: "Consent recorded" },
        { name: "consent_version", label: "Disclosure version" },
        { name: "consent_text", label: "Exact disclosure", maxLength: 220 },
        { name: "source_path", label: "Source" },
        { name: "status", label: "Status" },
      ]}
    />
  );
}
