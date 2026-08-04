import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Clock,
  GraduationCap,
  Star,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/site/lead-form";
import { UniversityLogo } from "@/components/site/university-logo";
import { formatINR, getUniversity, getUniversityPrograms } from "@/data/universities";

export const Route = createFileRoute("/universities/$universitySlug/")({
  loader: ({ params }) => {
    const university = getUniversity(params.universitySlug);
    if (!university) throw notFound();
    return { university, programs: getUniversityPrograms(university) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "University not found | DekhoCampus Online" }, { name: "robots", content: "noindex" }],
      };
    }
    const u = loaderData.university;
    const title = `${u.name} — Online Courses, Fees & Admission 2026`;
    const description = `${u.name}: NAAC ${u.naacGrade}, ${u.approvals.join(", ")}. Explore ${loaderData.programs.length} UGC-entitled online programs with fees, eligibility and placement details.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: UniversityPage,
  errorComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Couldn't load this university</h1>
      <p className="mt-2 text-sm text-muted-foreground">Please refresh or browse all universities.</p>
    </div>
  ),
  notFoundComponent: () => {
    const { universitySlug } = Route.useParams();
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-2xl font-bold">University not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No university exists at “{universitySlug}”.
        </p>
        <Button asChild className="mt-6 bg-ink text-ink-foreground hover:bg-ink-soft">
          <Link to="/universities">Browse all universities</Link>
        </Button>
      </div>
    );
  },
});

function UniversityPage() {
  const { university: u, programs } = Route.useLoaderData();

  return (
    <>
      <section className="hero-ink text-ink-foreground">
        <div className="container-page py-12">
          <nav className="text-xs text-ink-foreground/60">
            <Link to="/" className="hover:text-gold">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/universities" className="hover:text-gold">
              Universities
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink-foreground/85">{u.shortName}</span>
          </nav>

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-5">
              <UniversityLogo university={u} size="lg" className="bg-card" />
              <div>
                <h1 className="font-display text-3xl font-extrabold leading-tight md:text-4xl">
                  {u.name}
                </h1>
                <p className="mt-2 text-sm text-ink-foreground/70">
                  {u.city}, {u.state} · Established {u.established} · NAAC {u.naacGrade}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {u.approvals.map((a) => (
                    <Badge
                      key={a}
                      className="border-gold/30 bg-gold/15 text-gold hover:bg-gold/15"
                    >
                      <BadgeCheck className="mr-1 h-3 w-3" />
                      {a}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-ink-foreground/15 bg-ink-foreground/5 p-5">
              <p className="flex items-center gap-1.5 font-display text-2xl font-bold text-gold">
                <Star className="h-5 w-5 fill-gold text-gold" />
                {u.rating}
              </p>
              <p className="mt-1 text-xs text-ink-foreground/60">
                {u.reviews.toLocaleString("en-IN")} student reviews
              </p>
              <p className="mt-3 text-xs text-ink-foreground/60">
                <Users className="mr-1 inline h-3.5 w-3.5" />
                {u.studentsEnrolled} learners
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="font-display text-2xl font-bold">About {u.shortName}</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{u.about}</p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {u.highlights.map((h) => (
              <li
                key={h}
                className="flex gap-3 rounded-xl border border-border bg-card p-4 text-sm"
              >
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                {h}
              </li>
            ))}
          </ul>

          <h2 className="mt-14 font-display text-2xl font-bold">
            Online programs at {u.shortName} ({programs.length})
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Click any program for curriculum, specialisations, fee breakdown and eligibility.
          </p>

          <div className="mt-6 space-y-4">
            {programs.map((p) => (
              <Link
                key={p.slug}
                to="/universities/$universitySlug/$programSlug"
                params={{ universitySlug: u.slug, programSlug: p.slug }}
                className="group block rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift md:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-secondary px-2 py-0.5 font-display text-xs font-bold">
                        {p.code}
                      </span>
                      <span className="text-xs text-muted-foreground">{p.level}</span>
                    </div>
                    <h3 className="mt-2 font-display text-lg font-bold">{p.name}</h3>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> {p.durationYears} years ·{" "}
                        {p.semesters} semesters
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5" /> {p.specialisations.length}{" "}
                        specialisations
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-bold">{formatINR(p.totalFee)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatINR(p.perSemesterFee)}/semester
                    </p>
                    <span className="mt-2 inline-flex items-center text-xs font-semibold text-primary">
                      View program{" "}
                      <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <h2 className="mt-14 font-display text-2xl font-bold">Placement partners</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {u.placementPartners.map((p) => (
              <span
                key={p}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium"
              >
                {p}
              </span>
            ))}
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Building2, k: "Campus", v: `${u.city}, ${u.state}` },
              { icon: CalendarDays, k: "Established", v: String(u.established) },
              { icon: BadgeCheck, k: "Accreditation", v: `NAAC ${u.naacGrade}` },
            ].map((s) => (
              <div key={s.k} className="rounded-xl border border-border bg-card p-5">
                <s.icon className="h-4 w-4 text-muted-foreground" />
                <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">{s.k}</p>
                <p className="mt-1 font-semibold">{s.v}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <LeadForm
            compact
            defaultUniversity={u.name}
            title={`Apply to ${u.shortName}`}
            description="Check eligibility, fees and scholarship options with a counsellor."
          />
        </aside>
      </section>
    </>
  );
}
