import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { universities, programCatalog } from "@/data/universities";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold text-gold-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="font-display text-base font-bold">DekhoCampus Online</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-ink-foreground/70">
            India's dedicated portal for UGC-entitled online degrees. Compare universities, fees and
            placements — then apply with a counsellor by your side.
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
            Top universities
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
              <a href="tel:+919999999999" className="hover:text-gold">
                +91 99999 99999
              </a>
            </li>
            <li>
              <a href="mailto:online@dekhocampus.in" className="hover:text-gold">
                online@dekhocampus.in
              </a>
            </li>
            <li>Mon – Sat, 10 AM – 7 PM IST</li>
            <li className="pt-2">
              <Link to="/contact" className="font-semibold text-gold hover:underline">
                Book free counselling →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-foreground/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-ink-foreground/55 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} DekhoCampus Online. All rights reserved.</p>
          <p>
            Fees and approvals are indicative and verified with universities periodically. Always
            confirm details with the university before enrolling.
          </p>
        </div>
      </div>
    </footer>
  );
}
