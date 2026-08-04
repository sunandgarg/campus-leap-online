import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MessageCircle, Clock } from "lucide-react";
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
        content: "Free counselling for online degree admissions across India's top universities.",
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
            Share your details and a counsellor will call you with a shortlist, fee comparison and
            admission timeline for your profile.
          </p>
        </div>
      </section>

      <section className="container-page grid gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          {[
            { icon: Phone, k: "Call us", v: "+91 99999 99999", href: "tel:+919999999999" },
            {
              icon: MessageCircle,
              k: "WhatsApp",
              v: "Chat with a counsellor",
              href: "https://wa.me/919999999999",
            },
            {
              icon: Mail,
              k: "Email",
              v: "online@dekhocampus.in",
              href: "mailto:online@dekhocampus.in",
            },
          ].map((c) => (
            <a
              key={c.k}
              href={c.href}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-ink-foreground">
                <c.icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs uppercase tracking-wide text-muted-foreground">
                  {c.k}
                </span>
                <span className="block font-semibold">{c.v}</span>
              </span>
            </a>
          ))}
          <div className="flex items-center gap-4 rounded-2xl bg-surface p-5">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Counselling hours: Monday to Saturday, 10 AM – 7 PM IST
            </p>
          </div>
        </div>

        <LeadForm title="Request a callback" />
      </section>
    </>
  );
}
