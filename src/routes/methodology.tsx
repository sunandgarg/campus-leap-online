import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarCheck2,
  CircleAlert,
  ExternalLink,
  IndianRupee,
  Laptop2,
  ListChecks,
  Scale,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/methodology")({
  head: () => ({
    meta: [
      { title: "How We Evaluate Online Universities | DekhoCampus Online" },
      {
        name: "description",
        content:
          "See the evidence, safeguards and evaluation factors DekhoCampus Online uses when comparing online universities and courses.",
      },
    ],
  }),
  component: MethodologyPage,
});

const pillars = [
  {
    number: "01",
    title: "Recognition & credibility",
    description:
      "We begin with the institution and the exact online programme, mode and academic session. A university-level listing alone is not programme entitlement.",
    checks: ["Exact programme", "Online mode", "Academic-session evidence"],
    icon: ShieldCheck,
    color: "bg-[#e9f3ff] text-[#1768cc] dark:bg-[#153a5e] dark:text-[#78b9ff]",
  },
  {
    number: "02",
    title: "Programme substance",
    description:
      "We compare curriculum breadth, available specialisations, duration, eligibility and how clearly the university explains the academic journey.",
    checks: ["Curriculum structure", "Relevant specialisations", "Eligibility clarity"],
    icon: BookOpenCheck,
    color: "bg-[#f2ecff] text-[#7353c6] dark:bg-[#2f244d] dark:text-[#bca7ff]",
  },
  {
    number: "03",
    title: "Digital learning experience",
    description:
      "For an online learner, the platform is the campus. We look for clear information about live teaching, recordings, assessments and digital access.",
    checks: ["Live and recorded learning", "Assessment model", "LMS and device access"],
    icon: Laptop2,
    color: "bg-[#e9faf3] text-[#168258] dark:bg-[#153d30] dark:text-[#69d7a9]",
  },
  {
    number: "04",
    title: "Learner support",
    description:
      "The best programme on paper can still fail without dependable academic and administrative support. We surface the support claims learners should verify.",
    checks: ["Academic assistance", "Administrative help", "Career-service access"],
    icon: UsersRound,
    color: "bg-[#fff1e7] text-[#a94300] dark:bg-[#3d281c] dark:text-[#ffab73]",
  },
  {
    number: "05",
    title: "Career relevance",
    description:
      "We connect curriculum and specialisations to possible roles, while avoiding placement guarantees or salary promises that the evidence cannot support.",
    checks: ["Role relevance", "Practical projects", "Transparent outcome caveats"],
    icon: BriefcaseBusiness,
    color: "bg-[#fff7df] text-[#a56f0b] dark:bg-[#45351c] dark:text-[#f4bd4f]",
  },
  {
    number: "06",
    title: "Cost & payment clarity",
    description:
      "Where primary-source evidence is available, we show total programme fee beside semester and indicative EMI figures. Unsourced fees are withheld—not estimated.",
    checks: ["Source-checked fee", "Full cost before EMI", "No synthetic estimates"],
    icon: IndianRupee,
    color: "bg-[#ffedf3] text-[#c84b76] dark:bg-[#462333] dark:text-[#ff8eb7]",
  },
];

function MethodologyPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border bg-[#f3f7fc] py-16 dark:bg-[#071522] lg:py-24">
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(30,103,189,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(30,103,189,0.06)_1px,transparent_1px)] [background-size:56px_56px]" />
        <div className="container-page relative grid gap-10 lg:grid-cols-[1fr_360px] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#bad5f2] bg-white/80 px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#1768cc] dark:border-[#295a85] dark:bg-[#102a42] dark:text-[#78b9ff]">
              <Scale className="h-4 w-4" /> Transparent by design
            </span>
            <h1 className="mt-6 max-w-3xl font-display text-4xl font-extrabold tracking-[-0.06em] sm:text-5xl lg:text-6xl">
              How we help you compare with confidence.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
              DekhoCampus Online organises university-provided and publicly available information
              into a consistent decision framework. We do not award degrees or control university
              admissions.
            </p>
          </div>
          <div className="rounded-[2rem] border border-border bg-card p-7 shadow-[0_24px_70px_-50px_rgba(12,39,71,0.7)]">
            <BadgeCheck className="h-7 w-7 text-[#168258]" />
            <p className="mt-5 font-display text-xl font-extrabold">Our comparison promise</p>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
              {[
                "Same core fields for every university",
                "No hidden sponsored rank in catalogue sorting",
                "Clear caveats where facts can change",
                "No guaranteed job, salary or admission claims",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-[#168258]" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#1768cc] dark:text-[#78b9ff]">
            Six evaluation pillars
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl">
            What belongs in a serious online-degree decision
          </h2>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {pillars.map((pillar) => (
            <article
              key={pillar.number}
              className="rounded-[1.75rem] border border-border bg-card p-7 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className={`${pillar.color} flex h-12 w-12 items-center justify-center rounded-2xl`}
                >
                  <pillar.icon className="h-5 w-5" />
                </span>
                <span className="font-display text-3xl font-extrabold text-border">
                  {pillar.number}
                </span>
              </div>
              <h3 className="mt-5 font-display text-xl font-extrabold">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{pillar.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {pillar.checks.map((check) => (
                  <span
                    key={check}
                    className="rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-[10px] font-extrabold text-muted-foreground"
                  >
                    {check}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="admission-safety"
        className="scroll-mt-28 border-y border-border bg-[#071c2e] py-16 text-white lg:py-20"
      >
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8bc7ff]">
                <CalendarCheck2 className="h-4 w-4" /> Admission safety desk
              </span>
              <h2 className="mt-5 font-display text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl">
                Check the intake, not just the university.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">
                Entitlement, fees and admissions can change by session. DekhoCampus separates a
                researched profile from a directory-stage listing and links you back to the official
                regulator before any payment decision.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="https://deb.ugc.ac.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#ffc23f] px-5 text-sm font-extrabold text-[#10243b] transition hover:bg-[#ffd163]"
                >
                  Verify on UGC-DEB <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href="https://deb.ugc.ac.in/studentDEBID"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-5 text-sm font-extrabold text-white transition hover:bg-white/[0.12]"
                >
                  Create or check DEB-ID <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/12 bg-white/[0.06] p-6 backdrop-blur sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#78ddb3]/15 text-[#78ddb3]">
                  <ListChecks className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-xl font-extrabold">Before you enrol</p>
                  <p className="mt-1 text-xs text-white/55">Four checks for every application</p>
                </div>
              </div>
              <ol className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "Match the exact programme, Online mode and admission session on UGC-DEB.",
                  "Keep your ABC-ID and mandatory DEB-ID ready; do not share them in a lead form.",
                  "Read the university prospectus, complete fee components and refund policy.",
                  "Apply and pay only on the university’s official domain; save every receipt.",
                ].map((item, index) => (
                  <li
                    key={item}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-black/10 p-4 text-xs font-semibold leading-6 text-white/75"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1768cc] text-[10px] font-extrabold text-white">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-[#f2b06f]/30 bg-[#f47a20]/10 p-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex max-w-4xl items-start gap-3">
              <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#ffad70]" />
              <p className="text-xs leading-6 text-white/75 sm:text-sm">
                <strong className="text-white">Check prohibited domains too.</strong> UGC-DEB’s
                current instructions list programmes that cannot be offered online or by ODL and,
                from the August 2026 session, add covered allied and healthcare programmes,
                including Psychology as a specialisation. A polished university page is not proof
                that a prohibited offering is valid.
              </p>
            </div>
            <a
              href="https://deb.ugc.ac.in/Instruction"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-4 text-xs font-extrabold text-white transition hover:bg-white/[0.12]"
            >
              Read current instructions <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/45 py-16">
        <div className="container-page grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <CircleAlert className="h-8 w-8 text-[#a94300] dark:text-[#ff9a5b]" />
            <h2 className="mt-5 font-display text-3xl font-extrabold tracking-[-0.04em]">
              What we cannot decide for you
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Whether an online format suits your learning habits",
              "Whether a lender will approve your EMI application",
              "Whether a degree will produce a specific job or salary",
              "Whether university policies will remain unchanged after publication",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-border bg-card p-5 text-sm font-bold leading-6"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#ffc23f] py-12">
        <div className="container-page flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#705315]">
              Start with evidence
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.04em] text-[#10243b]">
              Build your own university comparison.
            </h2>
          </div>
          <Button
            asChild
            size="lg"
            className="rounded-xl bg-[#10243b] font-extrabold text-white hover:bg-[#183b60]"
          >
            <Link to="/compare">
              Compare now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
