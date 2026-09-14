import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Mail, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import { BrandLogo } from "@/components/site/brand-logo";
import {
  programCatalog,
  universities,
  universitiesOfferingProgram,
  type ProgramOffer,
} from "@/data/universities";

function popularCourseRecords(programSlug: "online-mba" | "online-bba") {
  return universitiesOfferingProgram(programSlug)
    .sort((a, b) => {
      if (a.university.slug === "amity-university-online") return -1;
      if (b.university.slug === "amity-university-online") return 1;
      return a.university.name.localeCompare(b.university.name);
    })
    .slice(0, 6);
}

function providerName(name: string) {
  return name.replace(/\s+Online$/i, "");
}

function hasCurrentOfferingEvidence({ university, program }: ProgramOffer) {
  return (
    university.profileDepth !== "directory" &&
    university.verificationCurrent === true &&
    program.entitlementStatus === "verified"
  );
}

export function SiteFooter() {
  const mbaRecords = popularCourseRecords("online-mba");
  const bbaRecords = popularCourseRecords("online-bba");
  const universityLinks = universities
    .filter((university) => university.programs.length > 0)
    .slice(0, 6);

  const columns = [
    {
      title: "Online MBA",
      items: mbaRecords.map(({ university, program }) => ({
        label: hasCurrentOfferingEvidence({ university, program })
          ? `${providerName(university.shortName)} Online MBA`
          : `${providerName(university.shortName)} MBA course profile`,
        to: "/universities/$universitySlug/$programSlug" as const,
        params: { universitySlug: university.slug, programSlug: program.slug },
      })),
      end: {
        label: "Explore Online MBA course profiles",
        to: "/programs/$programSlug" as const,
        params: { programSlug: "online-mba" },
      },
    },
    {
      title: "Online BBA",
      items: bbaRecords.map(({ university, program }) => ({
        label: hasCurrentOfferingEvidence({ university, program })
          ? `${providerName(university.shortName)} Online BBA`
          : `${providerName(university.shortName)} BBA course profile`,
        to: "/universities/$universitySlug/$programSlug" as const,
        params: { universitySlug: university.slug, programSlug: program.slug },
      })),
      end: {
        label: "Explore Online BBA course profiles",
        to: "/programs/$programSlug" as const,
        params: { programSlug: "online-bba" },
      },
    },
  ];

  return (
    <footer className="border-t border-[#2b3340] bg-[#131720] text-white dark:bg-[#0b1018]">
      <div className="container-page py-10 lg:py-16">
        <div className="grid gap-8 border-b border-white/10 pb-9 lg:grid-cols-[1.25fr_0.85fr_0.85fr_0.85fr_0.9fr] lg:gap-7 lg:pb-12">
          <div className="lg:pr-6">
            <Link to="/" aria-label="DekhoCampus home" className="inline-flex rounded-lg">
              <BrandLogo size="lg" tone="inverse" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
              A simpler way to explore online degrees, compare universities and plan your next step.
            </p>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("dekhocampus:open-diya"))}
              className="mt-5 flex min-h-12 w-full max-w-sm items-center gap-3 rounded-xl border border-white/15 bg-[#1b202a] px-3 text-left transition-colors hover:border-[#8cb0ff]"
            >
              <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white">
                <img
                  src="/diya-ai.webp"
                  alt=""
                  width={90}
                  height={96}
                  className="h-9 w-9 object-cover"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold">Ask Diya</span>
                <span className="block text-[11px] text-white/60">
                  Find your way around DekhoCampus
                </span>
              </span>
              <Sparkles className="h-4 w-4 text-[#ffad70]" />
            </button>
            <a
              href="https://dekhocampus.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-extrabold text-[#ffad70] hover:underline"
            >
              Visit DekhoCampus.com <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="space-y-2 lg:hidden">
            {columns.map((column) => (
              <MobileFooterGroup key={column.title} title={column.title}>
                {column.items.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} params={item.params} className="footer-link">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to={column.end.to}
                    params={column.end.params}
                    className="footer-link font-bold text-[#ffad70]"
                  >
                    {column.end.label}
                  </Link>
                </li>
              </MobileFooterGroup>
            ))}

            <MobileFooterGroup title="Universities">
              {universityLinks.map((university) => (
                <li key={university.slug}>
                  <Link
                    to="/universities/$universitySlug"
                    params={{ universitySlug: university.slug }}
                    className="footer-link"
                  >
                    {university.shortName}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/universities" className="footer-link font-bold text-[#ffad70]">
                  View all universities
                </Link>
              </li>
            </MobileFooterGroup>

            <MobileFooterGroup title="Explore & support">
              <SupportLinks />
            </MobileFooterGroup>
          </div>

          <div className="hidden lg:contents">
            {columns.map((column) => (
              <FooterColumn key={column.title} title={column.title}>
                {column.items.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} params={item.params} className="footer-link">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to={column.end.to}
                    params={column.end.params}
                    className="footer-link font-bold text-[#ffad70]"
                  >
                    {column.end.label}
                  </Link>
                </li>
              </FooterColumn>
            ))}

            <FooterColumn title="Universities">
              {universityLinks.map((university) => (
                <li key={university.slug}>
                  <Link
                    to="/universities/$universitySlug"
                    params={{ universitySlug: university.slug }}
                    className="footer-link"
                  >
                    {university.shortName}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/universities" className="footer-link font-bold text-[#ffad70]">
                  View all universities
                </Link>
              </li>
            </FooterColumn>

            <FooterColumn title="Explore & support">
              <SupportLinks />
            </FooterColumn>
          </div>
        </div>

        <div className="grid gap-5 py-7 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-extrabold">Need help with your shortlist?</p>
            <a
              href="mailto:online@dekhocampus.com"
              className="mt-1 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white/75 hover:text-[#ff9a50]"
            >
              <Mail className="h-4 w-4" /> online@dekhocampus.com
            </a>
          </div>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/65">
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

        <div className="rounded-xl border border-white/10 bg-[#1b202a] p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#ff9a50]" />
            <div>
              <p className="text-sm font-extrabold">One important check before you pay</p>
              <p className="mt-1 text-xs leading-5 text-white/60">
                Course availability, fees and admission details can change by intake. Confirm the
                exact university, programme, Online mode and academic session on the university
                website and the relevant official portal.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-7 text-xs leading-5 text-white/50 md:flex-row md:items-start md:justify-between">
          <p>© {new Date().getFullYear()} DekhoCampus Online. All rights reserved.</p>
          <p className="max-w-2xl md:text-right">
            DekhoCampus helps learners research their options. Universities manage admissions, fees,
            scholarships, placements and academic delivery.
          </p>
        </div>
      </div>
    </footer>
  );
}

function SupportLinks() {
  return (
    <>
      <li>
        <Link to="/finder" className="footer-link">
          Find the right course
        </Link>
      </li>
      <li>
        <Link to="/programs" className="footer-link">
          Browse {programCatalog.length} courses
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
          What to check before paying
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
    </>
  );
}

function MobileFooterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group rounded-xl border border-white/10 bg-[#1b202a] px-4">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-sm font-extrabold marker:content-none">
        {title}
        <ChevronDown className="h-4 w-4 text-white/60 transition-transform group-open:rotate-180" />
      </summary>
      <ul className="border-t border-white/10 pb-3 pt-2 text-sm">{children}</ul>
    </details>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-extrabold uppercase tracking-[0.12em] text-white/60">{title}</h2>
      <ul className="mt-3 text-sm">{children}</ul>
    </div>
  );
}
