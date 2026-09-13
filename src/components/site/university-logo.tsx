import { useState } from "react";
import { cn } from "@/lib/utils";
import type { University } from "@/data/universities";

const SIZES = {
  sm: { box: "h-9 w-9 rounded-lg", text: "text-xs", px: 64 },
  md: { box: "h-14 w-14 rounded-xl", text: "text-base", px: 128 },
  lg: { box: "h-20 w-20 rounded-2xl", text: "text-2xl", px: 192 },
} as const;

function initialsOf(name: string) {
  const initials = name
    .replace(/\b(?:Online|University|Jaipur)\b/gi, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return initials || "U";
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
  priority = false,
  className,
}: {
  university: University;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
  className?: string;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const s = SIZES[size];
  const logoUrl = university.logoUrl;
  const failed = !logoUrl || failedUrl === logoUrl;
  const loaded = loadedUrl === logoUrl;

  const tile = cn(
    "inline-flex shrink-0 items-center justify-center overflow-hidden border font-display font-bold tracking-tight",
    s.box,
    className,
  );

  if (failed) {
    return (
      <span
        role="img"
        aria-label={`${university.name} logo unavailable`}
        title={university.name}
        data-university-logo="fallback"
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
      className={cn(tile, "relative border-border bg-white")}
      title={university.name}
      data-university-logo="image"
      style={{ borderColor: `color-mix(in oklab, ${university.accentColor} 20%, transparent)` }}
    >
      {!loaded ? (
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-[#f4f6fa] font-display font-bold text-[#536176]",
            s.text,
          )}
        >
          {initialsOf(university.name)}
        </span>
      ) : null}
      <img
        src={logoUrl}
        alt={`${university.name} logo`}
        width={s.px}
        height={s.px}
        loading={priority || size === "lg" ? "eager" : "lazy"}
        fetchPriority={priority || size === "lg" ? "high" : "auto"}
        decoding="async"
        referrerPolicy="no-referrer"
        draggable={false}
        className={cn(
          "relative block h-full w-full object-contain p-[8%] transition-opacity duration-200",
          loaded ? "opacity-100" : "opacity-0",
        )}
        onError={() => setFailedUrl(logoUrl)}
        onLoad={(event) => {
          if (event.currentTarget.naturalWidth < 2 || event.currentTarget.naturalHeight < 2) {
            setFailedUrl(logoUrl);
            return;
          }
          setLoadedUrl(logoUrl);
        }}
      />
    </span>
  );
}
