import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { UniversityLogo } from "./university-logo";
import {
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
  const currentPrograms = programs.filter(
    (program) =>
      university.profileDepth !== "directory" &&
      university.verificationCurrent === true &&
      program.entitlementStatus === "verified",
  );
  const location = formatUniversityLocation(university);
  const courseSummary = currentPrograms.length
    ? `${currentPrograms.length} current ${currentPrograms.length === 1 ? "course" : "courses"}`
    : programs.length
      ? `${programs.length} ${programs.length === 1 ? "course profile" : "course profiles"}`
      : "University details";

  return (
    <Link
      to="/universities/$universitySlug"
      params={{ universitySlug: university.slug }}
      aria-label={
        currentPrograms.length
          ? `Explore ${university.name} and its current online courses`
          : `Explore ${university.name} profile and check course availability`
      }
      className="group flex h-[12rem] min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_10px_28px_-26px_rgba(19,23,32,0.72)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#9db9f6] hover:shadow-[0_16px_34px_-26px_rgba(50,93,210,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#325dd2] focus-visible:ring-offset-2"
    >
      <div className="flex min-h-8 items-center justify-between gap-2 px-3 pt-2.5">
        <p className="line-clamp-1 text-[10px] font-extrabold text-[#2449ad] dark:text-[#a9c0ff]">
          {courseSummary}
        </p>
        <span
          aria-hidden="true"
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: university.accentColor }}
        />
      </div>

      <div className="flex h-[4.4rem] shrink-0 items-center justify-center px-3 py-1">
        <UniversityLogo
          university={university}
          size="md"
          priority={priority}
          className="h-14 w-[94%] max-w-[8.6rem] rounded-lg border-0 bg-white"
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3 pb-2.5 pt-1">
        <h3 className="line-clamp-2 min-h-9 text-center font-display text-xs font-extrabold leading-[1.1rem] tracking-[-0.015em] sm:text-sm">
          {university.name}
        </h3>
        <p className="mt-1 flex min-w-0 items-center justify-center gap-1 text-center text-[10px] font-semibold leading-4 text-muted-foreground sm:text-[11px]">
          <MapPin className="h-3 w-3 shrink-0 text-[#f47b25]" aria-hidden="true" />
          <span className="line-clamp-1">{location}</span>
        </p>
      </div>

      <span className="flex min-h-9 shrink-0 items-center justify-center gap-1.5 border-t border-border bg-[#f7f9ff] px-3 text-[11px] font-extrabold text-[#2449ad] transition-colors group-hover:bg-[#325dd2] group-hover:text-white dark:bg-[#1b2230] dark:text-[#b9ceff]">
        View university <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
    </Link>
  );
}
