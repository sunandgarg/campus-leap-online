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
  {
    name: "official_programme_name",
    label: "Official programme name",
    type: "text",
    required: true,
  },
  {
    name: "delivery_mode",
    label: "Delivery mode",
    type: "select",
    options: ["ONLINE", "ODL"],
    defaultValue: "ONLINE",
    required: true,
  },
  {
    name: "academic_session",
    label: "Academic session",
    type: "text",
    nullable: true,
    help: "e.g. 2026-27",
  },
  {
    name: "entitlement_status",
    label: "Entitlement status",
    type: "select",
    options: ["unverified", "verified", "expired", "no-admission", "debarred"],
    defaultValue: "unverified",
    required: true,
  },
  {
    name: "entitlement_source_url",
    label: "UGC-DEB evidence URL",
    type: "text",
    nullable: true,
    wide: true,
  },
  {
    name: "university_programme_url",
    label: "Official programme URL",
    type: "text",
    nullable: true,
    wide: true,
    help: "Use an http(s) page on the university domain configured in Universities.",
  },
  {
    name: "official_application_url",
    label: "Official application URL",
    type: "text",
    nullable: true,
    wide: true,
    help: "Use an http(s) application route on the configured university domain; off-domain links are hidden publicly.",
  },
  {
    name: "verified_at",
    label: "Entitlement checked at",
    type: "text",
    nullable: true,
    help: "ISO date/time",
  },
  {
    name: "next_review_at",
    label: "Review again at",
    type: "text",
    nullable: true,
    help: "ISO date/time",
  },
  {
    name: "fees_verified",
    label: "Total-fee evidence checked",
    type: "bool",
    defaultValue: false,
    help: "Select only when the cited source explicitly substantiates the total fee.",
  },
  {
    name: "fee_source_url",
    label: "Official fee source URL",
    type: "text",
    nullable: true,
    wide: true,
  },
  {
    name: "fee_verified_at",
    label: "Fee checked at",
    type: "text",
    nullable: true,
    help: "ISO date/time",
  },
  {
    name: "fee_next_review_at",
    label: "Review fee again at",
    type: "text",
    nullable: true,
    help: "ISO date/time; verified fee fields expire at this time",
  },
  {
    name: "total_fee",
    label: "Total fee (₹)",
    type: "number",
    nullable: true,
    min: 1,
    step: 1,
  },
  {
    name: "per_semester_fee",
    label: "Per semester fee (₹)",
    type: "number",
    nullable: true,
    min: 1,
    step: 1,
  },
  {
    name: "per_semester_fee_verified",
    label: "Semester-fee evidence checked",
    type: "bool",
    defaultValue: false,
    help: "Leave off when this amount is calculated from the total fee.",
  },
  {
    name: "emi_per_month",
    label: "EMI per month (₹)",
    type: "number",
    nullable: true,
    min: 1,
    step: 1,
  },
  {
    name: "emi_per_month_verified",
    label: "Monthly-EMI evidence checked",
    type: "bool",
    defaultValue: false,
    help: "Select only for an EMI or payment plan explicitly published in the cited source.",
  },
  {
    name: "fee_components",
    label: "Fee components (internal JSON)",
    type: "json",
    defaultValue: {},
    help: "Stored for editorial preparation but not published until component-level evidence fields are available.",
  },
  {
    name: "refund_policy_url",
    label: "Refund policy URL",
    type: "text",
    nullable: true,
    wide: true,
  },
  {
    name: "duration_years",
    label: "Offering duration (years)",
    type: "number",
    nullable: true,
    min: 0.1,
    step: 0.1,
    help: "Use the official programme duration for this intake.",
  },
  {
    name: "semesters",
    label: "Offering semesters",
    type: "number",
    nullable: true,
    min: 1,
    step: 1,
  },
  {
    name: "eligibility",
    label: "Offering-specific eligibility",
    type: "textarea",
    nullable: true,
  },
  {
    name: "exam_mode",
    label: "Exam and proctoring mode",
    type: "textarea",
    nullable: true,
  },
  {
    name: "curriculum",
    label: "Offering curriculum (JSON)",
    type: "json",
    nullable: true,
  },
  {
    name: "scholarship_summary",
    label: "Scholarship conditions",
    type: "textarea",
    nullable: true,
  },
  { name: "sort_order", label: "Sort order", type: "number" },
  { name: "published", label: "Published", type: "bool", defaultValue: false },
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
      description="One university–programme–mode–session record. Keep unpublished until entitlement and any displayed fee have primary-source evidence."
      fields={fields}
      selectSources={slugs.data ?? {}}
      listColumns={[
        { name: "university_slug", label: "University" },
        { name: "program_slug", label: "Program" },
        { name: "academic_session", label: "Session" },
        { name: "entitlement_status", label: "Status" },
        { name: "published", label: "Live" },
      ]}
    />
  );
}
