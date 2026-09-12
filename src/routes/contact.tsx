import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, ShieldCheck } from "lucide-react";
import { LeadForm } from "@/components/site/lead-form";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Free Online-Degree Counselling — Contact DekhoCampus Online" },
      {
        name: "description",
        content:
          "Talk to a DekhoCampus counsellor about online degrees: eligibility, fees, EMI options and university shortlisting. Free for students.",
      },
      { property: "og:title", content: "Contact DekhoCampus Online" },
      {
        property: "og:description",
        content: "Request guidance for comparing listed online-degree options.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <section className="hero-ink text-ink-foreground">
        <div className="container-page py-14">
          <h1 className="font-display text-3xl font-extrabold md:text-4xl">
            Free counselling for online degrees
          </h1>
          <p className="mt-4 max-w-2xl text-ink-foreground/75">
            Ask for help with shortlisting, fee questions or the admission process, then choose the
            one channel you want us to use for this response.
          </p>
        </div>
      </section>

      <section className="container-page grid gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <a
            href="mailto:online@dekhocampus.in"
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-ink-foreground">
              <Mail className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-wide text-muted-foreground">
                Email support
              </span>
              <span className="block font-semibold">online@dekhocampus.in</span>
            </span>
          </a>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-start gap-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#1768cc] dark:text-[#78b9ff]" />
              <div>
                <h2 className="font-display text-base font-extrabold">You control the response</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  The form does not preselect call, WhatsApp or email. Your choice covers this
                  counselling request, not promotional campaigns. Sharing with a named university is
                  a separate optional choice.
                </p>
              </div>
            </div>
            <Link
              to="/privacy"
              className="mt-4 inline-flex text-sm font-bold text-[#1768cc] underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-[#78b9ff]"
            >
              Read the privacy notice
            </Link>
          </div>
        </div>

        <LeadForm
          title="Request free counselling"
          description="Tell us what you are exploring. Program and university preferences are optional."
        />
      </section>
    </>
  );
}
