import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Building2, CircleDollarSign, Scale, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Important Disclosures | DekhoCampus Online" },
      {
        name: "description",
        content:
          "Read DekhoCampus Online's independent-platform terms, verification guidance, fee and outcome disclosures, and acceptable-use conditions.",
      },
    ],
  }),
  component: TermsPage,
});

const disclosures = [
  {
    icon: Building2,
    title: "Independent discovery platform",
    text: "DekhoCampus compares education options and provides counselling. It is not a university, study centre or awarding body. Admission decisions, teaching, assessment, certification and refunds remain with the relevant higher-education institution.",
  },
  {
    icon: ShieldCheck,
    title: "Verify the exact intake",
    text: "A university's general status does not prove that every programme is entitled in every mode or session. Verify the exact university–programme–mode–academic-session combination on UGC-DEB and the university's official website before enrolment.",
  },
  {
    icon: CircleDollarSign,
    title: "No admission payment to DekhoCampus",
    text: "Do not send tuition, admission fees, deposits, original documents or government identity credentials to DekhoCampus. Complete final application and payment only through the university's confirmed official process and retain receipts and refund terms.",
  },
  {
    icon: BadgeCheck,
    title: "No outcome guarantee",
    text: "Rankings, reviews, fees, EMI, scholarships, placements and salary ranges can change and may come from university or third-party sources. DekhoCampus does not guarantee admission, entitlement, scholarship, employment, promotion or salary.",
  },
];

function TermsPage() {
  return (
    <div className="bg-background">
      <section className="border-b border-border bg-[#f4f8fd] dark:bg-[#071723]">
        <div className="container-page max-w-5xl py-16 lg:py-20">
          <Scale className="h-8 w-8 text-[#1768cc] dark:text-[#78b9ff]" />
          <h1 className="mt-5 font-display text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">
            Terms and important disclosures
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground">
            The simple version: compare carefully, verify current official evidence and transact
            only with the university.
          </p>
          <p className="mt-5 text-xs text-muted-foreground">
            Effective 12 September 2026 · Version 2026.09
          </p>
        </div>
      </section>
      <section className="container-page max-w-5xl py-12 lg:py-16">
        <div className="grid gap-5 sm:grid-cols-2">
          {disclosures.map((item) => (
            <article key={item.title} className="rounded-[1.5rem] border border-border bg-card p-6">
              <item.icon className="h-6 w-6 text-[#1768cc] dark:text-[#78b9ff]" />
              <h2 className="mt-5 font-display text-xl font-extrabold">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </div>
        <div className="prose prose-sm mt-10 max-w-none text-muted-foreground dark:prose-invert">
          <h2 className="font-display text-2xl font-extrabold text-foreground">
            Use of information
          </h2>
          <p>
            Catalogue content is provided for comparison and education, not as legal, financial or
            career advice. Do not rely on a cached page as the only basis for an admission payment.
          </p>
          <h2 className="font-display text-2xl font-extrabold text-foreground">
            Commercial relationships
          </h2>
          <p>
            If a university or service provider pays for placement, referral or promotion, the
            relevant surface should be labelled Sponsored or Partner. Payment must not be presented
            as an independent ranking signal.
          </p>
          <h2 className="font-display text-2xl font-extrabold text-foreground">
            Guided matching and AI-labelled features
          </h2>
          <p>
            The current finder uses rule-based filters and match scores based on the answers you
            select. If a feature is expressly labelled AI, treat its generated or summarised
            response as a catalogue-discovery aid. Neither type of output establishes UGC
            entitlement, admission probability, professional advice or a guaranteed outcome; check
            the cited underlying facts.
          </p>
          <h2 className="font-display text-2xl font-extrabold text-foreground">Corrections</h2>
          <p>
            Universities and learners may request a factual correction at online@dekhocampus.in.
            Include a primary-source link so the editorial record can be reviewed.
          </p>
        </div>
      </section>
    </div>
  );
}
