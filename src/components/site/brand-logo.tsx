import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BrandLogoProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "full" | "mark";
  size?: "sm" | "md" | "lg";
  tone?: "default" | "inverse";
};

const sizes = {
  sm: {
    mark: "h-7 w-8",
    wordmark: "text-[15px]",
    gap: "gap-0",
  },
  md: {
    mark: "h-9 w-10",
    wordmark: "text-[17px] sm:text-[18px]",
    gap: "gap-0",
  },
  lg: {
    mark: "h-10 w-11",
    wordmark: "text-xl sm:text-[22px]",
    gap: "gap-0",
  },
} as const;

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 54"
      aria-hidden="true"
      className={cn("shrink-0 overflow-visible", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 18.2 34 3.5 61 15.4 30.7 29.7 3 18.2Z" fill="currentColor" />
      <path
        d="M16.5 24.2v7.7c3.8 4.2 8.9 6.2 15.5 6.2 6.2 0 11.2-1.9 15.2-5.8v-8.9l-16.4 7.7-14.3-6.9Z"
        fill="currentColor"
        opacity=".96"
      />
      <path
        d="M12.2 22.2v16.2c0 2.3 1.2 4.4 3.2 5.6"
        stroke="#F47B25"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path d="m11.1 46.8 4.3-3.2 4 3.2-1.7 4.1h-5l-1.6-4.1Z" fill="#F47B25" />
      <circle cx="9.8" cy="42" r="1.7" fill="#F47B25" opacity=".72" />
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
            "-ml-1 whitespace-nowrap font-display font-black leading-none tracking-[-0.045em]",
            selectedSize.wordmark,
          )}
        >
          Dekho
          <span
            className={tone === "inverse" ? "text-[#FF9A50]" : "text-[#F47B25] dark:text-[#FF9A50]"}
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
