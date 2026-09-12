import { directoryUniversities, universityLogoUrls } from "@/data/directory-universities";

/**
 * Central data layer for online.dekhocampus.in
 *
 * Everything on the site (landing page, university list, university pages and
 * course pages) is derived from these structures, so adding a university or a
 * program automatically creates fully-populated, SEO-ready pages.
 */

export type ProgramLevel = "Bachelors" | "Masters" | "Diploma" | "Certificate";
export type EntitlementStatus = "verified" | "unverified" | "expired" | "no-admission" | "debarred";

export interface ClaimEvidence {
  id: string;
  renderedClaim: string;
  claimType: string;
  universitySlug?: string | undefined;
  programSlug?: string | undefined;
  offeringId?: string | undefined;
  sourceUrl: string;
  sourceDate?: string | undefined;
  academicSession?: string | undefined;
  methodology?: string | undefined;
  verifiedAt: string;
  expiresAt: string;
  published: boolean;
}

export interface CatalogSpecialisation {
  id: string;
  slug: string;
  name: string;
  category?: string | undefined;
  summary?: string | undefined;
  skills: string[];
  careerDirections: string[];
  sortOrder: number;
  /** Programs inferred from current, published offering mappings or legacy taxonomy labels. */
  programSlugs: string[];
  /** Exact labels used by a university for a current, published offering mapping. */
  programLabels: { programSlug: string; label: string }[];
}

export interface ProgramTemplate {
  /** url slug fragment, e.g. "online-mba" */
  slug: string;
  /** short code, e.g. "MBA" */
  code: string;
  /** full name, e.g. "Master of Business Administration" */
  name: string;
  level: ProgramLevel;
  durationYears: number;
  semesters: number;
  eligibility: string;
  overview: string;
  specialisations: string[];
  curriculum: { semester: string; subjects: string[] }[];
  careers: string[];
  heroImageUrl?: string | undefined;
}

export interface UniversityProgram extends ProgramTemplate {
  totalFee: number;
  perSemesterFee: number;
  emiPerMonth: number;
  /** Whether at least one source-backed fee field exists for comparison. */
  feeGuideAvailable: boolean;
  totalFeeAvailable: boolean;
  perSemesterFeeAvailable: boolean;
  emiPerMonthAvailable: boolean;
  /** True only when the amount has explicit source evidence, not a fallback multiplier. */
  feesVerified: boolean;
  /** True only when the cited fee source states the semester amount itself. */
  perSemesterFeeVerified: boolean;
  /** True only when the cited fee source states the monthly payment itself. */
  emiPerMonthVerified: boolean;
  /** Whether the duration and semester count came from the reviewed offering. */
  durationVerified: boolean;
  /** Whether eligibility came from the reviewed offering. */
  eligibilityVerified: boolean;
  /** Whether curriculum came from the reviewed offering. */
  curriculumVerified: boolean;
  /** True only when this university-level offering has its own checked pathway list. */
  specialisationsVerified: boolean;
  offeringId?: string | undefined;
  entitlementStatus?: EntitlementStatus | undefined;
  academicSession?: string | undefined;
  entitlementSourceUrl?: string | undefined;
  universityProgramUrl?: string | undefined;
  officialApplicationUrl?: string | undefined;
  verifiedAt?: string | undefined;
  deliveryMode?: "ONLINE" | "ODL" | undefined;
  examMode?: string | undefined;
  scholarshipSummary?: string | undefined;
  refundPolicyUrl?: string | undefined;
  feeSourceUrl?: string | undefined;
  feeVerifiedAt?: string | undefined;
  feeNextReviewAt?: string | undefined;
  feeComponents?: { [key: string]: SettingsValue } | undefined;
  seatsFilledPercent?: number | undefined;
}

export interface University {
  slug: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  established: number;
  domain: string;
  accentColor: string;
  /** Legacy editorial field; render accreditation only through current claim evidence. */
  naacGrade: string;
  /** Legacy editorial tags; never present these as verified public approvals. */
  approvals: string[];
  /** Current evidence rows scoped to this university (and optionally one of its programs). */
  claimEvidence?: ClaimEvidence[] | undefined;
  /** University-wide recognition/accreditation claims derived only from current evidence rows. */
  supportedApprovals?: string[] | undefined;
  rating: number;
  reviews: number;
  studentsEnrolled: string;
  placementPartners: string[];
  highlights: string[];
  about: string;
  logoUrl?: string | undefined;
  heroImageUrl?: string | undefined;
  hiringPartnerCount?: string | undefined;
  legalName?: string | undefined;
  heiId?: string | undefined;
  /**
   * Complete profiles contain editorially reviewed fees and learning details.
   * Directory profiles are discovery records with deliberately limited detail.
   * A source may be attached, but callers must check before describing one as
   * source-listed. Every record still needs intake-level confirmation.
   */
  profileDepth?: "complete" | "directory" | undefined;
  verificationAcademicYear?: string | undefined;
  verificationSourceUrl?: string | undefined;
  lastVerified?: string | undefined;
  verificationNextReviewAt?: string | undefined;
  verificationCurrent?: boolean | undefined;
  /** Independent evidence for ratings, review totals and enrolment metrics. */
  metricsVerified?: boolean | undefined;
  /**
   * Programs offered. `feeMultiplier` is retained only to read the legacy
   * editorial seed; it is never converted into a public fee. Publish amounts
   * only through explicit, independently verified fee fields.
   */
  programs: {
    slug: string;
    feeMultiplier?: number | undefined;
    totalFee?: number | undefined;
    perSemesterFee?: number | undefined;
    emiPerMonth?: number | undefined;
    feeGuideAvailable?: boolean | undefined;
    feesVerified?: boolean | undefined;
    perSemesterFeeVerified?: boolean | undefined;
    emiPerMonthVerified?: boolean | undefined;
    specialisations?: string[] | undefined;
    specialisationsVerified?: boolean | undefined;
    offeringId?: string | undefined;
    entitlementStatus?: EntitlementStatus | undefined;
    academicSession?: string | undefined;
    entitlementSourceUrl?: string | undefined;
    universityProgramUrl?: string | undefined;
    officialApplicationUrl?: string | undefined;
    verifiedAt?: string | undefined;
    officialProgrammeName?: string | undefined;
    deliveryMode?: "ONLINE" | "ODL" | undefined;
    durationYears?: number | undefined;
    semesters?: number | undefined;
    eligibility?: string | undefined;
    curriculum?: ProgramTemplate["curriculum"] | undefined;
    examMode?: string | undefined;
    scholarshipSummary?: string | undefined;
    refundPolicyUrl?: string | undefined;
    feeSourceUrl?: string | undefined;
    feeVerifiedAt?: string | undefined;
    feeNextReviewAt?: string | undefined;
    feeComponents?: { [key: string]: SettingsValue } | undefined;
    seatsFilledPercent?: number | undefined;
  }[];
}

export type SettingsValue =
  string | number | boolean | null | SettingsValue[] | { [key: string]: SettingsValue };

export type SiteSettings = Record<string, SettingsValue>;

export interface Catalog {
  universities: University[];
  programs: ProgramTemplate[];
  claimEvidence?: ClaimEvidence[] | undefined;
  specialisations?: CatalogSpecialisation[] | undefined;
  settings: SiteSettings;
  /** Database is authoritative; fallback keeps the reviewed bundled catalogue. */
  source?: "database" | "fallback" | undefined;
}

const programTemplates: ProgramTemplate[] = [
  {
    slug: "online-mba",
    code: "MBA",
    name: "Master of Business Administration",
    level: "Masters",
    durationYears: 2,
    semesters: 4,
    eligibility:
      "Bachelor's degree in any discipline from a recognised university with minimum 50% aggregate (45% for reserved categories).",
    overview:
      "An online MBA category guide covering management foundations, possible elective pathways and the curriculum questions a working professional should compare.",
    specialisations: [
      "Marketing Management",
      "Finance",
      "Human Resource Management",
      "Operations Management",
      "Business Analytics",
      "International Business",
      "Information Technology",
      "Entrepreneurship",
    ],
    curriculum: [
      {
        semester: "Semester 1",
        subjects: [
          "Management Principles & Practice",
          "Managerial Economics",
          "Accounting for Managers",
          "Organisational Behaviour",
          "Business Communication",
        ],
      },
      {
        semester: "Semester 2",
        subjects: [
          "Marketing Management",
          "Financial Management",
          "Human Resource Management",
          "Operations Management",
          "Business Research Methods",
        ],
      },
      {
        semester: "Semester 3",
        subjects: [
          "Strategic Management",
          "Business Analytics",
          "Specialisation Elective I",
          "Specialisation Elective II",
          "Live Industry Project",
        ],
      },
      {
        semester: "Semester 4",
        subjects: [
          "Corporate Governance & Ethics",
          "Leadership & Change Management",
          "Specialisation Elective III",
          "Specialisation Elective IV",
          "Capstone Dissertation",
        ],
      },
    ],
    careers: [
      "Business Manager",
      "Marketing Manager",
      "Financial Analyst",
      "HR Business Partner",
      "Operations Lead",
      "Product Manager",
    ],
  },
  {
    slug: "online-bba",
    code: "BBA",
    name: "Bachelor of Business Administration",
    level: "Bachelors",
    durationYears: 3,
    semesters: 6,
    eligibility:
      "10+2 or an equivalent qualification from a recognised board; exact thresholds and entrance requirements vary by university.",
    overview:
      "An online BBA category guide covering common business, finance and marketing foundations and the delivery and assessment questions to compare.",
    specialisations: [
      "Marketing",
      "Finance",
      "Human Resources",
      "Digital Marketing",
      "Business Analytics",
      "International Business",
    ],
    curriculum: [
      {
        semester: "Year 1",
        subjects: [
          "Principles of Management",
          "Business Economics",
          "Financial Accounting",
          "Business Mathematics & Statistics",
          "Business Communication",
        ],
      },
      {
        semester: "Year 2",
        subjects: [
          "Marketing Management",
          "Cost Accounting",
          "Organisational Behaviour",
          "Business Law",
          "Management Information Systems",
        ],
      },
      {
        semester: "Year 3",
        subjects: [
          "Strategic Management",
          "Entrepreneurship Development",
          "Specialisation Electives",
          "Research Project",
          "Industry Internship Report",
        ],
      },
    ],
    careers: [
      "Business Development Executive",
      "Marketing Associate",
      "Junior Analyst",
      "HR Executive",
      "Operations Executive",
    ],
  },
  {
    slug: "online-mca",
    code: "MCA",
    name: "Master of Computer Applications",
    level: "Masters",
    durationYears: 2,
    semesters: 4,
    eligibility:
      "Bachelor's degree with Mathematics at 10+2 or graduation level, minimum 50% aggregate.",
    overview:
      "An industry-aligned online MCA covering full-stack development, cloud, data structures and AI. Ideal for graduates targeting software engineering and data roles without leaving their job.",
    specialisations: [
      "Artificial Intelligence & Machine Learning",
      "Data Science",
      "Cloud Computing",
      "Cyber Security",
      "Full Stack Development",
    ],
    curriculum: [
      {
        semester: "Semester 1",
        subjects: [
          "Problem Solving with C",
          "Computer Organisation",
          "Discrete Mathematics",
          "Database Management Systems",
        ],
      },
      {
        semester: "Semester 2",
        subjects: [
          "Data Structures & Algorithms",
          "Object Oriented Programming with Java",
          "Operating Systems",
          "Web Technologies",
        ],
      },
      {
        semester: "Semester 3",
        subjects: [
          "Software Engineering",
          "Computer Networks",
          "Cloud Computing",
          "Specialisation Elective",
        ],
      },
      {
        semester: "Semester 4",
        subjects: [
          "Machine Learning",
          "Big Data Analytics",
          "Specialisation Elective",
          "Major Project",
        ],
      },
    ],
    careers: [
      "Software Engineer",
      "Full Stack Developer",
      "Data Analyst",
      "Cloud Engineer",
      "QA Automation Engineer",
    ],
  },
  {
    slug: "online-bca",
    code: "BCA",
    name: "Bachelor of Computer Applications",
    level: "Bachelors",
    durationYears: 3,
    semesters: 6,
    eligibility: "10+2 in any stream from a recognised board with minimum 50% aggregate.",
    overview:
      "Build a career in tech with an online BCA that starts from programming fundamentals and takes you to full-stack projects, databases and cloud deployment.",
    specialisations: [
      "Data Analytics",
      "Cloud & DevOps",
      "Cyber Security",
      "Web & Mobile Development",
    ],
    curriculum: [
      {
        semester: "Year 1",
        subjects: [
          "Programming Fundamentals",
          "Digital Electronics",
          "Mathematics for Computing",
          "Introduction to DBMS",
        ],
      },
      {
        semester: "Year 2",
        subjects: [
          "Data Structures",
          "Java Programming",
          "Operating Systems",
          "Software Engineering",
        ],
      },
      {
        semester: "Year 3",
        subjects: [
          "Web Development",
          "Computer Networks",
          "Cloud Fundamentals",
          "Capstone Project",
        ],
      },
    ],
    careers: [
      "Junior Developer",
      "Support Engineer",
      "Web Developer",
      "Data Entry & Analytics Associate",
    ],
  },
  {
    slug: "online-mcom",
    code: "M.Com",
    name: "Master of Commerce",
    level: "Masters",
    durationYears: 2,
    semesters: 4,
    eligibility: "B.Com / BBA / any bachelor's degree with commerce subjects, minimum 50%.",
    overview:
      "An online M.Com for finance and accounting professionals, aligned with CA/CS/CMA preparation and corporate finance roles.",
    specialisations: ["Accounting & Finance", "Taxation", "Banking & Insurance"],
    curriculum: [
      {
        semester: "Semester 1",
        subjects: [
          "Advanced Financial Accounting",
          "Business Environment",
          "Managerial Economics",
          "Statistics for Business",
        ],
      },
      {
        semester: "Semester 2",
        subjects: [
          "Corporate Accounting",
          "Direct & Indirect Taxation",
          "Financial Markets",
          "Cost & Management Accounting",
        ],
      },
      {
        semester: "Semester 3",
        subjects: [
          "Security Analysis & Portfolio Management",
          "International Finance",
          "Auditing",
          "Elective",
        ],
      },
      {
        semester: "Semester 4",
        subjects: [
          "Strategic Financial Management",
          "GST & Corporate Compliance",
          "Elective",
          "Dissertation",
        ],
      },
    ],
    careers: ["Accountant", "Tax Consultant", "Finance Executive", "Audit Associate"],
  },
  {
    slug: "online-bcom",
    code: "B.Com",
    name: "Bachelor of Commerce",
    level: "Bachelors",
    durationYears: 3,
    semesters: 6,
    eligibility: "10+2 from a recognised board with minimum 50% aggregate.",
    overview:
      "A flexible online B.Com covering accounting, taxation and corporate law, designed for students who want a degree alongside professional exam preparation.",
    specialisations: ["Accounting & Finance", "Taxation", "Corporate Accounting"],
    curriculum: [
      {
        semester: "Year 1",
        subjects: [
          "Financial Accounting",
          "Business Organisation",
          "Business Economics",
          "Business Law",
        ],
      },
      {
        semester: "Year 2",
        subjects: ["Corporate Accounting", "Income Tax", "Cost Accounting", "Company Law"],
      },
      {
        semester: "Year 3",
        subjects: ["Auditing", "GST", "Financial Management", "Project Work"],
      },
    ],
    careers: ["Accounts Executive", "Tax Assistant", "Banking Associate"],
  },
  {
    slug: "online-ma-journalism-mass-communication",
    code: "MA JMC",
    name: "Master of Arts in Journalism & Mass Communication",
    level: "Masters",
    durationYears: 2,
    semesters: 4,
    eligibility: "Bachelor's degree in any discipline with minimum 50% aggregate.",
    overview:
      "A media-first online MA JMC covering digital journalism, content strategy, PR and video storytelling with portfolio-based assessments.",
    specialisations: ["Digital Media", "Public Relations", "Advertising", "Broadcast Journalism"],
    curriculum: [
      {
        semester: "Semester 1",
        subjects: [
          "Introduction to Communication",
          "Reporting & Editing",
          "Media Laws & Ethics",
          "Media Research",
        ],
      },
      {
        semester: "Semester 2",
        subjects: ["Digital Journalism", "Public Relations", "Advertising", "Photojournalism"],
      },
      {
        semester: "Semester 3",
        subjects: [
          "Broadcast Production",
          "Content Strategy",
          "Development Communication",
          "Elective",
        ],
      },
      {
        semester: "Semester 4",
        subjects: ["Media Management", "Data Journalism", "Elective", "Dissertation"],
      },
    ],
    careers: ["Content Writer", "Digital Marketer", "PR Executive", "News Producer"],
  },
  {
    slug: "online-ma-english",
    code: "MA English",
    name: "Master of Arts in English",
    level: "Masters",
    durationYears: 2,
    semesters: 4,
    eligibility: "Bachelor's degree in any discipline with minimum 50% aggregate.",
    overview:
      "An online MA English for teaching, publishing, content and civil-services aspirants, covering literature, criticism and linguistics.",
    specialisations: ["Literature", "Linguistics", "Communication Studies"],
    curriculum: [
      {
        semester: "Semester 1",
        subjects: ["British Poetry", "Drama", "Literary Criticism", "Linguistics"],
      },
      {
        semester: "Semester 2",
        subjects: [
          "British Fiction",
          "American Literature",
          "Indian Writing in English",
          "Elective",
        ],
      },
      {
        semester: "Semester 3",
        subjects: ["Postcolonial Literature", "World Literature", "Literary Theory", "Elective"],
      },
      {
        semester: "Semester 4",
        subjects: [
          "Comparative Literature",
          "English Language Teaching",
          "Elective",
          "Dissertation",
        ],
      },
    ],
    careers: ["Teacher", "Editor", "Content Strategist", "Academic Researcher"],
  },
  {
    slug: "online-pg-diploma-data-science",
    code: "PGD DS",
    name: "PG Diploma in Data Science",
    level: "Diploma",
    durationYears: 1,
    semesters: 2,
    eligibility: "Bachelor's degree in any discipline; basic mathematics recommended.",
    overview:
      "A one-year online PG diploma that takes you from Python and statistics to machine learning deployment, with mentor-led projects.",
    specialisations: ["Machine Learning", "Business Intelligence", "AI Engineering"],
    curriculum: [
      {
        semester: "Semester 1",
        subjects: [
          "Python for Data Science",
          "Statistics & Probability",
          "SQL & Data Warehousing",
          "Data Visualisation",
        ],
      },
      {
        semester: "Semester 2",
        subjects: [
          "Machine Learning",
          "Deep Learning Basics",
          "MLOps & Cloud Deployment",
          "Capstone Project",
        ],
      },
    ],
    careers: ["Data Analyst", "Business Analyst", "ML Engineer (entry)", "BI Developer"],
  },
  {
    slug: "online-ba",
    code: "BA",
    name: "Bachelor of Arts",
    level: "Bachelors",
    durationYears: 3,
    semesters: 6,
    eligibility: "10+2 or an equivalent qualification from a recognised board.",
    overview:
      "A flexible multidisciplinary online degree for learners interested in humanities, public service, communication and postgraduate study.",
    specialisations: ["English", "Economics", "Political Science", "History", "Sociology"],
    curriculum: [
      {
        semester: "Year 1",
        subjects: ["English Communication", "Indian Society", "Political Theory", "Microeconomics"],
      },
      {
        semester: "Year 2",
        subjects: [
          "Research Methods",
          "Macroeconomics",
          "Modern Indian History",
          "Public Administration",
        ],
      },
      {
        semester: "Year 3",
        subjects: [
          "Specialisation Electives",
          "Contemporary India",
          "Dissertation",
          "Career Skills",
        ],
      },
    ],
    careers: [
      "Content Associate",
      "Public Policy Associate",
      "Research Assistant",
      "Civil Services Aspirant",
    ],
  },
  {
    slug: "online-ma-economics",
    code: "MA Economics",
    name: "Master of Arts in Economics",
    level: "Masters",
    durationYears: 2,
    semesters: 4,
    eligibility:
      "Bachelor's degree from a recognised university; economics or mathematics exposure may be preferred.",
    overview:
      "An online postgraduate degree covering economic theory, applied statistics, policy analysis and research methods.",
    specialisations: [
      "Applied Economics",
      "Development Economics",
      "Financial Economics",
      "Public Policy",
    ],
    curriculum: [
      {
        semester: "Semester 1",
        subjects: [
          "Microeconomic Theory",
          "Macroeconomic Theory",
          "Mathematical Economics",
          "Statistics",
        ],
      },
      {
        semester: "Semester 2",
        subjects: ["Econometrics", "Public Economics", "Indian Economy", "Research Methods"],
      },
      {
        semester: "Semester 3–4",
        subjects: ["Development Economics", "Electives", "Policy Lab", "Dissertation"],
      },
    ],
    careers: [
      "Economic Analyst",
      "Policy Researcher",
      "Market Research Analyst",
      "Data Research Associate",
    ],
  },
  {
    slug: "online-ma-political-science",
    code: "MA Political Science",
    name: "Master of Arts in Political Science",
    level: "Masters",
    durationYears: 2,
    semesters: 4,
    eligibility: "Bachelor's degree in any discipline from a recognised university.",
    overview:
      "A postgraduate online programme exploring political theory, Indian government, international relations, public policy and research.",
    specialisations: [
      "International Relations",
      "Public Administration",
      "Indian Politics",
      "Political Theory",
    ],
    curriculum: [
      {
        semester: "Semester 1",
        subjects: [
          "Western Political Thought",
          "Indian Political Thought",
          "Comparative Politics",
          "Research Methods",
        ],
      },
      {
        semester: "Semester 2",
        subjects: [
          "Indian Government",
          "International Relations",
          "Public Administration",
          "Political Sociology",
        ],
      },
      {
        semester: "Semester 3–4",
        subjects: ["Public Policy", "Electives", "Contemporary Political Issues", "Dissertation"],
      },
    ],
    careers: ["Policy Associate", "Researcher", "Programme Officer", "Public Affairs Associate"],
  },
  {
    slug: "online-msc-data-science",
    code: "MSc Data Science",
    name: "Master of Science in Data Science",
    level: "Masters",
    durationYears: 2,
    semesters: 4,
    eligibility:
      "Bachelor's degree from a recognised university; mathematics, statistics or programming exposure may be required.",
    overview:
      "An applied online master's degree in statistics, machine learning, data engineering and responsible AI for analytical roles.",
    specialisations: [
      "Artificial Intelligence",
      "Machine Learning",
      "Business Analytics",
      "Data Engineering",
    ],
    curriculum: [
      {
        semester: "Semester 1",
        subjects: [
          "Python Programming",
          "Probability & Statistics",
          "Data Management",
          "Linear Algebra",
        ],
      },
      {
        semester: "Semester 2",
        subjects: [
          "Machine Learning",
          "Data Visualisation",
          "Big Data Systems",
          "Research Methods",
        ],
      },
      {
        semester: "Semester 3–4",
        subjects: ["Deep Learning", "Responsible AI", "Electives", "Industry Capstone"],
      },
    ],
    careers: ["Data Analyst", "Data Scientist", "ML Engineer", "Analytics Consultant"],
  },
  {
    slug: "online-msw",
    code: "MSW",
    name: "Master of Social Work",
    level: "Masters",
    durationYears: 2,
    semesters: 4,
    eligibility: "Bachelor's degree in any discipline from a recognised university.",
    overview:
      "An online social-work degree covering community practice, social policy, counselling foundations and programme management.",
    specialisations: [
      "Community Development",
      "Social Policy",
      "Rural Development",
      "CSR & NGO Management",
    ],
    curriculum: [
      {
        semester: "Semester 1",
        subjects: [
          "Social Work Foundations",
          "Human Behaviour",
          "Indian Social Structure",
          "Fieldwork Methods",
        ],
      },
      {
        semester: "Semester 2",
        subjects: [
          "Community Organisation",
          "Social Policy",
          "Counselling Basics",
          "Research Methods",
        ],
      },
      {
        semester: "Semester 3–4",
        subjects: [
          "Programme Management",
          "Specialisation Electives",
          "Supervised Project",
          "Dissertation",
        ],
      },
    ],
    careers: ["Programme Coordinator", "CSR Associate", "Community Manager", "Social Researcher"],
  },
];

const coreUniversityData: University[] = [
  {
    slug: "amity-university-online",
    name: "Amity University Online",
    shortName: "Amity",
    city: "Noida",
    state: "Uttar Pradesh",
    established: 2005,
    domain: "amityonline.com",
    accentColor: "oklch(0.52 0.19 25)",
    naacGrade: "A+",
    approvals: ["UGC Entitled", "AICTE", "NAAC A+", "WES Recognised", "AIU Member"],
    rating: 4.6,
    reviews: 4820,
    studentsEnrolled: "1,50,000+",
    placementPartners: ["Amazon", "Deloitte", "HDFC Bank", "Byju's", "Wipro"],
    highlights: [
      "India's first university to offer UGC-entitled online degrees",
      "Dedicated placement cell with 1,200+ recruiters",
      "Live faculty sessions plus recorded lectures on the Amrita LMS",
    ],
    about:
      "Amity University Online is the digital learning arm of Amity University, one of India's largest private university groups. Its online degrees carry the same academic weight as on-campus programmes and are widely accepted by employers in India and abroad.",
    programs: [
      { slug: "online-mba", feeMultiplier: 1.55 },
      { slug: "online-bba", feeMultiplier: 1.25 },
      { slug: "online-mca", feeMultiplier: 1.4 },
      { slug: "online-bca", feeMultiplier: 1.15 },
      { slug: "online-bcom", feeMultiplier: 1.0 },
      { slug: "online-ma-journalism-mass-communication", feeMultiplier: 1.05 },
      { slug: "online-pg-diploma-data-science", feeMultiplier: 1.3 },
    ],
  },
  {
    slug: "manipal-university-online",
    name: "Manipal University Jaipur Online",
    legalName: "Manipal University Jaipur",
    heiId: "HEI-U-0749",
    shortName: "Manipal Jaipur",
    city: "Jaipur",
    state: "Rajasthan",
    established: 2011,
    domain: "onlinemanipal.com",
    accentColor: "oklch(0.5 0.15 250)",
    naacGrade: "A+",
    approvals: ["UGC Entitled", "NAAC A+", "AICTE", "WES Recognised", "AIU Member"],
    rating: 4.5,
    reviews: 3910,
    studentsEnrolled: "1,00,000+",
    placementPartners: ["Infosys", "TCS", "Cognizant", "Flipkart", "ICICI Bank"],
    highlights: [
      "Free access to Coursera courses with select programmes",
      "Alumni status with the Manipal network",
      "Placement assistance with 400+ hiring partners",
    ],
    about:
      "Manipal University Jaipur Online delivers UGC-entitled online degrees from one of India's most respected private education groups, with strong industry integration and a mature digital campus.",
    programs: [
      {
        slug: "online-mba",
        entitlementStatus: "expired",
        academicSession: "2025–26 (July–August 2025)",
        entitlementSourceUrl:
          "https://deb.ugc.ac.in/Uploads/Notices_Upload/UGC_20251006094420_1.pdf",
        universityProgramUrl: "https://www.onlinemanipal.com/online-mba-manipal-university-jaipur",
        officialProgrammeName: "Master of Business Administration",
        deliveryMode: "ONLINE",
        durationYears: 2,
        semesters: 4,
        eligibility:
          "A 10+2+3 bachelor's degree or AIU-equivalent qualification with at least 50% marks (45% for reserved categories).",
        examMode: "Online proctored examinations",
        feesVerified: false,
        specialisationsVerified: false,
      },
      { slug: "online-bba", feeMultiplier: 1.2 },
      { slug: "online-mca", feeMultiplier: 1.35 },
      { slug: "online-bca", feeMultiplier: 1.1 },
      { slug: "online-mcom", feeMultiplier: 1.0 },
      { slug: "online-bcom", feeMultiplier: 0.95 },
      { slug: "online-ma-english", feeMultiplier: 0.9 },
    ],
    verificationAcademicYear: "2025–26",
    verificationSourceUrl: "https://deb.ugc.ac.in/Uploads/Notices_Upload/UGC_20251006094420_1.pdf",
  },
  {
    slug: "lpu-online",
    name: "Lovely Professional University Online",
    shortName: "LPU Online",
    city: "Phagwara",
    state: "Punjab",
    established: 2005,
    domain: "lpuonline.com",
    accentColor: "oklch(0.55 0.16 40)",
    naacGrade: "A++",
    approvals: ["UGC Entitled", "NAAC A++", "AIU Member", "WES Recognised"],
    rating: 4.4,
    reviews: 2760,
    studentsEnrolled: "60,000+",
    placementPartners: ["Bosch", "Capgemini", "Amazon", "Paytm"],
    highlights: [
      "NAAC A++ accredited university",
      "Affordable fee structure with easy EMI options",
      "Multilingual learning support",
    ],
    about:
      "LPU Online extends Lovely Professional University's large campus ecosystem to online learners, offering UGC-entitled degrees with a strong focus on employability skills.",
    programs: [
      { slug: "online-mba", feeMultiplier: 1.15 },
      { slug: "online-bba", feeMultiplier: 0.95 },
      { slug: "online-mca", feeMultiplier: 1.1 },
      { slug: "online-bca", feeMultiplier: 0.9 },
      { slug: "online-mcom", feeMultiplier: 0.85 },
      { slug: "online-ma-english", feeMultiplier: 0.8 },
    ],
  },
  {
    slug: "jain-university-online",
    name: "Jain University Online",
    shortName: "Jain Online",
    city: "Bengaluru",
    state: "Karnataka",
    established: 1990,
    domain: "onlinejain.com",
    accentColor: "oklch(0.5 0.13 160)",
    naacGrade: "A++",
    approvals: ["UGC Entitled", "NAAC A++", "AICTE", "AIU Member"],
    rating: 4.5,
    reviews: 2310,
    studentsEnrolled: "45,000+",
    placementPartners: ["Accenture", "IBM", "KPMG", "Zomato"],
    highlights: [
      "Bengaluru-based university with strong startup connections",
      "Industry certifications bundled with degrees",
      "Dedicated career mentoring pods",
    ],
    about:
      "Jain (Deemed-to-be University) Online is known for entrepreneurship-led education and offers UGC-entitled online degrees with integrated professional certifications.",
    programs: [
      { slug: "online-mba", feeMultiplier: 1.35 },
      { slug: "online-bba", feeMultiplier: 1.1 },
      { slug: "online-mca", feeMultiplier: 1.25 },
      { slug: "online-bcom", feeMultiplier: 0.95 },
      { slug: "online-pg-diploma-data-science", feeMultiplier: 1.2 },
    ],
  },
  {
    slug: "chandigarh-university-online",
    name: "Chandigarh University Online",
    shortName: "CU Online",
    city: "Mohali",
    state: "Punjab",
    established: 2012,
    domain: "cuonline.ac.in",
    accentColor: "oklch(0.52 0.14 285)",
    naacGrade: "A+",
    approvals: ["UGC Entitled", "NAAC A+", "AIU Member"],
    rating: 4.3,
    reviews: 1980,
    studentsEnrolled: "35,000+",
    placementPartners: ["Microsoft", "Amazon", "Tech Mahindra", "HCL"],
    highlights: [
      "Strong placement record from the parent campus",
      "Weekend live classes for working professionals",
      "Fully digital exam and evaluation system",
    ],
    about:
      "Chandigarh University Online brings CU's placement-driven approach to online learners with UGC-entitled degrees and structured live mentoring.",
    programs: [
      { slug: "online-mba", feeMultiplier: 1.2 },
      { slug: "online-bba", feeMultiplier: 1.0 },
      { slug: "online-mca", feeMultiplier: 1.15 },
      { slug: "online-bca", feeMultiplier: 0.95 },
      { slug: "online-mcom", feeMultiplier: 0.9 },
    ],
  },
  {
    slug: "uttaranchal-university-online",
    name: "Uttaranchal University Online",
    shortName: "Uttaranchal",
    city: "Dehradun",
    state: "Uttarakhand",
    established: 2013,
    domain: "uudol.uttaranchaluniversity.ac.in",
    accentColor: "oklch(0.5 0.12 200)",
    naacGrade: "A+",
    approvals: ["UGC Entitled", "NAAC A+", "AIU Member"],
    rating: 4.2,
    reviews: 940,
    studentsEnrolled: "18,000+",
    placementPartners: ["Genpact", "Vedantu", "Axis Bank"],
    highlights: [
      "One of the most affordable UGC-entitled online degrees",
      "Personal academic counsellor for every learner",
      "Scholarships for defence personnel and women learners",
    ],
    about:
      "Uttaranchal University's Centre for Online Learning focuses on accessible, low-cost online degrees with strong learner support.",
    programs: [
      { slug: "online-mba", feeMultiplier: 0.8 },
      { slug: "online-bba", feeMultiplier: 0.7 },
      { slug: "online-mca", feeMultiplier: 0.85 },
      { slug: "online-bcom", feeMultiplier: 0.65 },
      { slug: "online-ma-english", feeMultiplier: 0.6 },
    ],
  },
  {
    slug: "dy-patil-university-online",
    name: "DY Patil University Online",
    shortName: "DY Patil",
    city: "Pune",
    state: "Maharashtra",
    established: 2003,
    domain: "dypatilonline.com",
    accentColor: "oklch(0.5 0.17 15)",
    naacGrade: "A++",
    approvals: ["UGC Entitled", "NAAC A++", "AIU Member"],
    rating: 4.4,
    reviews: 1560,
    studentsEnrolled: "25,000+",
    placementPartners: ["Cipla", "Deloitte", "Bajaj Finserv"],
    highlights: [
      "Strong healthcare and hospital management electives",
      "NAAC A++ accreditation",
      "Live weekend classes with industry practitioners",
    ],
    about:
      "DY Patil University Online is best known for management programmes with healthcare, pharma and hospital administration specialisations.",
    programs: [
      { slug: "online-mba", feeMultiplier: 1.3 },
      { slug: "online-bba", feeMultiplier: 1.05 },
      { slug: "online-mca", feeMultiplier: 1.2 },
      { slug: "online-mcom", feeMultiplier: 0.95 },
    ],
  },
  {
    slug: "vignan-university-online",
    name: "Vignan University Online",
    shortName: "Vignan",
    city: "Guntur",
    state: "Andhra Pradesh",
    established: 2008,
    domain: "vignanonline.com",
    accentColor: "oklch(0.52 0.15 320)",
    naacGrade: "A+",
    approvals: ["UGC Entitled", "NAAC A+", "AICTE"],
    rating: 4.1,
    reviews: 720,
    studentsEnrolled: "12,000+",
    placementPartners: ["Wipro", "Zoho", "Mphasis"],
    highlights: [
      "Engineering-strong faculty for computing programmes",
      "Regional language mentoring support",
      "Low-cost EMI plans from ₹2,500/month",
    ],
    about:
      "Vignan Online offers UGC-entitled online degrees from Vignan's Foundation for Science, Technology & Research, with a technology-heavy curriculum.",
    programs: [
      { slug: "online-mba", feeMultiplier: 0.9 },
      { slug: "online-mca", feeMultiplier: 0.95 },
      { slug: "online-bba", feeMultiplier: 0.75 },
      { slug: "online-bca", feeMultiplier: 0.7 },
      { slug: "online-pg-diploma-data-science", feeMultiplier: 0.95 },
    ],
  },
  {
    slug: "shoolini-university-online",
    name: "Shoolini University Online",
    shortName: "Shoolini",
    city: "Solan",
    state: "Himachal Pradesh",
    established: 2009,
    domain: "shooliniuniversity.com",
    accentColor: "oklch(0.55 0.14 130)",
    naacGrade: "A",
    approvals: ["UGC Entitled", "NAAC A", "AIU Member"],
    rating: 4.2,
    reviews: 640,
    studentsEnrolled: "9,000+",
    placementPartners: ["Nestle", "ITC", "Swiggy"],
    highlights: [
      "Research-led teaching with international faculty",
      "Mentor-per-learner model",
      "Strong focus on entrepreneurship projects",
    ],
    about:
      "Shoolini University Online combines a research-first academic culture with flexible, fully online UGC-entitled degrees.",
    programs: [
      { slug: "online-mba", feeMultiplier: 1.0 },
      { slug: "online-bba", feeMultiplier: 0.85 },
      { slug: "online-ma-journalism-mass-communication", feeMultiplier: 0.8 },
      { slug: "online-ma-english", feeMultiplier: 0.7 },
    ],
  },
  {
    slug: "sikkim-manipal-university-online",
    name: "Sikkim Manipal University Online",
    shortName: "SMU Online",
    city: "Gangtok",
    state: "Sikkim",
    established: 1995,
    domain: "smude.edu.in",
    accentColor: "oklch(0.48 0.13 265)",
    naacGrade: "A",
    approvals: ["UGC Entitled", "NAAC A", "AIU Member"],
    rating: 4.0,
    reviews: 1120,
    studentsEnrolled: "50,000+",
    placementPartners: ["Vodafone Idea", "Kotak Mahindra", "Concentrix"],
    highlights: [
      "Three decades of distance and online education",
      "Large alumni base across India's north-east",
      "Simple, low-fee programme structure",
    ],
    about:
      "Sikkim Manipal University's Directorate of Online Education is one of India's oldest providers of distance and online degrees, now fully UGC-entitled for online delivery.",
    programs: [
      { slug: "online-mba", feeMultiplier: 0.85 },
      { slug: "online-bba", feeMultiplier: 0.7 },
      { slug: "online-mca", feeMultiplier: 0.9 },
      { slug: "online-bcom", feeMultiplier: 0.6 },
      { slug: "online-mcom", feeMultiplier: 0.7 },
    ],
  },
];

const editorialUniversityData: University[] = coreUniversityData.map((university) => ({
  ...university,
  logoUrl: university.logoUrl ?? universityLogoUrls[university.slug],
  metricsVerified: false,
  studentsEnrolled: "Not independently verified",
  placementPartners: [],
  highlights: [
    "Course fields are editorial guides; fee amounts stay hidden unless source-backed",
    "Recognition must be checked for the exact programme, mode and admission session",
    "Learning delivery, examinations, support and refund rules require university confirmation",
  ],
  about: `${university.name} is maintained as an editorial comparison profile. Course fields are discovery aids rather than a current prospectus, and fee amounts remain hidden unless backed by a reviewed source. Verify the exact programme, online mode, academic session, recognition status, payable fee and official application route before applying or paying.`,
}));

const universityData: University[] = [...editorialUniversityData, ...directoryUniversities];

type UniversityProgramRef = University["programs"][number];

/**
 * Live catalog. Seeded with the bundled fallback data and replaced at runtime
 * with the admin-managed content loaded from the database (see
 * `src/lib/catalog.functions.ts` and the root route).
 */
export let universities: University[] = universityData;
export let programCatalog: ProgramTemplate[] = programTemplates;
export let claimEvidenceCatalog: ClaimEvidence[] = [];
export let specialisationCatalog: CatalogSpecialisation[] = [];
export let siteSettings: SiteSettings = {};

let templateBySlug = new Map(programTemplates.map((p) => [p.slug, p]));

function buildProgram(template: ProgramTemplate, ref: UniversityProgramRef): UniversityProgram {
  const useOfferingDetails = !ref.entitlementStatus || ref.entitlementStatus === "verified";
  const reviewedOffering = ref.entitlementStatus === "verified";
  const hasAcademicEvidence = useOfferingDetails && Boolean(ref.universityProgramUrl);
  const feeEvidenceCurrent = Boolean(
    ref.feeVerifiedAt &&
    ref.feeNextReviewAt &&
    Date.parse(ref.feeVerifiedAt) <= Date.now() &&
    Date.parse(ref.feeNextReviewAt) > Date.now(),
  );
  const durationYears = hasAcademicEvidence
    ? (ref.durationYears ?? template.durationYears)
    : template.durationYears;
  const semesters = hasAcademicEvidence
    ? (ref.semesters ?? template.semesters)
    : template.semesters;
  const totalFeeAvailable =
    useOfferingDetails &&
    feeEvidenceCurrent &&
    ref.feesVerified === true &&
    ref.totalFee !== undefined;
  const perSemesterFeeAvailable =
    useOfferingDetails &&
    feeEvidenceCurrent &&
    ref.perSemesterFeeVerified === true &&
    ref.perSemesterFee !== undefined;
  const emiPerMonthAvailable =
    useOfferingDetails &&
    feeEvidenceCurrent &&
    ref.emiPerMonthVerified === true &&
    ref.emiPerMonth !== undefined;
  const feeGuideAvailable = totalFeeAvailable || perSemesterFeeAvailable || emiPerMonthAvailable;
  const feesVerified = totalFeeAvailable;
  const totalFee = ref.totalFee ?? 0;
  return {
    ...template,
    name:
      useOfferingDetails && ref.officialProgrammeName ? ref.officialProgrammeName : template.name,
    durationYears,
    semesters,
    eligibility: hasAcademicEvidence && ref.eligibility ? ref.eligibility : template.eligibility,
    curriculum:
      hasAcademicEvidence && ref.curriculum?.length ? ref.curriculum : template.curriculum,
    specialisations:
      useOfferingDetails && ref.specialisations ? ref.specialisations : template.specialisations,
    totalFee,
    perSemesterFee: perSemesterFeeAvailable
      ? (ref.perSemesterFee ?? 0)
      : totalFeeAvailable
        ? Math.round(totalFee / Math.max(1, semesters))
        : 0,
    emiPerMonth: emiPerMonthAvailable
      ? (ref.emiPerMonth ?? 0)
      : totalFeeAvailable
        ? Math.round(totalFee / Math.max(1, durationYears * 12))
        : 0,
    feeGuideAvailable,
    totalFeeAvailable,
    perSemesterFeeAvailable,
    emiPerMonthAvailable,
    feesVerified,
    perSemesterFeeVerified: perSemesterFeeAvailable,
    emiPerMonthVerified: emiPerMonthAvailable,
    durationVerified:
      reviewedOffering &&
      hasAcademicEvidence &&
      ref.durationYears !== undefined &&
      ref.semesters !== undefined,
    eligibilityVerified: reviewedOffering && hasAcademicEvidence && Boolean(ref.eligibility),
    curriculumVerified: reviewedOffering && hasAcademicEvidence && Boolean(ref.curriculum?.length),
    specialisationsVerified: reviewedOffering && ref.specialisationsVerified === true,
    offeringId: ref.offeringId,
    entitlementStatus: ref.entitlementStatus,
    academicSession: ref.academicSession,
    entitlementSourceUrl: ref.entitlementSourceUrl,
    universityProgramUrl: ref.universityProgramUrl,
    officialApplicationUrl: ref.officialApplicationUrl,
    verifiedAt: ref.verifiedAt,
    deliveryMode: useOfferingDetails ? ref.deliveryMode : undefined,
    examMode: hasAcademicEvidence ? ref.examMode : undefined,
    scholarshipSummary: undefined,
    refundPolicyUrl: useOfferingDetails ? ref.refundPolicyUrl : undefined,
    feeSourceUrl:
      feesVerified || perSemesterFeeAvailable || emiPerMonthAvailable
        ? ref.feeSourceUrl
        : undefined,
    feeVerifiedAt:
      feesVerified || perSemesterFeeAvailable || emiPerMonthAvailable
        ? ref.feeVerifiedAt
        : undefined,
    feeNextReviewAt:
      feesVerified || perSemesterFeeAvailable || emiPerMonthAvailable
        ? ref.feeNextReviewAt
        : undefined,
    feeComponents: undefined,
    seatsFilledPercent: undefined,
  };
}

export function resolveCatalog(catalog: Catalog): Catalog {
  // A newly provisioned or fully failed import must not turn the public site
  // into an empty shell. The bundled catalogue is deliberately editorial and
  // unranked, so it is a safe failover until both CMS core tables are populated.
  const databaseIsAuthoritative =
    catalog.source === "database" && catalog.universities.length > 0 && catalog.programs.length > 0;
  let resolvedUniversities = universityData;
  let resolvedPrograms = programTemplates;

  if (databaseIsAuthoritative) {
    resolvedUniversities = catalog.universities.map((university) => ({
      ...university,
      profileDepth: university.profileDepth ?? "complete",
    }));
    resolvedPrograms = catalog.programs;
  } else if (catalog.universities.length > 0) {
    const managedSlugs = new Set(catalog.universities.map((university) => university.slug));
    resolvedUniversities = [
      ...catalog.universities.map((university) => {
        const bundledUniversity = universityData.find((entry) => entry.slug === university.slug);
        return {
          ...university,
          // A directory-only database import must not erase the reviewed,
          // explicitly unranked discovery relationships bundled with the app.
          // Once both CMS core tables are populated, the database becomes
          // authoritative and this fallback is no longer used.
          programs:
            university.programs.length > 0
              ? university.programs
              : (bundledUniversity?.programs ?? []),
          profileDepth: university.profileDepth ?? "complete",
        };
      }),
      ...universityData.filter((university) => !managedSlugs.has(university.slug)),
    ];
  }
  if (!databaseIsAuthoritative && catalog.programs.length > 0) {
    const managedProgramSlugs = new Set(catalog.programs.map((program) => program.slug));
    resolvedPrograms = [
      ...catalog.programs,
      ...programTemplates.filter((program) => !managedProgramSlugs.has(program.slug)),
    ];
  }

  resolvedUniversities = resolvedUniversities.map((university) => {
    const normalizedUniversity: University = {
      ...university,
      claimEvidence: university.claimEvidence ?? [],
    };
    return {
      ...normalizedUniversity,
      supportedApprovals: getUniversityApprovalClaims(normalizedUniversity).map(
        (claim) => claim.renderedClaim,
      ),
    };
  });

  return {
    universities: resolvedUniversities,
    programs: resolvedPrograms,
    claimEvidence: catalog.claimEvidence ?? [],
    specialisations: catalog.specialisations ?? [],
    settings: catalog.settings,
    source: databaseIsAuthoritative ? "database" : "fallback",
  };
}

/** Replace the live catalogue before nested route loaders and components run. */
export function setCatalog(catalog: Catalog): void {
  const resolved = resolveCatalog(catalog);
  universities = resolved.universities;
  programCatalog = resolved.programs;
  claimEvidenceCatalog = resolved.claimEvidence ?? [];
  specialisationCatalog = resolved.specialisations ?? [];
  siteSettings = resolved.settings;
  templateBySlug = new Map(programCatalog.map((program) => [program.slug, program]));
}

export function getUniversity(slug: string): University | undefined {
  return universities.find((u) => u.slug === slug);
}

export function formatUniversityLocation(university: Pick<University, "city" | "state">): string {
  return [university.city, university.state].filter(Boolean).join(", ");
}

export function getUniversityPrograms(university: University): UniversityProgram[] {
  return university.programs
    .map((ref) => {
      const template = templateBySlug.get(ref.slug);
      return template ? buildProgram(template, ref) : null;
    })
    .filter((p): p is UniversityProgram => p !== null);
}

export function getUniversityProgram(
  universitySlug: string,
  programSlug: string,
): { university: University; program: UniversityProgram } | null {
  const university = getUniversity(universitySlug);
  if (!university) return null;
  const ref = university.programs.find((p) => p.slug === programSlug);
  const template = ref ? templateBySlug.get(ref.slug) : undefined;
  if (!ref || !template) return null;
  return { university, program: buildProgram(template, ref) };
}

/** Every university that offers a given program slug, cheapest first. */
export function universitiesOfferingProgram(programSlug: string) {
  return universities
    .filter((u) => u.programs.some((p) => p.slug === programSlug))
    .flatMap((u) => {
      const ref = u.programs.find((p) => p.slug === programSlug);
      const template = templateBySlug.get(programSlug);
      if (!ref || !template) return [];
      return [{ university: u, program: buildProgram(template, ref) }];
    })
    .sort((a, b) => {
      const aVerified = isVerifiedProgramOffer(a);
      const bVerified = isVerifiedProgramOffer(b);
      if (aVerified !== bVerified) return aVerified ? -1 : 1;
      if (aVerified && bVerified) return a.program.totalFee - b.program.totalFee;
      return a.university.name.localeCompare(b.university.name);
    });
}

export type ProgramOffer = { university: University; program: UniversityProgram };

/** Directory records never participate in price/rating recommendations or comparisons. */
export function isComparableProgramOffer(offer: ProgramOffer): boolean {
  return (
    offer.university.profileDepth !== "directory" &&
    offer.university.verificationCurrent === true &&
    offer.program.totalFeeAvailable &&
    offer.program.feesVerified &&
    offer.program.entitlementStatus === "verified"
  );
}

/** Exact structured claims require both a reviewed profile and sourced fee data. */
export function isVerifiedProgramOffer(offer: ProgramOffer): boolean {
  return isComparableProgramOffer(offer) && offer.program.feesVerified;
}

export function verifiedUniversitiesOfferingProgram(programSlug: string): ProgramOffer[] {
  return universitiesOfferingProgram(programSlug).filter(isVerifiedProgramOffer);
}

export function comparableUniversitiesOfferingProgram(programSlug: string): ProgramOffer[] {
  return universitiesOfferingProgram(programSlug).filter(isComparableProgramOffer);
}

/**
 * A degree-level pathway is not automatically offered by every university.
 * Only explicitly mapped, reviewed university offerings are returned here.
 */
export function universitiesOfferingSpecialisation(
  programSlug: string,
  specialisation: string,
): ProgramOffer[] {
  const normalized = specialisation.trim().toLowerCase();
  return universitiesOfferingProgram(programSlug).filter(
    (offer) =>
      offer.university.profileDepth !== "directory" &&
      offer.university.verificationCurrent === true &&
      offer.program.entitlementStatus === "verified" &&
      offer.program.specialisationsVerified &&
      offer.program.specialisations.some((item) => item.trim().toLowerCase() === normalized),
  );
}

export function getProgramTemplate(slug: string): ProgramTemplate | undefined {
  return templateBySlug.get(slug);
}

const APPROVAL_CLAIM_TYPES = new Set(["recognition", "accreditation"]);

function isPublicEvidenceUrl(value: string): boolean {
  try {
    const protocol = new URL(value).protocol;
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

function isCurrentClaim(claim: ClaimEvidence): boolean {
  const now = Date.now();
  return Boolean(
    claim.published &&
    isPublicEvidenceUrl(claim.sourceUrl) &&
    claim.verifiedAt &&
    Date.parse(claim.verifiedAt) <= now &&
    Date.parse(claim.expiresAt) > now,
  );
}

/** University-wide approval evidence; program/offering-scoped claims are intentionally excluded. */
export function getUniversityApprovalClaims(university: University): ClaimEvidence[] {
  return (university.claimEvidence ?? []).filter(
    (claim) =>
      claim.universitySlug === university.slug &&
      !claim.programSlug &&
      !claim.offeringId &&
      APPROVAL_CLAIM_TYPES.has(claim.claimType) &&
      isCurrentClaim(claim),
  );
}

/**
 * Approval evidence applicable to an exact program offering. University-wide
 * records are inherited; narrower records must match this program/offering.
 */
export function getProgramApprovalClaims(
  university: University,
  program: UniversityProgram,
): ClaimEvidence[] {
  return (university.claimEvidence ?? []).filter(
    (claim) =>
      claim.universitySlug === university.slug &&
      (!claim.programSlug || claim.programSlug === program.slug) &&
      (!claim.offeringId || claim.offeringId === program.offeringId) &&
      (!claim.academicSession || claim.academicSession === program.academicSession) &&
      APPROVAL_CLAIM_TYPES.has(claim.claimType) &&
      isCurrentClaim(claim),
  );
}

export function formatINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

export function getAllUniversitySlugs(): string[] {
  return universities.map((u) => u.slug);
}

export function getSpecialisationCount(): number {
  return programCatalog.reduce((n, p) => n + p.specialisations.length, 0);
}

export function getTotalProgramCount(): number {
  return universities.reduce((n, u) => n + u.programs.length, 0);
}
