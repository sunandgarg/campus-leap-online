import { Link } from "@tanstack/react-router";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { BrandLogo } from "@/components/site/brand-logo";
import { programCatalog, universities, universitiesOfferingProgram } from "@/data/universities";

function popularCourseRecords(programSlug: "online-mba" | "online-bba") {
  return universitiesOfferingProgram(programSlug)
    .sort((a, b) => {
      if (a.university.slug === "amity-university-online") return -1;
      if (b.university.slug === "amity-university-online") return 1;
      return a.university.name.localeCompare(b.university.name);
    })
    .slice(0, 6);
}

export function SiteFooter() {
  const mbaRecords = popularCourseRecords("online-mba");
  const bbaRecords = popularCourseRecords("online-bba");
  const universityLinks = universities
    .filter((university) => university.programs.length > 0)
    .slice(0, 6);

  return (
    <footer className="border-t border-[#2b3340] bg-[#131720] text-white dark:bg-[#0b1018]">
      <div className="container-page py-16 lg:py-20">
        <div className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[1.35fr_0.8fr_0.8fr_0.9fr_0.9fr] lg:gap-8">
          <div className="lg:pr-8">
            <Link to="/" aria-label="DekhoCampus home" className="inline-flex rounded-lg">
              <BrandLogo size="lg" tone="inverse" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/70">
              Clear information and personal guidance for choosing an online degree. Browse
              privately, inspect the evidence, and ask for human help when you need it.
            </p>
            <div className="mt-6 rounded-xl border border-white/15 bg-[#1b202a] p-4">
              <div className="flex items-center gap-2 text-sm font-extrabold">
                <ShieldCheck className="h-4 w-4 text-[#ff9a50]" aria-hidden="true" />
                Verify before you pay
              </div>
              <p className="mt-2 text-xs leading-5 text-white/60">
                Confirm the exact university, programme, Online mode and academic session on
                official sources.
              </p>
            </div>
            <a
              href="https://dekhocampus.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-extrabold text-[#ff9a50] hover:underline"
            >
              Explore all of DekhoCampus <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <FooterColumn title="Online MBA">
            {mbaRecords.map(({ university, program }) => (
              <li key={university.slug}>
                <Link
                  to="/universities/$universitySlug/$programSlug"
                  params={{ universitySlug: university.slug, programSlug: program.slug }}
                  className="footer-link"
                >
                  {university.shortName} Online MBA
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/programs/$programSlug"
                params={{ programSlug: "online-mba" }}
                className="footer-link font-bold text-[#ffad70]"
              >
                Compare all MBA records
              </Link>
            </li>
          </FooterColumn>

          <FooterColumn title="Online BBA">
            {bbaRecords.map(({ university, program }) => (
              <li key={university.slug}>
                <Link
                  to="/universities/$universitySlug/$programSlug"
                  params={{ universitySlug: university.slug, programSlug: program.slug }}
                  className="footer-link"
                >
                  {university.shortName} Online BBA
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/programs/$programSlug"
                params={{ programSlug: "online-bba" }}
                className="footer-link font-bold text-[#ffad70]"
              >
                Compare all BBA records
              </Link>
            </li>
          </FooterColumn>

          <FooterColumn title="Universities">
            {universityLinks.map((university) => (
              <li key={university.slug}>
                <Link
                  to="/universities/$universitySlug"
                  params={{ universitySlug: university.slug }}
                  className="footer-link"
                >
                  {university.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/universities" className="footer-link font-bold text-[#ffad70]">
                All {universities.length} universities
              </Link>
            </li>
          </FooterColumn>

          <FooterColumn title="Help and trust">
            <li>
              <Link to="/finder" className="footer-link">
                Find the right course
              </Link>
            </li>
            <li>
              <Link to="/programs" className="footer-link">
                Browse {programCatalog.length} course guides
              </Link>
            </li>
            <li>
              <Link to="/specialisations" className="footer-link">
                Explore specialisations
              </Link>
            </li>
            <li>
              <Link to="/compare" className="footer-link">
                Compare universities
              </Link>
            </li>
            <li>
              <Link to="/methodology" className="footer-link">
                How we verify information
              </Link>
            </li>
            <li>
              <Link to="/about" className="footer-link">
                About DekhoCampus
              </Link>
            </li>
            <li>
              <Link to="/contact" className="footer-link font-bold text-[#ffad70]">
                Talk to a counsellor
              </Link>
            </li>
          </FooterColumn>
        </div>

        <div className="grid gap-7 py-9 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <p className="text-sm font-extrabold">Need help with your shortlist?</p>
            <a
              href="mailto:online@dekhocampus.in"
              className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white/75 hover:text-[#ff9a50]"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              online@dekhocampus.in
            </a>
          </div>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/65">
            <Link to="/privacy" className="inline-flex min-h-11 items-center hover:text-[#ff9a50]">
              Privacy
            </Link>
            <Link to="/terms" className="inline-flex min-h-11 items-center hover:text-[#ff9a50]">
              Terms
            </Link>
            <Link
              to="/accessibility"
              className="inline-flex min-h-11 items-center hover:text-[#ff9a50]"
            >
              Accessibility
            </Link>
          </nav>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-7 text-xs leading-5 text-white/60 md:flex-row md:items-start md:justify-between">
          <p>© {new Date().getFullYear()} DekhoCampus Online. All rights reserved.</p>
          <p className="max-w-3xl md:text-right">
            Programme entitlement, fees, admissions and outcomes can change by intake. Verify the
            exact university–programme–mode–session combination on the{" "}
            <a
              href="https://deb.ugc.ac.in/"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-white/85 hover:text-[#ff9a50]"
            >
              UGC-DEB portal
            </a>{" "}
            and pay only through the university&apos;s official channel. DekhoCampus does not
            guarantee admission, placement, scholarship or salary.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-extrabold uppercase tracking-[0.14em] text-white/65">{title}</h2>
      <ul className="mt-4 text-sm">{children}</ul>
    </div>
  );
}
