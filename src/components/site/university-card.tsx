import { Link } from "@tanstack/react-router";
import { ArrowUpRight, BookOpenCheck, MapPin } from "lucide-react";
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
    ? `${currentPrograms.length} current ${currentPrograms.length === 1 ? "online course" : "online courses"}`
    : programs.length
      ? `${programs.length} ${programs.length === 1 ? "course profile" : "course profiles"} · confirm availability`
      : "University profile";

  return (
    <Link
      to="/universities/$universitySlug"
      params={{ universitySlug: university.slug }}
      aria-label={
        currentPrograms.length
          ? `Explore ${university.name} and its current online courses`
          : `Explore ${university.name} profile and check course availability`
      }
      className="group relative flex h-[10.75rem] min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_9px_25px_-24px_rgba(19,23,32,0.65)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#80ace0] hover:shadow-[0_14px_30px_-22px_rgba(50,93,210,0.48)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#325dd2] focus-visible:ring-offset-2"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-10 h-1"
        style={{ backgroundColor: university.accentColor }}
      />

      <div className="flex h-[4.6rem] shrink-0 items-center justify-center border-b border-border bg-[#f8faff] px-2.5 pb-2 pt-3 dark:bg-[#171d28]">
        <UniversityLogo
          university={university}
          size="md"
          priority={priority}
          className="h-12 w-[92%] max-w-[8.4rem] rounded-md border-0 bg-white"
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-2.5">
        <p className="flex items-center gap-1 text-[10px] font-extrabold text-[#2449ad] dark:text-[#a9c0ff]">
          <BookOpenCheck className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span className="line-clamp-2">{courseSummary}</span>
        </p>
        <h3 className="mt-1 line-clamp-2 min-h-8 font-display text-xs font-extrabold leading-4 tracking-[-0.015em] sm:text-[0.82rem]">
          {university.name}
        </h3>
        <div className="mt-auto flex min-w-0 items-end justify-between gap-1.5">
          <p className="flex min-w-0 items-start gap-1 text-[10px] font-semibold leading-3.5 text-muted-foreground">
            <MapPin className="mt-px h-3 w-3 shrink-0 text-[#f47b25]" aria-hidden="true" />
            <span className="line-clamp-2">{location}</span>
          </p>
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#edf2ff] text-[#2449ad] transition-colors group-hover:bg-[#325dd2] group-hover:text-white dark:bg-[#243352] dark:text-[#a9c0ff]">
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
