import { createFileRoute } from "@tanstack/react-router";
import { EntityManager, type FieldDef } from "@/components/admin/entity-manager";

export const Route = createFileRoute("/_authenticated/admin/claims")({
  component: AdminClaims,
});

const fields: FieldDef[] = [
  { name: "rendered_claim", label: "Exact claim text", type: "textarea", required: true },
  {
    name: "claim_type",
    label: "Claim type",
    type: "select",
    options: [
      "recognition",
      "accreditation",
      "fee",
      "ranking",
      "review",
      "learner-count",
      "career-support",
      "outcome",
    ],
    required: true,
  },
  {
    name: "university_slug",
    label: "University slug (optional)",
    type: "text",
    nullable: true,
  },
  { name: "program_slug", label: "Program slug (optional)", type: "text", nullable: true },
  { name: "offering_id", label: "Offering ID (optional)", type: "text", nullable: true },
  { name: "academic_session", label: "Academic session", type: "text", nullable: true },
  { name: "source_url", label: "Primary source URL", type: "text", required: true, wide: true },
  {
    name: "source_date",
    label: "Source publication date",
    type: "text",
    nullable: true,
    help: "YYYY-MM-DD",
  },
  {
    name: "methodology",
    label: "Cohort, sample or methodology",
    type: "textarea",
    nullable: true,
  },
  {
    name: "verified_at",
    label: "Checked at",
    type: "text",
    required: true,
    help: "ISO date/time",
  },
  {
    name: "expires_at",
    label: "Expires at",
    type: "text",
    required: true,
    help: "ISO date/time",
  },
  { name: "published", label: "Published", type: "bool", defaultValue: false },
];

function AdminClaims() {
  return (
    <EntityManager
      table="claim_evidence"
      title="Claim evidence"
      description="Every time-sensitive public claim needs a primary source, applicable scope, review date and expiry."
      fields={fields}
      orderBy="expires_at"
      listColumns={[
        { name: "claim_type", label: "Type" },
        { name: "rendered_claim", label: "Claim" },
        { name: "expires_at", label: "Expires" },
        { name: "published", label: "Live" },
      ]}
    />
  );
}
