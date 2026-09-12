import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Database, Mail, ShieldCheck, Trash2 } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Notice | DekhoCampus Online" },
      {
        name: "description",
        content:
          "How DekhoCampus collects, uses, shares, retains and deletes counselling enquiry data.",
      },
    ],
  }),
  component: PrivacyPage,
});

const sections = [
  {
    title: "What we collect",
    body: "When you request counselling, we store the fields you submit: name, mobile number, optional email, optional programme or university preference, learner role and concern where shown, your chosen response channel, and the versioned wording and time of your counselling consent. If you separately allow sharing with a named university, we also store that exact optional disclosure, its version and its time. We store only the page path, a sanitised web referrer and allowlisted UTM campaign values available at submission.",
  },
  {
    title: "Why we use it",
    body: "We use enquiry data to respond to the counselling request, prevent immediate duplicate submissions, understand which discovery page led to the request and retain evidence of your choices. Choosing call, WhatsApp or email authorises a service response to this enquiry; it is not consent to an unrelated promotional campaign.",
  },
  {
    title: "Who receives it",
    body: "Authorised DekhoCampus staff and infrastructure providers can process the minimum data needed to operate the enquiry service. The form does not broadcast details to universities. If you explicitly select the separate sharing box, the request records the named university for a possible introduction. The website itself does not automatically send that record to every university.",
  },
  {
    title: "Browser storage",
    body: "The site stores your light or dark theme and comparison list in local browser storage. During a browsing session, it may store the first page, referrer and UTM values used for enquiry attribution. Administrative sign-in uses the authentication provider's browser storage. Clearing site data removes browser-held preferences but does not delete a submitted enquiry from the database.",
  },
  {
    title: "Security and retention today",
    body: "Public visitors cannot read lead records or call the database intake function directly. Enquiries pass through the DekhoCampus server, where fields, origin and request size are checked before submission. In production, Cloudflare Turnstile is also used to distinguish genuine interactions from automated abuse; Cloudflare may process technical request data for that security check. Before rate limiting, the server converts the client network address into a keyed pseudonymous bucket; the raw address is not stored in the lead database. The database also enforces a site-wide burst ceiling, and stale buckets are opportunistically pruned after one day when intake traffic continues. The current build does not yet run an automatic deletion schedule for enquiries. Enquiry records remain until an authorised administrator deletes them or a verified request is handled, subject to any record that must be retained by law.",
  },
  {
    title: "Your choices and requests",
    body: "You may email us to request access, correction or deletion of an enquiry, or to withdraw permission for further responses. Requests are handled manually after reasonable identity verification; there is no self-service privacy dashboard or automatic cross-system withdrawal in the current release. If information has already been shared with a university at your request, you may also need to contact that institution.",
  },
  {
    title: "Sensitive documents",
    body: "Do not submit Aadhaar, ABC-ID, DEB-ID, marksheets, payment credentials or original documents through a counselling form or email unless an official university process independently requires them. DekhoCampus does not need those items to provide an initial comparison or counselling response.",
  },
];

function PrivacyPage() {
  return (
    <div className="bg-background">
      <section className="border-b border-border bg-[#071b2c] text-white">
        <div className="container-page max-w-5xl py-16 lg:py-20">
          <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.15em] text-[#8bc7ff]">
            <ShieldCheck className="h-4 w-4" /> Plain-language privacy notice
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">
            Your enquiry is not a product.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-white/65">
            The counselling form records your chosen response channel, keeps named-university
            sharing optional, and does not gate the free finder results behind contact details.
          </p>
          <p className="mt-6 text-xs text-white/65">
            Effective 12 September 2026 · Version 2026.09
          </p>
        </div>
      </section>

      <section className="container-page grid max-w-6xl gap-10 py-12 lg:grid-cols-[0.62fr_1.38fr] lg:py-16">
        <aside className="h-fit rounded-[1.5rem] border border-border bg-card p-6 lg:sticky lg:top-24">
          <Database className="h-6 w-6 text-[#1768cc] dark:text-[#78b9ff]" />
          <h2 className="mt-4 font-display text-xl font-extrabold">Privacy controls</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            To access, correct, delete or withdraw permission, email from the address used in your
            enquiry or include the last four digits of your mobile number. Requests are reviewed
            manually and we may ask for additional information to prevent unauthorised changes.
          </p>
          <a
            href="mailto:online@dekhocampus.in?subject=Privacy%20request"
            className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#1768cc] dark:text-[#78b9ff]"
          >
            <Mail className="h-4 w-4" /> online@dekhocampus.in
          </a>
          <div className="mt-5 rounded-xl bg-secondary/60 p-4 text-xs leading-5 text-muted-foreground">
            <Trash2 className="mb-2 h-4 w-4 text-[#a94300] dark:text-[#ff9a5b]" />
            This release does not include an automated privacy-request portal or fixed deletion
            timer.
          </div>
        </aside>

        <div className="space-y-9">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-2xl font-extrabold tracking-[-0.03em]">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{section.body}</p>
            </section>
          ))}

          <section className="rounded-[1.5rem] border border-[#f0d8c5] bg-[#fff8f1] p-6 dark:border-[#5a3b28] dark:bg-[#2b2119]">
            <h2 className="font-display text-xl font-extrabold">Important operational note</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Website permission alone is not a substitute for telecom Digital Consent Acquisition
              requirements where applicable. If promotional SMS, WhatsApp or voice campaigns are
              introduced, they require registered senders, approved templates and suppression
              controls outside this enquiry form.
            </p>
          </section>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-[#1768cc] dark:text-[#78b9ff]"
          >
            Ask a privacy question <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
