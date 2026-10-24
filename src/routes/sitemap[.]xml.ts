import { createFileRoute } from "@tanstack/react-router";
import { resolveCatalog } from "@/data/universities";
import { slugifySpecialisation } from "@/data/specialisations";
import { getCatalog } from "@/lib/catalog.functions";
import { universityPath, coursePath } from "@/lib/online-paths";
import { SITE_ORIGIN } from "@/lib/site-origin";
import { newsItems, newsPath } from "@/data/news";

function pathSegment(value: string) {
  return encodeURIComponent(value);
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const catalog = resolveCatalog(await getCatalog());
        const urls: string[] = [
          "/",
          "/universities",
          "/online-universities",
          "/scholarships",
          "/news",
          ...newsItems.map(newsPath),
          "/programs",
          "/finder",
          "/specialisations",
          "/compare",
          "/methodology",
          "/about",
          "/privacy",
          "/terms",
          "/accessibility",
          "/contact",
          ...catalog.programs.map((program) => `/programs/${pathSegment(program.slug)}`),
          ...catalog.programs.flatMap((program) =>
            program.specialisations
              .filter((specialisation) =>
                catalog.universities.some(
                  (university) =>
                    university.profileDepth !== "directory" &&
                    university.verificationCurrent === true &&
                    university.programs.some(
                      (offering) =>
                        offering.slug === program.slug &&
                        offering.entitlementStatus === "verified" &&
                        offering.specialisationsVerified === true &&
                        offering.specialisations?.some(
                          (name) => name.toLowerCase() === specialisation.toLowerCase(),
                        ),
                    ),
                ),
              )
              .map(
                (specialisation) =>
                  `/specialisations/${pathSegment(program.slug.replace(/^online-/, ""))}-${pathSegment(slugifySpecialisation(specialisation))}`,
              ),
          ),
          ...catalog.universities.flatMap((u) =>
            u.profileDepth === "directory" || !u.verificationCurrent
              ? []
              : [
                  universityPath(u),
                  `${universityPath(u)}/courses-fees`,
                  ...u.programs
                    .filter((program) => program.entitlementStatus === "verified")
                    .map((program) => coursePath(u, program.slug)),
                ],
          ),
        ];

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${escapeXml(`${SITE_ORIGIN}${u}`)}</loc><changefreq>weekly</changefreq><priority>${u === "/" ? "1.0" : "0.8"}</priority></url>`,
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
