import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  Code2,
  Coffee,
  FileCheck2,
  GraduationCap,
  HeartHandshake,
  Laptop2,
  Layers3,
  Megaphone,
  Moon,
  Play,
  ShieldCheck,
  Sun,
  Sunrise,
  TrendingUp,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { CompactRail } from "@/components/site/compact-rail";
import { HomeFeeComparison } from "@/components/site/home-fee-comparison";
import { HomeDegreeBrowser } from "@/components/site/home-degree-browser";
import {
  HomeUniversityBrowser,
  featuredUniversitySlugs,
} from "@/components/site/home-university-browser";
import { UniversityLogo } from "@/components/site/university-logo";
import { BrandLogo } from "@/components/site/brand-logo";
import { Button } from "@/components/ui/button";
import {
  getUniversityPrograms,
  programCatalog,
  universities,
  type University,
} from "@/data/universities";
import { cn } from "@/lib/utils";

const familyQuestions = [
  {
    title: "Will this degree be recognised?",
    answer:
      "Check the exact university, programme, Online mode and academic session on UGC-DEB. Recognition of the institution alone does not confirm every programme or intake. Check any employer, professional-body or further-study requirements separately.",
    icon: ShieldCheck,
  },
  {
    title: "Is online learning just watching videos?",
    answer:
      "It can include live classes, recordings, assignments, projects and assessments. Delivery differs by university. Ask for a learning-platform demonstration and an actual class timetable before enrolling.",
    icon: Laptop2,
  },
  {
    title: "What about placements and career support?",
    answer:
      "Ask what support is included: CV reviews, interview practice, job boards or placement drives. Request written terms and recent outcomes for your programme. Career support is not a job or salary guarantee.",
    icon: BriefcaseBusiness,
  },
  {
    title: "How do we know the university is genuine?",
    answer:
      "Match the legal name and programme to the official regulator record, then use the university’s own application and payment channels. Confirm the current intake and get a fee receipt from the university.",
    icon: FileCheck2,
  },
  {
    title: "Can study fit around work and family?",
    answer:
      "Compare compulsory live attendance, recording access, assignment deadlines and exam windows with your weekly routine. Ask about learner support and what happens if you need to pause or withdraw.",
    icon: HeartHandshake,
  },
];

const studySlots = [
  {
    label: "Morning",
    time: "6:30–7:15 AM",
    icon: Sunrise,
    title: "A little progress before your day begins",
    task: "Review a recorded lesson",
    note: "Protect a short, quiet block before work or college.",
    blocks: ["Recordings", "Quick notes", "Weekly recap"],
  },
  {
    label: "Afternoon",
    time: "1:00–1:30 PM",
    icon: Sun,
    title: "Make your break a small learning win",
    task: "Read and revise",
    note: "Use a manageable break for revision, not an entire lecture.",
    blocks: ["Reading", "Practice quiz", "Discussion"],
  },
  {
    label: "Evening",
    time: "8:00–9:00 PM",
    icon: Coffee,
    title: "One focused hour after your working day",
    task: "Classes or project work",
    note: "Check the university’s actual live schedule before committing.",
    blocks: ["Live or recorded class", "Project work", "Assignments"],
  },
  {
    label: "Night",
    time: "9:30–10:15 PM",
    icon: Moon,
    title: "Rewind, revisit and learn at your own pace",
    task: "Replay a difficult topic",
    note: "Choose a sustainable routine and leave enough time for rest.",
    blocks: ["Lecture replay", "Revision", "Plan tomorrow"],
  },
];

const guides = [
  {
    title: "Is this degree right for us?",
    description: "A seven-point university and programme checklist to discuss together.",
    file: "/guides/degree-checklist.html",
    icon: ShieldCheck,
    color: "bg-[#eaf1ff] text-[#325dd2]",
  },
  {
    title: "Understand the complete fee",
    description: "Keep tuition, extra charges, payment terms and refunds on one page.",
    file: "/guides/fee-checklist.html",
    icon: WalletCards,
    color: "bg-[#fff0e4] text-[#b65b20]",
  },
  {
    title: "Ask before you enrol",
    description: "Ten questions about classes, exams, support and your next step.",
    file: "/guides/admission-questions.html",
    icon: BookOpenCheck,
    color: "bg-[#e8f6ef] text-[#267b5c]",
  },
];

export function HomeSections() {
  const [familyQuestion, setFamilyQuestion] = useState(0);
  const featuredUniversities = featuredUniversitySlugs.flatMap((slug) => {
    const university = universities.find((item) => item.slug === slug);
    return university ? [university] : [];
  });
  const selectedQuestion = familyQuestions[familyQuestion]!;
  const FamilyIcon = selectedQuestion.icon;

  return (
    <div className="home-sections">
      <HomeDegreeBrowser />
      <HomeUniversityBrowser />
      <section className="home-band home-warm" aria-labelledby="home-recognition-title">
        <div className="home-section">
          <SectionHeading
            id="home-recognition-title"
            title="A different classroom. A recognised qualification."
            description="Understand recognition first. Keep the exact programme, mode and academic session together."
          />
          <div className="mt-8 grid items-center gap-8 md:grid-cols-2 lg:gap-16">
            <div>
              <div className="relative grid grid-cols-2 gap-8 px-1 sm:gap-12 sm:px-5">
                <Certificate kind="On campus" icon={Building2} />
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-[#c48565]"
                >
                  =
                </span>
                <Certificate kind="Online" icon={Laptop2} />
              </div>
              <p className="mt-5 text-center text-[11px] leading-5 text-muted-foreground">
                Illustrations only. Degree format and recognition depend on the university and
                programme.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <img
                  src="/authorities/ugc-deb-9343d826.png"
                  alt="UGC-DEB"
                  width={48}
                  height={48}
                  loading="lazy"
                  className="h-12 w-12 rounded-lg bg-white object-contain p-1"
                />
                <h3 className="max-w-xs text-2xl font-extrabold leading-tight">
                  Know what stands behind your degree.
                </h3>
              </div>
              <ul className="mt-5 space-y-3 text-sm">
                {[
                  "Match the university’s exact legal name.",
                  "Check the programme, Online mode and current session.",
                  "Confirm eligibility and fees with the university.",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 rounded-lg bg-card/65 px-3 py-2.5"
                  >
                    <BadgeCheck
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-5 rounded-full px-5">
                <Link to="/methodology">
                  How do I verify a university? <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <HomeFeeComparison />
      <StudySchedule />
      <div className="home-section !py-3">
        <details className="border-y border-border">
          <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-4 py-5 focus-visible:outline-2 focus-visible:outline-primary">
            <span>
              <span className="block text-base font-bold">Need a little more clarity?</span>
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                Recognition, complete costs, study schedules and family checklists.
              </span>
            </span>
            <ChevronDown className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          </summary>
          <div className="overflow-hidden border-t border-border">
            <section className="home-section" aria-labelledby="home-careers-title">
              <SectionHeading
                id="home-careers-title"
                title="Think beyond graduation"
                description="Look at the work you want to do, then choose the curriculum and support that can help you prepare."
              />
              <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[
                  { slug: "online-mba", title: "Management & leadership", icon: TrendingUp },
                  { slug: "online-mca", title: "Technology & software", icon: Code2 },
                  { slug: "online-bcom", title: "Commerce & finance", icon: WalletCards },
                  {
                    slug: "online-ma-journalism-mass-communication",
                    title: "Media & communication",
                    icon: Megaphone,
                  },
                ].map((item) => {
                  const program = programCatalog.find((p) => p.slug === item.slug);
                  return (
                    <Link
                      key={item.slug}
                      to="/programs/$programSlug"
                      params={{ programSlug: item.slug }}
                      className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50 sm:p-5"
                    >
                      <item.icon className="h-6 w-6 text-primary" />
                      <h3 className="mt-4 text-sm font-bold">{item.title}</h3>
                      <p className="mt-2 min-h-12 text-[11px] leading-6 text-muted-foreground">
                        {program?.careers.slice(0, 2).join(" · ") ||
                          "Explore skills and career directions"}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary">
                        Explore the degree <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </Link>
                  );
                })}
              </div>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 rounded-2xl bg-surface px-4 py-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Explore the university behind the degree
                </p>
                {featuredUniversities.slice(0, 5).map((university) => (
                  <Link
                    key={university.slug}
                    to="/universities/$universitySlug"
                    params={{ universitySlug: university.slug }}
                    aria-label={`Explore ${university.name}`}
                  >
                    <UniversityLogo
                      university={university}
                      className="h-10 w-24 rounded-none border-0 bg-white"
                    />
                  </Link>
                ))}
              </div>
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Career directions are examples, not placement or salary guarantees.
              </p>
            </section>
            <section className="home-band home-warm" aria-labelledby="home-parents-title">
              <div className="home-section">
                <SectionHeading
                  id="home-parents-title"
                  title="Parents, we know what you’re thinking"
                  description="A big decision deserves a clear conversation. Start with the questions you would ask for your own family."
                />
                <div className="mt-7 grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
                  <div className="space-y-2">
                    {familyQuestions.map((question, index) => (
                      <div
                        key={question.title}
                        className={cn(
                          "rounded-xl border transition-colors",
                          familyQuestion === index
                            ? "border-[#c9d7f1] bg-card"
                            : "border-transparent bg-card/60",
                        )}
                      >
                        <button
                          type="button"
                          aria-expanded={familyQuestion === index}
                          aria-controls={`family-answer-${index}`}
                          onClick={() => setFamilyQuestion(index)}
                          className="flex min-h-14 w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold"
                        >
                          <span>{question.title}</span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 shrink-0 text-primary transition-transform",
                              familyQuestion === index && "rotate-180",
                            )}
                          />
                        </button>
                        <div id={`family-answer-${index}`} hidden={familyQuestion !== index}>
                          <p className="px-4 pb-5 text-xs leading-7 text-muted-foreground">
                            {question.answer}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-8 text-center">
                    <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-[#f5e9dc] dark:bg-secondary">
                      <Users className="h-16 w-16 text-[#a46a43]" strokeWidth={1.25} />
                      <span className="absolute -right-2 top-0 rounded-2xl border border-[#dce5f4] bg-card p-3 shadow-sm">
                        <FamilyIcon className="h-6 w-6 text-primary" />
                      </span>
                      <span className="absolute -left-5 bottom-1 rounded-full bg-[#e7f5ee] px-3 py-1.5 text-[10px] font-bold text-[#267b5c]">
                        Let’s talk it through
                      </span>
                    </div>
                    <h3 className="mt-7 max-w-xs text-xl font-extrabold">
                      A confident choice starts with the right questions.
                    </h3>
                    <p className="mt-3 max-w-xs text-xs leading-6 text-muted-foreground">
                      Bring your budget, worries and shortlist. A counsellor can help you organise
                      the next step.
                    </p>
                    <Button asChild className="mt-5 rounded-full px-5">
                      <Link to="/contact">
                        Speak with a counsellor <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="mt-10">
                  <SectionHeading
                    title="Guides you can save, print & share with family"
                    description="Take a little clarity away with you. These checklists are free to open and print."
                    align="left"
                  />
                  <CompactRail
                    label="Family checklists"
                    columns={3}
                    railClassName="auto-cols-[86%] gap-3 sm:auto-cols-[calc((100%-1.5rem)/3)]"
                  >
                    {guides.map((guide) => (
                      <a
                        key={guide.file}
                        href={guide.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex min-h-52 flex-col rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
                      >
                        <span
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-xl",
                            guide.color,
                          )}
                        >
                          <guide.icon className="h-5 w-5" />
                        </span>
                        <h3 className="mt-4 text-sm font-bold">{guide.title}</h3>
                        <p className="mt-2 text-xs leading-6 text-muted-foreground">
                          {guide.description}
                        </p>
                        <span className="mt-auto flex items-center justify-between gap-3 pt-4 text-[10px] font-bold">
                          <span className="text-muted-foreground">PRINT-FRIENDLY CHECKLIST</span>
                          <span className="inline-flex items-center gap-1 text-primary">
                            Open guide <ArrowDownToLine className="h-3.5 w-3.5" />
                          </span>
                        </span>
                      </a>
                    ))}
                  </CompactRail>
                </div>
              </div>
            </section>
            <section className="home-section" aria-labelledby="home-catalogue-title">
              <SectionHeading
                id="home-catalogue-title"
                title="A closer look at your next university"
                description="Go beyond a familiar name. Explore the programme, learning format and questions to ask before applying."
                align="left"
              />
              <CompactRail
                label="University programme profiles"
                columns={3}
                railClassName="auto-cols-[88%] gap-4 sm:auto-cols-[calc((100%-1rem)/2)] lg:auto-cols-[calc((100%-2rem)/3)]"
              >
                {featuredUniversities.slice(0, 6).map((university) => (
                  <UniversityProfileCard key={university.slug} university={university} />
                ))}
              </CompactRail>
              <a
                href="https://dekhocampus.com/colleges"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex min-h-14 flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-xs"
              >
                <span>
                  <strong>Prefer an on-campus experience?</strong> Explore colleges on DekhoCampus.
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-primary">
                  Explore campus colleges <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
            </section>
            <section className="home-band bg-surface" aria-labelledby="home-informed-title">
              <div className="home-section">
                <SectionHeading
                  id="home-informed-title"
                  title="Make an informed decision"
                  description="Understand the details before you decide. These pages help you compare with confidence."
                  align="left"
                />
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    {
                      title: "How to verify an online university",
                      text: "The programme, mode, intake and evidence to check.",
                      to: "/methodology" as const,
                      icon: ShieldCheck,
                    },
                    {
                      title: "Understand your course options",
                      text: "Explore eligibility, curriculum and career directions.",
                      to: "/programs" as const,
                      icon: GraduationCap,
                    },
                    {
                      title: "Compare universities side by side",
                      text: "Keep your shortlist together and inspect the details.",
                      to: "/compare" as const,
                      icon: Layers3,
                    },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-sm"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#edf2ff] text-primary dark:bg-accent">
                        <item.icon className="h-6 w-6" strokeWidth={1.4} />
                      </span>
                      <div>
                        <h3 className="text-sm font-bold leading-6">{item.title}</h3>
                        <p className="mt-1 text-xs leading-6 text-muted-foreground">{item.text}</p>
                        <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-primary">
                          Read more <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </details>
      </div>
      <section className="home-section !pb-12 !pt-8">
        <div className="relative overflow-hidden rounded-[28px] border border-[#dbe5f8] bg-[#eef4ff] px-5 py-9 text-center dark:border-border dark:bg-surface sm:px-10 sm:py-12">
          <div className="relative z-10">
            <div className="mb-5 flex justify-center">
              <BrandLogo size="md" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready to take the next step?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
              You don’t need every answer today. Start with a shortlist and a conversation about
              what works for you.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild className="rounded-full px-6">
                <Link to="/finder">
                  Find a degree that fits <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full bg-card px-6">
                <Link to="/contact">Talk to a counsellor</Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] text-muted-foreground">
              {[
                "Explore without signing up",
                "Your choice, your pace",
                "Human help when you need it",
              ].map((text) => (
                <span key={text} className="inline-flex items-center gap-1.5">
                  <BadgeCheck className="h-4 w-4 shrink-0" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StudySchedule() {
  const [selected, setSelected] = useState<number | null>(null);
  const slot = selected === null ? null : studySlots[selected]!;
  return (
    <section className="home-band home-warm" aria-labelledby="home-study-title">
      <div className="home-section study-layout">
        <div className="study-heading">
          <SectionHeading
            id="home-study-title"
            title="Make time to learn. On your terms."
            description="A learning routine that fits your life, not the other way around."
            align="left"
          />
        </div>
        <div className="study-visual">
          <div
            className="study-clock"
            role="img"
            aria-label="Illustrative 24-hour learning schedule, divided into morning, afternoon, evening and night"
          >
            <div className="study-clock-ring" />
            <div className="study-clock-centre">
              <strong>{slot ? slot.time : "24/7"}</strong>
              <span>{slot ? slot.task : "Your learning rhythm"}</span>
            </div>
            <span className="study-hour study-hour-top">12 AM</span>
            <span className="study-hour study-hour-right">6 AM</span>
            <span className="study-hour study-hour-bottom">12 PM</span>
            <span className="study-hour study-hour-left">6 PM</span>
            <span className="study-float study-float-night">Late-night replay</span>
            <span className="study-float study-float-evening">After-work revision</span>
            <span className="study-float study-float-morning">Early-morning focus</span>
          </div>
          <div role="group" aria-label="Study time" className="study-legend">
            {studySlots.map((item, index) => (
              <button
                key={item.label}
                type="button"
                aria-pressed={selected === index}
                onClick={() => setSelected(index)}
              >
                <span className={`study-key study-key-${index}`} />
                {item.label}
              </button>
            ))}
          </div>
          <p
            className="mt-3 min-h-10 text-center text-[11px] leading-5 text-muted-foreground"
            aria-live="polite"
          >
            {slot
              ? slot.note
              : "An example routine. Actual class times and access vary by university."}
          </p>
        </div>
        <div className="study-benefits">
          {[
            {
              title: "A schedule you can plan around",
              text: "Check compulsory live attendance and available batches.",
              icon: Sunrise,
            },
            {
              title: "Pause. Replay. Understand.",
              text: "Ask how long recordings remain available to revisit.",
              icon: Play,
            },
            {
              title: "Know your assessment windows",
              text: "Confirm exam dates, deadlines and proctoring needs.",
              icon: FileCheck2,
            },
            {
              title: "Less commuting. More learning.",
              text: "Check device, internet and platform requirements.",
              icon: Laptop2,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#fff2e4] text-[#a75b2b] dark:bg-secondary">
                <item.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold">{item.title}</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  id,
  title,
  description,
  align = "center",
}: {
  id?: string;
  title: string;
  description: string;
  align?: "center" | "left";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <h2
        id={id}
        className="font-display text-[25px] font-extrabold leading-[1.3] tracking-[-0.035em] sm:text-[32px]"
      >
        {title}
      </h2>
      <p className="mt-2 text-xs leading-6 text-muted-foreground sm:text-sm">{description}</p>
    </div>
  );
}

function Certificate({ kind, icon: Icon }: { kind: string; icon: LucideIcon }) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-[#ddd9cb] bg-card p-4 shadow-sm",
        kind === "Online" ? "rotate-3" : "-rotate-3",
      )}
    >
      <div className="absolute bottom-0 left-3 top-0 w-5 bg-[#d9e7ff] dark:bg-accent" />
      <div className="relative pl-5">
        <Icon className="h-6 w-6 text-primary" strokeWidth={1.4} />
        <p className="mt-3 text-[10px] font-bold uppercase tracking-wider">{kind}</p>
        <div className="mt-3 space-y-2" aria-hidden="true">
          <div className="h-1 w-full rounded bg-border" />
          <div className="h-1 w-4/5 rounded bg-border" />
          <div className="h-1 w-3/5 rounded bg-border" />
        </div>
        <div className="mt-5 flex items-center gap-1.5 text-[10px] font-semibold text-primary">
          <BadgeCheck className="h-4 w-4" />
          Check recognition
        </div>
      </div>
    </div>
  );
}

function UniversityProfileCard({ university }: { university: University }) {
  const programs = getUniversityPrograms(university);
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-[#f5f8ff] px-4 py-4 dark:bg-secondary">
        <UniversityLogo
          university={university}
          className="h-14 w-28 rounded-lg border-0 bg-white"
        />
        <span className="rounded-full border border-border bg-card px-2.5 py-1 text-[10px] text-muted-foreground">
          {university.state || "India"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-bold">{university.shortName}</h3>
        <p className="mt-1 text-xs leading-6 text-muted-foreground">
          Explore course profiles, eligibility and the details to check for your intake.
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {programs.slice(0, 4).map((program) => (
            <Link
              key={program.slug}
              to="/universities/$universitySlug/$programSlug"
              params={{ universitySlug: university.slug, programSlug: program.slug }}
              className="inline-flex min-h-8 items-center rounded-full border border-border bg-surface px-2.5 text-[10px] font-semibold transition-colors hover:border-primary hover:text-primary"
            >
              {program.code}
            </Link>
          ))}
        </div>
        <Link
          to="/universities/$universitySlug"
          params={{ universitySlug: university.slug }}
          className="mt-auto flex min-h-11 items-center justify-between gap-2 pt-4 text-xs font-bold text-primary"
        >
          View university <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
