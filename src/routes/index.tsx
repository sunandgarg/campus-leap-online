import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock,
  GraduationCap,
  IndianRupee,
  Laptop,
  Quote,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LeadForm } from "@/components/site/lead-form";
import { UniversityCard } from "@/components/site/university-card";
import { UniversityLogo } from "@/components/site/university-logo";
import {
  universities,
  programCatalog,
  totalProgramCount,
  specialisationCount,
} from "@/data/universities";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Online Degrees from India's Top Universities | DekhoCampus Online" },
      {
        name: "description",
        content:
          "Explore UGC-entitled online MBA, BBA, MCA, BCA and more from Amity, Manipal, LPU, Jain and other top universities. Compare fees, curriculum and placements free.",
      },
      { property: "og:title", content: "Online Degrees from India's Top Universities" },
      {
        property: "og:description",
        content:
          "Compare UGC-entitled online degrees, fees and placement support across India's leading online universities.",
      },
    ],
  }),
  component: HomePage,
});

const steps = [
  {
    icon: Users,
    title: "Share your goal",
    body: "Tell us your qualification, budget and career target in a 2-minute call.",
  },
  {
    icon: BadgeCheck,
    title: "Get a verified shortlist",
    body: "We match you with UGC-entitled universities that actually fit — no guesswork.",
  },
  {
    icon: Laptop,
    title: "Apply with support",
    body: "Documentation, EMI options and admission follow-ups handled end to end.",
  },
  {
    icon: GraduationCap,
    title: "Learn and get placed",
    body: "Live classes, recorded lectures and placement cells from day one.",
  },
];

const testimonials = [
  {
    name: "Priya Nair",
    role: "Online MBA · Manipal Jaipur",
    body: "I compared five universities in one place and picked the one with the best analytics electives. My counsellor even sorted my EMI plan.",
  },
  {
    name: "Aditya Rao",
    role: "Online MCA · Amity",
    body: "Working full time meant I needed recorded lectures. DekhoCampus showed me exactly which universities offered that flexibility.",
  },
  {
    name: "Sneha Kulkarni",
    role: "Online BBA · Jain",
    body: "The fee breakdown per semester was the most useful part. Zero surprises after enrolling.",
  },
];

const faqs = [
  {
    q: "Are online degrees valid in India?",
    a: "Yes. Online degrees from UGC-entitled universities are equivalent to on-campus degrees under UGC (Open and Distance Learning Programmes and Online Programmes) Regulations, 2020. Every university listed here is UGC-entitled for online delivery.",
  },
  {
    q: "Will employers accept an online degree?",
    a: "Online degrees from NAAC A/A+/A++ accredited universities are accepted by most Indian employers and are widely recognised abroad through WES evaluation. Many of our listed universities have dedicated placement cells for online learners.",
  },
  {
    q: "Do I need to appear for an entrance exam?",
    a: "Most online bachelor's and master's programmes are merit-based with no entrance exam. Some universities may conduct a short eligibility test or interview for specific programmes.",
  },
  {
    q: "How are exams conducted?",
    a: "Exams are proctored online — you appear from home using a laptop with a webcam. Assessments usually combine internal assignments with end-of-semester exams.",
  },
  {
    q: "Is there any placement support?",
    a: "Yes. Universities such as Amity Online, Manipal Jaipur and Chandigarh University provide resume support, interview prep and access to their recruiter networks for online learners.",
  },
  {
    q: "Does DekhoCampus charge students?",
    a: "No. Counselling, shortlisting and application support are completely free for students.",
  },
];

function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-ink relative overflow-hidden text-ink-foreground">
        <div className="grid-lines absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="container-page relative grid gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <Badge className="border-gold/30 bg-gold/15 text-gold hover:bg-gold/15">
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
              100% UGC-entitled universities only
            </Badge>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.08] md:text-5xl lg:text-[3.4rem]">
              Earn a recognised degree
              <br />
              <span className="text-gradient-gold">without leaving your job.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-foreground/75 md:text-lg">
              DekhoCampus Online is India's dedicated portal for online universities. Compare{" "}
              {universities.length} universities, {totalProgramCount} programs and{" "}
              {specialisationCount}+ specialisations — with real fees, curriculum and placement data.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-gold text-gold-foreground hover:bg-gold/90"
              >
                <Link to="/universities">
                  Explore universities <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-ink-foreground/25 bg-transparent text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
              >
                <Link to="/compare">Compare fees side by side</Link>
              </Button>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6">
              {[
                { k: `${universities.length}+`, v: "Online universities" },
                { k: `${totalProgramCount}+`, v: "Degree programs" },
                { k: "45,000+", v: "Students guided" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="font-display text-2xl font-bold text-gold md:text-3xl">{s.k}</dt>
                  <dd className="mt-1 text-xs text-ink-foreground/60 md:text-sm">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:pl-4">
            <LeadForm
              compact
              className="border-ink-foreground/10 bg-card text-card-foreground"
              title="Get free expert counselling"
              description="Fees, eligibility and a personalised university shortlist — at no cost."
            />
          </div>
        </div>
      </section>

      {/* Logo wall */}
      <section className="border-b border-border bg-surface py-14">
        <div className="container-page">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Universities on our platform
          </p>
          <h2 className="mt-3 text-center font-display text-2xl font-bold md:text-3xl">
            Pick a university to see its online courses
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {universities.map((u) => (
              <Link
                key={u.slug}
                to="/universities/$universitySlug"
                params={{ universitySlug: u.slug }}
                className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-4 py-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <UniversityLogo university={u} size="md" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{u.shortName}</span>
                  <span className="block text-[11px] text-muted-foreground">
                    NAAC {u.naacGrade} · {u.city}
                  </span>
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link to="/universities">View all universities</Link>
            </Button>
          </div>
        </div>
      </section>


      {/* Programs */}
      <section className="container-page py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Choose your online program
            </h2>
            <p className="mt-3 text-muted-foreground">
              Every program page lists the universities that offer it, ranked by total fee — so you
              can pick on merit, not marketing.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/programs">View all programs</Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programCatalog.map((p) => (
            <Link
              key={p.slug}
              to="/programs/$programSlug"
              params={{ programSlug: p.slug }}
              className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-secondary px-2.5 py-1 font-display text-xs font-bold text-secondary-foreground">
                  {p.code}
                </span>
                <span className="text-xs text-muted-foreground">{p.level}</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold leading-snug">{p.name}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.overview}</p>
              <div className="mt-5 flex items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {p.durationYears} years
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5" /> {p.specialisations.length}{" "}
                  specialisations
                </span>
                <ArrowRight className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="bg-surface py-20">
        <div className="container-page">
          <h2 className="max-w-2xl font-display text-3xl font-bold md:text-4xl">
            How DekhoCampus Online works
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-ink-foreground">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-2xl font-bold text-border">0{i + 1}</span>
                </div>
                <h3 className="mt-4 font-display text-base font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured universities */}
      <section className="container-page py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Top online universities in India
            </h2>
            <p className="mt-3 text-muted-foreground">
              Accreditation, approvals, fee range and program count — verified and updated.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/universities">See all {universities.length}</Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {universities.slice(0, 6).map((u) => (
            <UniversityCard key={u.slug} university={u} />
          ))}
        </div>
      </section>

      {/* Benefits strip */}
      <section className="bg-ink py-16 text-ink-foreground">
        <div className="container-page grid gap-8 md:grid-cols-3">
          {[
            {
              icon: IndianRupee,
              title: "Transparent fees",
              body: "Total fee, per-semester fee and no-cost EMI for every program — before you enquire.",
            },
            {
              icon: ShieldCheck,
              title: "Only entitled universities",
              body: "We list universities that hold valid UGC entitlement for online programmes.",
            },
            {
              icon: CheckCircle2,
              title: "Free, unbiased guidance",
              body: "Counsellors compare options for you. Students never pay us anything.",
            },
          ].map((b) => (
            <div key={b.title} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold text-gold-foreground">
                <b.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-bold">{b.title}</h3>
                <p className="mt-1.5 text-sm text-ink-foreground/70">{b.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-page py-20">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Learners we've guided</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <Quote className="h-6 w-6 text-gold" />
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground/85">
                {t.body}
              </blockquote>
              <figcaption className="mt-5 border-t border-border pt-4">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
                <p className="mt-2 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                  ))}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FAQ + form */}
      <section className="container-page grid gap-12 pb-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible className="mt-8">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left font-display text-base font-semibold">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="lg:pt-4">
          <LeadForm compact />
        </div>
      </section>
    </>
  );
}
