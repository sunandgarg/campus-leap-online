import { createFileRoute, notFound } from "@tanstack/react-router";
import { OnlineUniversityPage } from "@/components/site/online-profile-page";
import { resolveOnlineUniversity, profileName } from "@/lib/online-paths";

export const Route = createFileRoute("/online-universities/$universitySlug/faculty")({
  loader: ({ params }) => {
    const university = resolveOnlineUniversity(params.universitySlug);
    if (!university) throw notFound();
    return { university };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData ? profileName(loaderData.university) : "University"} Faculty & Academic Support | DekhoCampus`,
      },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
  component: function UniversityFacultyRoute() {
    return <OnlineUniversityPage university={Route.useLoaderData().university} tab="faculty" />;
  },
});
