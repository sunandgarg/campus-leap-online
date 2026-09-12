import { createFileRoute } from "@tanstack/react-router";
import {
  Accessibility,
  Keyboard,
  Mail,
  MousePointer2,
  Volume2,
  type LucideIcon,
} from "lucide-react";

const accessibilityCommitments: {
  icon: LucideIcon;
  title: string;
  text: string;
}[] = [
  {
    icon: Keyboard,
    title: "Keyboard access",
    text: "We aim to make navigation, forms, dialogs and comparisons operable without a mouse.",
  },
  {
    icon: MousePointer2,
    title: "Clear interaction",
    text: "Shared controls include visible keyboard focus; key forms provide labels and inline error messages.",
  },
  {
    icon: Volume2,
    title: "Motion with choice",
    text: "Site styles respond to reduced-motion preferences, and essential instructions should not depend on animation.",
  },
];

export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      { title: "Accessibility Statement | DekhoCampus Online" },
      {
        name: "description",
        content:
          "Review DekhoCampus Online's accessibility commitments, current audit boundary, and how to report a barrier or request information in another format.",
      },
    ],
  }),
  component: AccessibilityPage,
});

function AccessibilityPage() {
  return (
    <div className="bg-background">
      <section className="border-b border-border bg-[#071b2c] text-white">
        <div className="container-page max-w-5xl py-16 lg:py-20">
          <Accessibility className="h-8 w-8 text-[#8bc7ff]" />
          <h1 className="mt-5 font-display text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">
            Education discovery should work for everyone.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-white/65">
            DekhoCampus is working toward WCAG 2.1 AA and the applicable IS 17802 accessibility
            requirements. This release has not completed an independent conformance audit, so this
            statement is a direction and support commitment—not a certification claim.
          </p>
        </div>
      </section>
      <section className="container-page max-w-5xl py-12 lg:py-16">
        <div className="grid gap-5 sm:grid-cols-3">
          {accessibilityCommitments.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-[1.5rem] border border-border bg-card p-6">
              <Icon className="h-6 w-6 text-[#1768cc] dark:text-[#78b9ff]" />
              <h2 className="mt-5 font-display text-lg font-extrabold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-5 rounded-[1.5rem] border border-border bg-card p-6">
          <h2 className="font-display text-xl font-extrabold">Known review boundary</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            The public catalogue and counselling form are being improved continuously, but every
            route, remote image and administrative screen has not yet been manually tested with
            every assistive-technology and browser combination. Please report a specific barrier so
            we can reproduce and prioritise it.
          </p>
        </div>
        <div className="mt-10 rounded-[1.75rem] border border-border bg-secondary/35 p-7">
          <h2 className="font-display text-2xl font-extrabold">Report an accessibility barrier</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            Tell us the page, device, browser, assistive technology and what you were trying to do.
            Reports are reviewed manually, and we will try to provide the same information in an
            accessible format where practical.
          </p>
          <a
            href="mailto:online@dekhocampus.in?subject=Accessibility%20barrier"
            className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#1768cc] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-[#78b9ff]"
          >
            <Mail className="h-4 w-4" /> online@dekhocampus.in
          </a>
          <p className="mt-6 text-xs text-muted-foreground">
            Statement reviewed 12 September 2026.
          </p>
        </div>
      </section>
    </div>
  );
}
