import { Link } from "@tanstack/react-router";
import { universities, programCatalog } from "@/data/universities";
import { BrandLogo } from "@/components/site/brand-logo";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" aria-label="DekhoCampus home" className="inline-flex rounded-lg">
            <BrandLogo size="lg" tone="inverse" />
          </Link>
          <p className="mt-4 max-w-xs text-sm text-ink-foreground/70">
            An independent education discovery and counselling platform. Programmes are offered,
            admitted and awarded solely by the respective university.
          </p>
          <a
            href="https://dekhocampus.in"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-semibold text-gold hover:underline"
          >
            Looking for on-campus colleges? dekhocampus.in →
          </a>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-foreground/60">
            University profiles
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {universities.slice(0, 6).map((u) => (
              <li key={u.slug}>
                <Link
                  to="/universities/$universitySlug"
                  params={{ universitySlug: u.slug }}
                  className="text-ink-foreground/75 hover:text-gold"
                >
                  {u.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-foreground/60">
            Popular programs
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {programCatalog.slice(0, 6).map((p) => (
              <li key={p.slug}>
                <Link
                  to="/programs/$programSlug"
                  params={{ programSlug: p.slug }}
                  className="text-ink-foreground/75 hover:text-gold"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-foreground/60">
            Get in touch
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-foreground/75">
            <li>
              <Link to="/finder" className="hover:text-gold">
                Find my best match
              </Link>
            </li>
            <li>
              <Link to="/specialisations" className="hover:text-gold">
                Explore specialisations
              </Link>
            </li>
            <li>
              <Link to="/methodology" className="hover:text-gold">
                How we evaluate
              </Link>
            </li>
            <li>
              <Link to="/methodology" hash="admission-safety" className="hover:text-gold">
                Admission safety checklist
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-gold">
                About DekhoCampus
              </Link>
            </li>
            <li>
              <a href="mailto:online@dekhocampus.in" className="hover:text-gold">
                online@dekhocampus.in
              </a>
            </li>
            <li className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-xs">
              <Link to="/privacy" className="hover:text-gold">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-gold">
                Terms
              </Link>
              <Link to="/accessibility" className="hover:text-gold">
                Accessibility
              </Link>
            </li>
            <li className="pt-2">
              <Link to="/contact" className="font-semibold text-gold hover:underline">
                Request free counselling →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-foreground/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-ink-foreground/55 md:flex-row md:items-start md:justify-between">
          <p>© {new Date().getFullYear()} DekhoCampus Online. All rights reserved.</p>
          <p className="max-w-3xl md:text-right">
            Programme entitlement, fees, admissions and outcomes can change by intake. Verify the
            exact university–programme–mode–session combination on the{" "}
            <a
              href="https://deb.ugc.ac.in/"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-ink-foreground/75 hover:text-gold"
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
