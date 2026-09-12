import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { universities, getTotalProgramCount } from "@/data/universities";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About DekhoCampus Online — India's Online University Portal" },
      {
        name: "description",
        content:
          "DekhoCampus Online is the dedicated online-degree discovery experience from DekhoCampus, with visible source status, ungated comparison and optional counselling.",
      },
      { property: "og:title", content: "About DekhoCampus Online" },
      {
        property: "og:description",
        content:
          "Why we built a dedicated online-degree discovery portal and how its source-status model works.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="hero-ink text-ink-foreground">
        <div className="container-page py-14">
          <h1 className="font-display text-3xl font-extrabold md:text-4xl">
            About DekhoCampus Online
          </h1>
          <p className="mt-4 max-w-2xl text-ink-foreground/75">
            A dedicated portal for online universities, built by the team behind dekhocampus.in.
          </p>
        </div>
      </section>

      <section className="container-page grid gap-12 py-14 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6 leading-relaxed text-muted-foreground">
          <p>
            Choosing an online degree takes more than recognising a university name. Programme
            entitlement, delivery mode, academic session, exam format and full fee components can
            differ—and the primary evidence is scattered across regulator and university websites.
          </p>
          <p>
            DekhoCampus Online organises that decision. You can explore {universities.length}{" "}
            university profiles and {getTotalProgramCount()} mapped university-program
            relationships. Research-complete and directory-stage records are labelled separately,
            and a fee is not intended to appear where its source status has not been checked.
          </p>
          <p>
            The catalogue and finder can be used before sharing personal information. A requested
            counselling response is free; final application, document submission, payment and the
            admission decision always remain with the university through its official process.
          </p>
          <h2 className="pt-4 font-display text-2xl font-bold text-foreground">What we check</h2>
          <ul className="list-inside list-disc space-y-2">
            <li>The exact university, programme, Online mode and academic session</li>
            <li>The date and primary link behind a regulatory or accreditation claim</li>
            <li>
              Published total fee and compulsory components before displaying payment estimates
            </li>
            <li>University-specific duration, eligibility, specialisations and exam mode</li>
            <li>Whether career support is actually available to that online cohort</li>
          </ul>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-lg font-bold">Also from DekhoCampus</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Looking for regular on-campus colleges, entrance exams and cut-offs? Our main portal
              covers Indian colleges, entrance exams and campus admissions.
            </p>
            <Button asChild variant="outline" className="mt-4 w-full">
              <a href="https://dekhocampus.in" target="_blank" rel="noopener noreferrer">
                Visit dekhocampus.in
              </a>
            </Button>
          </div>
          <div className="rounded-2xl bg-surface p-6">
            <h2 className="font-display text-lg font-bold">Start comparing</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Jump straight into the university list or compare fees for a specific program.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Button asChild className="bg-ink text-ink-foreground hover:bg-ink-soft">
                <Link to="/universities">Browse universities</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/compare">Compare fees</Link>
              </Button>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
