import { cn } from "@/lib/utils";
import type { University } from "@/data/universities";

/**
 * University mark: initials monogram rendered from university data, tinted with
 * the university's accent colour. Fully data-driven — a new university in
 * universities.ts automatically gets a consistent logo tile.
 */
export function UniversityLogo({
  university,
  size = "md",
  className,
}: {
  university: University;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const initials = university.name
    .replace(/Online|University|Jaipur/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  const sizes = {
    sm: "h-9 w-9 text-xs rounded-lg",
    md: "h-14 w-14 text-base rounded-xl",
    lg: "h-20 w-20 text-2xl rounded-2xl",
  } as const;

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center border font-display font-bold tracking-tight",
        sizes[size],
        className,
      )}
      style={{
        color: university.accentColor,
        backgroundColor: `color-mix(in oklab, ${university.accentColor} 12%, white)`,
        borderColor: `color-mix(in oklab, ${university.accentColor} 25%, transparent)`,
      }}
    >
      {initials}
    </span>
  );
}
