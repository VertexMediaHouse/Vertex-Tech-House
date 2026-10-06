import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { calTrigger } from "@/lib/contact";
import StarBorder from "./StarBorder";
import { SectionGlow } from "./SectionGlow";

/* ---------- Packages ---------- */
// TODO(content): confirm what each package includes before launch.
const packages = [
  {
    name: "Starter",
    tagline: "For teams automating their first workflows",
    features: [
      "2 Custom n8n Workflows",
      "Integrations With Up to 5 Tools",
      "Lead Capture Into Your CRM or Sheet",
      "Tested Against Real Data",
      "Docs & Handover Walkthrough",
      "14 Days Post-launch Support",
      "Live in 1–2 Weeks",
    ],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Growth",
    tagline: "For teams ready to run sales on autopilot",
    features: [
      "Up to 6 Custom Workflows",
      "AI Voice or Chat Agent",
      "Custom CRM Build",
      "Lead Routing & Automated Follow-ups",
      "Outbound Sequence Setup",
      "Dashboards & Reporting",
      "Shared Notion Workspace",
      "Check-in Calls",
      "30 Days Post-launch Support",
    ],
    cta: "Scale now",
    highlighted: true,
  },
  {
    name: "Scale",
    tagline: "For businesses automating across every team",
    features: [
      "Ongoing Workflow Builds, Scoped Monthly",
      "Multi-agent AI Systems",
      "Full CRM With Data Migration",
      "Custom Integrations & APIs",
      "Team Onboarding & Training",
      "Dedicated Support",
      "Monthly Strategy Call",
      "Monthly Performance Report",
      "Priority Fixes & Changes",
    ],
    cta: "Talk to us",
    highlighted: false,
  },
];

function PackageCard({ pkg, index }: { pkg: (typeof packages)[0]; index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      onMouseMove={handleMouseMove}
      className="group relative transition-all duration-500 ease-out hover:-translate-y-3 h-full"
    >
      <StarBorder
        className="w-full h-full"
        color={pkg.highlighted ? "rgba(255, 77, 49, 0.8)" : "rgba(255, 255, 255, 0.6)"}
        speed={pkg.highlighted ? "10s" : "16s"}
        thickness={pkg.highlighted ? 4 : 3}
      >
        <div
          className={cn(
            "relative flex flex-col p-8 h-full w-full overflow-hidden",
            "liquid-glass backdrop-blur-xl backdrop-saturate-150 border-none shadow-none",
            pkg.highlighted ? "dark:!bg-white/[0.06]" : "dark:!bg-white/[0.03]",
          )}
        >
          {/* Spotlight hover */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden dark:block"
            style={{
              background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, ${
                pkg.highlighted ? "rgba(255, 255, 255, 0.18)" : "rgba(255, 255, 255, 0.12)"
              }, transparent 80%)`,
            }}
          />
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:hidden"
            style={{
              background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(120, 140, 180, 0.28), transparent 80%)`,
            }}
          />

          {pkg.highlighted && (
            <div className="absolute top-0 right-6">
              <div className="bg-[#ff4d31] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-b-lg shadow-lg shadow-[#ff4d31]/30">
                Recommended
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3
              className={cn(
                "text-2xl font-bold tracking-tight mb-1",
                pkg.highlighted ? "text-[#ff4d31]" : "text-neutral-900 dark:text-white",
              )}
            >
              {pkg.name}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{pkg.tagline}</p>
          </div>

          <ul className="space-y-3 mb-8 flex-grow">
            {pkg.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm">
                <div
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full mt-0.5",
                    pkg.highlighted
                      ? "bg-[#ff4d31]/15 text-[#ff4d31]"
                      : "bg-white/10 dark:bg-white/[0.06] text-neutral-500 dark:text-neutral-400",
                  )}
                >
                  <Check className="h-3 w-3" />
                </div>
                <span className="text-neutral-700 dark:text-neutral-300">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            className={cn(
              "w-full rounded-full h-12 text-sm font-semibold transition-all duration-300",
              pkg.highlighted
                ? "bg-[#ff4d31] text-white hover:bg-[#e8462c] shadow-lg shadow-[#ff4d31]/20 hover:shadow-xl hover:shadow-[#ff4d31]/30"
                : "bg-white/10 dark:bg-white/[0.06] text-neutral-900 dark:text-white border border-neutral-200/50 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/[0.1]",
            )}
            {...calTrigger}
          >
            {pkg.cta}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </StarBorder>
    </motion.div>
  );
}

export function Packages() {
  return (
    <section
      id="packages"
      className="relative w-full overflow-hidden px-4 sm:px-6 md:px-8 py-12 md:py-20 bg-white dark:bg-black"
    >
      <SectionGlow />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center mb-10 md:mb-14">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] backdrop-blur-md px-3 py-1 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff4d31] animate-pulse" />
            Packages
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-neutral-950 dark:text-white"
          >
            Simple packages. <span className="text-[#ff4d31]">No surprises.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg md:text-xl text-neutral-600 dark:text-neutral-400 font-medium"
          >
            Pick the scope that fits where your business is today. Every build is yours to keep,
            with no per-seat fees and no lock-in.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5 lg:gap-6 items-stretch">
          {packages.map((pkg, index) => (
            <PackageCard key={pkg.name} pkg={pkg} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
