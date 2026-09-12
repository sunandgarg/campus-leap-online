import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BrandLogoProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "full" | "mark";
  size?: "sm" | "md" | "lg";
  tone?: "default" | "inverse";
};

const sizes = {
  sm: {
    mark: "h-7 w-7",
    wordmark: "text-[15px]",
    gap: "gap-1.5",
  },
  md: {
    mark: "h-9 w-9",
    wordmark: "text-[17px] sm:text-[18px]",
    gap: "gap-2",
  },
  lg: {
    mark: "h-11 w-11",
    wordmark: "text-xl sm:text-[22px]",
    gap: "gap-2.5",
  },
} as const;

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={cn("shrink-0 overflow-visible", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 22.5 31.8 8 60 22.5 31.8 37 4 22.5Z" fill="currentColor" />
      <path
        d="M16 30.2v11.1c0 5.1 7.1 9.2 15.8 9.2s15.8-4.1 15.8-9.2V30.2l-15.8 8.1L16 30.2Z"
        fill="currentColor"
        opacity=".94"
      />
      <path d="M53.3 24.1v14.4" stroke="#F47A20" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="53.3" cy="41.5" r="3.7" fill="#F47A20" />
    </svg>
  );
}

export function BrandLogo({
  variant = "full",
  size = "md",
  tone = "default",
  className,
  ...props
}: BrandLogoProps) {
  const selectedSize = sizes[size];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center",
        selectedSize.gap,
        tone === "inverse" ? "text-white" : "text-[#111827] dark:text-white",
        className,
      )}
      {...props}
    >
      <BrandMark className={selectedSize.mark} />
      {variant === "full" ? (
        <span
          className={cn(
            "whitespace-nowrap font-display font-extrabold leading-none tracking-[-0.055em]",
            selectedSize.wordmark,
          )}
        >
          Dekho
          <span
            className={tone === "inverse" ? "text-[#ff9a50]" : "text-[#a94300] dark:text-[#ff9a50]"}
          >
            Campus
          </span>
        </span>
      ) : (
        <span className="sr-only">DekhoCampus</span>
      )}
    </span>
  );
}
