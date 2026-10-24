import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  BadgeCheck,
  Building2,
  Database,
  FileText,
  GraduationCap,
  IndianRupee,
  Inbox,
  LogOut,
  Shapes,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/site/brand-logo";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: FileText, exact: true },
  { to: "/admin/universities", label: "Universities", icon: Building2, exact: false },
  { to: "/admin/programs", label: "Programs", icon: GraduationCap, exact: false },
  { to: "/admin/offerings", label: "Fees & offerings", icon: IndianRupee, exact: false },
  { to: "/admin/specialisations", label: "Specialisations", icon: Shapes, exact: false },
  {
    to: "/admin/offering-specialisations",
    label: "Offering pathways",
    icon: GraduationCap,
    exact: false,
  },
  { to: "/admin/claims", label: "Claim evidence", icon: BadgeCheck, exact: false },
  {
    to: "/admin/catalogue-review",
    label: "Research queue",
    icon: Database,
    exact: false,
  },
  { to: "/admin/leads", label: "Enquiries", icon: Inbox, exact: false },
  { to: "/admin/settings", label: "Site settings", icon: Settings, exact: false },
] as const;

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  function signOut() {
    window.location.assign("/cdn-cgi/access/logout");
  }

  return (
    <div className="container-page py-10">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <BrandLogo variant="mark" size="sm" />
          <h1 className="mt-2 truncate font-display text-xl font-bold">Content admin</h1>
        </div>
        <Button variant="outline" size="sm" onClick={signOut}>
          <LogOut className="mr-1.5 h-3.5 w-3.5" /> Sign out
        </Button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Administration" className="flex flex-wrap gap-1.5 lg:flex-col">
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
          <Outlet />
        </div>
      </div>
    </div>
  );
}
