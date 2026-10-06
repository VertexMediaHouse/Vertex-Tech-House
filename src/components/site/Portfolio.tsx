import * as React from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Check, Mail, PhoneCall } from "lucide-react";
import { cn } from "@/lib/utils";
import { AutomationAnimation } from "../animation/AutomationAnimation";
import { CrmAnimation } from "../animation/CrmAnimation";
import { IntegrationsFlow } from "../animation/IntegrationsFlow";
import { SectionGlow } from "./SectionGlow";

function Cell({
  className,
  visual,
  title,
  body,
  link,
}: {
  className?: string;
  visual: React.ReactNode;
  title: string;
  body: string;
  link?: { slug: "automation" | "crm"; label: string };
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl liquid-glass border border-neutral-200/70 dark:border-white/10 dark:!bg-white/[0.03]",
        className,
      )}
    >
      <div className="relative h-56 overflow-hidden border-b border-neutral-200 md:h-64 dark:border-white/10">
        {visual}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold tracking-tight text-neutral-950 dark:text-white">
          {title}
        </h3>
        <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
          {body}
        </p>
        {link && (
          <Link
            to="/services/$slug"
            params={{ slug: link.slug }}
            className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-neutral-950 transition-colors hover:text-[#ff4d31] dark:text-white"
          >
            {link.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </motion.article>
  );
}

const waveHeights = [30, 55, 80, 45, 95, 60, 35, 70, 100, 50, 75, 40, 85, 55, 30];

function VoiceVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <style>{`
        @keyframes vth-wave { 0%,100% { transform: scaleY(.35); } 50% { transform: scaleY(1); } }
        .vth-wave > span { animation: vth-wave 1.1s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .vth-wave > span { animation: none; } }
      `}</style>
      <div className="flex items-center gap-5">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff4d31] text-white">
          <PhoneCall className="h-5 w-5" />
        </span>
        <div className="vth-wave flex h-20 items-center gap-[4px]" aria-hidden>
          {waveHeights.map((h, i) => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-[#ff4d31]/80"
              style={{ height: `${h}%`, animationDelay: `${i * 70}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const sequence = [
  { icon: Mail, label: "Intro email", day: 1 },
  { icon: Mail, label: "Follow-up", day: 3 },
  { icon: PhoneCall, label: "Call", day: 6 },
];

// Each step of the sequence slides in, gets its "sent" tick, then everything resets together.
const obKeyframes = sequence
  .map((_, i) => {
    const t = 8 + i * 22; // % of the loop where step i appears
    return `
      @keyframes ob-in-${i} {
        0%, ${t}% { opacity: 0; transform: translateX(-12px); }
        ${t + 6}%, 90% { opacity: 1; transform: translateX(0); }
        97%, 100% { opacity: 0; transform: translateX(0); }
      }
      @keyframes ob-sent-${i} {
        0%, ${t + 12}% { opacity: 0; transform: scale(0); }
        ${t + 15}% { opacity: 1; transform: scale(1.3); }
        ${t + 18}%, 100% { opacity: 1; transform: scale(1); }
      }
      .ob-step-${i} { animation: ob-in-${i} 6s ease-out infinite; }
      .ob-sent-${i} { animation: ob-sent-${i} 6s ease-out infinite; }`;
  })
  .join("");

function OutboundVisual() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-3 px-8">
      <style>{`${obKeyframes}
        @media (prefers-reduced-motion: reduce) { [class*="ob-step-"], [class*="ob-sent-"] { animation: none; } }
      `}</style>
      {sequence.map((s, i) => (
        <div
          key={s.label}
          style={{ marginLeft: i * 28 }}
          className={`ob-step-${i} flex w-fit items-center gap-2.5 rounded-lg liquid-glass border border-neutral-200/70 dark:border-white/10 dark:!bg-white/[0.03] px-3 py-2 text-sm`}
        >
          <s.icon className="h-4 w-4 text-[#ff4d31]" />
          <span className="font-medium text-neutral-900 dark:text-white">{s.label}</span>
          <span className="text-xs text-neutral-500">Day {s.day}</span>
          <span
            className={`ob-sent-${i} flex h-4 w-4 items-center justify-center rounded-full bg-[#2f7a4a] text-white`}
          >
            <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
          </span>
        </div>
      ))}
    </div>
  );
}

export function Portfolio() {
  return (
    <section
      id="our-work"
      className="relative w-full overflow-hidden px-4 sm:px-6 md:px-8 py-12 md:py-20 bg-white dark:bg-black/50"
    >
      <SectionGlow />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] backdrop-blur-md px-3 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-300">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff4d31]" />
            Our Work
          </span>
          <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-neutral-950 dark:text-white max-w-4xl">
            Manual work in ─ <span className="text-[#ff4d31]">systems that run themselves out</span>
          </h2>
          <p className="mt-8 max-w-2xl text-base md:text-lg text-neutral-600 dark:text-neutral-400">
            Automation and CRM built to work together, so every workflow feeds a CRM your team
            actually uses.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Cell
            className="md:col-span-2"
            visual={<AutomationAnimation />}
            title="n8n workflow automation"
            body="We map your process, cut the manual steps and wire it into the tools you already use. Flows that run 24/7 without anyone babysitting them."
            link={{ slug: "automation", label: "Explore automation" }}
          />
          <Cell
            visual={<VoiceVisual />}
            title="AI voice agents"
            body="Agents that answer, qualify and book meetings on the phone, and log every call to your CRM."
          />
          <Cell
            visual={<OutboundVisual />}
            title="Outbound campaigns"
            body="Enriched lead lists and personalised sequences that follow up on schedule, every time."
          />
          <Cell
            className="md:col-span-2"
            visual={<CrmAnimation />}
            title="Custom CRM builds"
            body="Your stages, your fields, your rules. A CRM shaped around how your team sells, with no bloated seats or features you never touch."
            link={{ slug: "crm", label: "Explore CRM" }}
          />

          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="grid items-center overflow-hidden rounded-2xl liquid-glass border border-neutral-200/70 dark:border-white/10 dark:!bg-white/[0.03] md:col-span-3 md:grid-cols-2"
          >
            <div className="p-6 md:p-10">
              <h3 className="text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">
                Plugs into the tools you already use.
              </h3>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
                Google Workspace, Notion, WhatsApp, OpenAI and hundreds more through n8n. No
                rip-and-replace. Your data just starts moving.
              </p>
            </div>
            <div className="border-t border-neutral-200 md:border-t-0 md:border-l dark:border-white/10">
              <IntegrationsFlow />
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
