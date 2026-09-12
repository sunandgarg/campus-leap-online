import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const db = supabase as unknown as SupabaseClient;

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const stats = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [universities, programs, offerings, specialisations, leads] = await Promise.all([
        db.from("universities").select("id", { count: "exact", head: true }),
        db.from("programs").select("id", { count: "exact", head: true }),
        db.from("university_programs").select("id", { count: "exact", head: true }),
        db.from("specialisations").select("id", { count: "exact", head: true }),
        db.from("leads").select("id", { count: "exact", head: true }),
      ]);
      return {
        universities: universities.count ?? 0,
        programs: programs.count ?? 0,
        offerings: offerings.count ?? 0,
        specialisations: specialisations.count ?? 0,
        leads: leads.count ?? 0,
      };
    },
  });

  const cards = [
    { label: "Universities", value: stats.data?.universities, to: "/admin/universities" },
    { label: "Programs", value: stats.data?.programs, to: "/admin/programs" },
    { label: "Fee entries", value: stats.data?.offerings, to: "/admin/offerings" },
    {
      label: "Specialisations",
      value: stats.data?.specialisations,
      to: "/admin/specialisations",
    },
    { label: "Enquiries", value: stats.data?.leads, to: "/admin/leads" },
  ] as const;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage catalogue records, offering evidence and enquiries. A saved record appears publicly
        only when it is explicitly published and passes the page’s source-status rules.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{c.label}</p>
            <p className="mt-2 font-display text-3xl font-bold">{c.value ?? "—"}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-bold">How the content model works</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Universities</strong> — one record per university.
            The slug becomes the page URL: /universities/&lt;slug&gt;.
          </li>
          <li>
            <strong className="text-foreground">Programs</strong> — the category guide shared across
            universities; it is not proof of a specific offering.
          </li>
          <li>
            <strong className="text-foreground">Fees &amp; offerings</strong> — one exact
            university–programme–mode–session tuple with evidence, fee components and review dates.
          </li>
          <li>
            <strong className="text-foreground">Claim evidence</strong> — a source, scope and expiry
            date for any ranking, outcome, accreditation or fee statement.
          </li>
          <li>
            <strong className="text-foreground">Site settings</strong> — structured announcement-bar
            configuration; unsupported keys stay dormant.
          </li>
        </ul>
      </div>
    </div>
  );
}
