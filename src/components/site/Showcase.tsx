import { useState } from "react";
import { Link } from "@tanstack/react-router";
import type * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BatteryFull,
  Boxes,
  ArrowRight,
  Check,
  Globe,
  Kanban,
  Lock,
  MousePointerClick,
  Signal,
  Wifi,
  Workflow,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import type { ServiceSlug } from "@/components/services/ServicePage";
import { SectionGlow } from "./SectionGlow";
import { Fit, type ScreenProps } from "@/components/showcase/kit";
import { WebsiteApp } from "@/components/showcase/WebsiteApp";
import { ErpApp } from "@/components/showcase/ErpApp";
import { CrmApp } from "@/components/showcase/CrmApp";
import { AutomationApp } from "@/components/showcase/AutomationApp";

/**
 * Portfolio ("our edge"): one laptop, four builds, each a working app you can click
 * through (screens live in components/showcase). On phones it becomes a phone frame showing
 * each app's mobile layout. Automation uses real n8n screenshots.
 * TODO(content): Website/ERP/CRM are demo builds for a sample client ("Northline"); swap in
 * real client work when it can be shown.
 */

type Project = {
  key: ServiceSlug;
  label: string;
  icon: React.ElementType;
  host: string;
  title: string;
  summary: string;
  points: string[];
  stack: string[];
  Screen: (props: ScreenProps) => React.ReactElement;
};

/* ---------------- data ---------------- */

const projects: Project[] = [
  {
    key: "website",
    label: "Website",
    icon: Globe,
    host: "northline.studio",
    title: "Websites that feed your pipeline",
    summary:
      "Fast, SEO-ready sites where every enquiry, booking and chat lands in your CRM, tagged and assigned.",
    points: [
      "Built for speed and search from day one",
      "Forms and bookings flow straight into the CRM",
      "Content you can edit yourself",
    ],
    stack: ["React", "Tailwind", "CMS", "Cal.com"],
    Screen: WebsiteApp,
  },
  {
    key: "erp",
    label: "ERP",
    icon: Boxes,
    host: "ops.northline.app",
    title: "An ERP for the back office",
    summary:
      "Orders, inventory, purchasing and invoicing in one system, replacing the spreadsheets that run operations.",
    points: [
      "Live stock levels with automatic purchase orders",
      "Orders become invoices without re-typing",
      "Role-based access for every team",
    ],
    stack: ["Postgres", "n8n", "Stripe", "Google Workspace"],
    Screen: ErpApp,
  },
  {
    key: "crm",
    label: "CRM",
    icon: Kanban,
    host: "crm.northline.app",
    title: "A CRM built around how you sell",
    summary:
      "Your stages, fields and rules. Leads from forms, calls and DMs land in one pipeline and get a reply in minutes.",
    points: [
      "Leads captured, scored and routed automatically",
      "Follow-ups that never get forgotten",
      "Live pipeline and revenue views",
    ],
    stack: ["WhatsApp", "Gmail", "Calendar", "n8n"],
    Screen: CrmApp,
  },
  {
    key: "automation",
    label: "Automation",
    icon: Workflow,
    host: "n8n.vertextechhouse.com",
    title: "Construction automation pipeline",
    summary:
      "One n8n workflow that runs a construction firm's admin: work orders in, projects synced, leads found and texted.",
    points: [
      "AI agent pulls work orders from email into Sheets",
      "Project details and photos synced to CompanyCam",
      "Leads scraped with Apify and texted via GoHighLevel",
    ],
    stack: ["n8n", "OpenAI", "Gmail", "Sheets", "Apify", "GoHighLevel"],
    Screen: AutomationApp,
  },
];

/* ---------------- device ---------------- */

/** A laptop, or a phone on small screens, running a live app with its address bar. */
export function Device({
  host,
  path,
  phone,
  children,
}: {
  host: string;
  path: string;
  phone: boolean;
  children: React.ReactNode;
}) {
  const address = (
    <>
      <Lock className="h-3 w-3 shrink-0" />
      <span className="truncate">
        {host}
        <span className="text-neutral-400">{path === "/" ? "" : path}</span>
      </span>
    </>
  );
  const screen = <Fit phone={phone}>{children}</Fit>;

  return (
    <>
      {phone ? (
        <div className="mx-auto w-full max-w-[330px] rounded-[46px] bg-neutral-900 p-[9px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)] ring-1 ring-black/10 dark:ring-white/15">
          <div className="overflow-hidden rounded-[38px] bg-white">
            <div className="relative flex h-10 items-center justify-between px-7 text-[12px] font-semibold text-neutral-900">
              <span>9:41</span>
              <span className="absolute top-2.5 left-1/2 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-neutral-900" />
              <span className="flex items-center gap-1">
                <Signal className="h-3.5 w-3.5" />
                <Wifi className="h-3.5 w-3.5" />
                <BatteryFull className="h-4 w-4" />
              </span>
            </div>
            <div className="px-3 pb-2">
              <div className="flex items-center justify-center gap-1.5 rounded-xl bg-neutral-100 px-3 py-1.5 text-[11px] text-neutral-600">
                {address}
              </div>
            </div>
            {screen}
            <div className="flex h-6 items-center justify-center">
              <span className="h-1 w-28 rounded-full bg-neutral-900" />
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* lid: black bezel with a camera, aluminium edge */}
          <div className="relative rounded-t-[20px] rounded-b-[4px] bg-neutral-950 p-[10px] pt-[20px] shadow-[0_0_0_1.5px_#c8cbd0,0_40px_70px_-40px_rgba(0,0,0,0.5)] dark:shadow-[0_0_0_1.5px_#3a3a3d,0_40px_70px_-40px_rgba(0,0,0,0.9)]">
            <span className="absolute top-[7px] left-1/2 h-[6px] w-[6px] -translate-x-1/2 rounded-full bg-[#1d2330] ring-[1.5px] ring-neutral-800" />
            <div className="overflow-hidden rounded-[5px] bg-white">
              {/* browser chrome (the laptop runs in light mode, like the apps) */}
              <div className="flex items-center gap-3 border-b border-neutral-200 bg-neutral-100 px-3 py-2">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="mx-auto flex max-w-[70%] min-w-0 items-center gap-1.5 rounded-md bg-white px-3 py-1 text-[11px] text-neutral-500">
                  {address}
                </div>
                <div className="w-[42px]" />
              </div>
              {screen}
            </div>
          </div>
          {/* base: a touch wider than the lid, with the thumb notch */}
          <div className="relative -mx-[3.5%] h-[16px] rounded-t-[3px] rounded-b-[18px] bg-gradient-to-b from-[#eceef0] via-[#cdd0d4] to-[#a4a8ae] shadow-[0_18px_30px_-18px_rgba(0,0,0,0.45)] dark:from-[#55565a] dark:via-[#343538] dark:to-[#1c1c1f]">
            <span className="absolute top-0 left-1/2 h-[6px] w-[15%] -translate-x-1/2 rounded-b-[10px] bg-gradient-to-b from-[#aeb2b7] to-[#d5d8db] dark:from-[#1c1c1f] dark:to-[#3a3b3e]" />
          </div>
        </div>
      )}
      <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
        <MousePointerClick className="h-3.5 w-3.5" />
        It's live. {phone ? "Tap" : "Click"} around, scroll and explore.
      </p>
    </>
  );
}

/** One project's app in its device, on its own (used by the service pages). */
export function LiveApp({ app }: { app: ServiceSlug }) {
  const p = projects.find((x) => x.key === app)!;
  const [path, setPath] = useState("/");
  const phone = useIsMobile();
  return (
    <Device host={p.host} path={path} phone={phone}>
      <p.Screen onPath={setPath} />
    </Device>
  );
}

/* ---------------- section ---------------- */

export function Showcase() {
  const [active, setActive] = useState(0);
  const [path, setPath] = useState("/");
  const phone = useIsMobile();
  const p = projects[active];

  return (
    <section
      id="portfolio"
      className="relative w-full overflow-hidden bg-white px-4 py-12 sm:px-6 md:px-8 md:py-20 dark:bg-black"
    >
      <SectionGlow />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200/70 bg-white/60 px-3 py-1 text-xs font-semibold tracking-wider text-neutral-600 uppercase backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff4d31]" />
            Portfolio
          </span>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-neutral-950 md:text-5xl lg:text-7xl dark:text-white">
            Our edge, <span className="text-[#ff4d31]">in production.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg font-medium text-neutral-600 md:text-xl dark:text-neutral-400">
            Websites, ERPs, CRMs and automations we've designed, built and shipped.
          </p>

          {/* tabs */}
          <div
            role="tablist"
            className="liquid-glass mt-10 inline-flex flex-wrap justify-center gap-1 rounded-2xl border border-neutral-200/70 p-1 dark:border-white/10 dark:!bg-white/[0.03]"
          >
            {projects.map((x, i) => (
              <button
                key={x.key}
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={cn(
                  "relative flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors sm:px-4 sm:text-sm",
                  i === active
                    ? "text-white dark:text-neutral-950"
                    : "text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white",
                )}
              >
                {i === active && (
                  <motion.span
                    layoutId="showcase-tab"
                    className="absolute inset-0 rounded-xl bg-neutral-950 dark:bg-white"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <x.icon className="relative hidden h-4 w-4 sm:block" />
                <span className="relative">{x.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* details */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={p.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="order-2 lg:order-1 lg:col-span-4"
            >
              <span className="text-xs font-semibold tracking-wider text-[#ff4d31] uppercase">
                {p.label}
              </span>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl dark:text-white">
                {p.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
                {p.summary}
              </p>
              <ul className="mt-6 space-y-3">
                {p.points.map((pt) => (
                  <li
                    key={pt}
                    className="flex gap-3 text-[15px] text-neutral-800 dark:text-neutral-200"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ff4d31]/10 text-[#ff4d31]">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="liquid-glass rounded-lg border border-neutral-200/70 px-2.5 py-1 font-mono text-[11px] text-neutral-600 dark:border-white/10 dark:!bg-white/[0.03] dark:text-neutral-400"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <Link
                to="/services/$slug"
                params={{ slug: p.key }}
                className="group mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-950 transition-colors hover:text-[#ff4d31] dark:text-white"
              >
                Explore the {p.label === "Website" ? "website" : p.label} service
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* a laptop, or a phone on small screens */}
          <div className="order-1 lg:order-2 lg:col-span-8">
            <Device host={p.host} path={path} phone={phone}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={p.key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="h-full w-full"
                >
                  <p.Screen onPath={setPath} />
                </motion.div>
              </AnimatePresence>
            </Device>
          </div>
        </div>
      </div>
    </section>
  );
}
