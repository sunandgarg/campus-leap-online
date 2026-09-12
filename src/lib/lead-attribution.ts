export interface LeadAttribution {
  path: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
}

const FIRST_TOUCH_KEY = "dekhocampus-first-touch";

function sanitizePath(value: unknown) {
  const path = typeof value === "string" ? value.split(/[?#]/, 1)[0] : "/";
  return (path?.startsWith("/") ? path : "/").slice(0, 500);
}

function sanitizeReferrer(value: unknown) {
  if (typeof value !== "string" || !value) return "";
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    return `${url.origin}${url.pathname}`.slice(0, 500);
  } catch {
    return "";
  }
}

function sanitizeAttribution(value: unknown): LeadAttribution | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const safeCampaignValue = (key: string) =>
    typeof record[key] === "string" ? record[key].slice(0, 160) : "";
  return {
    path: sanitizePath(record["path"]),
    referrer: sanitizeReferrer(record["referrer"]),
    utmSource: safeCampaignValue("utmSource"),
    utmMedium: safeCampaignValue("utmMedium"),
    utmCampaign: safeCampaignValue("utmCampaign"),
  };
}

export function getLeadAttribution(): LeadAttribution {
  if (typeof window === "undefined") {
    return { path: "/", referrer: "", utmSource: "", utmMedium: "", utmCampaign: "" };
  }

  const params = new URLSearchParams(window.location.search);
  const current: LeadAttribution = {
    path: sanitizePath(window.location.pathname),
    referrer: sanitizeReferrer(document.referrer),
    utmSource: (params.get("utm_source") ?? "").slice(0, 160),
    utmMedium: (params.get("utm_medium") ?? "").slice(0, 160),
    utmCampaign: (params.get("utm_campaign") ?? "").slice(0, 160),
  };

  try {
    const existing = window.sessionStorage.getItem(FIRST_TOUCH_KEY);
    if (existing) {
      const sanitized = sanitizeAttribution(JSON.parse(existing));
      if (sanitized) {
        window.sessionStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(sanitized));
        return sanitized;
      }
    }
    window.sessionStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(current));
  } catch {
    // Storage may be unavailable in private browsing; current-page attribution still works.
  }

  return current;
}
