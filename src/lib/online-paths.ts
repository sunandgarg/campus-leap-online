import {
  getUniversity,
  getUniversityPrograms,
  programCatalog,
  universities,
  type University,
} from "@/data/universities";
import { profileDetails, specialistCourses } from "@/data/online-profile-details";

export function profileName(university: University) {
  return (
    profileDetails[university.slug as keyof typeof profileDetails]?.displayName ?? university.name
  );
}

export function publishedCourseFee(
  course: NonNullable<ReturnType<typeof resolveOnlineCourse>>,
  today = new Date().toISOString().slice(0, 10),
) {
  if (course.specialist) {
    return today >= course.specialist.checkedAt && today <= course.specialist.reviewBy
      ? course.specialist.fee
      : null;
  }
  const p = course.offering;
  return p &&
    course.university.verificationCurrent === true &&
    p.entitlementStatus === "verified" &&
    p.feesVerified &&
    p.totalFeeAvailable
    ? p.totalFee
    : null;
}

export function publicId(value: string) {
  let hash = 2166136261;
  for (const char of value) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return String(1000000000 + (hash >>> 0));
}

export function universityPublicSlug(university: University) {
  return (
    profileDetails[university.slug as keyof typeof profileDetails]?.publicSlug ??
    `${university.slug}-${publicId(university.slug)}`
  );
}
export function universityPath(university: University) {
  return `/online-universities/${universityPublicSlug(university)}`;
}
export function resolveOnlineUniversity(slug: string) {
  return universities.find((university) => universityPublicSlug(university) === slug);
}
export function coursePublicSlug(university: University, programSlug: string) {
  const code = programCatalog.find((program) => program.slug === programSlug)?.code ?? programSlug;
  const label = code
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${label}-online-${publicId(`${university.slug}/${programSlug}`)}`;
}
export function coursePath(university: University, programSlug: string) {
  return `${universityPath(university)}/courses-fees/${coursePublicSlug(university, programSlug)}`;
}
export function specialistPath(course: (typeof specialistCourses)[number]) {
  const university = getUniversity(course.universitySlug);
  return university ? `${universityPath(university)}/courses-fees/${course.publicSlug}` : null;
}
export function resolveOnlineCourse(university: University, slug: string) {
  const specialist = specialistCourses.find(
    (course) => course.universitySlug === university.slug && course.publicSlug === slug,
  );
  const offering = getUniversityPrograms(university).find(
    (program) =>
      coursePublicSlug(university, program.slug) === slug ||
      specialist?.programSlug === program.slug,
  );
  const program =
    offering ??
    (specialist ? programCatalog.find((item) => item.slug === specialist.programSlug) : undefined);
  return program && (specialist || offering)
    ? { university, program, offering, specialist }
    : undefined;
}
