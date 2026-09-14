import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpenCheck, Building2, GitCompareArrows, Home } from "lucide-react";
import { useComparison } from "@/hooks/use-comparison";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/programs", label: "Courses", icon: BookOpenCheck },
  { to: "/universities", label: "Universities", icon: Building2 },
  { to: "/compare", label: "Compare", icon: GitCompareArrows },
] as const;

export function MobileBottomNav() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const comparison = useComparison();

  if (pathname.startsWith("/admin") || pathname === "/auth") return null;

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-5 rounded-xl border border-border bg-background p-1.5 shadow-card lg:hidden"
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
            <span className="relative">
              <Icon className="h-4.5 w-4.5" />
              {item.to === "/compare" && comparison.count > 0 ? (
                <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#325dd2] px-1 text-[8px] font-black text-white">
                  {comparison.count}
                </span>
              ) : null}
            </span>
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
      <button
        type="button"
        aria-label="Open Diya, DekhoCampus course guide"
        aria-haspopup="dialog"
        onClick={() => window.dispatchEvent(new Event("dekhocampus:open-diya"))}
        className="flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-[9px] font-extrabold text-[#2449ad] transition hover:bg-[#edf2ff] dark:text-[#8cb0ff] dark:hover:bg-[#263653] sm:text-[10px]"
      >
        <span className="relative flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-white">
          <img src="/diya-ai.webp" alt="" width={90} height={96} className="h-5 w-5" />
        </span>
        <span className="truncate">Diya AI</span>
      </button>
    </nav>
  );
}
