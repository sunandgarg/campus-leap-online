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
    full: "h-auto w-[116px]",
  },
  md: {
    mark: "h-9 w-9",
    full: "h-auto w-36",
  },
  lg: {
    mark: "h-11 w-11",
    full: "h-auto w-40",
  },
} as const;

export function BrandMark({ className }: { className?: string }) {
  return (
    <img
      src="/dekhocampus-logo.png"
      alt=""
      aria-hidden="true"
      width={52}
      height={52}
      className={cn("shrink-0 object-contain", className)}
    />
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
  const isFull = variant === "full";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        tone === "inverse" && isFull && "rounded-lg bg-white px-2 py-1",
        tone === "default" && isFull && "dark:rounded-lg dark:bg-white dark:px-2 dark:py-1",
        className,
      )}
      {...props}
    >
      {isFull ? (
        <img
          src="/dekhocampus-logo-full.webp"
          alt=""
          aria-hidden="true"
          width={256}
          height={70}
          className={cn("shrink-0 object-contain", selectedSize.full)}
        />
      ) : (
        <BrandMark className={selectedSize.mark} />
      )}
      <span className="sr-only">DekhoCampus</span>
    </span>
  );
}
