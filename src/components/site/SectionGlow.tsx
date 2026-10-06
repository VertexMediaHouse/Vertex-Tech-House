import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Shared "differentiator" — soft blue radial glow at the top of a section
 * plus a hairline divider. Drop this as a direct child of any
 * `relative` section to match the home page's section transitions.
 */
export function SectionGlow({
  className,
  withDivider = true,
}: {
  className?: string;
  withDivider?: boolean;
}) {
  return (
    <>
      <div
        aria-hidden
        className={cn("pointer-events-none absolute inset-0", className)}
        style={{
          background: "radial-gradient(60% 50% at 50% 0%, rgba(59,130,246,0.08), transparent 70%)",
        }}
      />
      {withDivider && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300/60 dark:via-white/10 to-transparent"
        />
      )}
    </>
  );
}

export default SectionGlow;
