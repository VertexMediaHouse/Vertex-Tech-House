import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Workflow, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionGlow } from "./SectionGlow";

type Category = "Automation" | "CRM";
type CaseStudy = { title: string; category: Category; summary: string; image?: string };

const caseStudies: CaseStudy[] = [
  {
    title: "Construction automation pipeline",
    category: "Automation",
    summary: "Automates project tracking, reporting and resource allocation across sites.",
    image: "/assets/imgs/Construction_Automation.png",
  },
  {
    title: "Bulk email automation engine",
    category: "Automation",
    summary: "Segmented outreach with personalisation and delivery optimisation built in.",
    image: "/assets/imgs/BulkEmail_Automation.png",
  },
  // TODO(content): placeholders until the write-ups exist (entries without `image`).
  {
    title: "AI voice agent for inbound leads",
    category: "Automation",
    summary: "Full write-up coming soon.",
  },
  { title: "Custom sales CRM", category: "CRM", summary: "Full write-up coming soon." },
  { title: "Client pipeline dashboard", category: "CRM", summary: "Full write-up coming soon." },
];

const icons = { Automation: Workflow, CRM: Database };

export function CaseStudies({ category }: { category?: Category } = {}) {
  const items = category ? caseStudies.filter((c) => c.category === category) : caseStudies;
  const [active, setActive] = React.useState(0);
  const current = items[active];
  const Icon = icons[current.category];

  return (
    <section
      id="case-studies"
      className="relative w-full overflow-hidden px-4 sm:px-6 md:px-8 py-12 md:py-20 bg-white dark:bg-black/50"
    >
      <SectionGlow />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] backdrop-blur-md px-3 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-300">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff4d31]" />
            Our Work
          </span>
          <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-neutral-950 dark:text-white max-w-4xl">
            Systems we've <span className="text-[#ff4d31]">shipped.</span>
          </h2>
          <p className="mt-8 max-w-2xl text-base md:text-lg text-neutral-600 dark:text-neutral-400">
            A few of the builds running for clients right now. Write-ups for newer projects are on
            the way.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* preview first on mobile, right column on desktop */}
          <div className="lg:order-2 lg:col-span-7">
            <div className="lg:sticky lg:top-24">
              <div className="relative aspect-video overflow-hidden rounded-2xl liquid-glass border border-neutral-200/70 dark:border-white/10 dark:!bg-white/[0.03] p-1.5">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={current.title}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0"
                  >
                    {current.image ? (
                      <img
                        src={current.image}
                        alt={`${current.title} workflow`}
                        className="h-full w-full object-cover object-left-top"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_40%,rgba(255,77,49,0.14),transparent_60%)] text-neutral-500">
                        <Icon className="h-10 w-10 text-[#ff4d31]" />
                        <span className="text-sm">Write-up coming soon</span>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              <p className="mt-5 max-w-[60ch] text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
                {current.summary}
              </p>
            </div>
          </div>

          <ul className="divide-y divide-neutral-200 border-y border-neutral-200 lg:order-1 lg:col-span-5 dark:divide-white/10 dark:border-white/10">
            {items.map((c, i) => (
              <li key={c.title}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  aria-pressed={i === active}
                  className="group relative flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -left-4 top-1/2 h-8 w-[3px] -translate-y-1/2 rounded-full bg-[#ff4d31] transition-opacity",
                      i === active ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span
                    className={cn(
                      "text-lg font-semibold tracking-tight transition-colors",
                      i === active
                        ? "text-neutral-950 dark:text-white"
                        : "text-neutral-500 group-hover:text-neutral-800 dark:group-hover:text-neutral-200",
                    )}
                  >
                    {c.title}
                  </span>
                  <span className="shrink-0 text-xs text-neutral-500">{c.category}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
