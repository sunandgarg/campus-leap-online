import { createFileRoute, notFound } from "@tanstack/react-router";
import { OnlineCoursePage } from "@/components/site/online-profile-page";
import { resolveOnlineCourse, resolveOnlineUniversity, profileName } from "@/lib/online-paths";

export const Route = createFileRoute(
  "/online-universities/$universitySlug/courses-fees/$courseSlug",
)({
  loader: ({ params }) => {
    const university = resolveOnlineUniversity(params.universitySlug);
    const course = university && resolveOnlineCourse(university, params.courseSlug);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${profileName(loaderData.course.university)} ${loaderData.course.specialist?.name ?? `Online ${loaderData.course.program.code}`} — Fees, Eligibility & Syllabus | DekhoCampus`
          : "Course not found | DekhoCampus",
      },
      {
        name: "description",
        content:
          "Review programme highlights, eligibility, semester curriculum, available fee details and official sources before choosing an online degree.",
      },
      ...(!loaderData?.course.university.verificationCurrent ||
      loaderData?.course.university.profileDepth === "directory" ||
      loaderData?.course.offering?.entitlementStatus !== "verified" ||
      loaderData?.course.specialist
        ? [{ name: "robots", content: "noindex,follow" }]
        : []),
    ],
  }),
  component: function UniversityCourseRoute() {
    return <OnlineCoursePage course={Route.useLoaderData().course} />;
  },
});
