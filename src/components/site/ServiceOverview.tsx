import type * as React from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, CircleDollarSign, Package, Truck, Users } from "lucide-react";
import { serviceList, type ServiceSlug } from "@/components/services/ServicePage";
import { FeatureCard } from "./WhyChooseUs";
import { SectionGlow } from "./SectionGlow";

/* Home "Services": the four service pages as tall cards, each topped with a slanted reel of its work. */

/** Rows of tiles drifting in alternating directions on a tilted plane, fading into the card. */
function SlantedReel({ rows, speed = 28 }: { rows: React.ReactNode[][]; speed?: number }) {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      <div className="absolute -inset-x-1/2 -inset-y-10 flex flex-col justify-center gap-3 -rotate-[10deg]">
        {rows.map((tiles, r) => (
          <motion.div
            key={r}
            className="flex w-max gap-3"
            animate={{ x: r % 2 ? ["-50%", "0%"] : ["0%", "-50%"] }}
            transition={{ duration: speed + r * 6, ease: "linear", repeat: Infinity }}
          >
            {[...tiles, ...tiles].map((t, i) => (
              <div key={i} className="shrink-0">
                {t}
              </div>
            ))}
          </motion.div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/40 to-white dark:from-black/10 dark:via-black/40 dark:to-[#0a0a0a]" />
    </div>
  );
}

const tile = "rounded-lg bg-white dark:bg-neutral-900 ring-1 ring-black/10 dark:ring-white/10";

const done = (text: string) => (
  <div className={`flex h-12 w-48 items-center gap-2 px-3 ${tile}`}>
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
      <Check className="h-3 w-3" strokeWidth={3} />
    </span>
    <span className="truncate text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
      {text}
    </span>
  </div>
);
const site = (img: string) => (
  <div className={`relative h-20 w-36 overflow-hidden ${tile}`}>
    <img src={`/assets/showcase/${img}.jpg`} alt="" className="h-full w-full object-cover" />
    <span className="absolute inset-x-0 top-0 flex gap-0.5 bg-white/90 px-1.5 py-1">
      <span className="h-1 w-1 rounded-full bg-[#ff5f57]" />
      <span className="h-1 w-1 rounded-full bg-[#febc2e]" />
      <span className="h-1 w-1 rounded-full bg-[#28c840]" />
    </span>
  </div>
);
const stat = (Icon: typeof Users, value: string, label: string) => (
  <div className={`flex h-16 w-40 items-center gap-2.5 px-3 ${tile}`}>
    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#ff4d31]/15 text-[#ff4d31]">
      <Icon className="h-4 w-4" />
    </span>
    <span>
      <span className="block text-sm font-bold text-neutral-900 dark:text-white">{value}</span>
      <span className="block text-[10px] text-neutral-500">{label}</span>
    </span>
  </div>
);
const deal = (name: string, value: string, stage: string) => (
  <div className={`flex h-16 w-44 items-center gap-2.5 px-3 ${tile}`}>
    <img
      src={`/assets/showcase/people/${name.toLowerCase().replace(" ", "-")}.jpg`}
      alt=""
      className="h-8 w-8 rounded-full object-cover"
    />
    <span className="min-w-0">
      <span className="block truncate text-xs font-bold text-neutral-900 dark:text-white">
        {name}
      </span>
      <span className="block text-[10px] text-neutral-500">
        {value} · {stage}
      </span>
    </span>
  </div>
);

const reels: Record<ServiceSlug, React.ReactNode[][]> = {
  automation: [
    ["Lead qualified · reply sent", "142 leads synced to CRM", "Meeting booked", "Report sent"].map(
      done,
    ),
    ["Invoice reminder sent", "Call back booked · Tue", "Deal created", "Answered by AI agent"].map(
      done,
    ),
    [
      "Form reply sent in 4 min",
      "Contact synced to Sheets",
      "Follow-up email sent",
      "WhatsApp reminder sent",
    ].map(done),
    [
      "Invoice paid · receipt sent",
      "Call summary logged",
      "Task assigned to Sarah",
      "Weekly report delivered",
    ].map(done),
  ],
  website: [
    ["hero", "harbor", "olive", "linen"].map(site),
    ["cedar", "maple", "ashford", "studio"].map(site),
    ["olive", "studio", "hero", "maple"].map(site),
    ["linen", "ashford", "harbor", "cedar"].map(site),
  ],
  erp: [
    [
      stat(CircleDollarSign, "£184,240", "revenue this month"),
      stat(Package, "23", "open orders"),
      stat(Truck, "PO-4471", "raised automatically"),
      stat(Users, "Payroll", "paid on time"),
    ],
    [
      stat(Package, "£212,480", "stock value"),
      stat(CircleDollarSign, "Invoice sent", "from order SO-1048"),
      stat(Truck, "Delivered", "SO-1044"),
      stat(Check, "Approved", "purchase order"),
    ],
    [
      stat(Users, "42 staff", "rota published"),
      stat(Truck, "Dispatched", "SO-1051"),
      stat(CircleDollarSign, "£38,920", "owed to you"),
      stat(Package, "Low stock", "reorder raised"),
    ],
    [
      stat(Check, "VAT return", "ready to file"),
      stat(Package, "1,284", "items in stock"),
      stat(CircleDollarSign, "Paid", "INV-2207"),
      stat(Truck, "PO-4482", "supplier confirmed"),
    ],
  ],
  crm: [
    [
      deal("Daniel Park", "£44,000", "Enquiry"),
      deal("Aisha Khan", "£42,000", "Consultation"),
      deal("Omar Farouk", "£124,000", "Proposal"),
      deal("Nina Rossi", "£86,500", "Won"),
    ],
    [
      deal("Priya Shah", "£28,000", "Enquiry"),
      deal("Jonah Weiss", "£68,000", "Consultation"),
      deal("Grace Liu", "£19,800", "Consultation"),
      deal("Ben Carter", "£23,400", "Won"),
    ],
    [
      deal("Emily Ward", "£31,500", "Proposal"),
      deal("Leo Martins", "£52,000", "Enquiry"),
      deal("Sofia Alvarez", "£77,200", "Consultation"),
      deal("Marcus Reid", "£16,900", "Won"),
    ],
    [
      deal("Hannah Cole", "£39,000", "Consultation"),
      deal("Richard Hale", "£145,000", "Proposal"),
      deal("Tom Becker", "£24,600", "Enquiry"),
      deal("Sarah Mills", "£58,300", "Won"),
    ],
  ],
};

export function ServiceOverview() {
  return (
    <section
      id="services"
      className="relative w-full overflow-hidden px-4 sm:px-6 md:px-8 py-12 md:py-20 bg-white dark:bg-black"
    >
      <SectionGlow />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center mb-8 md:mb-12">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] backdrop-blur-md px-3 py-1 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff4d31] animate-pulse" />
            Services
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-neutral-950 dark:text-white"
          >
            Four services. <span className="text-[#ff4d31]">One system.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg md:text-xl text-neutral-600 dark:text-neutral-400 font-medium"
          >
            Pick one, or let us build the whole thing. Every part is made to talk to the rest.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceList.map((s, i) => (
            <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }} className="block">
              <FeatureCard
                icon={s.icon}
                title={s.name}
                description={s.summary}
                index={i}
                className="h-full min-h-[580px]"
                top={<SlantedReel rows={reels[s.slug]} />}
              >
                <span className="mt-auto pt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#ff4d31]">
                  Explore{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </FeatureCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
