import { createFileRoute } from "@tanstack/react-router";
import { UniversitiesPage } from "./universities.index";

export const Route = createFileRoute("/online-universities/")({
  head: () => ({
    meta: [{ title: "Online Universities in India — Courses & Fees | DekhoCampus" }],
  }),
  component: UniversitiesPage,
});
