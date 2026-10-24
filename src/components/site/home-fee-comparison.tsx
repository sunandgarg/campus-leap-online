import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Laptop2 } from "lucide-react";
import { UniversityLogo } from "@/components/site/university-logo";
import { Button } from "@/components/ui/button";
import { formatINR, universities } from "@/data/universities";
import comparison from "@/data/mba-fee-comparisons.json";
import { FeaturedLearning } from "@/components/site/featured-learning";
import {
  annualTuition,
  annualBudgetSummary,
  budgetAmount,
  type AnnualBudget,
} from "@/lib/fee-calculator";

export function HomeFeeComparison() {
  const [selected, setSelected] = useState("manipal-university-online");
  const entry = comparison.universities.find((item) => item.slug === selected)!;
  const current = Date.now() <= Date.parse(`${comparison.reviewBy}T23:59:59+05:30`);
  const [budget, setBudget] = useState<AnnualBudget>(() => ({
    ...annualTuition(entry, current),
    living: 100000,
    travel: 50000,
  }));
  const { campus, difference, percent } = annualBudgetSummary(budget);

  return (
    <section
      id="compare-mba-fees"
      className="home-band home-warm"
      aria-labelledby="home-budget-title"
    >
      <div className="home-section">
        <header className="mx-auto max-w-3xl text-center">
          <h2
            id="home-budget-title"
            className="font-display text-[25px] font-extrabold leading-[1.3] tracking-[-.035em] sm:text-[32px]"
          >
            Spend on your education.
            <br />
            Save on the extras.
          </h2>
          <p className="mt-3 text-xs leading-6 text-muted-foreground sm:text-sm">
            Compare the full annual cost, including the expenses that don’t appear on a course fee
            card.
          </p>
        </header>
        <div
          role="group"
          aria-label="Choose a university to compare MBA fees"
          className="fee-university-bar"
        >
          {comparison.universities.map((item) => {
            const university = universities.find((candidate) => candidate.slug === item.slug);
            return (
              university && (
                <button
                  key={item.slug}
                  type="button"
                  aria-label={`Use ${item.label} MBA fees`}
                  aria-pressed={selected === item.slug}
                  title={`${item.label} · ${item.region}`}
                  onClick={() => {
                    setSelected(item.slug);
                    setBudget((previous) => ({ ...previous, ...annualTuition(item, current) }));
                  }}
                >
                  <UniversityLogo
                    university={university}
                    className="h-6 w-14 rounded-none border-0 bg-white"
                  />
                  <span>{item.label}</span>
                </button>
              )
            );
          })}
        </div>
        <p className="mb-5 text-center text-[11px] leading-5 text-muted-foreground">
          {entry.label} MBA · annualised tuition estimates · edit any amount below
        </p>
        <div className="grid items-start gap-7 lg:grid-cols-[1.1fr_.9fr] lg:gap-12">
          <div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Campus · annual example
                </p>
                <p className="mt-3 text-2xl font-extrabold tracking-tight" aria-live="polite">
                  {campus === null ? "Add estimates" : formatINR(campus)}
                </p>
                <div className="mt-4 space-y-3">
                  {(
                    [
                      { key: "tuition", label: "Tuition" },
                      { key: "living", label: "Living costs" },
                      { key: "travel", label: "Travel" },
                    ] as const
                  ).map((field) => (
                    <BudgetInput
                      key={field.key}
                      label={field.label}
                      value={budget[field.key]}
                      onChange={(value) =>
                        setBudget((previous) => ({ ...previous, [field.key]: value }))
                      }
                    />
                  ))}
                </div>
                {budget.tuition === null && (
                  <p className="mt-2 text-[10px] leading-5 text-muted-foreground">
                    A current annual tuition quote is needed for {entry.label}. Enter it above.
                  </p>
                )}
              </div>
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Online · annual example
                </p>
                <p
                  className="mt-3 text-2xl font-extrabold tracking-tight text-primary"
                  aria-live="polite"
                >
                  {budget.online === null ? "Add estimate" : formatINR(budget.online)}
                </p>
                <div className="mt-4">
                  <BudgetInput
                    label="Course cost · per year"
                    value={budget.online}
                    onChange={(value) => setBudget((previous) => ({ ...previous, online: value }))}
                  />
                </div>
                <div className="mt-4 rounded-xl bg-secondary/60 p-3">
                  <Laptop2 className="h-5 w-5 text-primary" />
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    Add exam, registration and financing charges to your estimate where applicable.
                  </p>
                </div>
              </div>
            </div>
            <div
              role="status"
              aria-live="polite"
              className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[#d4e8d7] bg-[#eef8ef] px-4 py-3 text-[#2c6547] dark:border-border dark:bg-secondary dark:text-foreground"
            >
              <span className="text-xs font-semibold">
                {difference === null
                  ? "Complete your annual estimates"
                  : difference >= 0
                    ? "Your example annual saving"
                    : "Your example extra annual cost"}
              </span>
              <strong className="text-xl tracking-tight">
                {difference === null ? "—" : formatINR(Math.abs(difference))}
              </strong>
            </div>
            <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
              Editable illustration, not a fee quote or savings promise. Tuition is prefilled from
              published two-year fees ÷ 2; actual yearly payments can differ. Living and travel are
              your estimates.
            </p>
            <details className="mt-3 border-t border-border text-[11px]">
              <summary className="min-h-11 cursor-pointer py-3 font-semibold text-primary">
                Fee sources & what’s included · {entry.label}
              </summary>
              <div className="space-y-3 pb-3 leading-6 text-muted-foreground">
                <p>
                  {current
                    ? entry.campusBasis
                    : "This fee snapshot needs a fresh review. Confirm current tuition with the university."}{" "}
                  <a
                    href={entry.campusSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-primary"
                  >
                    Campus source <ArrowUpRight className="h-3 w-3" />
                  </a>
                </p>
                <p>
                  {current
                    ? entry.onlineBasis
                    : "Confirm the current online fee before using an estimate."}{" "}
                  <a
                    href={entry.onlineSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-primary"
                  >
                    Online source <ArrowUpRight className="h-3 w-3" />
                  </a>
                </p>
                <p>
                  Reviewed 24 Oct 2026. University-published charges, not prices charged by
                  DekhoCampus. Admission routes, study modes and included services can differ.
                </p>
              </div>
            </details>
          </div>
          <div className="lg:pt-4">
            <p className="mb-3 text-4xl font-black tracking-tight text-primary" aria-live="polite">
              {percent !== null && percent > 0 ? `${percent}% lower` : "Your cost comparison"}
              <span className="mt-1 block text-[11px] font-medium text-muted-foreground">
                in this editable annual example
              </span>
            </p>
            <FeaturedLearning />
            <Button asChild className="mt-6 rounded-full px-5">
              <Link to="/compare">
                Compare my options <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function BudgetInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  return (
    <label className="block text-[11px] text-muted-foreground">
      {label}
      <span className="mt-1 flex items-center rounded-md border border-border bg-card px-2">
        <span aria-hidden="true" className="text-xs">
          ₹
        </span>
        <input
          aria-label={label}
          type="number"
          inputMode="numeric"
          min={0}
          max={10000000}
          step={1000}
          value={value ?? ""}
          placeholder="Enter annual fee"
          onChange={(event) => onChange(budgetAmount(event.currentTarget.value))}
          className="h-10 min-w-0 w-full bg-transparent pl-1 text-xs font-semibold text-foreground outline-none"
        />
      </span>
    </label>
  );
}
