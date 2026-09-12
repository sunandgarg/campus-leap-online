import { createFileRoute } from "@tanstack/react-router";

import { HomePage } from "@/components/site/home-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Find the Right Online Degree in India | DekhoCampus Online",
      },
      {
        name: "description",
        content:
          "Explore online MBA, BBA, MCA, BCA and other degrees by university, source status, fees where verified and specialisation. Get a private, free shortlist.",
      },
      {
        property: "og:title",
        content: "Find the online degree built around your ambition",
      },
      {
        property: "og:description",
        content:
          "Clear source status, ungated comparison and optional expert counselling from DekhoCampus Online.",
      },
    ],
  }),
  component: HomePage,
});
