export type EvidenceSourceKind =
  "ugc-deb" | "ugc" | "aicte" | "naac" | "nirf" | "university" | "secondary" | "missing";

function normalizedHostname(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    return new URL(candidate).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

function hostnameMatches(hostname: string, expected: string): boolean {
  return hostname === expected || hostname.endsWith(`.${expected}`);
}

export function classifyEvidenceSource(
  sourceUrl: string | undefined,
  universityDomain?: string,
): EvidenceSourceKind {
  const hostname = normalizedHostname(sourceUrl);
  if (!hostname) return sourceUrl ? "secondary" : "missing";
  if (hostname === "deb.ugc.ac.in") return "ugc-deb";
  if (hostnameMatches(hostname, "ugc.gov.in")) return "ugc";
  if (hostnameMatches(hostname, "aicte.gov.in")) return "aicte";
  if (hostnameMatches(hostname, "naac.gov.in")) return "naac";
  if (hostnameMatches(hostname, "nirfindia.org")) return "nirf";

  const officialUniversityHost = normalizedHostname(universityDomain);
  if (officialUniversityHost && hostnameMatches(hostname, officialUniversityHost)) {
    return "university";
  }
  return "secondary";
}

export function evidenceSourceLinkLabel(kind: EvidenceSourceKind): string {
  switch (kind) {
    case "ugc-deb":
      return "Open official UGC-DEB source";
    case "ugc":
      return "Open official UGC source";
    case "aicte":
      return "Open official AICTE source";
    case "naac":
      return "Open official NAAC source";
    case "nirf":
      return "Open official NIRF source";
    case "university":
      return "Open university source";
    case "secondary":
      return "Open cited secondary source";
    default:
      return "Source unavailable";
  }
}
