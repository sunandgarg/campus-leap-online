import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ShieldCheck, Star } from "lucide-react";
import { UniversityLogo } from "./university-logo";
import {
  formatINR,
  formatUniversityLocation,
  getUniversityPrograms,
  type University,
} from "@/data/universities";

export function UniversityCard({ university }: { university: University }) {
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
      className="group flex min-h-64 flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-[#325dd2]"
    >
      <div className="flex items-start justify-between gap-3">
        <UniversityLogo university={university} />
        <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>

      <h3 className="mt-3 line-clamp-2 font-display text-base font-bold leading-snug">
        {university.name}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {formatUniversityLocation(university)}
        {university.established ? ` · Est. ${university.established}` : ""}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-muted-foreground">
          {isDirectoryProfile
            ? hasDirectorySource
              ? "Historical directory source"
              : "Editorial directory record"
            : "Editorial profile"}
        </span>
        <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-muted-foreground">
          Verify each intake
        </span>
      </div>

      <div className="mt-auto flex items-end justify-between border-t border-border pt-4">
        <div>
          <p className="text-xs text-muted-foreground">
            {isDirectoryProfile || !Number.isFinite(cheapest) ? "Fee status" : "Sourced fees from"}
          </p>
          <p className="font-display text-base font-bold">
            {!isDirectoryProfile && Number.isFinite(cheapest)
              ? formatINR(cheapest)
              : "Confirm current fee"}
          </p>
        </div>
        <div className="text-right">
          {isDirectoryProfile ? (
            <p className="flex items-center justify-end gap-1 text-xs font-semibold text-[#187a55] dark:text-[#77ddb2]">
              <ShieldCheck className="h-4 w-4" />
              {hasDirectorySource ? "Source documented" : "Needs source review"}
            </p>
          ) : university.metricsVerified ? (
            <p className="flex items-center justify-end gap-1 text-sm font-semibold">
              <Star className="h-4 w-4 fill-gold text-gold" />
              {university.rating}
            </p>
          ) : (
            <p className="text-xs font-semibold text-muted-foreground">Editorial profile</p>
          )}
          <p className="text-xs text-muted-foreground">
            {programs.length} {programs.length === 1 ? "program" : "programs"}
          </p>
        </div>
      </div>
    </Link>
  );
}
