import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Inbox, Sparkles, Database, PhoneCall, CalendarCheck, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { icon: Inbox, title: "New lead", detail: "Website form submitted" },
  { icon: Sparkles, title: "AI qualifies", detail: "Budget, timeline and fit scored" },
  { icon: Database, title: "CRM updated", detail: "Deal created in your pipeline" },
  { icon: PhoneCall, title: "Voice agent calls", detail: "Lead gets a call back instantly" },
  { icon: CalendarCheck, title: "Meeting booked", detail: "Added to your team's calendar" },
];

// Example inbound-lead run: each step lights up in order, then the run restarts.
export function LeadFlow() {
  const reduce = useReducedMotion();
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    if (reduce) {
      setActive(steps.length); // static "all done" state
      return;
    }
    const id = setInterval(() => setActive((a) => (a + 1) % (steps.length + 2)), 1300);
    return () => clearInterval(id);
  }, [reduce]);

  const progress = Math.min(active, steps.length - 1) / (steps.length - 1);

  return (
    <div className="liquid-glass rounded-2xl border border-neutral-200 p-5 sm:p-6 dark:border-white/10 dark:!bg-white/[0.03]">
      <div className="mb-5 flex items-center justify-between text-xs">
        <span className="font-semibold text-neutral-900 dark:text-white">Inbound lead flow</span>
        <span className="rounded-md border border-neutral-200 px-2 py-0.5 text-neutral-500 dark:border-white/10">
          Example run
        </span>
      </div>

      <ol className="relative space-y-2.5">
        {/* connector: grey track + orange progress, both centered on the icons */}
        <span
          aria-hidden
          className="absolute left-[29px] top-7 bottom-7 w-px bg-neutral-200 dark:bg-white/10"
        />
        <motion.span
          aria-hidden
          className="absolute left-[29px] top-7 bottom-7 w-px origin-top bg-[#ff4d31]"
          initial={false}
          animate={{ scaleY: progress }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
        />

        {steps.map((s, i) => {
          const done = i < active;
          const running = i === active;
          return (
            <li
              key={s.title}
              className={cn(
                "relative flex items-center gap-4 rounded-xl border px-3 py-3 transition-colors duration-500",
                running ? "border-[#ff4d31]/40 bg-[#ff4d31]/[0.06]" : "border-transparent",
              )}
            >
              <span
                className={cn(
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors duration-500",
                  done || running
                    ? "border-[#ff4d31] bg-[#ff4d31] text-white"
                    : "border-neutral-200 bg-white text-neutral-400 dark:border-white/10 dark:bg-neutral-900",
                )}
              >
                <s.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm font-semibold transition-colors duration-500",
                    done || running ? "text-neutral-950 dark:text-white" : "text-neutral-400",
                  )}
                >
                  {s.title}
                </p>
                <p className="truncate text-xs text-neutral-500">{s.detail}</p>
              </div>
              <span className="w-16 text-right text-xs">
                {done ? (
                  <Check className="ml-auto h-4 w-4 text-[#ff4d31]" aria-label="Done" />
                ) : running ? (
                  <span className="font-medium text-[#ff4d31]">Running</span>
                ) : (
                  <span className="text-neutral-400">Queued</span>
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
