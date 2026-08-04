import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Star } from "lucide-react";
import { UniversityLogo } from "./university-logo";
import { formatINR, getUniversityPrograms, type University } from "@/data/universities";
import { Badge } from "@/components/ui/badge";

export function UniversityCard({ university }: { university: University }) {
  const programs = getUniversityPrograms(university);
  const cheapest = programs.reduce(
    (min, p) => (p.totalFee < min ? p.totalFee : min),
    Number.POSITIVE_INFINITY,
  );

  return (
    <Link
      to="/universities/$universitySlug"
      params={{ universitySlug: university.slug }}
      className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-3">
        <UniversityLogo university={university} />
        <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>

      <h3 className="mt-4 font-display text-lg font-bold leading-snug">{university.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {university.city}, {university.state} · Est. {university.established}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {university.approvals.slice(0, 3).map((a) => (
          <Badge key={a} variant="secondary" className="font-medium">
            {a}
          </Badge>
        ))}
      </div>

      <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
        <div>
          <p className="text-xs text-muted-foreground">Fees from</p>
          <p className="font-display text-base font-bold">{formatINR(cheapest)}</p>
        </div>
        <div className="text-right">
          <p className="flex items-center justify-end gap-1 text-sm font-semibold">
            <Star className="h-4 w-4 fill-gold text-gold" />
            {university.rating}
          </p>
          <p className="text-xs text-muted-foreground">{programs.length} programs</p>
        </div>
      </div>
    </Link>
  );
}
