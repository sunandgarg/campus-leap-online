import { Link } from "@tanstack/react-router";
import { universities, programCatalog } from "@/data/universities";
import { BrandLogo } from "@/components/site/brand-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#2B3340] bg-[#131720] text-white dark:bg-[#0B1018]">
      <div className="container-page grid gap-9 py-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        <div>
          <Link to="/" aria-label="DekhoCampus home" className="inline-flex rounded-lg">
            <BrandLogo size="lg" tone="inverse" />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/70">
            Clear information and personal guidance for choosing an online degree. Every programme
            is offered, admitted and awarded by its university.
          </p>
          <a
            href="https://dekhocampus.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-[#FF9A50] hover:underline"
          >
            Explore all of DekhoCampus →
          </a>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
            Universities
          </h3>
          <ul className="mt-3 text-sm">
            {universities.slice(0, 6).map((u) => (
              <li key={u.slug}>
                <Link
                  to="/universities/$universitySlug"
                  params={{ universitySlug: u.slug }}
                  className="inline-flex min-h-11 items-center text-white/75 transition-colors hover:text-[#FF9A50]"
                >
                  {u.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
            Online courses
          </h3>
          <ul className="mt-3 text-sm">
            {programCatalog.slice(0, 6).map((p) => (
              <li key={p.slug}>
                <Link
                  to="/programs/$programSlug"
                  params={{ programSlug: p.slug }}
                  className="inline-flex min-h-11 items-center text-white/75 transition-colors hover:text-[#FF9A50]"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
            Help and trust
          </h3>
          <ul className="mt-3 text-sm text-white/75">
            <li>
              <Link
                to="/finder"
                className="inline-flex min-h-11 items-center transition-colors hover:text-[#FF9A50]"
              >
                Find the right course
              </Link>
            </li>
            <li>
              <Link
                to="/specialisations"
                className="inline-flex min-h-11 items-center transition-colors hover:text-[#FF9A50]"
              >
                Explore specialisations
              </Link>
            </li>
            <li>
              <Link
                to="/methodology"
                className="inline-flex min-h-11 items-center transition-colors hover:text-[#FF9A50]"
              >
                How we verify information
              </Link>
            </li>
            <li>
              <Link
                to="/methodology"
                hash="admission-safety"
                className="inline-flex min-h-11 items-center transition-colors hover:text-[#FF9A50]"
              >
                Admission safety checklist
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="inline-flex min-h-11 items-center transition-colors hover:text-[#FF9A50]"
              >
                About DekhoCampus
              </Link>
            </li>
            <li>
              <a
                href="mailto:online@dekhocampus.in"
                className="inline-flex min-h-11 items-center transition-colors hover:text-[#FF9A50]"
              >
                online@dekhocampus.in
              </a>
            </li>
            <li className="flex min-h-11 flex-wrap items-center gap-x-4 text-xs">
              <Link to="/privacy" className="hover:text-[#FF9A50]">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-[#FF9A50]">
                Terms
              </Link>
              <Link to="/accessibility" className="hover:text-[#FF9A50]">
                Accessibility
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="inline-flex min-h-11 items-center font-semibold text-[#FF9A50] hover:underline"
              >
                Talk to a counsellor →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs leading-5 text-white/55 md:flex-row md:items-start md:justify-between">
          <p>© {new Date().getFullYear()} DekhoCampus Online. All rights reserved.</p>
          <p className="max-w-3xl md:text-right">
            Programme entitlement, fees, admissions and outcomes can change by intake. Verify the
            exact university–programme–mode–session combination on the{" "}
            <a
              href="https://deb.ugc.ac.in/"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-white/80 hover:text-[#FF9A50]"
            >
              UGC-DEB portal
            </a>{" "}
            and pay only through the university's official channel. DekhoCampus does not guarantee
            admission, placement, scholarship or salary.
          </p>
        </div>
      </div>
    </footer>
  );
}
