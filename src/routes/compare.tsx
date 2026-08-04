import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { UniversityLogo } from "@/components/site/university-logo";
import { LeadForm } from "@/components/site/lead-form";
import {
  formatINR,
  programCatalog,
  universitiesOfferingProgram,
} from "@/data/universities";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare Online Universities — Fees, NAAC Grade & EMI | DekhoCampus Online" },
      {
        name: "description",
        content:
          "Side-by-side comparison of online university fees, accreditation, ratings and EMI plans for any program. Pick a program and compare instantly.",
      },
      { property: "og:title", content: "Compare Online Universities in India" },
      {
        property: "og:description",
        content:
          "Compare fees, NAAC grades, ratings and EMI plans across UGC-entitled online universities.",
      },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  const [programSlug, setProgramSlug] = useState(programCatalog[0].slug);
  const offers = useMemo(() => universitiesOfferingProgram(programSlug), [programSlug]);
  const program = programCatalog.find((p) => p.slug === programSlug)!;

  return (
    <>
      <section className="hero-ink text-ink-foreground">
        <div className="container-page py-14">
          <h1 className="font-display text-3xl font-extrabold md:text-4xl">
            Compare online universities
          </h1>
          <p className="mt-4 max-w-2xl text-ink-foreground/75">
            Choose a program and see fees, accreditation, ratings and EMI side by side. No sponsored
            ranking — sorted purely by total fee.
          </p>
        </div>
      </section>

      <section className="container-page py-12">
        <label className="block text-sm font-medium" htmlFor="compare-program">
          Program
        </label>
        <select
          id="compare-program"
          value={programSlug}
          onChange={(e) => setProgramSlug(e.target.value)}
          className="mt-2 h-10 w-full max-w-md rounded-md border border-input bg-background px-3 text-sm"
        >
          {programCatalog.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name} ({p.code})
            </option>
          ))}
        </select>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-surface text-left">
              <tr>
                <th className="px-5 py-3.5 font-semibold">University</th>
                <th className="px-5 py-3.5 font-semibold">NAAC</th>
                <th className="px-5 py-3.5 font-semibold">Rating</th>
                <th className="px-5 py-3.5 font-semibold">Total fee</th>
                <th className="px-5 py-3.5 font-semibold">Per semester</th>
                <th className="px-5 py-3.5 font-semibold">EMI</th>
                <th className="px-5 py-3.5 font-semibold">Approvals</th>
              </tr>
            </thead>
            <tbody>
              {offers.map(({ university, program: prog }) => (
                <tr key={university.slug} className="border-t border-border bg-card">
                  <td className="px-5 py-4">
                    <Link
                      to="/universities/$universitySlug/$programSlug"
                      params={{ universitySlug: university.slug, programSlug }}
                      className="flex items-center gap-3 hover:underline"
                    >
                      <UniversityLogo university={university} size="sm" />
                      <span className="font-semibold">{university.name}</span>
                    </Link>
                  </td>
                  <td className="px-5 py-4">{university.naacGrade}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                      {university.rating}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold">{formatINR(prog.totalFee)}</td>
                  <td className="px-5 py-4">{formatINR(prog.perSemesterFee)}</td>
                  <td className="px-5 py-4">{formatINR(prog.emiPerMonth)}/mo</td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">
                    {university.approvals.slice(0, 3).join(" · ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          {offers.length} universities offer an online {program.code}. Fees are indicative and
          exclude one-time registration or examination charges.
        </p>

        <div className="mt-14 max-w-2xl">
          <LeadForm defaultProgram={program.name} title="Need help deciding?" />
        </div>
      </section>
    </>
  );
}
