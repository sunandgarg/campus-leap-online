import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  GitCompareArrows,
  ShieldCheck,
  Target,
} from "lucide-react";
import { BrandLogo } from "@/components/site/brand-logo";
import { UniversityLogo } from "@/components/site/university-logo";
import { universities, universitiesOfferingProgram } from "@/data/universities";
import { coursePath, universityPath } from "@/lib/online-paths";

const mainLinks = [
  { to: "/programs", label: "Courses", icon: BookOpenCheck },
  { to: "/universities", label: "Universities", icon: Building2 },
  { to: "/compare", label: "Compare", icon: GitCompareArrows },
  { to: "/news", label: "News", icon: BookOpenCheck },
] as const;
const helpLinks = [
  { to: "/finder", label: "Find my course", icon: Target },
  { to: "/specialisations", label: "Specialisations", icon: BookOpenCheck },
  { to: "/methodology", label: "Check recognition & fees", icon: ShieldCheck },
  { to: "/about", label: "About DekhoCampus", icon: Building2 },
] as const;

export function HomeFooter() {
  const courseColumns = ["online-mba", "online-bba"].map((slug) => {
    const code = slug === "online-mba" ? "MBA" : "BBA";
    return {
      title: `Online ${code}`,
      links: universitiesOfferingProgram(slug)
        .sort(
          (a, b) =>
            Number(b.university.slug === "amity-university-online") -
              Number(a.university.slug === "amity-university-online") ||
            a.university.name.localeCompare(b.university.name),
        )
        .slice(0, 6)
        .map(({ university }) => ({
          label: `${university.shortName.replace(/\s+Online$/i, "")} ${code} course profile`,
          href: coursePath(university, slug),
          university,
        })),
      all: `/programs/${slug}`,
    };
  });
  const columns = [
    ...courseColumns,
    {
      title: "Universities",
      links: universities
        .filter((u) => u.programs.length > 0)
        .slice(0, 6)
        .map((university) => ({
          label: university.shortName,
          href: universityPath(university),
          university,
        })),
      all: "/universities",
    },
    {
      title: "Explore & support",
      links: [...mainLinks, ...helpLinks].map((link) => ({
        label: link.label,
        href: link.to,
        university: undefined,
      })),
      all: "/contact",
    },
  ];
  return (
    <footer className="site-footer border-t border-border bg-[#fffdf9] text-foreground dark:bg-[#0b1018]">
      <div className="container-page py-9 lg:py-16">
        <div className="grid gap-7 border-b border-border pb-8 lg:grid-cols-[1.25fr_0.85fr_0.85fr_0.85fr_0.9fr] lg:gap-7 lg:pb-12">
          <div className="lg:pr-6">
            <Link to="/" aria-label="DekhoCampus home">
              <BrandLogo size="lg" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              A simpler way to explore online degrees, compare universities and plan your next step.
            </p>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("dekhocampus:open-diya"))}
              className="mt-5 flex min-h-12 w-full max-w-sm items-center gap-3 rounded-xl border border-border bg-background px-3 py-2 text-left hover:border-primary"
            >
              <img
                src="/diya-ai.webp"
                alt=""
                width="36"
                height="36"
                className="rounded-full bg-white"
              />
              <span>
                <strong className="block text-sm">Ask Diya</strong>
                <span className="text-xs text-muted-foreground">
                  Find your way around DekhoCampus
                </span>
              </span>
            </button>
            <a
              href="https://dekhocampus.com"
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-primary"
            >
              Visit DekhoCampus.com <ArrowRight size={14} />
            </a>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="mb-3 text-sm font-bold">{column.title}</h2>
              <div className="flex flex-col">
                {column.links.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex min-h-11 items-center gap-2 py-2 text-sm leading-5 text-muted-foreground hover:text-primary"
                  >
                    {item.university && (
                      <UniversityLogo
                        university={item.university}
                        size="md"
                        className="footer-university-logo"
                      />
                    )}
                    {item.label}
                  </a>
                ))}
                <a
                  href={column.all}
                  className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary"
                >
                  View all <ArrowRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 py-6 text-sm">
          <div>
            <p className="font-semibold">Need help with your shortlist?</p>
            <a
              href="mailto:online@dekhocampus.com"
              className="inline-flex min-h-11 items-center text-primary"
            >
              online@dekhocampus.com
            </a>
          </div>
          <nav aria-label="Legal" className="flex flex-wrap gap-5">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/accessibility">Accessibility</Link>
          </nav>
        </div>
        <div className="border-t border-border pt-5 text-xs leading-6 text-muted-foreground">
          <p className="font-semibold text-foreground">One important check before you pay</p>
          <p>
            Course availability, fees and admission details can change by intake. Confirm the exact
            university, programme, Online mode and academic session on the university website and
            the relevant official portal.
          </p>
          <p className="mt-4">
            © {new Date().getFullYear()} DekhoCampus Online. All rights reserved.
          </p>
          <p>
            DekhoCampus helps learners research their options. Universities manage admissions, fees,
            scholarships, placements and academic delivery.
          </p>
        </div>
      </div>
    </footer>
  );
}
