import { useState } from "react";
import { cn } from "@/lib/utils";
import type { University } from "@/data/universities";

const SIZES = {
  sm: { box: "h-9 w-9 rounded-lg", text: "text-xs", px: 64 },
  md: { box: "h-14 w-14 rounded-xl", text: "text-base", px: 128 },
  lg: { box: "h-20 w-20 rounded-2xl", text: "text-2xl", px: 192 },
} as const;

function initialsOf(name: string) {
  return name
    .replace(/Online|University|Jaipur/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

/**
 * University mark: renders the university's real brand logo (resolved from its
 * official domain) with an initials monogram fallback tinted with the
 * university's accent colour. Fully data-driven — adding a university to
 * universities.ts automatically gets a logo tile.
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
  const [failed, setFailed] = useState(false);
  const s = SIZES[size];

  const tile = cn(
    "inline-flex shrink-0 items-center justify-center overflow-hidden border font-display font-bold tracking-tight",
    s.box,
    className,
  );

  if (failed) {
    return (
      <span
        aria-hidden="true"
        className={cn(tile, s.text)}
        style={{
          color: university.accentColor,
          backgroundColor: `color-mix(in oklab, ${university.accentColor} 12%, white)`,
          borderColor: `color-mix(in oklab, ${university.accentColor} 25%, transparent)`,
        }}
      >
        {initialsOf(university.name)}
      </span>
    );
  }

  return (
    <span
      className={cn(tile, "border-border bg-white")}
      style={{ borderColor: `color-mix(in oklab, ${university.accentColor} 20%, transparent)` }}
    >
      <img
        src={`https://www.google.com/s2/favicons?domain=${university.domain}&sz=${s.px}`}
        alt={`${university.name} logo`}
        width={s.px}
        height={s.px}
        loading="lazy"
        decoding="async"
        className="h-[70%] w-[70%] object-contain"
        onError={() => setFailed(true)}
      />
    </span>
  );
}
