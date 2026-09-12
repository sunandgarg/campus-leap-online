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
 * University mark: renders a reviewed logo URL from the catalogue, with an
 * initials monogram fallback. We deliberately do not request third-party
 * favicon services: that leaks a visitor request, adds network work to every
 * card and often returns a low-quality or unrelated mark.
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

  if (failed || !university.logoUrl) {
    return (
      <span
        aria-hidden="true"
        className={cn(tile, s.text)}
        style={{
          color: `color-mix(in oklab, ${university.accentColor} 55%, #101923)`,
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
        src={university.logoUrl}
        alt={`${university.name} logo`}
        width={s.px}
        height={s.px}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className="h-[70%] w-[70%] object-contain"
        onError={() => setFailed(true)}
      />
    </span>
  );
}
