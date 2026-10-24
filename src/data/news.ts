import { programCatalog } from "@/data/universities";

export const newsCategories = [
  "News",
  "Course",
  "Online Degrees",
  "Management",
  "Computer Applications",
  "Admissions",
  "Cutoff 2026",
  "Science",
  "Arts",
  "Articles",
  "University Results",
  "Engineering",
  "Medical",
  "Exam",
  "Online",
  "Design",
  "Medical UG",
  "Paramedical",
  "Commerce",
  "Law",
  "Education",
  "Scholarships",
  "College",
  "Photostories",
  "Careers",
  "Mass Communications",
  "Nursing",
  "Aviation",
  "Architecture",
  "Humanities",
  "Agriculture",
  "Admission",
  "Comparisons",
  "Vocational Courses",
  "Hotel Management",
  "Exam Results",
  "Animation",
  "Hospitality",
  "Medical PG",
  "12th Board",
  "Dental",
  "10th Board",
  "School",
  "Study Abroad",
  "Computer",
  "Exams",
  "Uncategorized",
] as const;
export type NewsCategory = (typeof newsCategories)[number];
export type NewsItem = {
  slug: string;
  title: string;
  summary: string;
  categories: NewsCategory[];
  label: "Official update" | "Explainer" | "Course guide";
  cover: "admissions" | "recognition" | "management" | "technology" | "fees" | "study";
  href: string;
  action: string;
  source?: string;
};

export const newsItems: NewsItem[] = [
  {
    slug: "ugc-online-admission-session-update",
    title: "Online admissions: check the academic session before you apply",
    summary:
      "The UGC-DEB student portal lists 13 October 2026 as the admission deadline for the August 2026 ODL/online session. That date has passed. Check the official portal for the next applicable session and your university’s programme listing before applying.",
    categories: ["News", "Admissions", "Admission", "Online Degrees", "Online", "Education"],
    label: "Official update",
    cover: "admissions",
    href: "https://deb.ugc.ac.in/StudentDEBId",
    action: "Check the UGC-DEB portal",
    source: "University Grants Commission · DEB student portal",
  },
  {
    slug: "deb-id-online-degree-checklist",
    title: "DEB-ID and ABC-ID: the starting point for your online degree",
    summary:
      "UGC-DEB asks learners entering online or ODL programmes to create a DEB-ID using their ABC-ID. Its student portal explains the process and links to recognised programmes. Use the official service for registration and personal documents.",
    categories: ["News", "Admissions", "Admission", "Online Degrees", "Online", "Education"],
    label: "Explainer",
    cover: "recognition",
    href: "https://deb.ugc.ac.in/StudentDEBId",
    action: "Read the official DEB-ID guidance",
    source: "University Grants Commission · DEB student portal",
  },
  {
    slug: "online-degree-recognition-check",
    title: "Before you enrol: how to check an online university and programme",
    summary:
      "Keep the university’s legal name, exact degree, learning mode and academic session together when you check recognition. Our checklist helps you organise the information and find the official records to consult.",
    categories: ["News", "Admissions", "Online Degrees", "Education", "Articles", "College"],
    label: "Explainer",
    cover: "technology",
    href: "/methodology",
    action: "Open the recognition checklist",
  },
  {
    slug: "online-degree-complete-fees",
    title: "Online degree fees: look beyond the headline tuition amount",
    summary:
      "Build a budget around tuition, registration, examination charges, devices and financing costs. Ask for a complete written quote and a payment schedule before comparing an EMI with the total programme fee.",
    categories: ["News", "Admissions", "Management", "Online Degrees", "Articles", "Commerce"],
    label: "Explainer",
    cover: "fees",
    href: "/guides/fee-checklist.html",
    action: "Open the complete-fee checklist",
  },
  {
    slug: "questions-before-online-admission",
    title: "Ten questions worth asking before your online admission",
    summary:
      "A useful counselling conversation covers eligibility, subjects, live classes, recordings, exams, learner support and refunds. Save the questions and discuss the answers with your family before making a decision.",
    categories: ["News", "Admissions", "Admission", "Online Degrees", "Articles"],
    label: "Explainer",
    cover: "study",
    href: "/guides/admission-questions.html",
    action: "Open the admission questions",
  },
  {
    slug: "compare-online-universities",
    title: "Choosing between online universities? Compare the same details",
    summary:
      "Compare the exact course, total fee, assessment format and available support. Put up to three university options together, then verify the current intake details with each university.",
    categories: ["News", "Management", "Online Degrees", "Comparisons", "College"],
    label: "Explainer",
    cover: "management",
    href: "/compare",
    action: "Compare university options",
  },
  {
    slug: "online-mba-mca-difference",
    title: "Online MBA or MCA: start with the work you want to do",
    summary:
      "Management and computing programmes answer different interests. Compare their course guides, entry requirements, core subjects and available university options before choosing your next step.",
    categories: [
      "Management",
      "Computer Applications",
      "Course",
      "Comparisons",
      "Careers",
      "Computer",
    ],
    label: "Explainer",
    cover: "technology",
    href: "/finder",
    action: "Find a course that fits",
  },
  {
    slug: "study-online-alongside-work",
    title: "Studying alongside work: build a routine you can sustain",
    summary:
      "Check the timetable and compulsory attendance before you plan your week. Set aside time for lessons, revision and assignments, and ask how long recordings remain available.",
    categories: ["Management", "Computer Applications", "Online Degrees", "Careers", "Articles"],
    label: "Explainer",
    cover: "study",
    href: "/#home-study-title",
    action: "Explore study routines",
  },
  ...programCatalog.map((program): NewsItem => ({
    slug: `${program.slug}-course-guide`,
    title: `Online ${program.code}: course details, eligibility and university options`,
    summary: `${program.overview} Use the course guide to review typical eligibility, subjects and university profiles. Confirm the exact requirements for the university and session you choose.`,
    categories: [
      "Course",
      "Online Degrees",
      "Online",
      "Education",
      "Careers",
      ...(["MBA", "BBA", "M.Com", "B.Com"].includes(program.code) ? ["Management" as const] : []),
      ...(["MCA", "BCA", "PGD DS", "MSc Data Science"].includes(program.code)
        ? ["Computer Applications" as const]
        : []),
      ...(["M.Com", "B.Com"].includes(program.code) ? ["Commerce" as const] : []),
      ...(["MA JMC"].includes(program.code)
        ? ["Mass Communications" as const, "Arts" as const]
        : []),
      ...(["BA", "MA English", "MSW"].includes(program.code)
        ? ["Arts" as const, "Humanities" as const]
        : []),
      ...(["MSc Data Science", "PGD DS"].includes(program.code)
        ? ["Science" as const, "Computer" as const]
        : []),
    ],
    label: "Course guide",
    cover: ["MCA", "BCA", "PGD DS", "MSc Data Science"].includes(program.code)
      ? "technology"
      : "management",
    href: `/programs/${program.slug}`,
    action: `Explore the online ${program.code} guide`,
  })),
];

export function filterNews(category = "", query = "") {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return newsItems.filter(
    (item) =>
      (!category || item.categories.includes(category as NewsCategory)) &&
      words.every((word) =>
        `${item.title} ${item.summary} ${item.categories.join(" ")}`.toLowerCase().includes(word),
      ),
  );
}

export function newsCategoryPath(category: string) {
  return `/news?category=${encodeURIComponent(category)}`;
}

export function newsPath(item: Pick<NewsItem, "slug">) {
  return `/news/${encodeURIComponent(item.slug)}`;
}

const photos = {
  admissions: {
    file: "students-library",
    id: "16420473",
    photographer: "Ludovic Delot",
    alt: "Students discussing their studies around a library table",
  },
  recognition: {
    file: "study-together",
    id: "6281016",
    photographer: "Yaroslav Shuraev",
    alt: "Two students working with books and a laptop in a library",
  },
  management: {
    file: "collaborative-learning",
    id: "8199627",
    photographer: "Yan Krukau",
    alt: "Students working together on a laptop",
  },
  technology: {
    file: "laptop-research",
    id: "8199759",
    photographer: "Yan Krukau",
    alt: "Students researching with a laptop and reference books",
  },
  fees: {
    file: "planning-together",
    id: "5940716",
    photographer: "Kampus Production",
    alt: "Two students reviewing information together on a laptop",
  },
  study: {
    file: "library-discussion",
    id: "16420458",
    photographer: "Ludovic Delot",
    alt: "A group of students discussing their work in a library",
  },
};

export function newsImage(item: Pick<NewsItem, "cover">) {
  const photo = photos[item.cover];
  return {
    src: `/news/${photo.file}.jpg`,
    alt: photo.alt,
    credit: photo.photographer,
    source: `https://www.pexels.com/photo/${photo.id}/`,
  };
}
