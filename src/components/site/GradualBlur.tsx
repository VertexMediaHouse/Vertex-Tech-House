import * as React from "react";
import { cn } from "@/lib/utils";

type Position = "bottom" | "top";

interface GradualBlurProps {
  position?: Position;
  height?: string;
  strength?: number;
  divCount?: number;
  exponential?: boolean;
  opacity?: number;
  className?: string;
  /** "parent" = absolute inside relative parent, "page" = fixed to viewport */
  target?: "parent" | "page";
}

/**
 * Gradual blur with progressive frosted-glass layers.
 * Each layer increases blur and is masked to a thin band so the blur
 * intensifies smoothly toward the edge.
 */
export function GradualBlur({
  position = "bottom",
  height = "7rem",
  strength = 2,
  divCount = 6,
  exponential = true,
  opacity = 1,
  className,
  target = "page",
}: GradualBlurProps) {
  const layers = Array.from({ length: divCount });

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none z-30",
        target === "page" ? "fixed left-0 right-0" : "absolute left-0 right-0",
        position === "bottom" ? "bottom-0" : "top-0",
        className,
      )}
      style={{ height, opacity }}
    >
      {layers.map((_, i) => {
        const t = (i + 1) / divCount; // 0 < t <= 1
        const progress = exponential ? Math.pow(t, 2) : t;
        const blurPx = +(progress * strength * 8).toFixed(2);

        // each layer occupies a slice closer to the edge
        const segStart = (i / divCount) * 100;
        const segEnd = ((i + 1) / divCount) * 100;

        const gradientDir = position === "bottom" ? "to bottom" : "to top";

        const mask = `linear-gradient(${gradientDir}, transparent ${segStart}%, black ${(segStart + segEnd) / 2}%, black ${segEnd}%, transparent 100%)`;

        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blurPx}px) saturate(140%)`,
              WebkitBackdropFilter: `blur(${blurPx}px) saturate(140%)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
      {/* faint glass tint */}
      <div
        className="absolute inset-0"
        style={{
          background:
            position === "bottom"
              ? "linear-gradient(to top, color-mix(in oklab, var(--color-background) 55%, transparent), transparent)"
              : "linear-gradient(to bottom, color-mix(in oklab, var(--color-background) 55%, transparent), transparent)",
        }}
      />
    </div>
  );
}

export default GradualBlur;
