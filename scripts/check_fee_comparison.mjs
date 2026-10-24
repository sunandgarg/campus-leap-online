import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
const data = JSON.parse(fs.readFileSync("src/data/mba-fee-comparisons.json", "utf8"));
const logos = JSON.parse(fs.readFileSync("src/data/bundled-university-logos.json", "utf8"));
assert.equal(data.universities.length, 8);
assert.equal(new Set(data.universities.map((entry) => entry.slug)).size, 8);
for (const region of ["North", "South", "West", "Central", "East & Northeast"]) {
  assert.ok(
    data.universities.some((entry) => entry.region === region),
    `Missing ${region}`,
  );
}
for (const entry of data.universities) {
  assert.ok(logos[entry.slug], `${entry.label} needs a bundled logo`);
  for (const mode of ["campus", "online"]) {
    const value = entry[`${mode}Fee`];
    assert.ok(value === null || (Number.isSafeInteger(value) && value > 0));
    assert.ok(entry[`${mode}Basis`].length > 25);
    assert.equal(new URL(entry[`${mode}Source`]).protocol, "https:");
  }
}
const manipal = data.universities.find((entry) => entry.label === "Manipal Jaipur");
assert.equal(manipal.campusFee, 510000 * 2);
assert.equal(manipal.campusFee - manipal.onlineFee, 836000);
const gla = data.universities.find((entry) => entry.label === "GLA");
assert.equal(gla.campusFee, 290000 + 300000);
assert.equal(gla.onlineFee, 97000);
assert.equal(
  data.universities.find((entry) => entry.label === "MATS").onlineFee,
  null,
  "Do not promote the old 2025–26 quote as current",
);
assert.ok(Date.parse(data.reviewBy) > Date.parse(data.checkedAt));
const source = fs.readFileSync("src/components/site/home-fee-comparison.tsx", "utf8");
assert.ok(source.includes("comparison.reviewBy"), "Expired fee snapshots must be hidden");
assert.ok(
  source.includes("A current annual tuition quote is needed"),
  "Incomplete fee pairs need an honest fallback",
);
assert.ok(
  source.includes("living: 100000") && source.includes("travel: 50000"),
  "Default living/travel budgets changed",
);
const helper = ts.transpileModule(fs.readFileSync("src/lib/fee-calculator.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const exports = {};
vm.runInNewContext(helper, { exports });
const { annualTuition, annualBudgetSummary, budgetAmount } = exports;
const tuition = annualTuition(manipal, true);
assert.equal(tuition.tuition, 510000);
assert.equal(tuition.online, 92000);
const budget = { ...tuition, living: 100000, travel: 50000 };
assert.equal(annualBudgetSummary(budget).campus, 660000);
assert.equal(annualBudgetSummary(budget).difference, 568000);
assert.equal(annualBudgetSummary(budget).percent, 86);
const switched = { ...budget, living: 120000, ...annualTuition(gla, true) };
assert.equal(switched.living, 120000, "University switch must preserve personal costs");
assert.equal(switched.travel, 50000);
assert.equal(switched.tuition, 295000);
assert.equal(switched.online, 48500);
assert.equal(annualTuition(data.universities[0], true).tuition, null);
assert.equal(annualTuition(manipal, false).tuition, null, "Expired quotes must not prefill");
assert.equal(annualBudgetSummary({ ...budget, tuition: null }).difference, null);
assert.equal(annualBudgetSummary({ tuition: 0, living: 0, travel: 0, online: 0 }).percent, null);
assert.ok(annualBudgetSummary({ ...budget, online: 900000 }).difference < 0);
assert.equal(budgetAmount(""), null);
assert.equal(budgetAmount("Infinity"), null);
assert.equal(budgetAmount("-20"), 0);
assert.equal(budgetAmount("99999999"), 10000000);
console.log(
  "Fee calculator passed: 8 logos, annualised tuition, ₹1L living/₹50K travel defaults, preserved edits, live totals, missing/expired quotes and input bounds.",
);
