import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dekhocampus-comparison";
const CHANGE_EVENT = "dekhocampus-comparison-change";
const MAX_UNIVERSITIES = 3;

export interface ComparisonState {
  programSlug: string;
  universitySlugs: string[];
}

function emptyComparison(programSlug = ""): ComparisonState {
  return { programSlug, universitySlugs: [] };
}

function readComparison(): ComparisonState {
  if (typeof window === "undefined") return emptyComparison();
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "null",
    ) as ComparisonState | null;
    if (
      !parsed ||
      typeof parsed.programSlug !== "string" ||
      !Array.isArray(parsed.universitySlugs)
    ) {
      return emptyComparison();
    }
    return {
      programSlug: parsed.programSlug,
      universitySlugs: parsed.universitySlugs
        .filter((slug): slug is string => typeof slug === "string")
        .slice(0, MAX_UNIVERSITIES),
    };
  } catch {
    return emptyComparison();
  }
}

function persistComparison(next: ComparisonState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent<ComparisonState>(CHANGE_EVENT, { detail: next }));
}

export function useComparison(defaultProgramSlug = "") {
  const [comparison, setComparison] = useState<ComparisonState>(() =>
    emptyComparison(defaultProgramSlug),
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = readComparison();
    setComparison(
      defaultProgramSlug && saved.programSlug !== defaultProgramSlug
        ? emptyComparison(defaultProgramSlug)
        : saved.programSlug
          ? saved
          : emptyComparison(defaultProgramSlug),
    );
    setReady(true);

    function handleChange(event: Event) {
      const next = (event as CustomEvent<ComparisonState>).detail;
      if (!next) return;
      setComparison(
        defaultProgramSlug && next.programSlug !== defaultProgramSlug
          ? emptyComparison(defaultProgramSlug)
          : next,
      );
    }

    function handleStorage() {
      const next = readComparison();
      setComparison(
        defaultProgramSlug && next.programSlug !== defaultProgramSlug
          ? emptyComparison(defaultProgramSlug)
          : next,
      );
    }

    window.addEventListener(CHANGE_EVENT, handleChange);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(CHANGE_EVENT, handleChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, [defaultProgramSlug]);

  const toggleUniversity = useCallback((programSlug: string, universitySlug: string) => {
    const current = readComparison();
    const working = current.programSlug === programSlug ? current : emptyComparison(programSlug);
    const exists = working.universitySlugs.includes(universitySlug);
    const universitySlugs = exists
      ? working.universitySlugs.filter((slug) => slug !== universitySlug)
      : working.universitySlugs.length < MAX_UNIVERSITIES
        ? [...working.universitySlugs, universitySlug]
        : working.universitySlugs;
    const next = { programSlug, universitySlugs };
    persistComparison(next);
    setComparison(next);
    return !exists && universitySlugs.includes(universitySlug);
  }, []);

  const changeProgram = useCallback((programSlug: string) => {
    const next = emptyComparison(programSlug);
    persistComparison(next);
    setComparison(next);
  }, []);

  const clearComparison = useCallback(() => {
    const next = emptyComparison(comparison.programSlug || defaultProgramSlug);
    persistComparison(next);
    setComparison(next);
  }, [comparison.programSlug, defaultProgramSlug]);

  return {
    ...comparison,
    ready,
    count: comparison.universitySlugs.length,
    maxUniversities: MAX_UNIVERSITIES,
    toggleUniversity,
    changeProgram,
    clearComparison,
  };
}
