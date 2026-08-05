import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const stats = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [universities, programs, offerings, leads] = await Promise.all([
        supabase.from("universities").select("id", { count: "exact", head: true }),
        supabase.from("programs").select("id", { count: "exact", head: true }),
        supabase.from("university_programs").select("id", { count: "exact", head: true }),
        supabase.from("leads").select("id", { count: "exact", head: true }),
      ]);
      return {
        universities: universities.count ?? 0,
        programs: programs.count ?? 0,
        offerings: offerings.count ?? 0,
        leads: leads.count ?? 0,
      };
    },
  });

  const cards = [
    { label: "Universities", value: stats.data?.universities, to: "/admin/universities" },
    { label: "Programs", value: stats.data?.programs, to: "/admin/programs" },
    { label: "Fee entries", value: stats.data?.offerings, to: "/admin/offerings" },
    { label: "Enquiries", value: stats.data?.leads, to: "/admin/leads" },
  ] as const;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Everything on the public site — universities, programs, fees, hero copy — is driven by the
        records below. Changes appear on the site immediately after saving.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
            <strong className="text-foreground">Programs</strong> — the course template (syllabus,
            specialisations, careers) shared across universities.
          </li>
          <li>
            <strong className="text-foreground">Fees &amp; offerings</strong> — links a university to
            a program with its total fee, per-semester fee and EMI. This creates the course page at
            /universities/&lt;university&gt;/&lt;program&gt;.
          </li>
          <li>
            <strong className="text-foreground">Site settings</strong> — brand details, announcement
            bar and homepage hero copy.
          </li>
        </ul>
      </div>
    </div>
  );
}
