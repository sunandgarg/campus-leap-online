import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ShieldCheck, Star } from "lucide-react";
import { UniversityLogo } from "./university-logo";
import {
  formatINR,
  formatUniversityLocation,
  getUniversityPrograms,
  type University,
} from "@/data/universities";

export function UniversityCard({
  university,
  priority = false,
}: {
  university: University;
  priority?: boolean;
}) {
  const programs = getUniversityPrograms(university);
  const isDirectoryProfile = university.profileDepth === "directory";
  const hasDirectorySource = Boolean(
    university.verificationSourceUrl && university.verificationAcademicYear,
  );
  const cheapest = programs
    .filter((program) => program.totalFeeAvailable)
    .reduce((min, p) => (p.totalFee < min ? p.totalFee : min), Number.POSITIVE_INFINITY);

  return (
    <Link
      to="/universities/$universitySlug"
      params={{ universitySlug: university.slug }}
      className="group flex min-h-[13.5rem] flex-col rounded-xl border border-border bg-card p-3.5 transition-colors hover:border-[#325dd2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#325dd2] focus-visible:ring-offset-2"
    >
      <div className="flex items-start justify-between gap-3">
        <UniversityLogo university={university} size="md" priority={priority} />
        <ArrowUpRight
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
        />
      </div>

      <h3 className="mt-2.5 line-clamp-2 font-display text-sm font-extrabold leading-snug">
        {university.name}
      </h3>
      <p className="mt-1 line-clamp-1 text-[10px] text-muted-foreground">
        {formatUniversityLocation(university)}
        {university.established ? ` · Est. ${university.established}` : ""}
      </p>

      <div className="mt-2.5 flex flex-wrap gap-1">
        <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-bold text-muted-foreground">
          {isDirectoryProfile
            ? hasDirectorySource
              ? "Historical source"
              : "Directory record"
            : "Editorial profile"}
        </span>
        <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-bold text-muted-foreground">
          Verify intake
        </span>
      </div>

      <div className="mt-auto min-w-0 border-t border-border pt-2.5">
        <p className="text-[9px] text-muted-foreground">
          {isDirectoryProfile || !Number.isFinite(cheapest) ? "Fee status" : "Sourced fees from"}
        </p>
        <p className="mt-0.5 line-clamp-2 break-words font-display text-xs font-extrabold leading-4">
          {!isDirectoryProfile && Number.isFinite(cheapest)
            ? formatINR(cheapest)
            : "Confirm current fee"}
        </p>
        <div className="mt-1.5 flex min-w-0 items-center justify-between gap-1 border-t border-border/70 pt-1.5">
          {isDirectoryProfile ? (
            <p className="flex min-w-0 items-center gap-1 text-[9px] font-bold text-[#187a55] dark:text-[#77ddb2]">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="truncate">
                {hasDirectorySource ? "Source listed" : "Review needed"}
              </span>
            </p>
          ) : university.metricsVerified ? (
            <p className="flex min-w-0 items-center gap-1 text-[10px] font-bold">
              <Star className="h-3.5 w-3.5 fill-gold text-gold" aria-hidden="true" />
              {university.rating}
            </p>
          ) : (
            <p className="truncate text-[9px] font-bold text-muted-foreground">Editorial</p>
          )}
          <p className="shrink-0 text-[9px] text-muted-foreground">
            {programs.length} {programs.length === 1 ? "course" : "courses"}
          </p>
        </div>
      </div>
    </Link>
  );
}
