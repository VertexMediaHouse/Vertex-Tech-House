import * as React from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, PhoneCall } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ServiceSlug } from "@/components/services/ServicePage";
import { Avatar, Fit } from "@/components/showcase/kit";
import { WebsiteApp } from "@/components/showcase/WebsiteApp";
import { AutomationAnimation } from "../animation/AutomationAnimation";
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
  link?: { slug: ServiceSlug; label: string };
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

/** A light-mode browser window peeking up from the bottom of a card, like the live demos. */
function Window({
  host,
  className,
  children,
}: {
  host: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      inert
      className={cn(
        "absolute top-6 left-6 overflow-hidden rounded-t-xl bg-white ring-1 ring-black/10 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.35)] dark:ring-white/15",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-neutral-200 bg-neutral-100 px-3 py-1.5">
        <span className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        </span>
        <span className="mx-auto truncate rounded bg-white px-2 py-0.5 text-[10px] text-neutral-500">
          {host}
        </span>
        <span className="w-6" />
      </div>
      {children}
    </div>
  );
}

const noop = () => {};

/** The live demo site from /services, touring itself. Never narrower than 22rem, so it always fills the card. */
function WebsiteVisual() {
  return (
    <Window host="northline.studio" className="w-[max(calc(100%-3rem),22rem)]">
      <Fit>
        <WebsiteApp onPath={noop} />
      </Fit>
    </Window>
  );
}

const crmStats = [
  ["Pipeline value", "£1.28M", "+12.4% vs Aug"],
  ["Open deals", "38", "+6 this week"],
  ["Won this quarter", "£412k", "+£86k this week"],
];
const pipeline = [
  { stage: "Enquiry", deals: 16, value: "£452k", bar: "bg-sky-500" },
  { stage: "Consultation", deals: 13, value: "£418k", bar: "bg-amber-500" },
  { stage: "Proposal", deals: 9, value: "£410k", bar: "bg-violet-500" },
  { stage: "Won", deals: 6, value: "£204k", bar: "bg-emerald-500" },
];
const newLeads = [
  { name: "Sofia Alvarez", project: "Hotel lobby, Casa Verde", source: "Referral", score: 91 },
  { name: "Daniel Park", project: "Loft conversion", source: "Website", score: 86 },
  { name: "Priya Shah", project: "Kitchen & dining", source: "Instagram", score: 72 },
  { name: "Marcus Reid", project: "Townhouse refurbishment", source: "Phone", score: 64 },
];

/** The demo CRM's dashboard in one glance: stats, the pipeline by stage, and the newest leads. */
function CrmVisual() {
  return (
    <Window host="crm.northline.app" className="right-6 bottom-0">
      <div className="h-full space-y-2 bg-neutral-50 p-3 text-neutral-900">
        <div className="grid grid-cols-3 gap-2">
          {crmStats.map(([label, value, delta]) => (
            <div key={label} className="rounded-lg border border-neutral-200 bg-white px-2.5 py-2">
              <div className="truncate text-[10px] text-neutral-500">{label}</div>
              <div className="text-[15px] font-semibold tracking-tight">{value}</div>
              <div className="truncate text-[9px] font-medium text-emerald-600">{delta}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-neutral-200 bg-white p-2.5">
            <div className="mb-2 text-[11px] font-medium">Pipeline</div>
            <ul className="space-y-1.5">
              {pipeline.map((p, i) => (
                <li key={p.stage} className="text-[10px]">
                  <div className="flex justify-between text-neutral-500">
                    <span>{p.stage}</span>
                    <span>
                      <span className="font-medium text-neutral-900">{p.deals}</span>
                      <span className="max-sm:hidden"> · {p.value}</span>
                    </span>
                  </div>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className={cn("mt-0.5 block h-1.5 origin-left rounded-full", p.bar)}
                    style={{ width: `${(p.deals / pipeline[0].deals) * 100}%` }}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-2.5">
            <div className="mb-2 flex items-center justify-between text-[11px] font-medium">
              New leads
              <span className="rounded-full bg-neutral-100 px-1.5 text-[9px] text-neutral-500">
                12
              </span>
            </div>
            <ul className="space-y-1.5">
              {newLeads.map((l, i) => (
                <motion.li
                  key={l.name}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <Avatar name={l.name} size={20} />
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block truncate text-[10px] font-medium">{l.name}</span>
                    <span className="block truncate text-[9px] text-neutral-500 max-sm:hidden">
                      {l.project} · {l.source}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-1.5 text-[9px] font-semibold text-emerald-700">
                    {l.score}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Window>
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
            visual={<WebsiteVisual />}
            title="Client websites"
            body="Fast, SEO-ready sites built around how your customers enquire. Every form, booking and chat lands straight in your CRM."
            link={{ slug: "website", label: "Explore websites" }}
          />
          <Cell
            className="md:col-span-2"
            visual={<CrmVisual />}
            title="Custom CRM builds"
            body="Your stages, your fields, your rules. A CRM shaped around how your team sells, with no bloated seats or features you never touch."
            link={{ slug: "crm", label: "Explore CRM" }}
          />
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
