import { useRef, useState } from "react";
import type * as React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  Check,
  CircleAlert,
  Database,
  GitBranch,
  Globe,
  Lock,
  Mail,
  Phone as PhoneIcon,
  Sheet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandIcons } from "@/components/animation/BrandIcons";
export { LiveApp as HeroApp } from "@/components/site/Showcase";

/* Visual building blocks for the service pages, following Vertex Media House's service pages. */

/* ---------- section wrapper ---------- */

export function SectionWrap({
  id,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="relative w-full scroll-mt-24 overflow-clip px-4 sm:px-6 md:px-8 py-12 md:py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300/60 dark:via-white/10 to-transparent"
      />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] backdrop-blur-md px-3 py-1 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff4d31] animate-pulse" />
            {eyebrow}
          </span>
          <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-950 dark:text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-5 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

// Where a pinned card sits below the fixed navbar.
export const PIN_TOP = 112;
