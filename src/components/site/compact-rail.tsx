import { ArrowLeft, ArrowRight } from "lucide-react";
import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type CompactRailProps = {
  label: string;
  children: ReactNode;
  rows?: 1 | 2;
  columns?: 2 | 3 | 4;
  dark?: boolean;
  className?: string;
  railClassName?: string;
};

export function CompactRail({
  label,
  children,
  rows = 1,
  columns = 3,
  dark = false,
  className,
  railClassName,
}: CompactRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({
    canGoBack: false,
    canGoForward: false,
    hasOverflow: false,
  });
  const itemCount = Children.count(children);

  const updatePosition = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const end = rail.scrollWidth - rail.clientWidth;
    setPosition({
      canGoBack: rail.scrollLeft > 2,
      canGoForward: end > 2 && rail.scrollLeft < end - 2,
      hasOverflow: end > 2,
    });
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    updatePosition();
    const observer = new ResizeObserver(updatePosition);
    observer.observe(rail);
    rail.addEventListener("scroll", updatePosition, { passive: true });
    return () => {
      observer.disconnect();
      rail.removeEventListener("scroll", updatePosition);
    };
  }, [itemCount, updatePosition]);

  const scroll = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollBy({
      left: direction * rail.clientWidth * 0.88,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const columnClass = {
    2: "auto-cols-[minmax(16rem,88%)] sm:auto-cols-[minmax(17rem,47%)]",
    3: "auto-cols-[minmax(16rem,88%)] sm:auto-cols-[minmax(17rem,47%)] lg:auto-cols-[calc((100%-2rem)/3)]",
    4: "auto-cols-[minmax(14.5rem,84%)] sm:auto-cols-[minmax(14.5rem,47%)] lg:auto-cols-[calc((100%-3rem)/4)]",
  }[columns];

  const buttonClass = dark
    ? "border-white/20 bg-[#1b202a] text-white enabled:hover:bg-white enabled:hover:text-[#131720] disabled:text-white/30"
    : "border-border bg-card text-foreground enabled:hover:border-[#325dd2] enabled:hover:text-[#2449ad] disabled:text-muted-foreground/40";

  return (
    <div className={cn("mt-6 min-w-0", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className={cn("text-xs font-bold", dark ? "text-white/65" : "text-muted-foreground")}>
          {itemCount} {itemCount === 1 ? "item" : "items"}
          {position.hasOverflow ? " · swipe or use arrows" : ""}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label={`Scroll ${label} backward`}
            disabled={!position.canGoBack}
            onClick={() => scroll(-1)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg border transition-colors disabled:cursor-not-allowed",
              buttonClass,
            )}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={`Scroll ${label} forward`}
            disabled={!position.canGoForward}
            onClick={() => scroll(1)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg border transition-colors disabled:cursor-not-allowed",
              buttonClass,
            )}
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        ref={railRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        className={cn(
          "grid snap-x snap-mandatory grid-flow-col gap-4 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*]:min-w-0 [&>*]:snap-start",
          rows === 2 ? "grid-rows-2" : "grid-rows-1",
          columnClass,
          railClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
