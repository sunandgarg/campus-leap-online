export type AnnualBudget = Record<"tuition" | "living" | "travel" | "online", number | null>;

export function annualTuition(
  fees: { campusFee: number | null; onlineFee: number | null },
  current: boolean,
) {
  return {
    tuition: current && fees.campusFee !== null ? Math.round(fees.campusFee / 2) : null,
    online: current && fees.onlineFee !== null ? Math.round(fees.onlineFee / 2) : null,
  };
}

export function budgetAmount(raw: string) {
  if (!raw.trim() || !Number.isFinite(Number(raw))) return null;
  return Math.min(10000000, Math.max(0, Math.round(Number(raw))));
}

export function annualBudgetSummary(budget: AnnualBudget) {
  const { tuition, living, travel, online } = budget;
  const campus =
    tuition !== null && living !== null && travel !== null ? tuition + living + travel : null;
  const difference = campus !== null && online !== null ? campus - online : null;
  const percent =
    campus !== null && campus > 0 && difference !== null
      ? Math.round((difference / campus) * 100)
      : null;
  return { campus, difference, percent };
}
