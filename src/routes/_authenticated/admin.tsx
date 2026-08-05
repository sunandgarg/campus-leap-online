import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  FileText,
  GraduationCap,
  IndianRupee,
  Inbox,
  LogOut,
  Settings,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: FileText, exact: true },
  { to: "/admin/universities", label: "Universities", icon: Building2, exact: false },
  { to: "/admin/programs", label: "Programs", icon: GraduationCap, exact: false },
  { to: "/admin/offerings", label: "Fees & offerings", icon: IndianRupee, exact: false },
  { to: "/admin/leads", label: "Enquiries", icon: Inbox, exact: false },
  { to: "/admin/settings", label: "Site settings", icon: Settings, exact: false },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const roleQuery = useQuery({
    queryKey: ["admin", "is-admin"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return false;
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: userData.user.id,
        _role: "admin",
      });
      if (error) throw error;
      return Boolean(data);
    },
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="container-page py-10">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            DekhoCampus Online
          </p>
          <h1 className="truncate font-display text-xl font-bold">Content admin</h1>
        </div>
        <Button variant="outline" size="sm" onClick={signOut}>
          <LogOut className="mr-1.5 h-3.5 w-3.5" /> Sign out
        </Button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav className="flex flex-wrap gap-1.5 lg:flex-col">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-ink text-ink-foreground" : "hover:bg-secondary"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="min-w-0">
          {roleQuery.data === false ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <h2 className="font-display text-lg font-bold">Admin access required</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                This account does not have admin rights. Ask an existing admin to grant access.
              </p>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
}
