import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { calTrigger } from "@/lib/contact";
import { IntegrationsFlow } from "@/components/animation/IntegrationsFlow";
import { SectionGlow } from "./SectionGlow";

/* ---------- Hero: copy centred, the home page "gate" integrations flow below ---------- */
export function ServiceHero() {
  return (
    <section className="relative w-full overflow-hidden px-4 sm:px-6 md:px-8 pt-4 md:pt-8 pb-8">
      <SectionGlow />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-2 text-center md:gap-0">
          <div className="flex max-w-3xl flex-col items-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full liquid-glass border border-white/30 dark:border-white/10 px-3 py-1 text-xs font-mono uppercase tracking-widest text-neutral-700 dark:text-neutral-300"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff4d31] animate-pulse" />
              Automation Suite
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-neutral-950 dark:text-white leading-[0.95]"
            >
              You run the business.
              <br />
              <span className="text-[#ff4d31]">We automate the busywork.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400"
            >
              n8n workflows, AI voice agents and custom CRMs, built together so every lead is
              captured, followed up and tracked without anyone typing.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-wrap justify-center gap-3"
            >
              <Button
                className="rounded-xl px-6 py-3 h-auto bg-[#ff4d31] text-white hover:bg-[#e8462c]"
                {...calTrigger}
              >
                Book a Call
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-xl px-6 py-3 h-auto liquid-glass border-neutral-300 dark:border-neutral-700 bg-transparent"
              >
                <a href="#case-studies">See Our Work</a>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative w-full"
          >
            <IntegrationsFlow />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
