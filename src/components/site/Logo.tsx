import * as React from "react";
import { cn } from "@/lib/utils";

// TODO(logo): placeholder, this is the VMH mark. Swap the <svg> below for the Vertex Tech House logo.
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn("h-8 w-8 shrink-0", className)}
    >
      <path
        d="M12 18C10 18 9 20 10 22L42 50L10 78C9 80 10 82 12 82H34C37 82 39 81 41 79L76 54C79 52 79 48 76 46L41 21C39 19 37 18 34 18H12Z"
        fill="#FF4B33"
      />
    </svg>
  );
}

// Full lockup: mark | AI & Tech. Dimensions match the Vertex Media House "| Media" lockup.
export function LogoLockup({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5 md:gap-2", className)}>
      {/* Cropped viewBox drops the mark's built-in padding so the divider sits close. */}
      <svg viewBox="8 16 72 68" fill="none" aria-hidden className="h-7 w-7 md:h-8 md:w-8">
        <path
          d="M12 18C10 18 9 20 10 22L42 50L10 78C9 80 10 82 12 82H34C37 82 39 81 41 79L76 54C79 52 79 48 76 46L41 21C39 19 37 18 34 18H12Z"
          fill="#FF4B33"
        />
      </svg>
      <span aria-hidden className="h-6 md:h-7 w-0.5 bg-neutral-900 dark:bg-white" />
      <span className="text-2xl md:text-[1.7rem] font-bold leading-none tracking-tight text-[#FF4B33]">
        AI &amp; Tech
      </span>
    </div>
  );
}
