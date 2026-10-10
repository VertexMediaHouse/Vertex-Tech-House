import { useEffect, useRef, useState } from "react";
import type * as React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  Check,
  CircleAlert,
  Database,
  GitBranch,
  Globe,
  Lock,
  Mail,
  Phone as PhoneIcon,
  Sheet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandIcons } from "@/components/animation/BrandIcons";
export { LiveApp as HeroApp } from "@/components/site/Showcase";

/* Visual building blocks for the service pages, following Vertex Media House's service pages. */

/* ---------- section wrapper ---------- */

export function SectionWrap({
  id,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="relative w-full scroll-mt-24 overflow-clip px-4 sm:px-6 md:px-8 py-12 md:py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300/60 dark:via-white/10 to-transparent"
      />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] backdrop-blur-md px-3 py-1 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff4d31] animate-pulse" />
            {eyebrow}
          </span>
          <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-950 dark:text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-5 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

/* ---------- hero: the live app with floating chips ---------- */

/** Drifts to a new random spot within ±DRIFT px every few seconds. */
const DRIFT = 14;
function Chip({ className, children }: { className?: string; children: React.ReactNode }) {
  const [to, setTo] = useState({ x: 0, y: 0, d: 3 });
  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    const move = () => {
      const d = 2 + Math.random() * 2;
      setTo({ x: (Math.random() * 2 - 1) * DRIFT, y: (Math.random() * 2 - 1) * DRIFT, d });
      id = setTimeout(move, d * 1000);
    };
    move();
    return () => clearTimeout(id);
  }, []);
  return (
    <motion.div
      animate={{ x: to.x, y: to.y }}
      transition={{ duration: to.d, ease: "easeInOut" }}
      className={cn(
        "pointer-events-none absolute z-20 hidden md:block liquid-glass rounded-2xl border border-white/30 dark:border-white/10 p-3 shadow-xl",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

function ChipBody({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff4d31]/15 text-[#ff4d31] [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
      <span>
        <span className="block text-sm font-bold text-neutral-900 dark:text-white">{value}</span>
        <span className="block text-[11px] text-neutral-500 dark:text-neutral-400">{label}</span>
      </span>
    </div>
  );
}

/* ---------- "How it works": scroll-driven steps ---------- */

// Where a pinned "How it works" card sits below the fixed navbar.
export const PIN_TOP = 112;
// Page scroll per step, in viewport heights. Lower = less scrolling to get through.
const STEP_VH = 40;

/**
 * Scroll-driven steps: put `track` on a tall wrapper and make the card inside it
 * sticky at PIN_TOP. Scrolling through the wrapper advances `stage`.
 */
function useScrollStages(count: number) {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: track,
    offset: [`start ${PIN_TOP}px`, "end end"],
  });
  const [stage, setStage] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) =>
    setStage(Math.min(count - 1, Math.floor(v * count))),
  );
  // Scroll the page to the middle of step i.
  const pick = (i: number) => {
    const el = track.current;
    if (!el) return;
    const start = el.getBoundingClientRect().top + window.scrollY - PIN_TOP;
    const end = start + el.offsetHeight - (window.innerHeight - PIN_TOP);
    window.scrollTo({ top: start + ((i + 0.5) / count) * (end - start) });
  };
  return { track, stage, pick, progress: scrollYProgress };
}

/** Fills as the page scrolls through step `i`. */
function StepBar({ progress, i, n }: { progress: MotionValue<number>; i: number; n: number }) {
  const scaleX = useTransform(progress, [i / n, (i + 1) / n], [0, 1]);
  return <motion.span style={{ scaleX }} className="block h-full bg-[#ff4d31] origin-left" />;
}

export type Step = { name: string; text: string };

/** Pinned card: the steps on the left, and on the right what that step produces. */
export function StepProcess({
  title,
  subtitle,
  steps,
  stageView: StageView,
}: {
  title: React.ReactNode;
  subtitle?: string;
  steps: Step[];
  stageView: (props: { stage: number }) => React.ReactElement;
}) {
  const n = steps.length;
  const { track, stage, pick, progress } = useScrollStages(n);

  return (
    <SectionWrap id="how-it-works" eyebrow="How it works" title={title} subtitle={subtitle}>
      <div ref={track} style={{ height: `${n * STEP_VH}vh` }}>
        <div
          className="sticky rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#111113] shadow-2xl shadow-black/20 p-4 md:p-6 overflow-hidden"
          style={{ top: PIN_TOP }}
        >
          <div className="grid md:grid-cols-12 items-center gap-6">
            <ol className="md:col-span-5 grid grid-cols-2 md:grid-cols-1 gap-1 order-last md:order-first">
              {steps.map((st, i) => {
                const on = i === stage;
                return (
                  <li key={st.name}>
                    <button
                      onClick={() => pick(i)}
                      aria-current={on ? "step" : undefined}
                      className={cn(
                        "relative flex w-full gap-3 overflow-hidden rounded-xl px-3 py-3 text-left transition-colors",
                        on && "bg-black/[0.04] dark:bg-white/[0.05]",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                          i < stage && "bg-[#ff4d31]/15 text-[#ff4d31]",
                          on && "bg-[#ff4d31] text-white",
                          i > stage && "bg-black/5 dark:bg-white/10 text-neutral-500",
                        )}
                      >
                        {i < stage ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={cn(
                            "block font-bold leading-tight",
                            on ? "text-neutral-950 dark:text-white" : "text-neutral-500",
                          )}
                        >
                          {st.name}
                        </span>
                        {/* long processes only describe the current step, so the card fits the screen */}
                        <span
                          className={cn(
                            "mt-0.5 text-sm leading-snug text-neutral-600 dark:text-neutral-400",
                            n <= 6 || on ? "hidden md:block" : "hidden",
                          )}
                        >
                          {st.text}
                        </span>
                      </span>
                      <span className="absolute inset-x-3 bottom-0 h-0.5">
                        <StepBar progress={progress} i={i} n={n} />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="md:col-span-7 relative">
              <div className="absolute inset-0 bg-[radial-gradient(closest-side,rgba(255,77,49,0.16),transparent)]" />
              <div className="relative h-[300px] md:h-[400px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={stage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0"
                  >
                    <StageView stage={stage} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrap>
  );
}

/* ---------- stage pieces ---------- */

/** A small app window for a stage. */
function Win({
  title,
  status,
  children,
  className,
}: {
  title: string;
  status?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-black/10 bg-white shadow-xl dark:border-white/10 dark:bg-neutral-900">
      <div className="flex items-center gap-2 border-b border-black/5 px-3 py-2 dark:border-white/5">
        <span className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        </span>
        <span className="truncate text-[11px] font-semibold text-neutral-600 dark:text-neutral-300">
          {title}
        </span>
        <span className="ml-auto">{status}</span>
      </div>
      <div
        className={cn("relative min-h-0 flex-1 p-3 md:p-5", className)}
        style={{
          backgroundImage: "radial-gradient(circle, rgba(128,128,128,.18) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Pill({
  tone = "green",
  children,
}: {
  tone?: "green" | "orange" | "grey";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold",
        tone === "green" && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
        tone === "orange" && "bg-[#ff4d31]/15 text-[#ff4d31]",
        tone === "grey" && "bg-black/5 text-neutral-500 dark:bg-white/10 dark:text-neutral-400",
      )}
    >
      {children}
    </span>
  );
}

/** Grows a bar to `w`% after `delay` seconds. */
function Bar({ w, delay = 0, className }: { w: number; delay?: number; className?: string }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${w}%` }}
        transition={{ delay, duration: 0.8, ease: "easeOut" }}
        className={cn("h-full rounded-full bg-[#ff4d31]", className)}
      />
    </div>
  );
}

const card =
  "rounded-lg border border-black/10 bg-white px-2.5 py-2 text-[11px] shadow-sm md:text-xs dark:border-white/10 dark:bg-neutral-800";

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-black/5 bg-white p-1 dark:border-transparent [&>svg]:h-full [&>svg]:w-full">
      {children}
    </span>
  );
}

/** A person from the demo client's team. */
function Face({ who, className }: { who: string; className?: string }) {
  return (
    <img
      src={`/assets/showcase/people/${who}.jpg`}
      alt=""
      className={cn("h-6 w-6 shrink-0 rounded-full object-cover", className)}
    />
  );
}

/** Rows that slide in one after another. On phones only the first `max` show. */
function Rows({
  children,
  gap = "gap-1.5 md:gap-2",
  max,
}: {
  children: React.ReactNode[];
  gap?: string;
  max?: number;
}) {
  return (
    <div className={cn("flex flex-col", gap)}>
      {children.map((c, i) => (
        <motion.div
          key={i}
          className={cn(max !== undefined && i >= max && "max-md:hidden")}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.12 }}
        >
          {c}
        </motion.div>
      ))}
    </div>
  );
}

const muted = "text-neutral-500 dark:text-neutral-400";
const strong = "font-semibold text-neutral-900 dark:text-white";

/* ---------- automation: one enquiry workflow, from Monday's admin to running on its own ---------- */

const admin: [string, string][] = [
  ["Copy 23 web enquiries into the spreadsheet", "1h 40m"],
  ["Reply to each enquiry by hand", "2h 10m"],
  ["Follow up anyone who went quiet", "1h 30m"],
  ["Chase 6 unpaid invoices", "50m"],
  ["Build the weekly report", "1h 20m"],
];

const spec: [string, string][] = [
  ["When", "A form is submitted on northline.studio"],
  ["Then", "Look up the company and the project budget"],
  ["Then", "Create the lead in the CRM and assign Sarah"],
  ["Then", "Reply on WhatsApp within a minute"],
  ["If", "No reply in 2 days → send a follow-up"],
  ["If", "Number invalid → reply by email instead"],
];

// n8n-style canvas: node centres in % of the canvas
const nodes = [
  { name: "Form submitted", icon: <Globe className="text-[#5b8bd6]" />, x: 8, y: 48 },
  { name: "Enrich", icon: <BrandIcons.openai />, x: 29, y: 48 },
  { name: "Create lead", icon: <Database className="text-[#ff4d31]" />, x: 50, y: 48 },
  { name: "Phone valid?", icon: <GitBranch className="text-[#e5a50a]" />, x: 70, y: 48 },
  { name: "WhatsApp", icon: <BrandIcons.whatsapp />, x: 91, y: 24 },
  { name: "Gmail", icon: <Mail className="text-[#ea4335]" />, x: 91, y: 72 },
];
const edges: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [3, 5],
];

function N8nCanvas() {
  return (
    <div className="relative h-full">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {edges.map(([a, b], i) => {
          const A = nodes[a];
          const B = nodes[b];
          const mx = (A.x + B.x) / 2;
          return (
            <motion.path
              key={i}
              d={`M${A.x} ${A.y} C${mx} ${A.y} ${mx} ${B.y} ${B.x} ${B.y}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
              className="text-neutral-300 dark:text-neutral-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.15, duration: 0.4 }}
            />
          );
        })}
      </svg>
      {nodes.map((n, i) => (
        <div
          key={n.name}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-[10px] border border-black/15 bg-white p-2 shadow-sm md:h-12 md:w-12 md:p-2.5 dark:border-white/15 dark:bg-neutral-800 [&>svg]:h-full [&>svg]:w-full">
            {n.icon}
            {/* the test execution reaches each node in turn */}
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9 + i * 0.2, type: "spring", stiffness: 400, damping: 16 }}
              className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white"
            >
              <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
            </motion.span>
          </div>
          <span className="mt-1 whitespace-nowrap text-[9px] font-medium text-neutral-600 md:text-[11px] dark:text-neutral-300">
            {n.name}
          </span>
        </div>
      ))}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2"
      >
        <span className="rounded-md bg-[#ff6d5a] px-2.5 py-1 text-[10px] font-semibold text-white md:text-[11px]">
          Execute workflow
        </span>
        <Pill>24 of 24 test runs passed</Pill>
      </motion.div>
    </div>
  );
}

const runs: [string, string, string, string][] = [
  ["priya-shah", "Priya Shah", "Replied on WhatsApp", "0.8s"],
  ["tom-becker", "Tom Becker", "Follow-up sent", "1.1s"],
  ["daniel-park", "Daniel Park", "Replied on WhatsApp", "0.7s"],
  ["grace-liu", "Grace Liu", "Replied by email", "1.4s"],
  ["aisha-khan", "Aisha Khan", "Replied on WhatsApp", "0.9s"],
];

export function AutomationStages({ stage }: { stage: number }) {
  if (stage === 0)
    return (
      <Win title="Sarah's Monday" status={<Pill tone="orange">7h 30m of admin</Pill>}>
        <div className="mb-2 flex items-center gap-2 md:mb-3">
          <Face who="sarah-mills" className="h-7 w-7" />
          <span className="text-[11px] md:text-xs">
            <span className={cn("block", strong)}>Sarah Mills</span>
            <span className={muted}>Studio manager · to do</span>
          </span>
        </div>
        <Rows>
          {admin.map(([t, time]) => (
            <div key={t} className={cn(card, "flex items-center gap-2 py-1.5 md:py-2")}>
              <span className="h-3.5 w-3.5 shrink-0 rounded border border-black/25 dark:border-white/25" />
              <span className="min-w-0 flex-1 truncate text-neutral-800 dark:text-neutral-200">
                {t}
              </span>
              <span className={cn("shrink-0 font-mono text-[10px]", muted)}>{time}</span>
            </div>
          ))}
        </Rows>
      </Win>
    );
  if (stage === 1)
    return (
      <Win title="Workflow spec · New enquiry" status={<Pill tone="grey">Draft v2</Pill>}>
        <div
          className={cn(card, "flex h-full flex-col overflow-hidden p-3 md:justify-center md:p-6")}
        >
          <p className={cn("text-xs md:text-base", strong)}>New enquiry → reply in a minute</p>
          <p className={cn("mt-0.5 text-[10px] md:text-[11px]", muted)}>
            Agreed with Sarah · replaces 3h 40m of Monday's list
          </p>
          <Rows gap="mt-2 gap-1 md:mt-4 md:gap-2.5" max={4}>
            {spec.map(([k, v], i) => (
              <div key={i} className="flex gap-2 text-[11px] md:text-sm">
                <span
                  className={cn(
                    "w-10 shrink-0 font-mono text-[10px] uppercase",
                    k === "If" ? "text-amber-500" : "text-[#ff4d31]",
                  )}
                >
                  {k}
                </span>
                <span className="text-neutral-800 dark:text-neutral-200">{v}</span>
              </div>
            ))}
          </Rows>
        </div>
      </Win>
    );
  if (stage === 2)
    return (
      <Win title="n8n · New enquiry" status={<Pill tone="grey">Testing</Pill>}>
        <N8nCanvas />
      </Win>
    );
  if (stage === 3)
    return (
      <Win title="n8n · Executions" status={<Pill>Live</Pill>}>
        <Rows max={4}>
          {runs.map(([who, name, what, time]) => (
            <div key={who} className={cn(card, "flex items-center gap-2 py-1.5 md:py-2")}>
              <Face who={who} />
              <span className="min-w-0 flex-1">
                <span className={cn("block truncate", strong)}>{name}</span>
                <span className={cn("block truncate", muted)}>{what}</span>
              </span>
              <span className={cn("shrink-0 font-mono text-[10px]", muted)}>{time}</span>
              <Pill>Succeeded</Pill>
            </div>
          ))}
        </Rows>
      </Win>
    );
  return (
    <Win title="Inbox" status={<Pill tone="grey">Monday 08:00</Pill>}>
      <div className={cn(card, "flex h-full flex-col p-3 md:p-4")}>
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-950 text-[10px] font-bold text-white dark:bg-white dark:text-neutral-950">
            V
          </span>
          <span className="min-w-0 text-[11px] md:text-xs">
            <span className={cn("block", strong)}>Your weekly automation report</span>
            <span className={muted}>Vertex Tech House → Sarah Mills</span>
          </span>
        </div>
        <div className="mt-3 grid flex-1 grid-cols-2 gap-2 md:mt-4">
          {[
            ["312", "enquiries handled"],
            ["0", "failed runs"],
            ["0.9s", "average reply time"],
            ["16h", "of admin saved"],
          ].map(([v, l], i) => (
            <motion.div
              key={l}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              className="flex flex-col justify-center rounded-lg bg-black/[0.03] px-3 dark:bg-white/[0.05]"
            >
              <span className="text-lg font-bold text-neutral-900 md:text-2xl dark:text-white">
                {v}
              </span>
              <span className={cn("text-[10px] md:text-[11px]", muted)}>{l}</span>
            </motion.div>
          ))}
        </div>
        <p className={cn("mt-3 text-[11px] md:text-xs", muted)}>
          <span className={strong}>Next up:</span> invoice chasing, from Sarah's list.
        </p>
      </div>
    </Win>
  );
}

/* ---------- website: northline.studio, from brief to enquiries ---------- */

function Browser({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-black/10 bg-white shadow-xl dark:border-white/10 dark:bg-neutral-900">
      <div className="flex items-center gap-2 border-b border-black/5 bg-neutral-50 px-3 py-2 dark:border-white/5 dark:bg-neutral-900">
        <span className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        </span>
        <span className="mx-auto flex items-center gap-1 rounded-md bg-white px-3 py-0.5 text-[10px] text-neutral-500 dark:bg-white/5 dark:text-neutral-400">
          <Lock className="h-2.5 w-2.5" /> {url}
        </span>
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}

/** The finished Northline home page, at any size. */
function NorthlinePage({ small }: { small?: boolean }) {
  return (
    <div className="absolute inset-0">
      <img src="/assets/showcase/hero.jpg" alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
      <span
        className={cn(
          "absolute top-2 left-2.5 font-serif tracking-[0.3em] text-white",
          small ? "text-[5px]" : "text-[10px] md:text-xs",
        )}
      >
        NORTHLINE
      </span>
      <p
        className={cn(
          "absolute bottom-2 left-2.5 max-w-[75%] font-serif leading-tight text-white",
          small ? "text-[7px]" : "text-xl md:text-3xl",
        )}
      >
        Calm, considered interiors for the way you live.
      </p>
    </div>
  );
}

const enquiries: [string, string, string, string][] = [
  ["richard-hale", "Richard Hale", "Kitchen extension · Surrey", "2m ago"],
  ["emily-ward", "Emily Ward", "Two-bed flat · Islington", "1h ago"],
  ["leo-martins", "Leo Martins", "Office fit-out · Shoreditch", "3h ago"],
  ["hannah-cole", "Hannah Cole", "Living room styling", "Yesterday"],
];

export function WebsiteStages({ stage }: { stage: number }) {
  if (stage === 0)
    return (
      <Win title="Northline · Website brief" status={<Pill tone="grey">Signed off</Pill>}>
        <div
          className={cn(card, "flex h-full flex-col overflow-hidden p-3 md:justify-center md:p-6")}
        >
          <p className={cn("mb-3 text-xs md:mb-5 md:text-base", strong)}>
            A site that books consultations
          </p>
          <Rows gap="gap-2 md:gap-3.5" max={4}>
            {[
              ["Audience", "Homeowners in London & Surrey planning a renovation"],
              ["Goal", "Book a free design consultation"],
              ["Pages", "Home · Work · Services · Studio · Contact"],
              ["Proof", "Real projects, Google reviews, the team"],
              ["Measure", "Consultations booked per month"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-3 text-[11px] md:text-sm">
                <span className={cn("w-16 shrink-0 md:w-20", muted)}>{k}</span>
                <span className="text-neutral-900 dark:text-white">{v}</span>
              </div>
            ))}
          </Rows>
        </div>
      </Win>
    );
  if (stage === 1)
    return (
      <Win title="Figma · Northline website" className="bg-neutral-100 dark:bg-neutral-800/60">
        <div className="flex h-full items-start gap-3 md:gap-5">
          {/* desktop frame */}
          <div className="flex h-full flex-[3] flex-col">
            <span className="mb-1 text-[9px] text-sky-600 dark:text-sky-400">
              Desktop · Home v3
            </span>
            <div className="flex flex-1 flex-col gap-1.5 rounded-sm bg-white p-2 shadow-sm md:gap-2 md:p-3 dark:bg-neutral-900">
              <div className="flex justify-between">
                <span className="h-2 w-12 rounded-sm bg-neutral-300 dark:bg-neutral-700" />
                <span className="h-2 w-20 rounded-sm bg-neutral-200 dark:bg-neutral-700" />
              </div>
              <div className="flex flex-1 flex-col justify-end gap-1 rounded-sm bg-neutral-200 p-2 dark:bg-neutral-800">
                <span className="h-2.5 w-3/4 rounded-sm bg-neutral-400/70" />
                <span className="h-2.5 w-1/2 rounded-sm bg-neutral-400/70" />
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-6 rounded-sm bg-neutral-200 md:h-9 dark:bg-neutral-800"
                  />
                ))}
              </div>
            </div>
          </div>
          {/* mobile frame */}
          <div className="flex h-[85%] flex-1 flex-col">
            <span className="mb-1 text-[9px] text-sky-600 dark:text-sky-400">Mobile · Home</span>
            <div className="flex flex-1 flex-col gap-1.5 rounded-sm bg-white p-1.5 shadow-sm dark:bg-neutral-900">
              <span className="h-1.5 w-8 rounded-sm bg-neutral-300 dark:bg-neutral-700" />
              <span className="flex-1 rounded-sm bg-neutral-200 dark:bg-neutral-800" />
              <span className="h-5 rounded-sm bg-neutral-200 dark:bg-neutral-800" />
              <span className="h-5 rounded-sm bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>
        </div>
        {/* client comment on the design */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={cn(card, "absolute bottom-4 left-1/4 max-w-[60%] md:bottom-8")}
        >
          <div className="flex items-start gap-2">
            <Face who="richard-hale" className="h-5 w-5" />
            <span>
              <span className={strong}>Richard</span>{" "}
              <span className="text-neutral-700 dark:text-neutral-300">
                Can the project photos come before the services?
              </span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="mt-1 flex items-center gap-1 text-emerald-600 dark:text-emerald-400"
              >
                <Check className="h-3 w-3" /> Done in v3
              </motion.span>
            </span>
          </div>
        </motion.div>
      </Win>
    );
  if (stage === 2)
    return (
      <Browser url="northline.studio">
        <NorthlinePage />
      </Browser>
    );
  if (stage === 3)
    return (
      <Win title="QA · northline.studio" status={<Pill>38 of 38 checks passed</Pill>}>
        <div className="flex h-full flex-col justify-between">
          <div className="flex items-end justify-center gap-3 md:gap-4">
            {[
              ["Desktop", "w-[46%] aspect-[16/10] rounded-md"],
              ["Tablet", "w-[22%] aspect-[3/4] rounded-md"],
              ["Phone", "w-[13%] aspect-[9/19] rounded-lg"],
            ].map(([label, size], i) => (
              <div key={label} className={cn("flex flex-col items-center", size.split(" ")[0])}>
                <div
                  className={cn(
                    "relative w-full overflow-hidden border-[3px] border-neutral-900 bg-neutral-900 dark:border-neutral-700",
                    size.split(" ").slice(1).join(" "),
                  )}
                >
                  <NorthlinePage small />
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.3 + i * 0.2,
                      type: "spring",
                      stiffness: 400,
                      damping: 16,
                    }}
                    className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white"
                  >
                    <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                  </motion.span>
                </div>
                <span className={cn("mt-1 text-[9px] md:text-[10px]", muted)}>{label}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              ["98", "Performance"],
              ["100", "Accessibility"],
              ["100", "Best practices"],
              ["100", "SEO"],
            ].map(([v, l], i) => (
              <motion.div
                key={l}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="flex flex-col items-center gap-1"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-emerald-500 text-[11px] font-bold text-emerald-600 md:h-11 md:w-11 dark:text-emerald-400">
                  {v}
                </span>
                <span className={cn("text-center text-[9px] md:text-[10px]", muted)}>{l}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Win>
    );
  if (stage === 4)
    return (
      <Win title="Deployments · northline.studio" status={<Pill>Production</Pill>}>
        <Rows max={4}>
          <div className={cn(card, "flex items-center gap-3")}>
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            <span className="min-w-0 flex-1">
              <span className={cn("block truncate", strong)}>Launch v1.0</span>
              <span className={cn("block truncate font-mono text-[10px]", muted)}>
                main · a3f9c21 · built in 38s
              </span>
            </span>
            <Pill>Ready</Pill>
          </div>
          {[
            ["northline.studio", "Valid configuration · SSL"],
            ["www.northline.studio", "Redirects to northline.studio"],
            ["42 old URLs", "301 redirects to their new pages"],
            ["Analytics & Search Console", "Receiving data"],
            ["Contact form → CRM", "Test enquiry delivered"],
          ].map(([a, b]) => (
            <div key={a} className={cn(card, "flex items-center gap-2 py-1.5")}>
              <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={3} />
              <span className={cn("shrink-0", strong)}>{a}</span>
              <span className={cn("truncate", muted)}>{b}</span>
            </div>
          ))}
        </Rows>
      </Win>
    );
  return (
    <Win title="CRM · Website enquiries" status={<Pill>41 this month</Pill>}>
      <Rows>
        {enquiries.map(([who, name, what, when]) => (
          <div key={who} className={cn(card, "flex items-center gap-2")}>
            <Face who={who} />
            <span className="min-w-0 flex-1">
              <span className={cn("block", strong)}>{name}</span>
              <span className={cn("block truncate", muted)}>{what}</span>
            </span>
            <span className={cn("shrink-0 text-[10px]", muted)}>{when}</span>
            <Pill tone="orange">Consultation</Pill>
          </div>
        ))}
      </Rows>
    </Win>
  );
}

/* ---------- CRM: from a messy inbox to a working pipeline ---------- */

const leads: [React.ReactNode, string, string, boolean][] = [
  [<Mail className="text-[#ea4335]" />, "Priya Shah", "Pricing for a kitchen?", true],
  [<BrandIcons.whatsapp />, "Tom Becker", "hi, still taking projects?", false],
  [<Globe className="text-[#5b8bd6]" />, "Daniel Park", "Web form · loft conversion", true],
  [<PhoneIcon className="text-neutral-500" />, "Missed call", "+44 7700 900 218", true],
];
const stages = ["Enquiry", "Consultation", "Proposal", "Won"];

function Board({ filled }: { filled: boolean }) {
  const deals = [
    ["Daniel Park", "£44,000", 0],
    ["Priya Shah", "£28,000", 0],
    ["Aisha Khan", "£42,000", 1],
    ["Omar Farouk", "£124,000", 2],
    ["Nina Rossi", "£86,500", 3],
  ] as const;
  return (
    <div className="grid h-full grid-cols-4 gap-1.5 md:gap-2">
      {stages.map((s, i) => (
        <div key={s} className="rounded-lg bg-black/[0.03] p-1.5 dark:bg-white/[0.04]">
          <p className="mb-1.5 truncate text-[9px] font-semibold text-neutral-500 md:text-[11px]">
            {s}
          </p>
          {filled &&
            deals
              .filter((d) => d[2] === i)
              .map(([n, v], j) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (i + j) * 0.12 }}
                  className={cn(card, "mb-1.5 px-1.5 py-1.5")}
                >
                  <p className="truncate font-semibold text-neutral-900 dark:text-white">{n}</p>
                  <p className="text-neutral-500">{v}</p>
                </motion.div>
              ))}
        </div>
      ))}
    </div>
  );
}

export function CrmStages({ stage }: { stage: number }) {
  if (stage === 0)
    return (
      <Win
        title="Where leads come in today"
        status={<Pill tone="orange">3 waiting for a reply</Pill>}
      >
        <div className="flex h-full flex-col justify-center gap-1.5 md:gap-2">
          {leads.map(([icon, who, msg, waiting], i) => (
            <motion.div
              key={who}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}
              className={cn(card, "flex items-center gap-2")}
            >
              <Icon>{icon}</Icon>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-neutral-900 dark:text-white">{who}</span>
                <span className="block truncate text-neutral-500">{msg}</span>
              </span>
              {waiting && (
                <span className="flex shrink-0 items-center gap-1 text-[10px] text-red-500">
                  <CircleAlert className="h-3 w-3" /> {i + 1}d no reply
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </Win>
    );
  if (stage === 1)
    return (
      <Win title="Pipeline design" status={<Pill tone="grey">Draft</Pill>}>
        <div className="flex h-full flex-col gap-3">
          <div className="min-h-0 flex-1">
            <Board filled={false} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["Project type", "Budget", "Source", "Owner", "Next step"].map((f) => (
              <span key={f} className={cn(card, "py-1")}>
                {f}
              </span>
            ))}
          </div>
        </div>
      </Win>
    );
  if (stage === 2)
    return (
      <Win title="Automation rules">
        <div className="flex h-full flex-col justify-center gap-2 md:gap-3">
          {[
            "New lead → assign owner and reply",
            "No reply in 48h → send a follow-up",
            "Proposal sent → task to call in 3 days",
            "Deal won → create the invoice",
          ].map((r, i) => (
            <div key={r} className={cn(card, "flex items-center justify-between gap-2")}>
              <span className="truncate text-neutral-800 dark:text-neutral-200">{r}</span>
              <span className="relative h-4 w-7 shrink-0 rounded-full bg-black/10 dark:bg-white/10">
                <motion.span
                  initial={{ x: 2, backgroundColor: "#a3a3a3" }}
                  animate={{ x: 13, backgroundColor: "#ff4d31" }}
                  transition={{
                    delay: 0.3 + i * 0.25,
                    type: "spring",
                    stiffness: 400,
                    damping: 22,
                  }}
                  className="absolute top-0.5 left-0 h-3 w-3 rounded-full"
                />
              </span>
            </div>
          ))}
        </div>
      </Win>
    );
  if (stage === 3)
    return (
      <Win title="Integrations & import" status={<Pill>2,416 contacts imported</Pill>}>
        <div className="flex h-full items-center justify-center gap-4 md:gap-8">
          <div className="flex flex-col gap-2">
            {[
              <Mail className="text-[#ea4335]" />,
              <BrandIcons.whatsapp />,
              <Globe className="text-[#5b8bd6]" />,
              <Sheet className="text-[#1e8e3e]" />,
            ].map((ic, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}
              >
                <Icon>{ic}</Icon>
              </motion.span>
            ))}
          </div>
          <div className="relative h-0.5 w-12 overflow-hidden rounded bg-black/10 md:w-24 dark:bg-white/10">
            <motion.span
              animate={{ x: ["-100%", "300%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-y-0 w-1/3 bg-[#ff4d31]"
            />
          </div>
          <div className="flex flex-col items-center gap-1.5 rounded-xl border border-black/10 bg-white px-4 py-4 shadow-sm dark:border-white/10 dark:bg-neutral-800">
            <Database className="h-6 w-6 text-[#ff4d31]" />
            <span className="text-xs font-bold text-neutral-900 dark:text-white">Your CRM</span>
          </div>
        </div>
      </Win>
    );
  if (stage === 4)
    return (
      <Win title="crm.northline.app · Deals" status={<Pill>Team live</Pill>}>
        <Board filled />
      </Win>
    );
  return (
    <Win title="Conversion · enquiry to won">
      <div className="flex h-full flex-col justify-center gap-2 md:gap-3">
        {[
          ["Enquiry", 100],
          ["Consultation", 64],
          ["Proposal", 41],
          ["Won", 27],
        ].map(([s, v], i) => (
          <div key={s} className="flex items-center gap-3">
            <span className="w-20 text-[11px] text-neutral-600 md:w-24 md:text-xs dark:text-neutral-400">
              {s}
            </span>
            <div className="flex-1">
              <Bar w={v as number} delay={i * 0.15} />
            </div>
            <span className="w-8 text-right font-mono text-[11px] text-neutral-500">{v}%</span>
          </div>
        ))}
      </div>
    </Win>
  );
}
