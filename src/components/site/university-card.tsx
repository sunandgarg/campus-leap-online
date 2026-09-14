import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
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
  const hasSourcedFee = !isDirectoryProfile && Number.isFinite(cheapest);
  const profileLabel = isDirectoryProfile
    ? hasDirectorySource
      ? "Historical source"
      : "Directory record"
    : "Editorial profile";
  const compactProfileLabel = isDirectoryProfile
    ? hasDirectorySource
      ? "Historical"
      : "Directory"
    : "Editorial";
  return (
    <Link
      to="/universities/$universitySlug"
      params={{ universitySlug: university.slug }}
      className="group relative flex h-[7.75rem] min-w-0 overflow-hidden rounded-2xl border border-border border-t-[3px] border-t-[#f47b25] bg-card shadow-[0_12px_28px_-24px_rgba(19,23,32,0.55)] transition-[border-color,box-shadow] duration-200 hover:border-[#325dd2] hover:shadow-[0_16px_32px_-22px_rgba(50,93,210,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#325dd2] focus-visible:ring-offset-2"
    >
      <div className="flex w-[4.75rem] shrink-0 items-center justify-center border-r border-border bg-[#f6f8fc] p-2 dark:bg-[#171d28]">
        <UniversityLogo
          university={university}
          size="md"
          priority={priority}
          className="h-14 w-full rounded-lg bg-white"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-2.5">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <span
            className="truncate text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#a94300] dark:text-[#ffad70]"
            aria-label={profileLabel}
            title={profileLabel}
          >
            {compactProfileLabel}
          </span>
          <ArrowUpRight
            aria-hidden="true"
            className="h-3.5 w-3.5 shrink-0 text-[#325dd2] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-[#8cb0ff]"
          />
        </div>

        <h3 className="mt-1 line-clamp-2 font-display text-xs font-extrabold leading-[1.2] tracking-[-0.015em]">
          {university.name}
        </h3>
        <p className="mt-1 truncate text-[10px] leading-none text-muted-foreground">
          {formatUniversityLocation(university)}
        </p>

        <p
          className="mt-auto truncate border-t border-border pt-1.5 text-[10px] font-bold text-muted-foreground"
          title={`${programs.length} ${programs.length === 1 ? "course record" : "course records"} · ${hasSourcedFee ? `Fee from ${formatINR(cheapest)}` : "Fee: check intake"}`}
        >
          {programs.length} {programs.length === 1 ? "record" : "records"}
          <span aria-hidden="true"> · </span>
          {hasSourcedFee ? `From ${formatINR(cheapest)}` : "Fee check"}
        </p>
      </div>
    </Link>
  );
}
