import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpenCheck, Building2, GitCompareArrows, Home } from "lucide-react";

import { useComparison } from "@/hooks/use-comparison";

const leftItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/programs", label: "Courses", icon: BookOpenCheck },
] as const;

const rightItems = [
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
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background px-2 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-10px_30px_-20px_rgba(19,23,32,0.55)] lg:hidden"
    >
      <div className="mx-auto grid max-w-xl grid-cols-5 items-end">
        {leftItems.map((item) => (
          <BottomNavLink key={item.to} {...item} pathname={pathname} />
        ))}

        <button
          type="button"
          aria-label="Open Diya, DekhoCampus course guide"
          aria-haspopup="dialog"
          onClick={() => window.dispatchEvent(new Event("dekhocampus:open-diya"))}
          className="group -mt-5 flex min-h-[3.75rem] min-w-0 flex-col items-center justify-end gap-0.5 rounded-xl px-1 text-[10px] font-extrabold text-[#2449ad] dark:text-[#b9ceff]"
        >
          <span className="relative flex h-13 w-13 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-[#325dd2] shadow-lift transition-transform group-active:scale-95">
            <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white">
              <img
                src="/diya-ai.webp"
                alt=""
                width={90}
                height={96}
                className="h-11 w-11 object-cover"
              />
            </span>
            <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f47b25] px-1 text-[7px] font-black text-[#111827]">
              AI
            </span>
          </span>
          <span>Ask Diya</span>
        </button>

        {rightItems.map((item) => (
          <BottomNavLink
            key={item.to}
            {...item}
            pathname={pathname}
            badge={item.to === "/compare" ? comparison.count : 0}
          />
        ))}
      </div>
    </nav>
  );
}

function BottomNavLink({
  to,
  label,
  icon: Icon,
  pathname,
  badge = 0,
}: {
  to: "/" | "/programs" | "/universities" | "/compare";
  label: string;
  icon: typeof Home;
  pathname: string;
  badge?: number;
}) {
  const active = to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);

  return (
    <Link
      to={to}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-[3.75rem] min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-1 text-[10px] font-extrabold transition-colors ${
        active
          ? "text-[#2449ad] dark:text-[#b9ceff]"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      <span
        className={`relative flex h-7 min-w-9 items-center justify-center rounded-full px-2 transition-colors ${
          active ? "bg-[#edf2ff] dark:bg-[#263653]" : ""
        }`}
      >
        <Icon className="h-[1.15rem] w-[1.15rem]" aria-hidden="true" />
        {badge > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f47b25] px-1 text-[8px] font-black text-[#111827]">
            {badge}
          </span>
        ) : null}
      </span>
      <span className="max-w-full truncate">{label}</span>
    </Link>
  );
}
