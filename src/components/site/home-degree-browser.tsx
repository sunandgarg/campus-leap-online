import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  Clapperboard,
  Clock3,
  Code2,
  HeartPulse,
  IndianRupee,
  Layers3,
  Megaphone,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { UniversityLogo } from "@/components/site/university-logo";
import { formatINR, programCatalog, universitiesOfferingProgram } from "@/data/universities";

export function degreeOptions(programs: typeof programCatalog, course: string) {
  const groups = programs
    .filter((program) => program.slug === course)
    .map((program) => universitiesOfferingProgram(program.slug));
  return groups.flatMap((group) => group.slice(0, 6));
}

const interests = [
  {
    name: "AI, Data & Analytics",
    icon: BrainCircuit,
    codes: ["MBA", "MCA", "MSc Data Science", "BBA", "BCA", "PGD DS"],
  },
  { name: "Tech & Software", icon: Code2, codes: ["MCA", "MSc Data Science", "BCA", "PGD DS"] },
  { name: "Finance & Banking", icon: Building2, codes: ["MBA", "M.Com", "BBA", "B.Com"] },
  { name: "Marketing & Digital", icon: Megaphone, codes: ["MBA", "MA JMC", "BBA"] },
  {
    name: "Business & Entrepreneurship",
    icon: BriefcaseBusiness,
    codes: ["MBA", "M.Com", "BBA", "B.Com"],
  },
  { name: "Healthcare & Management", icon: HeartPulse, codes: ["MBA", "BBA"] },
  { name: "Operations & Supply Chain", icon: SlidersHorizontal, codes: ["MBA", "BBA"] },
  { name: "HR & People", icon: Users, codes: ["MBA", "MSW", "BBA"] },
  { name: "Media & Communication", icon: Clapperboard, codes: ["MA JMC", "BA"] },
  { name: "Explore all interests", icon: Layers3, codes: [] },
];

export function HomeDegreeBrowser() {
  const [interestIndex, setInterestIndex] = useState(0);
  const [course, setCourse] = useState("all");
  const interest = interests[interestIndex]!;
  const available = programCatalog.filter(
    (program) => !interest.codes.length || interest.codes.includes(program.code),
  );
  const options =
    course === "all"
      ? available
          .flatMap((program) => universitiesOfferingProgram(program.slug))
          .sort((a, b) => a.university.name.localeCompare(b.university.name))
          .slice(0, 12)
      : degreeOptions(available, course);
  return (
    <section
      id="explore-courses"
      className="home-section scroll-mt-20"
      aria-labelledby="home-degrees-title"
    >
      <header className="max-w-3xl">
        <h2
          id="home-degrees-title"
          className="mt-2 font-display text-[25px] font-extrabold leading-tight tracking-tight sm:text-[32px]"
        >
          Online degrees built around your ambition.
        </h2>
        <p className="mt-3 text-xs leading-6 text-muted-foreground sm:text-sm">
          Find your area of interest, choose a course and explore your university options.
        </p>
      </header>
      <div className="home-interest-browser mt-6">
        <nav className="ambition-interests" aria-label="Explore by interest">
          {interests.map(({ name, icon: Icon }, index) => (
            <button
              key={name}
              type="button"
              aria-pressed={interestIndex === index}
              onClick={() => {
                setInterestIndex(index);
                setCourse("all");
              }}
            >
              <Icon size={18} className="shrink-0" />
              <span>{name}</span>
              <ArrowRight size={14} className="ml-auto shrink-0" />
            </button>
          ))}
        </nav>
        <div className="min-w-0">
          <h3 className="mb-4 text-lg font-bold">{interest.name}</h3>
          <div role="group" aria-label="Choose a degree" className="ambition-course-filters">
            <button type="button" aria-pressed={course === "all"} onClick={() => setCourse("all")}>
              All courses
            </button>
            {(
              [
                ["Masters", "PG"],
                ["Bachelors", "UG"],
                ["Diploma", "Diploma"],
                ["Certificate", "Certificate"],
              ] as const
            ).map(([level, label]) => {
              const degrees = available.filter((program) => program.level === level);
              return (
                degrees.length > 0 && (
                  <div key={level} className="ambition-filter-group">
                    <span className="ambition-filter-label">{label}</span>
                    {degrees.map((program) => (
                      <button
                        key={program.slug}
                        type="button"
                        aria-pressed={course === program.slug}
                        onClick={() => setCourse(program.slug)}
                      >
                        {program.code}
                      </button>
                    ))}
                  </div>
                )
              );
            })}
          </div>
          <HomeCourseOptions options={options} label="Choose an online course" />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] leading-5 text-muted-foreground">
              Swipe or scroll sideways. Open a university course for fees, eligibility and guidance.
            </p>
            <Link to="/programs" className="study-browser-link">
              View all courses <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-2 text-[10px] leading-5 text-muted-foreground">
            Explore related degrees; specialisation availability varies by university and intake.
          </p>
        </div>
      </div>
    </section>
  );
}

export function HomeCourseOptions({
  options,
  label,
}: {
  options: ReturnType<typeof universitiesOfferingProgram>;
  label: string;
}) {
  return (
    <nav
      key={options.map(({ university, program }) => `${university.slug}/${program.slug}`).join(",")}
      aria-label={label}
      tabIndex={0}
      className="ambition-cards"
    >
      {options.map(({ university, program }) => {
        const verifiedFee =
          university.verificationCurrent === true &&
          program.entitlementStatus === "verified" &&
          program.feesVerified &&
          program.totalFeeAvailable;
        return (
          <Link
            key={`${university.slug}-${program.slug}`}
            to="/universities/$universitySlug/$programSlug"
            params={{ universitySlug: university.slug, programSlug: program.slug }}
            className="ambition-card"
          >
            <div className="ambition-card-university">
              <UniversityLogo
                university={university}
                className="h-6 w-9 shrink-0 rounded-none border-0 bg-white"
              />
              <span>{university.shortName}</span>
              <ArrowUpRight className="ml-auto h-4 w-4 shrink-0" />
            </div>
            <div className="ambition-card-body">
              <span className="ambition-card-level">
                {program.level === "Masters"
                  ? "Postgraduate"
                  : program.level === "Bachelors"
                    ? "Undergraduate"
                    : program.level}{" "}
                course
              </span>
              <h3>Online {program.code}</h3>
              <p className="ambition-course-name">{program.name}</p>
              <div className="ambition-card-facts">
                <div>
                  <span>
                    <Clock3 /> Typical duration
                  </span>
                  <strong>{program.durationYears} years</strong>
                </div>
                <div>
                  <span>
                    <IndianRupee /> Total fee
                  </span>
                  <strong>{verifiedFee ? formatINR(program.totalFee) : "Check current fee"}</strong>
                </div>
              </div>
              <span className="ambition-card-cta">
                Course details & fees <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        );
      })}
      {!options.length && (
        <p className="p-5 text-sm leading-6 text-muted-foreground">
          No course profiles are available here yet. Open the full guide or ask our team for help.
        </p>
      )}
    </nav>
  );
}
