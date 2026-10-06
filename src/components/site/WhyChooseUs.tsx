import React from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Layers, Zap, Kanban, BadgeCheck, ShieldCheck, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import StarBorder from "./StarBorder";

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
  children?: React.ReactNode;
  className?: string;
  /** full-bleed visual above the icon */
  top?: React.ReactNode;
}

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  index,
  children,
  className,
  top,
}: FeatureCardProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative transition-all duration-500 ease-out hover:-translate-y-3",
        className,
      )}
    >
      <StarBorder
        className="w-full h-full"
        color="rgba(255, 255, 255, 0.6)"
        speed="16s"
        thickness={3}
      >
        <div
          className={cn(
            "relative flex flex-col items-start p-8 h-full w-full overflow-hidden",
            "liquid-glass dark:!bg-white/[0.03] border-none shadow-none",
            "backdrop-blur-xl backdrop-saturate-150",
          )}
        >
          {/* Spotlight Effect (Light Mode) */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:hidden"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  400px circle at ${mouseX}px ${mouseY}px,
                  rgba(120, 140, 180, 0.28),
                  transparent 80%
                )
              `,
            }}
          />
          {/* Spotlight Effect (Dark Mode) */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden dark:block"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  400px circle at ${mouseX}px ${mouseY}px,
                  rgba(255, 255, 255, 0.18),
                  transparent 80%
                )
              `,
            }}
          />

          {top && (
            <div className="relative -mx-8 -mt-8 mb-6 h-[40%] min-h-52 w-[calc(100%+4rem)] overflow-hidden">
              {top}
            </div>
          )}

          {/* Animated Icon Container */}
          <div className="relative mb-6">
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [0, 10, -10, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500/10 text-[#ff4d31] group-hover:scale-110 group-hover:bg-orange-500/20 transition-all duration-500"
            >
              <Icon className="h-7 w-7 transition-transform duration-500 group-hover:rotate-[360deg]" />

              {/* Icon Glow Animation */}
              <motion.div
                animate={{
                  opacity: [0.2, 0.5, 0.2],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-xl bg-orange-500/20 blur-xl"
              />
            </motion.div>
          </div>

          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3 tracking-tight">
            {title}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-base">
            {description}
          </p>
          {children}
        </div>
      </StarBorder>
    </motion.div>
  );
};

const features = [
  {
    icon: Layers,
    title: "Automation and CRM, one team.",
    description:
      "Workflows, voice agents and the CRM they feed are built by the same engineers, so nothing falls through the gaps between vendors.",
  },
  {
    icon: Zap,
    title: "Live in weeks, not quarters",
    description:
      "Most workflows ship within 1-2 weeks. You see working automations early instead of waiting on a months-long rollout.",
  },
  {
    icon: Kanban,
    title: "You're never left wondering",
    description:
      "Every project lives in a shared Notion workspace: timelines, deliverables, feedback and progress updates all in one place.",
  },
  {
    icon: BadgeCheck,
    title: "Tested before it touches your data",
    description:
      "Every flow runs against real data and edge cases before go-live, so it doesn't break the first time something unexpected comes in.",
  },
  {
    icon: ShieldCheck,
    title: "You own everything we build",
    description:
      "Your workflows, your CRM, your data. Full docs and a handover walkthrough, with no lock-in to us or to per-seat pricing.",
  },
  {
    icon: Briefcase,
    title: "We speak business, not jargon",
    description:
      "We tell you what we're automating, why it saves time, and how many hours a week you get back.",
  },
];

export function WhyChooseUs() {
  return (
    <section
      id="why-choose-us"
      className="relative w-full overflow-hidden px-4 sm:px-6 md:px-8 py-12 md:py-20 bg-white dark:bg-black"
    >
      {/* ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(60% 50% at 50% 0%, rgba(59,130,246,0.08), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300/60 dark:via-white/10 to-transparent"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center mb-8 md:mb-12">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] backdrop-blur-md px-3 py-1 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff4d31] animate-pulse" />
            Our Edge
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-neutral-950 dark:text-white"
          >
            The difference is{" "}
            <span className="text-[#ff4d31] dark:text-[#ff4d31]">in everything.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg md:text-xl text-neutral-600 dark:text-neutral-400 font-medium"
          >
            One team. Systems that run themselves. No compromises on reliability, speed, or results.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
