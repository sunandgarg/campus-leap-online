/**
 * Central data layer for online.dekhocampus.in
 *
 * Everything on the site (landing page, university list, university pages and
 * course pages) is derived from these structures, so adding a university or a
 * program automatically creates fully-populated, SEO-ready pages.
 */

export type ProgramLevel = "Bachelors" | "Masters" | "Diploma" | "Certificate";

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
  averageSalaryLpa: string;
  heroImageUrl?: string | undefined;
}

export interface UniversityProgram extends ProgramTemplate {
  totalFee: number;
  perSemesterFee: number;
  emiPerMonth: number;
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
  naacGrade: string;
  approvals: string[];
  rating: number;
  reviews: number;
  studentsEnrolled: string;
  placementPartners: string[];
  highlights: string[];
  about: string;
  logoUrl?: string | undefined;
  heroImageUrl?: string | undefined;
  hiringPartnerCount?: string | undefined;
  /**
   * Programs offered. Either a fee multiplier over the base fee (static
   * fallback data) or explicit fees coming from the admin-managed database.
   */
  programs: {
    slug: string;
    feeMultiplier?: number | undefined;
    totalFee?: number | undefined;
    perSemesterFee?: number | undefined;
    emiPerMonth?: number | undefined;
    seatsFilledPercent?: number | undefined;
  }[];
}

export type SettingsValue =
  | string
  | number
  | boolean
  | null
  | SettingsValue[]
  | { [key: string]: SettingsValue };

export type SiteSettings = Record<string, SettingsValue>;

export interface Catalog {
  universities: University[];
  programs: ProgramTemplate[];
  settings: SiteSettings;
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
      "A UGC-entitled online MBA built for working professionals who want to move into leadership. The programme blends core management fundamentals with a deep specialisation, live faculty sessions and industry capstone projects.",
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
    averageSalaryLpa: "6 - 18 LPA",
  },
  {
    slug: "online-bba",
    code: "BBA",
    name: "Bachelor of Business Administration",
    level: "Bachelors",
    durationYears: 3,
    semesters: 6,
    eligibility:
      "10+2 (any stream) from a recognised board with minimum 50% aggregate. No entrance exam required.",
    overview:
      "An online BBA that gives you a complete grounding in business, finance and marketing while you work or prepare for higher studies. Learn through recorded lectures, live doubt-clearing classes and case-based assessments.",
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
    averageSalaryLpa: "3 - 7 LPA",
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
    averageSalaryLpa: "5 - 16 LPA",
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
    averageSalaryLpa: "3 - 8 LPA",
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
    averageSalaryLpa: "4 - 10 LPA",
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
    averageSalaryLpa: "3 - 6 LPA",
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
    averageSalaryLpa: "3.5 - 9 LPA",
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
        subjects: ["British Fiction", "American Literature", "Indian Writing in English", "Elective"],
      },
      {
        semester: "Semester 3",
        subjects: ["Postcolonial Literature", "World Literature", "Literary Theory", "Elective"],
      },
      {
        semester: "Semester 4",
        subjects: ["Comparative Literature", "English Language Teaching", "Elective", "Dissertation"],
      },
    ],
    careers: ["Teacher", "Editor", "Content Strategist", "Academic Researcher"],
    averageSalaryLpa: "3 - 8 LPA",
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
    averageSalaryLpa: "5 - 14 LPA",
  },
];

const universityData: University[] = [
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
      { slug: "online-mba", feeMultiplier: 1.4 },
      { slug: "online-bba", feeMultiplier: 1.2 },
      { slug: "online-mca", feeMultiplier: 1.35 },
      { slug: "online-bca", feeMultiplier: 1.1 },
      { slug: "online-mcom", feeMultiplier: 1.0 },
      { slug: "online-bcom", feeMultiplier: 0.95 },
      { slug: "online-ma-english", feeMultiplier: 0.9 },
    ],
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

/** Base total fee (INR) for a program before per-university multiplier. */
const BASE_FEE: Record<ProgramLevel, number> = {
  Masters: 120000,
  Bachelors: 90000,
  Diploma: 80000,
  Certificate: 40000,
};

type UniversityProgramRef = University["programs"][number];

/**
 * Live catalog. Seeded with the bundled fallback data and replaced at runtime
 * with the admin-managed content loaded from the database (see
 * `src/lib/catalog.functions.ts` and the root route).
 */
export let universities: University[] = universityData;
export let programCatalog: ProgramTemplate[] = programTemplates;
export let siteSettings: SiteSettings = {};

let templateBySlug = new Map(programTemplates.map((p) => [p.slug, p]));

function buildProgram(template: ProgramTemplate, ref: UniversityProgramRef): UniversityProgram {
  const totalFee =
    ref.totalFee ?? Math.round((BASE_FEE[template.level] * (ref.feeMultiplier ?? 1)) / 1000) * 1000;
  return {
    ...template,
    totalFee,
    perSemesterFee:
      ref.perSemesterFee ?? Math.round(totalFee / template.semesters / 500) * 500,
    emiPerMonth:
      ref.emiPerMonth ?? Math.round(totalFee / (template.durationYears * 12) / 100) * 100,
    seatsFilledPercent: ref.seatsFilledPercent,
  };
}

/** Replace the live catalog with admin-managed content. */
export function setCatalog(catalog: Catalog): void {
  if (catalog.universities.length > 0) universities = catalog.universities;
  if (catalog.programs.length > 0) {
    programCatalog = catalog.programs;
    templateBySlug = new Map(catalog.programs.map((p) => [p.slug, p]));
  }
  siteSettings = catalog.settings;
}

export function getUniversity(slug: string): University | undefined {
  return universities.find((u) => u.slug === slug);
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
    .sort((a, b) => a.program.totalFee - b.program.totalFee);
}

export function getProgramTemplate(slug: string): ProgramTemplate | undefined {
  return templateBySlug.get(slug);
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

