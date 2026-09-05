import { Link } from "@tanstack/react-router";
import { Check, CheckCircle2, Clock, GitCompareArrows, ShieldCheck, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/site/lead-form";
import { UniversityLogo } from "@/components/site/university-logo";
import type { University, UniversityProgram } from "@/data/universities";
import { useComparison } from "@/hooks/use-comparison";
import heroImage from "@/assets/program-hero.jpg";

interface ProgramHeroProps {
  university: University;
  program: UniversityProgram;
}

export function ProgramHero({ university: u, program: p }: ProgramHeroProps) {
  const comparison = useComparison(p.slug);
  const isCompared = comparison.universitySlugs.includes(u.slug);
  const words = p.name.split(" ");
  const head = words.slice(0, Math.ceil(words.length / 2)).join(" ");
  const tail = words.slice(Math.ceil(words.length / 2)).join(" ");

  const stats = [
    { value: `NAAC ${u.naacGrade}`, label: "Accreditation listed" },
    { value: `${u.approvals.length}`, label: "Recognition markers" },
    { value: `${p.specialisations.length}`, label: "Specialisations" },
  ];

  function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      void navigator.share({ title: `${p.name} — ${u.shortName}`, url });
      return;
    }
    void navigator?.clipboard?.writeText(url);
    toast.success("Page link copied");
  }

  return (
    <section className="relative overflow-hidden bg-ink text-ink-foreground">
      <img
        src={heroImage}
        alt=""
        width={1920}
        height={1080}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, color-mix(in oklab, var(--ink) 92%, transparent) 0%, color-mix(in oklab, var(--ink) 70%, transparent) 60%, color-mix(in oklab, var(--ink) 45%, transparent) 100%)",
        }}
      />

      <div className="container-page relative py-8 md:py-10">
        <nav className="text-xs text-ink-foreground/65">
          <Link to="/" className="hover:text-gold">
            Home
          </Link>
          <span className="mx-2">&gt;</span>
          <Link to="/universities" className="hover:text-gold">
            Universities
          </Link>
          <span className="mx-2">&gt;</span>
          <Link
            to="/universities/$universitySlug"
            params={{ universitySlug: u.slug }}
            className="hover:text-gold"
          >
            {u.shortName}
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gold">{p.code}</span>
        </nav>

        <div className="mt-5 grid gap-8 rounded-3xl lg:grid-cols-[1fr_400px] lg:items-start">
          <div className="pt-2 lg:pb-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-lg bg-ink-foreground/95 px-3 py-1.5 text-sm font-bold text-ink">
                <ShieldCheck className="h-4 w-4" /> UGC Entitled
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-ink-foreground/25 px-3 py-1.5 text-sm font-semibold">
                <UniversityLogo university={u} size="sm" className="h-5 w-5 bg-transparent p-0" />
                {u.name}
              </span>
            </div>

            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              {head} <span className="text-gold">{tail}</span>{" "}
              <span className="text-gold">({p.code})</span>
            </h1>

            <p className="mt-5 flex items-center gap-2 text-base font-medium text-ink-foreground/90">
              <Clock className="h-5 w-5" /> Duration : {p.durationYears} Years
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-ink-foreground text-ink hover:bg-ink-foreground/90"
              >
                <a href="#apply">
                  Get fee guidance <CheckCircle2 className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <button
                type="button"
                onClick={() => comparison.toggleUniversity(p.slug, u.slug)}
                className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-extrabold transition ${
                  isCompared
                    ? "border-[#77d3ad] bg-[#e9fff5] text-[#126f4b]"
                    : "border-ink-foreground/35 bg-ink-foreground/10 text-ink-foreground hover:bg-ink-foreground/15"
                }`}
              >
                {isCompared ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <GitCompareArrows className="h-4 w-4" />
                )}
                {isCompared ? "Added to compare" : "Add to compare"}
              </button>
              <button
                type="button"
                onClick={share}
                aria-label="Share this program"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-foreground/35 transition-colors hover:bg-ink-foreground/10"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-10 gap-y-5">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl font-extrabold">{s.value}</p>
                  <p className="text-sm text-ink-foreground/70">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 inline-flex flex-wrap items-center gap-3 rounded-full bg-ink-foreground/95 px-5 py-2.5">
              <span className="text-xs font-bold uppercase tracking-wide text-ink">
                Accreditations
              </span>
              {u.approvals
                .filter((a) => !a.startsWith("NAAC"))
                .slice(0, 4)
                .map((a) => (
                  <span
                    key={a}
                    className="rounded-full bg-ink/10 px-2.5 py-1 text-xs font-bold text-ink"
                  >
                    {a}
                  </span>
                ))}
              <span className="rounded-full bg-ink/10 px-2.5 py-1 text-xs font-bold text-ink">
                NAAC {u.naacGrade}
              </span>
            </div>
          </div>

          <div id="apply" className="scroll-mt-28">
            <LeadForm
              compact
              defaultProgram={p.name}
              defaultUniversity={u.name}
              className="rounded-2xl border-0 text-card-foreground shadow-lift"
              title={`Future-Proof Your Career with an Online ${p.code} at ${u.shortName}`}
              description="Request current fee, eligibility and admission guidance without any payment."
            />
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-ink-foreground/10 px-4 py-3 text-xs leading-5 text-ink-foreground/70">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              Final fees, entitlement and intake availability must be reconfirmed before payment.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const sections = [
  { id: "overview", label: "Program overview" },
  { id: "specialisations", label: "Specialisation" },
  { id: "curriculum", label: "Curriculum" },
  { id: "fees", label: "Fees" },
  { id: "eligibility", label: "Eligibility" },
  { id: "careers", label: "Careers" },
  { id: "compare", label: "Compare" },
];

export function ProgramSectionNav() {
  return (
    <nav className="sticky top-16 z-30 border-b border-border bg-card/95 backdrop-blur">
      <div className="container-page flex gap-1 overflow-x-auto py-2.5">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
