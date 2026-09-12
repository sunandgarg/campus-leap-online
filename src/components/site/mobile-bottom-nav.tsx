import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpenCheck, Building2, GitCompareArrows, Home, Sparkles } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/programs", label: "Courses", icon: BookOpenCheck },
  { to: "/universities", label: "Universities", icon: Building2 },
  { to: "/compare", label: "Compare", icon: GitCompareArrows },
  { to: "/finder", label: "My match", icon: Sparkles },
] as const;

export function MobileBottomNav() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname.startsWith("/admin") || pathname === "/auth") return null;

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-5 rounded-2xl border border-border/90 bg-background/95 p-1.5 shadow-[0_20px_55px_-18px_rgba(12,30,50,0.55)] backdrop-blur-xl lg:hidden"
    >
      {items.map((item) => {
        const active =
          item.to === "/"
            ? pathname === "/"
            : pathname === item.to || pathname.startsWith(`${item.to}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.to}
            to={item.to}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-[9px] font-extrabold transition sm:text-[10px] ${
              active
                ? "bg-[#fff0e6] text-[#a94300] dark:bg-[#3b2619] dark:text-[#ffad70]"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Icon className="h-4.5 w-4.5" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
