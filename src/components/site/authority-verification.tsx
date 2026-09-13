import { ExternalLink, ShieldCheck } from "lucide-react";

import { CompactRail } from "@/components/site/compact-rail";
import { cn } from "@/lib/utils";

const authorities = [
  {
    name: "UGC Distance Education Bureau",
    shortName: "UGC-DEB",
    image: "/authorities/ugc-deb-9343d826.png",
    width: 372,
    height: 57,
    purpose: "Match the legal HEI, exact programme, Online or ODL mode, and admission session.",
    linkLabel: "Search UGC-DEB",
    href: "https://deb.ugc.ac.in/Home/HEI_Prog_List",
  },
  {
    name: "All India Council for Technical Education",
    shortName: "AICTE",
    image: "/authorities/aicte-1017085a.png",
    width: 380,
    height: 73,
    purpose: "Check an exact institution, course, mode and academic-year record when applicable.",
    linkLabel: "Read AICTE scope",
    href: "https://www.aicte.gov.in/sites/default/files/APH%20Final.pdf",
  },
  {
    name: "National Assessment and Accreditation Council",
    shortName: "NAAC",
    image: "/authorities/naac-d34a8af5.png",
    width: 454,
    height: 100,
    purpose: "Use institutional accreditation as context—not as online-programme entitlement.",
    linkLabel: "Read NAAC scope",
    href: "https://naac.gov.in/index.php/en/assessment-accreditation",
  },
  {
    name: "National Institutional Ranking Framework",
    shortName: "NIRF",
    image: "/authorities/nirf-ae99b646.png",
    width: 154,
    height: 104,
    purpose: "Read the year and category. A relative annual ranking is not an approval.",
    linkLabel: "Open NIRF 2025",
    href: "https://www.nirfindia.org/Rankings/2025/Ranking.html",
  },
] as const;

type AuthorityVerificationProps = {
  dark?: boolean;
  compact?: boolean;
  className?: string;
};

export function AuthorityVerification({
  dark = false,
  compact = false,
  className,
}: AuthorityVerificationProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="flex max-w-3xl items-start gap-3">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            dark
              ? "bg-white text-[#2449ad]"
              : "bg-[#edf2ff] text-[#2449ad] dark:bg-[#263653] dark:text-[#b9ceff]",
          )}
        >
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className={cn("font-display font-extrabold", compact ? "text-lg" : "text-xl")}>
            Know what each official source can confirm
          </p>
          <p
            className={cn(
              "mt-1 text-xs leading-5",
              dark ? "text-white/75" : "text-muted-foreground",
            )}
          >
            University identity, programme entitlement, institutional accreditation and ranking are
            different checks. Always match the scope and date.
          </p>
        </div>
      </div>

      <CompactRail
        label="Official education information sources"
        columns={4}
        dark={dark}
        className={compact ? "mt-4" : "mt-5"}
        railClassName="gap-3 lg:auto-cols-[calc((100%-2.25rem)/4)]"
      >
        {authorities.map((authority) => (
          <a
            key={authority.shortName}
            href={authority.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${authority.name}: ${authority.linkLabel} (opens in new tab)`}
            className={cn(
              "group flex min-h-44 min-w-0 flex-col rounded-xl border p-3.5 transition-colors focus-visible:outline-offset-2",
              dark
                ? "border-white/15 bg-[#1b202a] hover:border-white/35"
                : "border-border bg-card hover:border-[#8aa7e8] dark:bg-[#1b202a]",
            )}
          >
            <span className="flex h-14 items-center justify-center rounded-lg border border-[#e4e7ec] bg-white px-3">
              <img
                src={authority.image}
                alt=""
                width={authority.width}
                height={authority.height}
                loading="lazy"
                decoding="async"
                className="max-h-9 w-auto max-w-full object-contain"
              />
            </span>
            <span className="mt-3 block text-xs font-extrabold leading-4">
              {authority.shortName}
            </span>
            <span
              className={cn(
                "mt-1 line-clamp-3 block flex-1 text-[11px] leading-4",
                dark ? "text-white/70" : "text-muted-foreground",
              )}
            >
              {authority.purpose}
            </span>
            <span
              className={cn(
                "mt-3 inline-flex items-center gap-1 text-[11px] font-extrabold",
                dark ? "text-[#9fbcff]" : "text-[#2449ad] dark:text-[#b9ceff]",
              )}
            >
              {authority.linkLabel}
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </span>
          </a>
        ))}
      </CompactRail>

      <p
        className={cn(
          "mt-3 text-[10px] leading-4",
          dark ? "text-white/65" : "text-muted-foreground",
        )}
      >
        These links open official public information. Marks identify the destination only; they do
        not indicate endorsement of DekhoCampus or confirm fees, admissions, placements, or another
        intake.
      </p>
    </div>
  );
}
