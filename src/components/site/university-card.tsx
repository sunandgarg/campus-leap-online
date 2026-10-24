import { Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin } from "lucide-react";
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
  const current = programs.filter(
    (program) =>
      university.profileDepth !== "directory" &&
      university.verificationCurrent === true &&
      program.entitlementStatus === "verified",
  );
  const summary = current.length
    ? `${current.length} current courses`
    : programs.length
      ? `${programs.length} course profiles`
      : "Explore university";
  return (
    <Link
      to="/universities/$universitySlug"
      params={{ universitySlug: university.slug }}
      aria-label={`Explore ${university.name} profile and check course availability`}
      className="university-list-row group flex min-h-28 min-w-0 items-center gap-4 border-b border-border py-5 text-left transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
    >
      <UniversityLogo
        university={university}
        priority={priority}
        className="h-14 w-20 rounded-none border-0 bg-transparent"
      />
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold leading-6 group-hover:text-primary">
          {university.name}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
          {formatUniversityLocation(university)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{summary}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
    </Link>
  );
}
