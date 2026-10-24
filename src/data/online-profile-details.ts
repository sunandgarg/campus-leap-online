export const profileDetails = {
  "amity-university-online": {
    publicSlug: "amity-university-online-900012",
    displayName: "Amity University Online",
    source: "https://amityonline.com/",
    introduction:
      "Amity University Online offers online degrees in business, computing, commerce and other subject areas. Explore the programme, its study format and the university’s current fee schedule before deciding. Academic and admission requirements differ by programme and intake.",
  },
  "lpu-online": {
    publicSlug: "lpu-online-900011",
    displayName: "LPU Online",
    source: "https://www.lpuonline.com/",
    introduction:
      "LPU Online is the online-learning division of Lovely Professional University in Phagwara, Punjab. Its learning model includes live sessions, recordings and digital study resources. Compare individual programme requirements, payment options and examination arrangements before applying.",
  },
  "jaypee-institute-of-information-technology-uttar-pradesh": {
    publicSlug: "jiit-online-900015",
    displayName: "JIIT Online",
    source: "https://www.jiitonline.com/",
    introduction:
      "JIIT Online is the Centre for Distance and Online Education at Jaypee Institute of Information Technology, Noida. Its official programme information covers online business and computing study. Check the exact programme, academic session, entry requirements and written fee quote with the university.",
  },
} as const;

export const specialistCourses = [
  {
    universitySlug: "amity-university-online",
    publicSlug: "mba-online-in-data-science-1104242",
    programSlug: "online-mba",
    name: "MBA (Online) in Data Science",
    specialisation: "Data Science",
    description:
      "Explore management study alongside data analysis, visualisation and machine-learning topics. This guide brings the programme’s study structure and application questions together so you can compare it with other options.",
    duration: "2 years",
    eligibility:
      "Confirm the current graduation requirements and any additional admission assessment with Amity Online.",
    fee: 225000,
    semesterFee: 56300,
    feeNote:
      "Published Indian-rupee programme fee snapshot. Semester figures are university-published rounded amounts; extra charges, payment benefits and eligibility may differ. Ask for the current all-inclusive written quote.",
    feeSource: "https://api-otp.amityonline.com/mba-data-science-online",
    source: "https://amityonline.com/mba-data-science-online",
    brochure: "",
    checkedAt: "2026-10-24",
    reviewBy: "2026-10-31",
    curriculum: [
      [
        "Managerial Economics",
        "Statistics for Management",
        "Professional Communication",
        "Accounting for Managers",
        "Marketing Management",
      ],
      [
        "Legal Aspects of Business",
        "Business Research Methods",
        "Financial Management",
        "Human Resource Management",
        "Conflict Resolution and Management",
      ],
      [
        "Data Engineering",
        "Data Visualization and EDA",
        "Introduction to Data Science",
        "Analytics for Decision Making",
        "Minor Project",
      ],
      [
        "Digital Marketing",
        "AI Tools and Applications",
        "Advanced Deep Learning",
        "Supervised and Unsupervised Machine Learning",
        "Major Project",
      ],
    ],
  },
  {
    universitySlug: "jaypee-institute-of-information-technology-uttar-pradesh",
    publicSlug: "mba-online-in-marketing-management-1104317",
    programSlug: "online-mba",
    name: "MBA (Online) in Marketing Management",
    specialisation: "Marketing Management",
    description:
      "Study marketing strategy, customer behaviour and digital business within an online management programme. Use the university’s academic document to confirm the semester structure, assessments and available electives.",
    duration: "2 years",
    eligibility:
      "A bachelor’s degree from a recognised university. Confirm the current marks requirement and any additional conditions with JIIT Online.",
    fee: null,
    semesterFee: null,
    feeNote:
      "The official specialisation page does not publish a definitive current fee. Request the current, complete written fee schedule directly from JIIT Online before paying.",
    feeSource: "https://www.jiitonline.com/academics/online-mba-programs/marketing-management/",
    source: "https://www.jiitonline.com/academics/online-mba-programs/marketing-management/",
    brochure:
      "https://www.jiitonline.com/wp-content/uploads/2026/03/JIIT-CDOE-Academic-System-MBA.pdf",
    checkedAt: "2026-10-24",
    reviewBy: "2026-10-31",
    curriculum: [],
  },
] as const;
