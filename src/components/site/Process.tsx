import * as React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Search, Hammer, FlaskConical, LifeBuoy } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Map",
    body: "A free call to find the manual work costing your team the most hours.",
  },
  {
    icon: Hammer,
    title: "Build",
    body: "We design the workflow or CRM around how your team already works.",
  },
  {
    icon: FlaskConical,
    title: "Test",
    body: "Every flow runs against real data and edge cases before it goes live.",
  },
  {
    icon: LifeBuoy,
    title: "Hand over",
    body: "Docs, a walkthrough, and a shared Notion workspace for ongoing support.",
  },
];

export function Process() {
  const ref = React.useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const scale = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <section
      id="process"
      className="relative border-y border-neutral-200 bg-neutral-50 py-20 md:py-28 dark:border-white/[0.08] dark:bg-white/[0.02]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#ff4d31]">
          How we work
        </p>
        <h2 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-neutral-950 md:text-5xl dark:text-white">
          From first call to a system that runs itself.
        </h2>

        <ol ref={ref} className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-8">
          {/* track + scroll-drawn progress: vertical on mobile, horizontal from md */}
          <span
            aria-hidden
            className="absolute left-5 top-5 bottom-5 w-px bg-neutral-200 md:left-5 md:right-5 md:top-5 md:bottom-auto md:h-px md:w-auto dark:bg-white/10"
          />
          <motion.span
            aria-hidden
            style={{ scaleY: scale }}
            className="absolute left-[19px] top-5 bottom-5 w-0.5 origin-top bg-[#ff4d31] md:hidden"
          />
          <motion.span
            aria-hidden
            style={{ scaleX: scale }}
            className="absolute left-5 right-5 top-[19px] hidden h-0.5 origin-left bg-[#ff4d31] md:block"
          />

          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex gap-5 md:block"
            >
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-[#ff4d31] dark:border-white/10 dark:bg-neutral-950">
                <s.icon className="h-5 w-5" />
              </span>
              <div className="md:mt-6">
                <h3 className="text-xl font-semibold tracking-tight text-neutral-950 dark:text-white">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-[32ch] text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {s.body}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
