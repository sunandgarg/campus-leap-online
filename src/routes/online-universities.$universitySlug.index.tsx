import { createFileRoute, notFound } from "@tanstack/react-router";
import { OnlineUniversityPage } from "@/components/site/online-profile-page";
import { resolveOnlineUniversity, profileName } from "@/lib/online-paths";

export const Route = createFileRoute("/online-universities/$universitySlug/")({
  loader: ({ params }) => {
    const university = resolveOnlineUniversity(params.universitySlug);
    if (!university) throw notFound();
    return { university };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData ? profileName(loaderData.university) : "University"} Courses, Fees & Admission | DekhoCampus`,
      },
      {
        name: "description",
        content:
          "Explore online courses, eligibility, available fee information and the admission checklist. Get independent university guidance from DekhoCampus.",
      },
      ...(!loaderData?.university.verificationCurrent ||
      loaderData?.university.profileDepth === "directory"
        ? [{ name: "robots", content: "noindex,follow" }]
        : []),
    ],
  }),
  component: function UniversityOverviewRoute() {
    return <OnlineUniversityPage university={Route.useLoaderData().university} />;
  },
});
