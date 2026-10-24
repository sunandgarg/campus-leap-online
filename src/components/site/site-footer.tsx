import { ArrowRight, Mail } from "lucide-react";
import { BrandLogo } from "@/components/site/brand-logo";
import { UniversityLogo } from "@/components/site/university-logo";
import { programCatalog, universities, universitiesOfferingProgram } from "@/data/universities";
import { coursePath, universityPath } from "@/lib/online-paths";

export function SiteFooter() {
  const featured = [
    "amity-university-online",
    "lpu-online",
    "manipal-university-online",
    "chandigarh-university-online",
    "jaypee-institute-of-information-technology-uttar-pradesh",
  ]
    .map((slug) => universities.find((u) => u.slug === slug))
    .filter((u) => u !== undefined);
  const columns = [
    {
      title: "Listings",
      items: [
        ["List of Online Universities", "/online-universities"],
        ["List of Online Courses", "/programs"],
        ["News & Guides", "/news"],
        ["Specialisations", "/specialisations"],
        ["Admission Checklist", "/methodology"],
      ],
    },
    { title: "Top Universities", items: featured.map((u) => [u.shortName, universityPath(u)]) },
    {
      title: "Trending Degrees",
      items: programCatalog.slice(0, 5).map((p) => [`Online ${p.code}`, `/programs/${p.slug}`]),
    },
    {
      title: "Quick Links",
      items: [
        ["About Us", "/about"],
        ["Contact Us", "/contact"],
        ["Course Finder", "/finder"],
        ["Compare Universities", "/compare"],
        ["Scholarships", "/scholarships"],
        ["Terms and Conditions", "/terms"],
      ],
    },
  ];
  return (
    <footer className="reference-footer site-footer">
      <div className="profile-container">
        <div className="reference-footer-intro">
          <div>
            <h2>Your next chapter starts with a better choice.</h2>
            <p>
              Explore online degrees, understand the options and compare universities with
              DekhoCampus. Clear information first. A conversation when you need one.
            </p>
          </div>
          <a className="profile-button profile-button-outline" href="/contact">
            Talk to a counsellor <ArrowRight size={14} />
          </a>
        </div>
        <div className="reference-footer-columns">
          {columns.map((column) => (
            <div key={column.title}>
              <h3>{column.title}</h3>
              {column.items.map(([label, href]) => (
                <a key={href} href={href}>
                  {label}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="reference-footer-quick">
          <h2>ONLINE DEGREES — QUICK ACCESS</h2>
          <div>
            {programCatalog.slice(0, 8).map((program) => (
              <section key={program.slug}>
                <h3>
                  <a href={`/programs/${program.slug}`}>Online {program.code}</a>
                </h3>
                {universitiesOfferingProgram(program.slug)
                  .slice(0, 5)
                  .map(({ university }) => (
                    <a key={university.slug} href={coursePath(university, program.slug)}>
                      <UniversityLogo
                        university={university}
                        size="md"
                        className="footer-university-logo"
                      />
                      <span>
                        {university.shortName} {program.code}
                      </span>
                    </a>
                  ))}
                <a className="reference-footer-all" href={`/programs/${program.slug}`}>
                  View all <ArrowRight size={12} />
                </a>
              </section>
            ))}
          </div>
        </div>
        <div className="reference-footer-bottom">
          <a href="/" aria-label="DekhoCampus home">
            <BrandLogo size="lg" />
          </a>
          <div>
            <a href="/privacy">Privacy Policy</a>
            <a href="/accessibility">Accessibility</a>
            <a href="/contact">
              <Mail size={14} />
              Contact
            </a>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("dekhocampus:open-diya"))}
            >
              <img src="/diya-ai.webp" width="22" height="22" alt="" />
              Ask Diya AI
            </button>
          </div>
        </div>
        <p className="reference-footer-copyright">
          © {new Date().getFullYear()} DekhoCampus. All rights reserved. Independent education
          guidance; university names and marks belong to their respective owners. Admission,
          programme availability and fees must be confirmed with the university.
        </p>
      </div>
    </footer>
  );
}
