import { createFileRoute } from "@tanstack/react-router";
import { universities, programCatalog } from "@/data/universities";

const ORIGIN = "https://online.dekhocampus.in";

export const Route = createFileRoute("/sitemap[.]xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls: string[] = [
          "/",
          "/universities",
          "/programs",
          "/compare",
          "/about",
          "/contact",
          ...programCatalog.map((p) => `/programs/${p.slug}`),
          ...universities.flatMap((u) => [
            `/universities/${u.slug}`,
            ...u.programs.map((p) => `/universities/${u.slug}/${p.slug}`),
          ]),
        ];

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${ORIGIN}${u}</loc><changefreq>weekly</changefreq><priority>${u === "/" ? "1.0" : "0.8"}</priority></url>`,
  )
  .join("\n")}
</urlset>`;

        return new Response(body, {
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
