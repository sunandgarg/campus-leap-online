import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
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
    .reduce((minimum, program) => Math.min(minimum, program.totalFee), Number.POSITIVE_INFINITY);
  const hasSourcedFee = !isDirectoryProfile && Number.isFinite(cheapest);
  const profileLabel = isDirectoryProfile
    ? hasDirectorySource
      ? "Historical directory source"
      : "Directory research record"
    : "Editorial profile";

  return (
    <Link
      to="/universities/$universitySlug"
      params={{ universitySlug: university.slug }}
      aria-label={`View ${university.name} profile`}
      className="group relative flex h-[12.25rem] min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_10px_26px_-24px_rgba(19,23,32,0.58)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#325dd2] hover:shadow-[0_16px_34px_-24px_rgba(50,93,210,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#325dd2] focus-visible:ring-offset-2"
    >
      <div className="relative flex h-[4.25rem] shrink-0 items-center justify-center border-b border-border bg-[#f6f8fc] px-2.5 pb-1.5 pt-6 dark:bg-[#171d28]">
        <span
          className={`absolute left-2 top-2 max-w-[calc(100%-1rem)] truncate rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.04em] ${
            isDirectoryProfile
              ? "bg-[#fff1e7] text-[#9b3d07] dark:bg-[#392418] dark:text-[#ffad70]"
              : "bg-[#eaf1ff] text-[#2449ad] dark:bg-[#1d315d] dark:text-[#b9ceff]"
          }`}
          title={profileLabel}
        >
          {isDirectoryProfile
            ? hasDirectorySource
              ? "Historical source"
              : "Research record"
            : "Editorial profile"}
        </span>
        <UniversityLogo
          university={university}
          size="md"
          priority={priority}
          className="h-10 w-[82%] max-w-[7.75rem] rounded-md border-0 bg-white sm:h-11"
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-2.5 pb-2 pt-2">
        <h3 className="line-clamp-2 min-h-8 font-display text-[0.78rem] font-extrabold leading-4 tracking-[-0.018em] sm:text-[0.82rem]">
          {university.name}
        </h3>
        <p
          className="mt-1 flex min-w-0 items-center gap-1 truncate text-[11px] font-semibold text-muted-foreground"
          title={formatUniversityLocation(university)}
        >
          <MapPin className="h-3 w-3 shrink-0 text-[#f47b25]" aria-hidden="true" />
          <span className="truncate">{formatUniversityLocation(university)}</span>
        </p>
        <div className="mt-auto border-t border-border pt-1.5">
          <p className="truncate text-[11px] font-extrabold text-foreground">
            {programs.length} {programs.length === 1 ? "course record" : "course records"}
          </p>
          <p
            className="mt-0.5 truncate text-[11px] font-semibold text-muted-foreground"
            title={
              hasSourcedFee
                ? `Lowest source-backed total fee starts at ${formatINR(cheapest)}`
                : "Confirm the exact current-intake fee with the university"
            }
          >
            {hasSourcedFee ? `Sourced from ${formatINR(cheapest)}` : "Fee: confirm intake"}
          </p>
        </div>
      </div>

      <span className="flex h-10 shrink-0 items-center justify-center gap-1.5 bg-[#325dd2] px-2 text-[11px] font-extrabold text-white transition-colors group-hover:bg-[#2449ad]">
        View courses
        <ArrowRight
          className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}
