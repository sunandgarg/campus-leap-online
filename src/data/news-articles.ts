import { programCatalog } from "@/data/universities";
import type { NewsItem } from "@/data/news";

export type ArticleSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  table?: { headers: string[]; rows: string[][] };
};
export type ArticleContent = { takeaways: string[]; sections: ArticleSection[] };

const articles: Record<string, ArticleContent> = {
  "ugc-online-admission-session-update": {
    takeaways: [
      "Match the admission notice to your intended academic session.",
      "Check the exact university, programme and online learning mode.",
      "Do not pay using an old deadline or an undated offer.",
    ],
    sections: [
      {
        id: "check-the-session",
        heading: "Start with the academic session",
        paragraphs: [
          "An admission deadline is only useful when it belongs to the intake you want. A university may keep information about earlier sessions on its website, so look for the session and date on the notice—not just an ‘Apply now’ button.",
          "Before you send documents or money, ask the university to confirm the intake in writing. Keep the notice with your application records so you can refer back to the terms you saw.",
        ],
      },
      {
        id: "what-to-compare",
        heading: "Keep these details together",
        paragraphs: [
          "Use one note for each option. This makes it easier to spot a different programme name or learning mode before you compare fees.",
        ],
        table: {
          headers: ["Detail", "What to record"],
          rows: [
            ["University", "The legal name, not only the marketing brand"],
            ["Programme", "Full degree title and any specialisation"],
            ["Mode", "Online or open and distance learning, as listed"],
            ["Session", "Intake, year and notice date"],
            ["Payment", "University payment destination and receipt process"],
          ],
        },
      },
      {
        id: "before-payment",
        heading: "Before making a payment",
        paragraphs: [
          "Use the official portal linked below to review the current notice. The dated update in this article is not confirmation that a new admission window is open.",
          "If the deadline, programme listing or payment instructions are unclear, pause and ask the university’s admission team. A counsellor can help you organise the questions, but the university must confirm your admission and the applicable terms.",
        ],
      },
    ],
  },
  "deb-id-online-degree-checklist": {
    takeaways: [
      "Complete identity registration only through the official services.",
      "Check that your details match before submitting an application.",
      "Do not share identity credentials or one-time passwords with a counsellor.",
    ],
    sections: [
      {
        id: "prepare-your-details",
        heading: "Prepare your details first",
        paragraphs: [
          "Identity registration is a separate step from choosing a university. Keep the spelling of your name consistent across your education records and the official registration services.",
          "The UGC-DEB portal linked below provides the registration instructions. Follow the live instructions there rather than sending personal documents through an unfamiliar link or asking another person to use your account.",
        ],
      },
      {
        id: "registration-checklist",
        heading: "A practical registration checklist",
        paragraphs: [
          "Set aside a few uninterrupted minutes and work through the process yourself. Keep any confirmation in a place you can access when you apply.",
        ],
        bullets: [
          "Check your name and other details before you begin.",
          "Use the official service and read the consent screen.",
          "Keep your login credentials and OTPs private.",
          "Save the confirmation and check which details your university requests.",
          "Use the official support process if you find a mismatch.",
        ],
      },
      {
        id: "after-registration",
        heading: "Registration is not an admission offer",
        paragraphs: [
          "Having an identifier does not replace checking the programme, eligibility, session or fee terms. Complete those checks separately with the university.",
          "DekhoCampus does not need your Aadhaar number, ABC-ID, DEB-ID, password or OTP to help you compare degree options. Use the official portal for identity documents and registration.",
        ],
      },
    ],
  },
  "online-degree-recognition-check": {
    takeaways: [
      "Check the exact programme and session, not just a university’s logo.",
      "Keep online and distance-learning listings separate.",
      "Save the source and the date you checked it.",
    ],
    sections: [
      {
        id: "exact-programme",
        heading: "A university name is only the starting point",
        paragraphs: [
          "It is easy to recognise a university name and assume the rest of the decision is settled. For an online degree, write down the exact programme title, learning mode and academic session before checking the relevant official listing.",
          "A badge on a brochure is not a substitute for that check. If a counsellor makes a recognition claim, ask for the official record that supports the specific course and intake you are considering.",
        ],
      },
      {
        id: "record-your-check",
        heading: "What to put in your comparison note",
        paragraphs: [
          "You should be able to reopen the record later and understand what you checked. Keep the information together instead of saving an isolated screenshot with no date.",
        ],
        table: {
          headers: ["Question", "Evidence to keep"],
          rows: [
            ["Which institution?", "University legal name and official website"],
            ["Which course?", "Full degree and specialisation name"],
            ["Which mode and session?", "The relevant official listing"],
            ["When was it checked?", "Source URL and your check date"],
          ],
        },
      },
      {
        id: "when-details-differ",
        heading: "If two sources disagree",
        paragraphs: [
          "Do not choose the more reassuring statement and ignore the other one. Send the discrepancy to the university through its official contact channel and ask for a written explanation.",
          "Our university profiles help you organise your research. Recognition and admission decisions should be based on the applicable official records for your programme and session.",
        ],
      },
    ],
  },
  "online-degree-complete-fees": {
    takeaways: [
      "Compare complete programme costs, not only an EMI.",
      "Ask which charges are compulsory and which are optional.",
      "Keep the payment schedule and refund terms with the quote.",
    ],
    sections: [
      {
        id: "complete-budget",
        heading: "What will you actually pay?",
        paragraphs: [
          "Two fee cards can look similar while covering different things. One may include examination charges; another may show tuition alone. Start by asking for a dated, written breakdown for the exact course and intake.",
          "A monthly instalment helps you plan cash flow, but it does not tell you the total cost. If finance is involved, check the lender’s total repayable amount and the conditions before you compare it with a direct university payment.",
        ],
      },
      {
        id: "fee-breakdown",
        heading: "Use the same fee checklist for every university",
        paragraphs: [
          "Mark an item ‘included’, ‘extra’ or ‘not applicable’. If the answer is unclear, leave it as a question rather than assuming the amount is zero.",
        ],
        table: {
          headers: ["Cost", "What to ask"],
          rows: [
            ["Tuition", "Is this for one semester, one year or the whole programme?"],
            ["Admission and registration", "Are these additional and refundable?"],
            ["Assessment", "Are exams, projects and re-exams included?"],
            ["Study setup", "What device, software and internet access do I need?"],
            ["Finance", "What is the interest, processing fee and total repayment?"],
            ["Discount", "Who qualifies, and what conditions apply?"],
          ],
        },
      },
      {
        id: "keep-the-terms",
        heading: "Save the terms before you pay",
        paragraphs: [
          "Keep the quote, payment dates, scholarship conditions and cancellation process together. Ask where a refund request must be sent and how it will be acknowledged.",
          "The checklist below can be printed or saved as a PDF. It is a place to record a university’s answers, not a fee quote or a promise of savings.",
        ],
      },
    ],
  },
  "questions-before-online-admission": {
    takeaways: [
      "Ask about teaching and exams as well as fees.",
      "Request written answers for anything that affects your decision.",
      "Take time to discuss the answers before paying.",
    ],
    sections: [
      {
        id: "ten-questions",
        heading: "Ten questions to take into a counselling call",
        paragraphs: [
          "A good conversation should leave you with fewer unknowns. You do not need to remember everything on the spot—keep a list and ask where each answer is documented.",
        ],
        bullets: [
          "Am I eligible for this exact programme and intake?",
          "Where can I check its current recognition listing?",
          "What is the complete fee, including compulsory charges?",
          "Which subjects and specialisations are available in this intake?",
          "When are live classes held, and is attendance compulsory?",
          "How long can I access recordings and learning materials?",
          "How are exams conducted, and are there any in-person requirements?",
          "Who handles academic and technical support?",
          "What support is offered for projects and career preparation?",
          "What are the cancellation and refund terms?",
        ],
      },
      {
        id: "follow-up",
        heading: "Ask for the important answers in writing",
        paragraphs: [
          "A verbal answer can be easy to misunderstand. For eligibility, fees, exam arrangements and refund terms, ask for an official page or a written response from the university.",
          "If someone promises a job, a guaranteed salary or a special deadline, ask for the terms and the organisation responsible for delivering it. Do not treat a sales conversation as a guarantee.",
        ],
      },
      {
        id: "discuss-your-choice",
        heading: "Leave room for a second conversation",
        paragraphs: [
          "Share the shortlist and total budget with anyone who will help pay or support your study time. A course that looks convenient on paper still needs space in your weekly routine.",
          "Use the downloadable question sheet below to record what each university says. It is fine to come back with follow-up questions before you decide.",
        ],
      },
    ],
  },
  "compare-online-universities": {
    takeaways: [
      "Shortlist the same degree across two or three universities.",
      "Separate confirmed details from unanswered questions.",
      "Choose around your budget and schedule, not a universal ‘best’ ranking.",
    ],
    sections: [
      {
        id: "shortlist-first",
        heading: "Start with a manageable shortlist",
        paragraphs: [
          "Opening ten university tabs can make the decision feel harder. Begin with two or three options that offer the degree you want. Remove options that do not fit your basic eligibility, budget or study schedule.",
          "Compare like with like. A different specialisation, course duration or fee period can change the meaning of the number on a card.",
        ],
      },
      {
        id: "comparison-points",
        heading: "The details worth comparing",
        paragraphs: [
          "Use the same headings for every option. An unanswered question is useful information: it tells you what to clarify before you apply.",
        ],
        table: {
          headers: ["Compare", "Look for"],
          rows: [
            ["Programme", "Exact degree, subjects and specialisation"],
            ["Recognition", "Official listing for the mode and session"],
            ["Budget", "Total payable cost and payment dates"],
            ["Teaching", "Live timetable, recordings and attendance"],
            ["Assessment", "Exam format, projects and any travel"],
            ["Support", "Academic contact, response process and resources"],
          ],
        },
      },
      {
        id: "make-the-choice",
        heading: "Use the comparison to ask better questions",
        paragraphs: [
          "There may not be one university that wins on every point. Decide which trade-offs matter most to you: a timetable you can attend, subjects you want to study or a payment plan you can sustain.",
          "Our comparison tool brings profiles together. Check any missing or time-sensitive detail with the university and keep its written response with your shortlist.",
        ],
      },
    ],
  },
  "online-mba-mca-difference": {
    takeaways: [
      "MBA and MCA programmes focus on different kinds of work.",
      "Read the subjects before choosing a degree title.",
      "Check the entry requirements of each university separately.",
    ],
    sections: [
      {
        id: "different-focus",
        heading: "Management or computing? Start there",
        paragraphs: [
          "If you are torn between an MBA and an MCA, think about the work you want to spend time doing. Are you more interested in business decisions, teams and markets—or in software, computing systems and technical problem-solving?",
          "You do not need a perfect career plan. But a few clear interests make the syllabus more useful than a list of fashionable job titles.",
        ],
      },
      {
        id: "read-the-syllabus",
        heading: "Compare the actual learning",
        paragraphs: [
          "Use this as a starting point, not a substitute for the university’s curriculum. Course content and admission requirements differ.",
        ],
        table: {
          headers: ["Question", "Online MBA", "Online MCA"],
          rows: [
            ["Main focus", "Business and management", "Computing and applications"],
            [
              "Subjects to inspect",
              "Finance, marketing, operations, people management",
              "Programming, databases, software and computing systems",
            ],
            [
              "Projects to ask about",
              "Business cases and applied management work",
              "Software and technical projects",
            ],
            [
              "Before applying",
              "Check degree and intake eligibility",
              "Check degree, mathematics and other entry requirements",
            ],
          ],
        },
      },
      {
        id: "choose-next-step",
        heading: "Try a small exercise before choosing",
        paragraphs: [
          "Read one module description from each course. Look at the assignments and ask which you would be willing to practise every week. Then speak with someone doing work that interests you about the skills they actually use.",
          "Compare university options only after you understand the degree direction. Neither course title is a promise of a particular job or salary.",
        ],
      },
    ],
  },
  "study-online-alongside-work": {
    takeaways: [
      "Plan around compulsory sessions and deadlines first.",
      "Leave time for revision and assignments, not only videos.",
      "Keep a small buffer for busy weeks.",
    ],
    sections: [
      {
        id: "real-week",
        heading: "Plan for the week you actually have",
        paragraphs: [
          "A flexible course still needs regular time. Before enrolling, look at your commute, working hours, family responsibilities and the parts of the day when you can concentrate.",
          "Ask the university for its timetable and attendance expectations. ‘Online’ does not automatically mean every activity can be completed whenever you want.",
        ],
      },
      {
        id: "weekly-routine",
        heading: "Give each study block a job",
        paragraphs: [
          "An hour labelled ‘study’ can disappear into catching up. A specific task is easier to start and easier to finish.",
        ],
        bullets: [
          "Reserve fixed time for compulsory sessions.",
          "Use a short block to review notes after each class.",
          "Give assignments and projects their own time.",
          "Keep one catch-up block for an unexpectedly busy week.",
          "Check upcoming deadlines at the start of the week.",
        ],
      },
      {
        id: "support-plan",
        heading: "Know where to ask for help",
        paragraphs: [
          "Find out who answers academic questions, how to raise a technical issue and what happens if you miss an assessment. Save these contacts before you need them.",
          "If your routine is not working, adjust it early. Ask about the support available rather than relying on a growing list of recordings to watch later. A workable plan is more useful than an ambitious one you cannot sustain.",
        ],
      },
    ],
  },
};

export function articleContent(item: NewsItem): ArticleContent {
  const editorial = articles[item.slug];
  if (editorial) return editorial;
  const program = programCatalog.find((entry) => `${entry.slug}-course-guide` === item.slug);
  if (!program) throw new Error(`Missing article content: ${item.slug}`);
  return {
    takeaways: [
      `Understand what the ${program.code} curriculum covers before comparing universities.`,
      "Eligibility, fees and delivery arrangements vary by university and session.",
      "Use the course profile to shortlist options, then confirm the current prospectus.",
    ],
    sections: [
      {
        id: "course-overview",
        heading: `What is an online ${program.code}?`,
        paragraphs: [
          program.overview,
          `This guide introduces the ${program.name} category. It is a starting point for understanding the degree, not an admission offer or a university-specific prospectus. Use it to decide what you want to learn and what questions to ask.`,
        ],
        table: {
          headers: ["Course detail", "Category guide"],
          rows: [
            ["Degree", program.name],
            ["Level", program.level],
            ["Indicative duration", `${program.durationYears} years`],
            ["Indicative semesters", String(program.semesters)],
          ],
        },
      },
      {
        id: "eligibility",
        heading: "Who can apply?",
        paragraphs: [
          "Entry requirements are set by the university for the programme and intake. Read the current prospectus before assuming that a general course guide applies to your qualifications.",
          `Our category guide lists: ${program.eligibility} Ask the university to confirm your eligibility, including any subject, score, equivalence or documentation requirement.`,
        ],
      },
      {
        id: "subjects",
        heading: "What will you study?",
        paragraphs: [
          "The outline below shows the subjects in our category guide. University syllabi, elective availability and semester sequencing may differ. Ask for the current syllabus of the exact programme you are considering.",
        ],
        table: {
          headers: ["Stage", "Indicative subjects"],
          rows: program.curriculum.map((semester) => [
            semester.semester,
            semester.subjects.join(", "),
          ]),
        },
      },
      {
        id: "fees-and-format",
        heading: "Compare fees and the way the course is taught",
        paragraphs: [
          "Ask each university for the total payable fee, not just its monthly instalment. Check registration, exams, projects and any other compulsory charges, along with the payment and refund terms.",
          "The timetable matters just as much. Confirm live classes, attendance expectations, access to recordings, assessment arrangements and any in-person requirements. Choose a format you can realistically fit around the rest of your week.",
        ],
      },
      {
        id: "after-the-course",
        heading: "Where could this learning be useful?",
        paragraphs: [
          "Use career directions as prompts for further research, not as guaranteed outcomes. Your previous education, experience, practical skills and the opportunities you apply for will also matter.",
        ],
        bullets: program.careers,
      },
      {
        id: "choose-a-university",
        heading: `How to shortlist a university for ${program.code}`,
        paragraphs: [
          "Compare two or three universities offering the exact degree you want. Put eligibility, current recognition, complete cost, subjects and delivery arrangements side by side.",
          "The course profile below connects you to the university options in our catalogue. Where information is missing or time-sensitive, ask the university directly and save its written reply before paying.",
        ],
      },
    ],
  };
}

export function articleReadingMinutes(content: ArticleContent, summary: string) {
  const words = [
    summary,
    ...content.takeaways,
    ...content.sections.flatMap((section) => [
      section.heading,
      ...section.paragraphs,
      ...(section.bullets ?? []),
      ...(section.table?.rows.flat() ?? []),
    ]),
  ]
    .join(" ")
    .trim()
    .split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
