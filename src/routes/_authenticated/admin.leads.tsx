import { createFileRoute } from "@tanstack/react-router";
import { EntityManager, type FieldDef } from "@/components/admin/entity-manager";

export const Route = createFileRoute("/_authenticated/admin/leads")({
  component: AdminLeads,
});

const fields: FieldDef[] = [
  { name: "full_name", label: "Name", type: "text", required: true },
  { name: "phone", label: "Phone", type: "text", required: true },
  { name: "email", label: "Email", type: "text" },
  { name: "city", label: "City", type: "text" },
  { name: "university_slug", label: "University interest", type: "text" },
  { name: "program_slug", label: "Program interest", type: "text" },
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
      description="Every enquiry submitted through the site forms, newest first. Update the status as you follow up."
      fields={fields}
      orderBy="created_at"
      listColumns={[
        { name: "full_name", label: "Name" },
        { name: "phone", label: "Phone" },
        { name: "program_slug", label: "Program" },
        { name: "status", label: "Status" },
        { name: "created_at", label: "Received" },
      ]}
    />
  );
}
