import type * as React from "react";
import {
  Activity,
  Blocks,
  CalendarDays,
  ClipboardList,
  FlaskConical,
  Lock,
  Mail,
  Plug,
  Sheet,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/showcase/kit";
import { BrandIcons } from "@/components/animation/BrandIcons";
import {
  body,
  box,
  BuildStack,
  Frame,
  Legend,
  muted,
  Pill,
  Ring,
  rule,
  shades,
  Stat,
  strong,
  type Step,
  type Tone,
} from "./BuildStack";

/*
 * Automation page: one workflow built step by step, Northline's new-enquiry handling,
 * from mapping the manual process to running live.
 */

const HAND = { fontFamily: '"Caveat", cursive' };
/* ---------- 1. Map: how an enquiry is handled today, by hand ---------- */

const today: [step: string, who: string, min: number, automate: boolean][] = [
  ["Read the enquiry email", "Sarah Mills", 3, true],
  ["Copy details into the spreadsheet", "Sarah Mills", 6, true],
  ["Check budget and postcode", "Daniel Park", 4, true],
  ["Decide who takes it", "Sarah Mills", 2, true],
  ["Write and send a reply", "Daniel Park", 8, true],
  ["Add the lead to the CRM", "Priya Shah", 5, true],
  ["Visit the site and quote", "Sarah Mills", 90, false],
];

const admin = today.filter(([, , , automate]) => automate);

function MapView() {
  return (
    <Frame label="Process map · New enquiry, today">
      <div className="h-full bg-neutral-50 p-3 md:p-4 dark:bg-neutral-950/60">
        <div className={cn(box, "px-3")}>
          <ul className={rule}>
            {today.map(([step, who, min, automate]) => (
              <li key={step} className="flex items-center gap-3 py-2 text-[11px]">
                <Avatar name={who} size={20} />
                <span className={cn("min-w-0 flex-1 truncate", body)}>{step}</span>
                <span className={cn("w-12 text-right tabular-nums", muted)}>{min} min</span>
                <span className="w-16 text-right">
                  {automate ? <Pill tone="orange">Automate</Pill> : <Pill tone="grey">Keep</Pill>}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className={cn(box, "mt-3 p-3")}>
          <div className="flex items-baseline justify-between gap-3 text-[11px]">
            <span className={muted}>Where 28 admin minutes per enquiry go</span>
            <span className={cn("text-[15px]", strong)}>18.7 h a week</span>
          </div>
          <div className="mt-2 flex h-2.5 gap-0.5 overflow-hidden rounded-full">
            {admin.map(([step, , min], i) => (
              <span
                key={step}
                style={{ width: `${(min / 28) * 100}%`, background: shades[i % 5] }}
              />
            ))}
          </div>
          <div className="mt-2 flex items-end justify-between gap-3">
            <Legend
              className="flex flex-wrap gap-x-3 gap-y-1"
              items={admin
                .slice(0, 4)
                .map(([step, , min], i) => [
                  `${step.split(" ").slice(0, 2).join(" ")} ${min}m`,
                  shades[i],
                ])}
            />
            <span style={HAND} className="shrink-0 -rotate-3 text-xl text-[#ff4d31] max-sm:hidden">
              nearly 3 days a week!
            </span>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ---------- 2. Design: the workflow as plain rules ---------- */

const spec: [keyword: string, text: string][] = [
  ["When", "a new enquiry arrives by web form, Gmail or WhatsApp"],
  ["Then", "read it with AI: name, project, budget, postcode"],
  ["If", "budget is £20k+ and inside the M25, assign to Sarah"],
  ["Else", "add to the nurture email sequence"],
  ["Then", "reply within a minute, with a link to book a call"],
  ["Then", "create the deal in the CRM and post in #new-leads"],
];

const edges: [string, string][] = [
  ["No budget given", "Ask for it in the reply"],
  ["Same person twice", "Merge, don't reply twice"],
  ["Spam or sales pitch", "Drop it, log it"],
];

// how last quarter's enquiries would have been routed
const routing: [string, number][] = [
  ["Straight to Sarah", 58],
  ["Nurture sequence", 30],
  ["Ask for budget", 8],
  ["Spam, dropped", 4],
];

function DesignView() {
  return (
    <Frame label="Spec · New enquiry workflow">
      <div className="flex h-full flex-col gap-3 bg-neutral-50 p-3 md:p-4 dark:bg-neutral-950/60">
        <ol className={cn(box, "space-y-2.5 p-3")}>
          {spec.map(([k, text], i) => (
            <li key={i} className="flex items-baseline gap-3 text-[11px]">
              <span className="w-10 shrink-0 font-mono text-[10px] font-semibold uppercase text-[#ff4d31]">
                {k}
              </span>
              <span className={body}>{text}</span>
            </li>
          ))}
        </ol>
        <div className={cn(box, "p-3 max-sm:hidden")}>
          <div className={cn("mb-2 text-[11px]", strong)}>Edge cases</div>
          <ul className={cn(rule, "text-[11px]")}>
            {edges.map(([c, then]) => (
              <li key={c} className="flex justify-between gap-3 py-1.5">
                <span className={body}>{c}</span>
                <span className={muted}>{then}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={cn(box, "flex items-center gap-4 p-3")}>
          <Ring parts={routing.map(([, pct], i) => [pct, shades[i]])} size={64} stroke={9}>
            <span className={cn("text-[11px]", strong)}>160</span>
            <span className={cn("text-[8px]", muted)}>a month</span>
          </Ring>
          <div className="min-w-0">
            <div className={cn("mb-1.5 text-[11px]", strong)}>Where enquiries will go</div>
            <Legend items={routing.map(([label, pct], i) => [`${label} ${pct}%`, shades[i]])} />
          </div>
          <span
            className={cn(
              "ml-auto flex items-center gap-2 self-end text-[10px] max-lg:hidden",
              muted,
            )}
          >
            <Avatar name="Sarah Mills" size={18} />
            Signed off
          </span>
        </div>
      </div>
    </Frame>
  );
}

/* ---------- 3. Connect: access to the tools they already use ---------- */

const tools: [name: string, icon: React.ReactNode, use: string, ok: boolean][] = [
  ["Gmail", <Mail className="text-[#ea4335]" />, "Read enquiries, send replies", true],
  ["WhatsApp", <BrandIcons.whatsapp />, "Receive messages", true],
  ["OpenAI", <BrandIcons.openai />, "Read and summarise", true],
  ["Sheets", <Sheet className="text-[#1e8e3e]" />, "Enquiry log", true],
  ["Notion", <BrandIcons.notion />, "CRM database", true],
  ["Calendar", <CalendarDays className="text-[#4285f4]" />, "Site visit slots", false],
];

const channels: [string, number][] = [
  ["Web form", 22],
  ["Gmail", 11],
  ["WhatsApp", 7],
];

function ConnectView() {
  return (
    <Frame label="Credentials · Northline">
      <div className="flex h-full flex-col gap-3 bg-neutral-50 p-3 md:p-4 dark:bg-neutral-950/60">
        <div className={cn(box, "px-3")}>
          <ul className={rule}>
            {tools.map(([name, icon, use, ok]) => (
              <li key={name} className="flex items-center gap-3 py-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-black/10 bg-white p-1.5 dark:border-white/10 [&>svg]:h-full [&>svg]:w-full">
                  {icon}
                </span>
                <span className="min-w-0 flex-1 leading-tight">
                  <span className={cn("block text-[11px]", strong)}>{name}</span>
                  <span className={cn("block truncate text-[10px]", muted)}>{use}</span>
                </span>
                {ok ? (
                  <Pill tone="green">Connected</Pill>
                ) : (
                  <Pill tone="amber">Awaiting access</Pill>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className={cn(box, "p-3 max-sm:hidden")}>
          <div className={cn("mb-2 text-[11px]", strong)}>Enquiries a week, by channel</div>
          <div className="space-y-1.5">
            {channels.map(([name, n]) => (
              <div key={name} className="flex items-center gap-2 text-[10px]">
                <span className={cn("w-16", muted)}>{name}</span>
                <span className="h-2 flex-1">
                  <span
                    className="block h-full rounded-full bg-[#ff4d31]"
                    style={{ width: `${(n / 22) * 100}%` }}
                  />
                </span>
                <span className={cn("w-5 text-right tabular-nums", strong)}>{n}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={cn("flex items-center gap-2 px-1 text-[10px]", muted)}>
          <Lock className="h-3 w-3" />
          Only the access each step needs · keys stored encrypted
        </div>
      </div>
    </Frame>
  );
}

/* ---------- 4. Build: the workflow in n8n (a real one of ours) ---------- */

// the workflow's 14 steps, by kind
const nodes: [string, number][] = [
  ["logic steps", 7],
  ["AI steps", 3],
  ["app actions", 4],
];

function BuildView() {
  return (
    <Frame label="n8n · workflow editor">
      <img
        src="/assets/imgs/Construction_Automation.png"
        alt=""
        className="h-full w-full origin-[42%_52%] scale-[1.7] object-cover"
      />
      <span className="absolute bottom-3 left-3 flex items-center gap-2 rounded-md border border-black/10 bg-white/95 px-2.5 py-1.5 text-[10px] text-neutral-700 dark:border-white/10 dark:bg-neutral-900/95 dark:text-neutral-300">
        <span className="h-4 w-4 [&>svg]:h-full [&>svg]:w-full">
          <BrandIcons.n8n />
        </span>
        Built in n8n, on your account
      </span>
      <div className="absolute right-3 bottom-3 flex items-center gap-3 rounded-lg border border-black/10 bg-white/95 p-2.5 max-sm:hidden dark:border-white/10 dark:bg-neutral-900/95">
        <Ring parts={nodes.map(([, n], i) => [n, shades[i]])} size={52} stroke={7}>
          <span className={cn("text-[11px]", strong)}>14</span>
        </Ring>
        <Legend items={nodes.map(([label, n], i) => [`${n} ${label}`, shades[i]])} />
      </div>
    </Frame>
  );
}

/* ---------- 5. Test: replayed against past enquiries ---------- */

const results: [name: string, budget: string, to: string, tone: Tone, result: string][] = [
  ["Hannah Cole", "£24k", "Sarah", "green", "Pass"],
  ["Omar Farouk", "£38k", "Sarah", "green", "Pass"],
  ["Ben Carter", "£9k", "Nurture", "green", "Pass"],
  ["Grace Liu", "$90k", "Sarah", "amber", "Fixed: read $ as £"],
  ["Leo Martins", "none", "Ask budget", "green", "Pass"],
];

function TestView() {
  return (
    <Frame label="Test run · 120 past enquiries">
      <div className="flex h-full flex-col gap-3 bg-neutral-50 p-3 md:p-4 dark:bg-neutral-950/60">
        <div className={cn(box, "flex items-center gap-4 p-3")}>
          <Ring
            parts={[
              [118, "#ff4d31"],
              [2, "#ffc2b5"],
            ]}
            size={64}
            stroke={9}
          >
            <span className={cn("text-[12px]", strong)}>98%</span>
          </Ring>
          <div className="grid flex-1 grid-cols-3 gap-3">
            <Stat label="Replayed" value="120" note="last 3 months" />
            <Stat label="Right first time" value="118" />
            <Stat label="Fixed, then passed" value="2" />
          </div>
        </div>
        <div className={cn(box, "px-3")}>
          <ul className={rule}>
            {results.map(([name, budget, to, tone, result]) => (
              <li key={name} className="flex items-center gap-3 py-2 text-[11px]">
                <Avatar name={name} size={20} />
                <span className={cn("min-w-0 flex-1 truncate", body)}>{name}</span>
                <span className={cn("w-10 tabular-nums max-sm:hidden", muted)}>{budget}</span>
                <span className={cn("w-16 max-sm:hidden", muted)}>{to}</span>
                <span className="w-28 text-right">
                  <Pill tone={tone}>{result}</Pill>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Frame>
  );
}

/* ---------- 6. Live: running, and watched ---------- */

const week = [31, 38, 42, 35, 44, 18, 9];
const feed: [time: string, what: string][] = [
  ["09:41", "Hannah Cole → Sarah · replied in 38s"],
  ["09:12", "Spam dropped · logged"],
  ["08:55", "Ben Carter → nurture sequence"],
  ["08:30", "Gmail access refreshed automatically"],
];

function LiveView() {
  return (
    <Frame label="Monitor · New enquiry">
      <div className="flex h-full flex-col gap-3 bg-neutral-50 p-3 md:p-4 dark:bg-neutral-950/60">
        <div className="flex items-center gap-2 text-[11px]">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className={strong}>Live</span>
          <span className={muted}>· alerts go to #ops if anything fails</span>
        </div>
        <div className={cn(box, "grid grid-cols-3 items-center gap-3 p-3")}>
          <div className="flex items-center gap-2.5">
            <Ring parts={[[100, "#ff4d31"]]} size={48} stroke={6}>
              <span className={cn("text-[10px]", strong)}>100%</span>
            </Ring>
            <Stat label="Runs this week" value="217" note="all succeeded" />
          </div>
          <Stat label="Average reply" value="42s" note="was 5 hours" />
          <Stat label="Admin saved" value="17 h" note="this week" />
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          <div className={cn(box, "flex flex-col p-3")}>
            <div className={cn("mb-2 text-[11px]", strong)}>Runs per day</div>
            <div className="flex h-24 items-end gap-1.5">
              {week.map((v, i) => (
                <span key={i} className="flex h-full flex-1 flex-col justify-end">
                  <span
                    className="rounded-sm bg-[#ff4d31]"
                    style={{ height: `${(v / 44) * 100}%` }}
                  />
                </span>
              ))}
            </div>
            <div className={cn("mt-1.5 flex justify-between text-[9px]", muted)}>
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span key={i} className="flex-1 text-center">
                  {d}
                </span>
              ))}
            </div>
          </div>
          <div className={cn(box, "p-3 max-lg:hidden")}>
            <div className={cn("mb-1 text-[11px]", strong)}>Activity</div>
            <ul className={rule}>
              {feed.map(([t, what]) => (
                <li key={t} className="flex gap-2.5 py-1.5 text-[10px]">
                  <span className={cn("tabular-nums", muted)}>{t}</span>
                  <span className={cn("truncate", body)}>{what}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ---------- content ---------- */

const steps: Step[] = [
  {
    name: "Map the Process",
    icon: ClipboardList,
    text: "We sit with your team and map how the work gets done today, step by step, with the time each part takes.",
    features: [
      "Every step and handover written down",
      "Time spent on each one",
      "What to automate and what stays human",
      "Clear before-and-after numbers",
    ],
    View: MapView,
  },
  {
    name: "Design the Workflow",
    icon: Workflow,
    text: "The automation written out as plain rules, edge cases included, and agreed with you before anything is built.",
    features: [
      "Triggers, rules and outcomes",
      "Edge cases planned for",
      "Agreed in plain English",
      "No surprises later",
    ],
    View: DesignView,
  },
  {
    name: "Connect Your Tools",
    icon: Plug,
    text: "Secure access to the tools you already use, so nothing has to be replaced and your data stays yours.",
    features: [
      "Works with the tools you have",
      "Only the access each step needs",
      "Keys stored encrypted",
      "Your accounts, your data",
    ],
    View: ConnectView,
  },
  {
    name: "Build",
    icon: Blocks,
    text: "Built in n8n, step by step, with AI where it saves time and plain logic where it's safer.",
    features: [
      "Built in n8n, owned by you",
      "AI for reading and writing",
      "Every run logged",
      "Readable by your team",
    ],
    View: BuildView,
  },
  {
    name: "Test with Real Data",
    icon: FlaskConical,
    text: "Replayed against your past work, so we see exactly what it would have done before it touches a real customer.",
    features: [
      "Run on your real history",
      "Every result checked",
      "Fixes made before launch",
      "Signed off by your team",
    ],
    View: TestView,
  },
  {
    name: "Go Live & Monitor",
    icon: Activity,
    text: "Switched on, watched and kept running, with an alert the moment anything needs a person.",
    features: [
      "Alerts if anything fails",
      "Weekly run reports",
      "Time saved, tracked",
      "Changed as your process grows",
    ],
    View: LiveView,
  },
];

export function AutomationBuild() {
  return (
    <BuildStack
      eyebrow="How we automate"
      title={
        <>
          From manual process <span className="text-[#ff4d31]">to running on its own.</span>
        </>
      }
      subtitle="Scroll through how one workflow comes together with us: a business's new-enquiry handling, from mapping it to live."
      steps={steps}
    />
  );
}
