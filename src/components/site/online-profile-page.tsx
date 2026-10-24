import {
  ArrowDownToLine,
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  ChevronRight,
  Clock3,
  GraduationCap,
  IndianRupee,
  Laptop,
  MapPin,
} from "lucide-react";
import type { ReactNode } from "react";
import { LeadForm } from "@/components/site/lead-form";
import { UniversityLogo } from "@/components/site/university-logo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  formatINR,
  formatUniversityLocation,
  getUniversityApprovalClaims,
  getUniversityPrograms,
  getUniversityRankingClaims,
  type University,
  type UniversityProgram,
} from "@/data/universities";
import { profileDetails, specialistCourses } from "@/data/online-profile-details";
import { getAllSpecialisations } from "@/data/specialisations";
import {
  coursePath,
  profileName,
  publishedCourseFee,
  resolveOnlineCourse,
  specialistPath,
  universityPath,
} from "@/lib/online-paths";

type Course = NonNullable<ReturnType<typeof resolveOnlineCourse>>;
type Tab = "overview" | "courses" | "faculty";
const photos: Record<string, { src: string; alt: string }> = {
  "amity-university-online": {
    src: "/online-profiles/amity.webp",
    alt: "Student learning with Amity Online",
  },
  "lpu-online": {
    src: "/online-profiles/lpu.webp",
    alt: "Lovely Professional University campus, Phagwara",
  },
  "jaypee-institute-of-information-technology-uttar-pradesh": {
    src: "/online-profiles/jiit.webp",
    alt: "Jaypee Institute of Information Technology campus",
  },
};

function officialSource(university: University) {
  const curated = profileDetails[university.slug as keyof typeof profileDetails]?.source;
  return (
    curated ??
    (university.domain
      ? `https://${university.domain.replace(/^https?:\/\//, "").replace(/\/$/, "")}`
      : university.verificationSourceUrl || "https://deb.ugc.ac.in/")
  );
}
function isCurrent(program: UniversityProgram, university: University) {
  return university.verificationCurrent === true && program.entitlementStatus === "verified";
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="profile-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
function DataTable({ headings, rows }: { headings?: string[]; rows: ReactNode[][] }) {
  return (
    <div
      className="profile-table-scroll"
      tabIndex={0}
      role="region"
      aria-label={headings?.join(", ") ?? "Programme details"}
    >
      <table className={`profile-table${headings ? "" : " profile-key-table"}`}>
        {headings && (
          <thead>
            <tr>
              {headings.map((h) => (
                <th key={h} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) =>
                j === 0 && !headings ? (
                  <th key={j} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={j}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Source({
  href,
  children = "View official programme information",
}: {
  href: string;
  children?: ReactNode;
}) {
  return (
    <a className="profile-source" href={href} target="_blank" rel="noopener noreferrer">
      {children} ↗
    </a>
  );
}
function TableOfContents({ items }: { items: [string, string][] }) {
  return (
    <details className="profile-toc">
      <summary>
        TABLE OF CONTENTS <ChevronDown size={16} />
      </summary>
      <nav aria-label="On this page">
        {items.map(([id, title]) => (
          <a href={`#${id}`} key={id}>
            {title}
            <ChevronRight size={13} />
          </a>
        ))}
      </nav>
    </details>
  );
}

function Hero({
  university: u,
  course,
  tab,
}: {
  university: University;
  course?: Course;
  tab: Tab;
}) {
  const name = profileName(u);
  const photo = photos[u.slug];
  const courseName = course?.specialist?.name ?? (course ? `Online ${course.program.code}` : "");
  const approvals = getUniversityApprovalClaims(u);
  const brochure = course?.specialist?.brochure;
  const path = universityPath(u);
  const fee = course ? publishedCourseFee(course) : null;
  return (
    <>
      <div className="profile-hero">
        <div className="profile-container">
          <nav className="profile-breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <ChevronRight size={11} />
            <a href="/online-universities">Online Universities</a>
            <ChevronRight size={11} />
            <a href={path}>{name}</a>
            {course && (
              <>
                <ChevronRight size={11} />
                <span>{courseName}</span>
              </>
            )}
          </nav>
          <div className="profile-hero-grid">
            <div>
              <p className="profile-kicker">
                {course ? "YOUR NEXT CHAPTER STARTS HERE" : "GET TO KNOW YOUR UNIVERSITY"}
              </p>
              <div className="profile-heading">
                <UniversityLogo university={u} priority />
                <div>
                  {course && (
                    <a href={path} className="profile-university-name">
                      {name} <ArrowRight size={14} />
                    </a>
                  )}
                  <h1>{course ? courseName : name}</h1>
                  {!course && <p>Find the online degree that fits your next step.</p>}
                </div>
              </div>
              {course && (
                <p className="profile-hero-intro">
                  Explore the course. Understand the costs. Plan your next move with a little help
                  from us.
                </p>
              )}
              <div className="profile-location">
                <span>
                  <MapPin size={13} />
                  {formatUniversityLocation(u)}
                </span>
                {approvals.slice(0, 2).map((claim) => (
                  <Source href={claim.sourceUrl} key={claim.id}>
                    <BadgeCheck size={13} />
                    {claim.renderedClaim}
                  </Source>
                ))}
              </div>
              <p className="profile-byline">
                <img src="/dekhocampus-logo.png" width="18" height="18" alt="" /> By DekhoCampus
                Editorial <span>•</span>
                {course?.specialist
                  ? `Programme information checked ${course.specialist.checkedAt}`
                  : "Check the current intake before applying"}
              </p>
              <div className="profile-hero-actions">
                <Dialog>
                  <DialogTrigger asChild>
                    <button type="button" className="profile-button">
                      {course ? "Get course guidance" : "Explore admission options"}{" "}
                      <ArrowRight size={16} />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="profile-dialog">
                    <div className="profile-dialog-heading">
                      <p>YOUR NEXT STEP</p>
                      <DialogTitle>Get admission guidance</DialogTitle>
                      <DialogDescription>
                        Ask about {courseName || name}. This is an independent counselling enquiry,
                        not a university admission application.
                      </DialogDescription>
                    </div>
                    <LeadForm
                      compact
                      hideIntroduction
                      {...(course ? { defaultProgramSlug: course.program.slug } : {})}
                      defaultUniversitySlug={u.slug}
                      requestContext={
                        course?.specialist?.name ??
                        (course ? `Online ${course.program.code}` : `${name} enquiry`)
                      }
                      className="profile-lead-form"
                    />
                  </DialogContent>
                </Dialog>
                <a
                  className="profile-button profile-button-outline"
                  href={brochure || "#apply"}
                  {...(brochure ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <ArrowDownToLine size={14} />
                  {brochure ? "Brochure" : "Request Brochure"}
                </a>
              </div>
              <p className="profile-hero-disclaimer">Free counselling · Explore at your own pace</p>
            </div>
            {photo ? (
              <figure className="profile-photo">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  width="360"
                  height="192"
                  fetchPriority="high"
                />
                <figcaption>
                  <span>EXPLORE ONLINE LEARNING</span>
                  <strong>{name}</strong>
                  <GraduationCap size={24} />
                </figcaption>
              </figure>
            ) : (
              <div className="profile-photo profile-photo-logo">
                <UniversityLogo university={u} size="lg" />
              </div>
            )}
          </div>
          {course && (
            <div className="profile-quick-facts" aria-label="Course at a glance">
              <div>
                <span className="profile-fact-icon">
                  <Clock3 size={20} />
                </span>
                <span>
                  <small>Course duration</small>
                  <strong>
                    {course.specialist?.duration ??
                      `${course.program.durationYears} years${course.offering?.durationVerified ? "" : " (typical)"}`}
                  </strong>
                </span>
              </div>
              <div>
                <span className="profile-fact-icon">
                  <Laptop size={20} />
                </span>
                <span>
                  <small>Learning mode</small>
                  <strong>Online degree</strong>
                </span>
              </div>
              <div>
                <span className="profile-fact-icon">
                  <IndianRupee size={20} />
                </span>
                <span>
                  <small>{fee === null ? "Programme fees" : "Published total fee"}</small>
                  <a href={fee === null ? "#apply" : "#fees"}>
                    {fee === null ? "Get current fees" : formatINR(fee)} <ArrowRight size={14} />
                  </a>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <nav className="profile-tabs" aria-label={course ? "Course sections" : "University sections"}>
        <div className="profile-container">
          {course
            ? [
                ["about-course", "Overview"],
                ["fees", "Fees"],
                ["eligibility", "Eligibility"],
                ["curriculum", "Syllabus"],
                ["admission", "Admission"],
                ["faqs", "FAQs"],
              ].map(([id, label]) => (
                <a href={`#${id}`} key={id}>
                  {label}
                </a>
              ))
            : (
                [
                  ["overview", "Overview", path],
                  ["courses", "Courses & Fees", `${path}/courses-fees`],
                  ["faculty", "Faculty", `${path}/faculty`],
                ] as const
              ).map(([key, label, href]) => (
                <a key={key} href={href} aria-current={tab === key ? "page" : undefined}>
                  {label}
                </a>
              ))}
        </div>
      </nav>
    </>
  );
}
function Counselling({ university, course }: { university: University; course?: Course }) {
  const specialists = specialistCourses.filter(
    (item) =>
      item.universitySlug === university.slug &&
      item.publicSlug !== course?.specialist?.publicSlug &&
      (!course || item.programSlug === course.program.slug),
  );
  const directLinks = specialists.map((item) => ({
    label: item.name,
    href: specialistPath(item)!,
    note: "University course profile",
  }));
  const related = course
    ? [
        ...directLinks,
        ...getAllSpecialisations()
          .filter(
            (item) =>
              item.program.slug === course.program.slug &&
              item.name !== course.specialist?.specialisation &&
              !directLinks.some((link) => link.label.includes(item.name)),
          )
          .map((item) => ({
            label: `${item.program.code} in ${item.name}`,
            href: `/specialisations/${item.slug}`,
            note: "Explore across universities",
          })),
      ].slice(0, 5)
    : [
        ...directLinks,
        ...getUniversityPrograms(university).map((program) => ({
          label: `Online ${program.code}`,
          href: coursePath(university, program.slug),
          note: program.name,
        })),
      ].slice(0, 5);
  return (
    <aside className="profile-sidebar">
      <div className="profile-enquiry" id="apply">
        <div className="profile-enquiry-title">
          <div>
            <h2>Find your next degree.</h2>
            <p>Let’s find the right fit, together.</p>
          </div>
          <img src="/diya-ai.webp" width="46" height="46" alt="Diya, your course guide" />
        </div>
        <LeadForm
          key={`${university.slug}/${course?.specialist?.publicSlug ?? course?.program.slug ?? "all"}`}
          compact
          hideIntroduction
          {...(course ? { defaultProgramSlug: course.program.slug } : {})}
          defaultUniversitySlug={university.slug}
          requestContext={
            course?.specialist?.name ??
            (course ? `Online ${course.program.code}` : `${profileName(university)} enquiry`)
          }
          className="profile-lead-form"
        />
      </div>
      <a className="profile-sidebar-compare" href="/compare">
        <span>Still weighing your options?</span>
        <strong>Compare universities side by side.</strong>
        <span>
          Start comparing <ArrowRight size={16} />
        </span>
      </a>
      {related.length > 0 && (
        <nav
          className="profile-related-courses"
          aria-label={course ? "Other specialisations" : "University courses and specialisations"}
        >
          <h2>{course ? "Other specialisations" : "Courses & specialisations"}</h2>
          {related.map((item) => (
            <a key={item.href} href={item.href}>
              <span>
                <strong>{item.label}</strong>
                <small>{item.note}</small>
              </span>
              <ArrowRight size={16} />
            </a>
          ))}
        </nav>
      )}
    </aside>
  );
}
function CourseList({ university }: { university: University }) {
  const programs = getUniversityPrograms(university);
  const specialists = specialistCourses.filter(
    (course) => course.universitySlug === university.slug,
  );
  return (
    <nav
      id="programs"
      aria-label="Open a course at this university"
      className="profile-course-navigation"
    >
      {programs.length > 0 && (
        <DataTable
          headings={["Degree", "Duration", "Total programme fee", "Details"]}
          rows={programs.map((p) => [
            <a href={coursePath(university, p.slug)}>{`Online ${p.code}`}</a>,
            p.durationVerified ? `${p.durationYears} years` : `${p.durationYears} years (typical)`,
            isCurrent(p, university) && p.feesVerified && p.totalFeeAvailable
              ? formatINR(p.totalFee)
              : "Request current fee",
            <a className="profile-table-cta" href={coursePath(university, p.slug)}>
              View course <ArrowRight size={12} />
            </a>,
          ])}
        />
      )}
      {specialists.length > 0 && (
        <div className="profile-specialisations">
          <h3>Explore a specialisation</h3>
          {specialists.map((item) => (
            <a key={item.publicSlug} href={specialistPath(item) ?? "#apply"}>
              <span>{item.name}</span>
              <ArrowRight size={15} />
            </a>
          ))}
        </div>
      )}
      {programs.length === 0 && specialists.length === 0 && (
        <p>
          We have not published a course list for this university yet. Ask the university to confirm
          current online programme availability.
        </p>
      )}
      <p className="profile-caption">
        Fees and intake availability can change. A course listing is not a current entitlement or
        admission guarantee.
      </p>
    </nav>
  );
}

function UniversityContent({ university: u, tab }: { university: University; tab: Tab }) {
  const detail = profileDetails[u.slug as keyof typeof profileDetails];
  const name = profileName(u);
  const source = officialSource(u);
  const rankings = getUniversityRankingClaims(u);
  const photo = photos[u.slug];
  if (tab === "faculty")
    return (
      <>
        <Section id="faculty" title={`${name} Faculty`}>
          <p>
            Faculty can differ by programme, semester and intake. We do not have a current verified
            faculty roster to publish here.
          </p>
          <p>
            Request the teaching team’s subject expertise, live-session schedule and academic
            support arrangements before enrolling.
          </p>
          <Source href={source}>Check the university’s faculty information</Source>
        </Section>
        <Section id="faculty-questions" title="Questions to ask your university">
          <ul>
            <li>Who teaches the core subjects and specialisation electives?</li>
            <li>Which sessions are live, and can working learners watch recordings?</li>
            <li>How are academic questions and project supervision handled?</li>
          </ul>
        </Section>
      </>
    );
  if (tab === "courses")
    return (
      <>
        <TableOfContents
          items={[
            ["courses", "Courses & Fees"],
            ["payment", "Payments & Refunds"],
            ["admission", "Admission Process"],
          ]}
        />
        <Section id="courses" title={`${name} Courses & Fees`}>
          <p>
            Choose a degree to review its duration, eligibility, subjects and available fee
            information.
          </p>
          <CourseList university={u} />
        </Section>
        <PaymentSection source={source} />
        <AdmissionSection />
      </>
    );
  return (
    <>
      <Section id="about" title={`About ${name}`}>
        <p>{detail?.introduction ?? u.about}</p>
        <details className="profile-read-more">
          <summary>
            Read more <ChevronDown size={13} />
          </summary>
          <p>
            Online study may help you fit a degree around work and other commitments. Review the
            learning platform, assessment format, eligibility and support for the programme you are
            considering—not just the university name.
          </p>
          <Source href={source}>Visit the official university website</Source>
        </details>
      </Section>
      <TableOfContents
        items={[
          ["highlights", "University Highlights"],
          ["why-choose", "Why Choose Online Learning?"],
          ["courses", "Courses & Fees"],
          ["learning", "Learning Experience"],
          ["rankings", "Recognition & Rankings"],
          ["payment", "Payments & Refunds"],
          ["admission", "Admission Process"],
          ["gallery", "University Gallery"],
          ["faqs", "Frequently Asked Questions"],
        ]}
      />
      <Section id="highlights" title={`${name} Highlights`}>
        <DataTable
          rows={[
            ["University", name],
            ["Location", formatUniversityLocation(u)],
            ["Study mode", "Online — confirm the exact programme and academic session"],
            [
              "Degrees & specialisations",
              <a href={`${universityPath(u)}/courses-fees`}>Browse course profiles</a>,
            ],
            ["Official website", <Source href={source}>{new URL(source).hostname}</Source>],
          ]}
        />
      </Section>
      <Section id="why-choose" title={`Why consider ${name}?`}>
        <p>
          Start with how you want to study and the support you will need to finish. Ask the
          university about these practical details:
        </p>
        <ul className="profile-checks">
          <li>
            <BadgeCheck />
            Live classes, recordings and access to study material
          </li>
          <li>
            <BadgeCheck />A timetable that works alongside your commitments
          </li>
          <li>
            <BadgeCheck />
            Academic help, assignments and examination arrangements
          </li>
          <li>
            <BadgeCheck />
            The complete fee, payment schedule and refund window
          </li>
        </ul>
      </Section>
      <Section id="courses" title={`${name} Courses & Fees`}>
        <CourseList university={u} />
      </Section>
      <Section id="learning" title="Learning Management System & Student Support">
        <p>
          Use the official programme page to check live-session timings, recording availability,
          assessment rules and technical requirements. Do not assume every degree at the same
          university has identical delivery or career support.
        </p>
        <DataTable
          rows={[
            ["Classes", "Confirm live sessions and access to recordings"],
            ["Assessments", "Ask about online exams, assignments and proctoring"],
            ["Academic support", "Request response times and project guidance details"],
            ["Career services", "Confirm eligibility and scope; no job or salary guarantee"],
          ]}
        />
      </Section>
      <Section id="rankings" title={`${name} Recognition & Rankings`}>
        {rankings.length ? (
          rankings.map((claim) => (
            <p key={claim.id}>
              {claim.renderedClaim} <Source href={claim.sourceUrl}>Source</Source>
            </p>
          ))
        ) : (
          <p>
            No current independently checked ranking is published in this profile. Rankings and
            accreditation are different from online programme entitlement.
          </p>
        )}
        <p>
          Check the exact university, degree and academic session using the official regulator
          records.
        </p>
        <Source href="https://deb.ugc.ac.in/">Check UGC-DEB records</Source>
      </Section>
      <PaymentSection source={source} />
      <AdmissionSection />
      <Section id="gallery" title={`${name} Gallery`}>
        {photo ? (
          <img
            className="profile-gallery"
            src={photo.src}
            alt={photo.alt}
            width="773"
            height="400"
            loading="lazy"
          />
        ) : (
          <p>University photographs have not been added to this profile yet.</p>
        )}
        <p className="profile-caption">
          University-published image. Online students should confirm campus access separately.
        </p>
      </Section>
      <FAQs university={u} />
    </>
  );
}
function PaymentSection({ source }: { source: string }) {
  return (
    <Section id="payment" title="Fee Payments, Scholarships & Refunds">
      <p>
        Request a written quote showing tuition, registration, examination and any other mandatory
        charges. Check whether a published discount applies to your intake and payment method.
      </p>
      <p>
        Financing or an EMI is not a fee reduction. Confirm the total payable, interest, lender
        terms and refund deductions before paying.
      </p>
      <Source href={source}>Confirm current fees with the university</Source>
    </Section>
  );
}
function AdmissionSection() {
  return (
    <Section id="admission" title="Admission Process">
      <ol className="profile-steps">
        <li>
          <strong>Choose your programme.</strong> Compare subjects, eligibility and study format.
        </li>
        <li>
          <strong>Verify the intake.</strong> Check programme entitlement and request a written fee
          quote.
        </li>
        <li>
          <strong>Apply with the university.</strong> Submit documents through its official
          application channel.
        </li>
        <li>
          <strong>Review before paying.</strong> Keep the fee schedule, refund policy and payment
          receipt.
        </li>
      </ol>
      <a className="profile-button" href="#apply">
        Get admission guidance <ArrowRight size={14} />
      </a>
    </Section>
  );
}
function FAQs({ university, course }: { university: University; course?: Course }) {
  return (
    <Section id="faqs" title="Frequently Asked Questions">
      {[
        [
          `How do I apply to ${profileName(university)}?`,
          "Confirm eligibility and the current intake with the university. Our counsellors can help you compare options; the university makes admission decisions.",
        ],
        [
          "What is the complete fee?",
          course
            ? publishedCourseFee(course) !== null
              ? `The dated published programme fee snapshot is ${formatINR(publishedCourseFee(course)!)}. Ask for a current written quote including any additional charges.`
              : "A definitive current fee is not published here. Ask the university for the complete payable amount and payment schedule."
            : "Open a course profile and check the dated fee information. Confirm all mandatory charges and current payment terms directly with the university.",
        ],
        [
          "Does online study guarantee a job?",
          "No. Career services and placement support do not guarantee employment, a salary increase or a particular role.",
        ],
        [
          "Can I check the programme without sharing my phone number?",
          "Yes. Course details, university information and comparison tools are available without an enquiry. Share your details only when you want counselling.",
        ],
      ].map(([question, answer]) => (
        <details className="profile-faq" key={question}>
          <summary>
            {question}
            <ChevronDown size={15} />
          </summary>
          <p>{answer}</p>
        </details>
      ))}
    </Section>
  );
}
function CourseContent({ course }: { course: Course }) {
  const { university: u, program: p, specialist: s, offering: o } = course;
  const name = s?.name ?? `Online ${p.code}`;
  const source = s?.source ?? o?.universityProgramUrl ?? officialSource(u);
  const fee = publishedCourseFee(course);
  const curriculum = s
    ? s.curriculum.map((subjects, index) => ({
        semester: `Semester ${index + 1}`,
        subjects: [...subjects],
      }))
    : o?.curriculumVerified
      ? o.curriculum
      : [];
  const eligibility =
    s?.eligibility ??
    (o?.eligibilityVerified
      ? o.eligibility
      : "Confirm the current entry requirements, marks and required documents with the university.");
  return (
    <>
      <Section id="about-course" title="A closer look at your course">
        <p>{s?.description ?? p.overview}</p>
        <Source href={source} />
      </Section>
      <TableOfContents
        items={[
          ["highlights", "Course Highlights"],
          ["fees", "Fee Structure"],
          ["rankings", "Rankings & Recognition"],
          ["placements", "Career Support"],
          ["eligibility", "Eligibility"],
          ["curriculum", "Curriculum"],
          ["other-specialisations", "Other Courses & Specialisations"],
          ["admission", "Admission Process"],
          ["faqs", "FAQs"],
        ]}
      />
      <Section id="highlights" title="Your course, at a glance">
        <DataTable
          rows={[
            ["Programme", name],
            ["University", <a href={universityPath(u)}>{profileName(u)}</a>],
            [
              "Duration",
              s?.duration ??
                `${p.durationYears} years${o?.durationVerified ? "" : " (typical; confirm with university)"}`,
            ],
            ["Mode", "Online"],
            ["Eligibility", eligibility],
            [
              "Total programme fee",
              fee !== null ? formatINR(fee) : "Request current university fee",
            ],
          ]}
        />
      </Section>
      <Section id="fees" title="Understand your investment">
        <DataTable
          headings={["Fee component", "Amount"]}
          rows={[
            ["Published programme fee", fee !== null ? formatINR(fee) : "Confirm with university"],
            [
              "Semester fee",
              s?.semesterFee && fee !== null
                ? formatINR(s.semesterFee)
                : o && fee !== null && o.perSemesterFeeVerified && o.perSemesterFeeAvailable
                  ? formatINR(o.perSemesterFee)
                  : "Confirm payment schedule",
            ],
            ["Registration, exam & other charges", "Confirm inclusions and any additional charges"],
          ]}
        />
        <p className="profile-caption">
          {s?.feeNote ??
            "Fees are shown only when current evidence is available. Ask for an all-inclusive written quote before paying."}
          {s && ` Information checked ${s.checkedAt}; next review ${s.reviewBy}.`}
        </p>
        <Source href={s?.feeSource ?? o?.feeSourceUrl ?? source}>
          Check official fee information
        </Source>
      </Section>
      <Section id="rankings" title="Rankings & Programme Recognition">
        <p>
          A university’s institutional ranking is not a ranking for this particular online
          specialisation. We have not published an independently verified course-specific rank here.
        </p>
        <p>
          Before applying, verify the university, programme title and academic session on the
          regulator’s official records.
        </p>
        <Source href="https://deb.ugc.ac.in/">Check UGC-DEB records</Source>
      </Section>
      <Section id="placements" title="Plan for what comes next">
        <p>
          Ask the university which career services are included, who can access them and how support
          is delivered. No verified course-specific placement rate, company count or salary figure
          is available in this profile.
        </p>
        <div className="profile-career-note">
          <BadgeCheck size={20} />
          <span>
            Career support is not a placement guarantee. Compare the skills and curriculum with the
            roles you want to pursue.
          </span>
        </div>
      </Section>
      <Section id="eligibility" title="Is this course right for you?">
        <DataTable
          rows={[
            ["Academic qualification", eligibility],
            [
              "Documents",
              "Graduation records, identity documents and other records requested by the university",
            ],
            ["Final decision", "The university verifies eligibility and decides admission"],
          ]}
        />
      </Section>
      <Section id="curriculum" title="What will you study?">
        {curriculum.length ? (
          <DataTable
            headings={curriculum.map((semester) => semester.semester)}
            rows={Array.from(
              { length: Math.max(...curriculum.map((semester) => semester.subjects.length)) },
              (_, i) => curriculum.map((semester) => semester.subjects[i] ?? "—"),
            )}
          />
        ) : (
          <>
            <p>
              The current university-specific semester syllabus has not been published in our
              catalogue. Use the university’s academic document to review subjects, electives,
              credit requirements and assessment rules.
            </p>
            {s?.brochure && <Source href={s.brochure}>Read the official academic document</Source>}
          </>
        )}
        <p className="profile-caption">
          Curriculum may change by intake. Confirm your specialisation and elective availability.
        </p>
      </Section>
      <div className="profile-compare-banner">
        <div>
          <h2>Compare before you commit.</h2>
          <p>Put universities, fees and programme details side by side.</p>
        </div>
        <a className="profile-button" href="/compare">
          Compare Now <ArrowRight size={14} />
        </a>
      </div>
      <Section id="other-specialisations" title="Other Courses & Specialisations">
        <CourseList university={u} />
      </Section>
      <AdmissionSection />
      <FAQs university={u} course={course} />
    </>
  );
}

export function OnlineUniversityPage({
  university,
  tab = "overview",
}: {
  university: University;
  tab?: Tab;
}) {
  return (
    <div className="online-profile profile-refined">
      <Hero university={university} tab={tab} />
      <div className="profile-container profile-content">
        <article>
          <UniversityContent university={university} tab={tab} />
        </article>
        <Counselling university={university} />
      </div>
    </div>
  );
}
export function OnlineCoursePage({ course }: { course: Course }) {
  return (
    <div className="online-profile profile-refined">
      <Hero university={course.university} course={course} tab="courses" />
      <div className="profile-container profile-content">
        <article>
          <CourseContent course={course} />
        </article>
        <Counselling university={course.university} course={course} />
      </div>
    </div>
  );
}
