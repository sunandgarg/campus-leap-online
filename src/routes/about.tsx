import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { universities, totalProgramCount } from "@/data/universities";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About DekhoCampus Online — India's Online University Portal" },
      {
        name: "description",
        content:
          "DekhoCampus Online is the dedicated online-degree arm of dekhocampus.in, helping students compare UGC-entitled online universities with verified fees and unbiased counselling.",
      },
      { property: "og:title", content: "About DekhoCampus Online" },
      {
        property: "og:description",
        content:
          "Why we built a dedicated portal for UGC-entitled online degrees, and how our free counselling works.",
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
            Online degrees now sit alongside on-campus degrees in the eyes of UGC — but choosing one
            is harder than choosing a college. Entitlement status, exam formats, placement support
            and real fee structures are scattered across dozens of university microsites.
          </p>
          <p>
            DekhoCampus Online exists to fix that. We list only universities with valid UGC
            entitlement for online programmes, publish the fee data we verify with each university,
            and let you compare {universities.length} universities and {totalProgramCount} programs
            without a sales pitch.
          </p>
          <p>
            Our counselling is free for students. We're paid by universities only when a student
            enrols — and we never rank a university higher because of it. Fee tables on this site are
            always sorted by cost, not by commission.
          </p>
          <h2 className="pt-4 font-display text-2xl font-bold text-foreground">What we verify</h2>
          <ul className="list-inside list-disc space-y-2">
            <li>UGC entitlement for online programme delivery</li>
            <li>NAAC grade and other statutory approvals (AICTE, AIU, WES)</li>
            <li>Published fee structure and EMI availability</li>
            <li>Programme duration, specialisations and exam mode</li>
            <li>Placement support available to online learners</li>
          </ul>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-lg font-bold">Also from DekhoCampus</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Looking for regular on-campus colleges, entrance exams and cut-offs? Our main portal
              covers 20,000+ Indian colleges.
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
