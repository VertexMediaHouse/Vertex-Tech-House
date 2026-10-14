import type * as React from "react";
import {
  CalendarClock,
  Check,
  Contact,
  FileText,
  Headset,
  Kanban,
  LayoutDashboard,
  Megaphone,
  Receipt,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/showcase/kit";
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

/* CRM page: the CRM's modules as a scroll stack, each one's screen inside the same Vertex CRM. */

const bg = "bg-neutral-50 dark:bg-neutral-950/60";
const track = "bg-black/10 dark:bg-white/15";
const label = cn("text-[9px] font-semibold tracking-wider uppercase", muted);

/** Vertex CRM's window: the module list down the side, this module's screen on the right. */
function Crm({ page, children }: { page: string; children: React.ReactNode }) {
  return (
    <Frame label={`Vertex CRM · ${page}`}>
      <div className="flex h-full">
        <aside className="w-36 shrink-0 border-r border-black/5 bg-white p-2 max-lg:hidden dark:border-white/5 dark:bg-neutral-900">
          <div className="mb-3 flex items-center gap-2 px-2 pt-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#ff4d31] text-[11px] font-bold text-white">
              V
            </span>
            <span className={cn("text-[11px]", strong)}>Vertex CRM</span>
          </div>
          {modules.map((m) => (
            <div
              key={m.short}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px]",
                m.short === page
                  ? "bg-[#ff4d31]/10 font-semibold text-[#ff4d31]"
                  : "text-neutral-600 dark:text-neutral-400",
              )}
            >
              <m.icon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{m.short}</span>
            </div>
          ))}
        </aside>
        {/* screens stack their panels top to bottom; the last one stretches to the bottom edge */}
        <div className={cn("flex min-w-0 flex-1 flex-col gap-3 overflow-hidden p-3 md:p-4", bg)}>
          {children}
        </div>
      </div>
    </Frame>
  );
}

/** Horizontal bars with a label and value on each row. */
function HBars({ rows, max }: { rows: [string, number, string?][]; max: number }) {
  return (
    <div className="space-y-2">
      {rows.map(([name, v, shown]) => (
        <div key={name} className="flex items-center gap-2 text-[10px]">
          <span className={cn("w-20 shrink-0 truncate", body)}>{name}</span>
          <span className={cn("h-2 flex-1 rounded-full", track)}>
            <span
              className="block h-full rounded-full bg-[#ff4d31]"
              style={{ width: `${(v / max) * 100}%` }}
            />
          </span>
          <span className={cn("w-12 shrink-0 text-right tabular-nums", strong)}>{shown ?? v}</span>
        </div>
      ))}
    </div>
  );
}

/** Column chart that fills its panel; the last bar is the current period, in full orange. */
function Bars({ data, labels }: { data: number[]; labels: string[] }) {
  const max = Math.max(...data);
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-16 flex-1 items-end gap-2">
        {data.map((v, i) => (
          <span key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
            <span className={cn("text-[9px] tabular-nums", muted)}>{v}</span>
            <span
              className={cn(
                "w-full rounded-sm",
                i === data.length - 1 ? "bg-[#ff4d31]" : "bg-[#ff4d31]/35",
              )}
              style={{ height: `${(v / max) * 85}%` }}
            />
          </span>
        ))}
      </div>
      <div className={cn("mt-1 flex gap-2 text-[9px]", muted)}>
        {labels.map((l) => (
          <span key={l} className="flex-1 text-center">
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Small ring with a value inside, for a single percentage. */
function Pct({
  value,
  size = 48,
  children,
}: {
  value: number;
  size?: number;
  children: React.ReactNode;
}) {
  return (
    <Ring
      size={size}
      stroke={size / 8}
      parts={[
        [value, "#ff4d31"],
        [100 - value, "transparent"],
      ]}
    >
      {children}
    </Ring>
  );
}

/* ---------- 01. Dashboard & analytics ---------- */

const reps: [string, number][] = [
  ["Aditi Sharma", 9],
  ["Karan Mehta", 7],
  ["Sneha Patel", 5],
  ["Rahul Verma", 4],
];

const forecast: [string, number, string][] = [
  ["Proposal", 5.5, "₹ 5.5L"],
  ["Qualified", 3.9, "₹ 3.9L"],
  ["New", 1.1, "₹ 1.1L"],
];

const leadSources: [string, number][] = [
  ["Website", 38],
  ["WhatsApp", 27],
  ["Meta Ads", 21],
  ["Referral", 14],
];

function DashboardView() {
  return (
    <Crm page="Dashboard">
      <div className={cn(box, "grid grid-cols-3 items-center gap-3 p-3")}>
        <Stat label="New leads (month)" value="248" note="+18% on Sep" />
        <Stat label="Deals won" value="₹ 18.4L" note="11 deals" />
        <div className="flex items-center gap-2.5">
          <Pct value={32}>
            <span className={cn("text-[10px]", strong)}>32%</span>
          </Pct>
          <span className={cn("text-[10px]", muted)}>Win rate</span>
        </div>
      </div>
      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[1.4fr_1fr]">
        <div className={cn(box, "flex flex-col p-3")}>
          <div className={cn("mb-2 text-[11px]", strong)}>Monthly revenue (₹ lakh)</div>
          <Bars data={[8, 9, 11, 13, 14, 18]} labels={["May", "Jun", "Jul", "Aug", "Sep", "Oct"]} />
        </div>
        <div className={cn(box, "p-3 max-lg:hidden")}>
          <div className={cn("mb-2.5 text-[11px]", strong)}>Deals won by rep</div>
          <div className="space-y-2.5">
            {reps.map(([name, n]) => (
              <div key={name} className="flex items-center gap-2 text-[10px]">
                <Avatar name={name} size={18} />
                <span className="min-w-0 flex-1">
                  <span className={cn("block truncate", body)}>{name}</span>
                  <span className={cn("mt-1 block h-1.5 rounded-full", track)}>
                    <span
                      className="block h-full rounded-full bg-[#ff4d31]"
                      style={{ width: `${(n / 9) * 100}%` }}
                    />
                  </span>
                </span>
                <span className={cn("w-4 text-right tabular-nums", strong)}>{n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <div className={cn(box, "p-3")}>
          <div className="mb-2.5 flex justify-between text-[11px]">
            <span className={strong}>Forecast by stage</span>
            <span className={muted}>weighted · ₹ 10.5L</span>
          </div>
          <HBars rows={forecast} max={5.5} />
        </div>
        <div className={cn(box, "flex items-center gap-3 p-3 max-lg:hidden")}>
          <Ring size={60} stroke={8} parts={leadSources.map(([, n], i) => [n, shades[i]])}>
            <span className={cn("text-[10px]", strong)}>248</span>
          </Ring>
          <Legend items={leadSources.map(([s, n], i) => [`${s} ${n}%`, shades[i]])} />
        </div>
      </div>
    </Crm>
  );
}

/* ---------- 02. Lead management ---------- */

const leads: [name: string, source: string, score: number, stage: string, tone: Tone][] = [
  ["Rohan Kapoor", "Website", 92, "Hot", "orange"],
  ["Ananya Iyer", "WhatsApp", 78, "Warm", "amber"],
  ["Vikram Shah", "Meta Ads", 71, "Warm", "amber"],
  ["Neha Joshi", "Referral", 64, "New", "grey"],
  ["Arjun Rao", "Email", 58, "New", "grey"],
];

const channels: [string, number][] = [
  ["Website", 42],
  ["WhatsApp", 31],
  ["Meta Ads", 24],
  ["Referral", 12],
  ["Email", 9],
];

function LeadsView() {
  return (
    <Crm page="Leads">
      <div className={cn(box, "px-3")}>
        <div className={cn("flex gap-3 border-b border-black/5 py-2 dark:border-white/5", label)}>
          <span className="flex-1">Lead</span>
          <span className="w-16 max-sm:hidden">Source</span>
          <span className="w-24">Score · AI</span>
          <span className="w-10 text-right">Stage</span>
        </div>
        <ul className={rule}>
          {leads.map(([name, source, score, stage, tone]) => (
            <li key={name} className="flex items-center gap-3 py-2 text-[11px]">
              <span className="flex min-w-0 flex-1 items-center gap-2">
                <Avatar name={name} size={22} />
                <span className={cn("truncate", strong)}>{name}</span>
              </span>
              <span className={cn("w-16 max-sm:hidden", muted)}>{source}</span>
              <span className="flex w-24 items-center gap-1.5">
                <span className={cn("h-1.5 flex-1 rounded-full", track)}>
                  <span
                    className="block h-full rounded-full bg-[#ff4d31]"
                    style={{ width: `${score}%` }}
                  />
                </span>
                <span className={cn("w-5 text-right tabular-nums", body)}>{score}</span>
              </span>
              <span className="w-10 text-right">
                <Pill tone={tone}>{stage}</Pill>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid min-h-0 flex-1 gap-3 sm:grid-cols-[1.5fr_1fr]">
        <div className={cn(box, "p-3")}>
          <div className={cn("mb-2.5 text-[11px]", strong)}>Leads this week, by channel</div>
          <HBars rows={channels} max={42} />
        </div>
        <div className={cn(box, "flex flex-col justify-center gap-2 p-3 max-sm:hidden")}>
          <Stat label="Avg. time to owner" value="4 sec" />
          <Stat label="Duplicates merged" value="17" note="this week" />
        </div>
      </div>
      <div className={cn(box, "flex items-center gap-2.5 p-3 text-[11px]")}>
        <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={3} />
        <span className={cn("truncate", body)}>
          Rohan Kapoor assigned to Aditi Sharma (West region)
        </span>
        <span className={cn("ml-auto shrink-0 text-[10px]", muted)}>in 4 seconds</span>
      </div>
    </Crm>
  );
}

/* ---------- 03. Contact & account management ---------- */

const timeline: [what: string, detail: string][] = [
  ["Quote sent", "₹ 3.2L · 2h ago"],
  ["Meeting booked", "Fri, 11:00 AM"],
  ["Call logged", "12 min · Yesterday"],
  ["Email opened", "Proposal v2 · Mon 10"],
];

const colleagues: [string, string][] = [
  ["Rajesh Nair", "Purchase Manager"],
  ["Meera Pillai", "Finance Lead"],
  ["Sanjay Gupta", "Plant Head"],
];

const files = ["Proposal v2.pdf", "NDA signed.pdf", "Site photos (12)"];

function ContactsView() {
  return (
    <Crm page="Contacts">
      <div className={cn(box, "flex items-center gap-3 p-3")}>
        <Avatar name="Priya Mehta" size={36} />
        <span className="min-w-0 leading-tight">
          <span className={cn("block text-[13px]", strong)}>Priya Mehta</span>
          <span className={cn("block text-[10px]", muted)}>Ops Head · Acme Industries</span>
        </span>
        <span className="ml-auto flex gap-1.5">
          <Pill tone="orange">Key account</Pill>
          <span className="max-sm:hidden">
            <Pill tone="grey">Manufacturing</Pill>
          </span>
        </span>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <div className={cn(box, "px-3")}>
          <ul className={cn(rule, "text-[11px]")}>
            {[
              ["Email", "priya@acmeind.in"],
              ["Phone", "+91 98200 41235"],
              ["City", "Pune, Maharashtra"],
              ["Lifetime value", "₹ 12.6L"],
            ].map(([k, v]) => (
              <li key={k} className="flex justify-between gap-3 py-2">
                <span className={muted}>{k}</span>
                <span className={cn("truncate", body)}>{v}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={cn(box, "p-3")}>
          <div className={cn("mb-2", label)}>Activity timeline</div>
          <ul>
            {timeline.map(([what, detail], i) => (
              <li key={what} className="relative flex gap-2.5 pb-2.5 last:pb-0">
                {i < timeline.length - 1 && (
                  <span className="absolute top-3 left-[3px] h-full w-px bg-black/10 dark:bg-white/15" />
                )}
                <span
                  className={cn(
                    "relative mt-1 h-[7px] w-[7px] shrink-0 rounded-full",
                    i === 0 ? "bg-[#ff4d31]" : "bg-neutral-300 dark:bg-neutral-600",
                  )}
                />
                <span className="leading-tight">
                  <span className={cn("block text-[11px]", body)}>{what}</span>
                  <span className={cn("text-[10px]", muted)}>{detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-2">
        <div className={cn(box, "p-3")}>
          <div className={cn("mb-2", label)}>Acme Industries · 4 contacts</div>
          <ul className="space-y-2">
            {colleagues.map(([name, role]) => (
              <li key={name} className="flex items-center gap-2 text-[11px]">
                <Avatar name={name} size={20} />
                <span className={cn("flex-1 truncate", body)}>{name}</span>
                <span className={cn("text-[10px]", muted)}>{role}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={cn(box, "p-3 max-lg:hidden")}>
          <div className={cn("mb-2", label)}>Files</div>
          <ul className="space-y-2">
            {files.map((f) => (
              <li key={f} className="flex items-center gap-2 text-[11px]">
                <FileText className="h-3.5 w-3.5 shrink-0 text-[#ff4d31]" />
                <span className={cn("truncate", body)}>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Crm>
  );
}

/* ---------- 04. Sales pipeline & deals ---------- */

// stage, then its deals as [company, value, win chance]
const pipeline: [string, [string, string, number][]][] = [
  [
    "New",
    [
      ["Zenith Foods", "₹ 2.4L", 20],
      ["Orbit Logistics", "₹ 1.8L", 15],
      ["Pixel Labs", "₹ 1.0L", 20],
      ["Metro Clinics", "₹ 90K", 10],
    ],
  ],
  [
    "Qualified",
    [
      ["Nova Pharma", "₹ 4.6L", 45],
      ["BlueOak Realty", "₹ 2.4L", 40],
      ["Kiran Motors", "₹ 2.4L", 35],
    ],
  ],
  [
    "Proposal",
    [
      ["Acme Industries", "₹ 6.0L", 70],
      ["Greenleaf Agro", "₹ 1.8L", 60],
    ],
  ],
  [
    "Won",
    [
      ["Sharma Textiles", "₹ 2.8L", 100],
      ["Apex Steel", "₹ 2.4L", 100],
    ],
  ],
];
const totals = ["₹ 6.1L", "₹ 9.4L", "₹ 7.8L", "₹ 5.2L"];
const lostReasons: [string, number][] = [
  ["Price", 3],
  ["Timing", 2],
  ["Competitor", 1],
];

function PipelineView() {
  return (
    <Crm page="Pipeline">
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 md:grid-cols-4">
        {pipeline.map(([stage, deals], i) => (
          <div
            key={stage}
            className={cn(
              "min-w-0 rounded-lg bg-black/[0.03] p-2 dark:bg-white/[0.04]",
              i > 1 && "max-md:hidden",
            )}
          >
            <div className="mb-2 px-0.5 leading-tight">
              <div className="flex justify-between text-[11px]">
                <span className={strong}>{stage}</span>
                <span className={muted}>{deals.length}</span>
              </div>
              <div className={cn("text-[10px]", stage === "Won" ? "text-[#ff4d31]" : muted)}>
                {totals[i]}
              </div>
            </div>
            <div className="space-y-1.5">
              {deals.map(([company, value, chance]) => (
                <div key={company} className={cn(box, "p-2")}>
                  <div className={cn("truncate text-[10px]", strong)}>{company}</div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px]">
                    <span className={body}>{value}</span>
                    <span className={muted}>{chance}%</span>
                  </div>
                  <span className={cn("mt-1 block h-1 rounded-full", track)}>
                    <span
                      className="block h-full rounded-full bg-[#ff4d31]"
                      style={{ width: `${chance}%` }}
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={cn(box, "grid grid-cols-3 items-center gap-3 p-3")}>
        <Stat label="Weighted forecast" value="₹ 11.9L" note="this month" />
        <Stat label="Average cycle" value="26 days" />
        <div className="max-sm:hidden">
          <div className={cn("mb-1 text-[10px]", muted)}>Lost this month</div>
          <div className="flex h-2 gap-0.5 overflow-hidden rounded-full">
            {lostReasons.map(([r, n], i) => (
              <span key={r} style={{ width: `${(n / 6) * 100}%`, background: shades[i] }} />
            ))}
          </div>
          <div className={cn("mt-1 text-[9px]", muted)}>Price 3 · Timing 2 · Competitor 1</div>
        </div>
      </div>
    </Crm>
  );
}

/* ---------- 05. Tasks & follow-ups ---------- */

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
// day, then its events as [title, time, kind]
const week: [string, string, "call" | "meet" | "visit"][][] = [
  [
    ["Discovery call", "10:00", "call"],
    ["Proposal prep", "12:30", "meet"],
    ["Follow-up", "15:00", "call"],
    ["Call Neha Joshi", "17:00", "call"],
  ],
  [
    ["Team sync", "09:30", "meet"],
    ["Demo · Acme", "14:00", "meet"],
    ["Follow-up", "16:30", "call"],
  ],
  [
    ["Site visit", "11:00", "visit"],
    ["Call Arjun Rao", "15:30", "call"],
    ["Pipeline review", "17:00", "meet"],
  ],
  [
    ["Contract", "12:00", "meet"],
    ["Quote review", "16:00", "meet"],
    ["Follow-up", "17:30", "call"],
  ],
  [
    ["Renewal call", "10:30", "call"],
    ["Site visit", "13:00", "visit"],
    ["Follow-up", "15:00", "call"],
    ["Weekly report", "17:00", "meet"],
  ],
];
const kinds = {
  call: "border-[#ff4d31] bg-[#ff4d31]/10",
  meet: "border-neutral-400 bg-black/[0.04] dark:bg-white/[0.06]",
  visit: "border-amber-500 bg-amber-500/10",
};

function CalendarView() {
  return (
    <Crm page="Tasks">
      <div className={cn(box, "grid min-h-0 flex-1 grid-cols-3 gap-2 p-3 sm:grid-cols-5")}>
        {week.map((events, i) => (
          <div key={days[i]} className={cn("flex min-w-0 flex-col", i > 2 && "max-sm:hidden")}>
            <div
              className={cn(
                "mb-2 text-center text-[10px]",
                i === 1 ? "font-semibold text-[#ff4d31]" : muted,
              )}
            >
              {days[i]}
            </div>
            {/* events share the column's height, so the week fills the panel */}
            <div className="flex min-h-0 flex-1 flex-col gap-1.5">
              {events.map(([title, time, kind]) => (
                <div
                  key={title + time}
                  className={cn(
                    "flex min-h-0 flex-1 flex-col justify-center rounded border-l-2 px-1.5 py-1",
                    kinds[kind],
                  )}
                >
                  <div className={cn("truncate text-[10px]", strong)}>{title}</div>
                  <div className={cn("text-[9px]", muted)}>{time}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={cn(box, "flex items-center gap-4 p-3")}>
        <div className="min-w-0 flex-1">
          <div className="flex justify-between text-[10px]">
            <span className={strong}>This week</span>
            <span className={muted}>19 of 23 tasks done</span>
          </div>
          <span className={cn("mt-1.5 block h-2 rounded-full", track)}>
            <span className="block h-full w-[83%] rounded-full bg-[#ff4d31]" />
          </span>
        </div>
        <Pill tone="red">2 overdue</Pill>
      </div>
      <div className={cn(box, "flex items-center gap-2.5 p-3 text-[11px]")}>
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className={cn("block", strong)}>Reminder sent on WhatsApp</span>
          <span className={cn("block text-[10px]", muted)}>Demo · Acme starts in 1 hour</span>
        </span>
      </div>
    </Crm>
  );
}

/* ---------- 06. Quotations & invoicing ---------- */

const lines: [string, string][] = [
  ["Custom CRM setup", "₹ 85,000"],
  ["WhatsApp integration", "₹ 22,000"],
  ["Training (2 sessions)", "₹ 17,000"],
];
const billing: [string, string][] = [
  ["Quote created", "3 Oct"],
  ["Converted to invoice", "6 Oct"],
  ["Payment link sent", "6 Oct"],
  ["Payment received", "9 Oct"],
];
const recent: [no: string, client: string, amount: string, status: string, tone: Tone][] = [
  ["INV-0141", "Zenith Foods", "₹ 68,500", "Paid", "green"],
  ["INV-0140", "Nova Pharma", "₹ 2,10,000", "Reminder sent", "amber"],
  ["INV-0139", "Kiran Motors", "₹ 45,000", "Overdue", "red"],
];

function BillingView() {
  return (
    <Crm page="Billing">
      <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr]">
        <div className={cn(box, "p-3")}>
          <div className="flex items-start justify-between">
            <span className="leading-tight">
              <span className={cn("block", label)}>Invoice</span>
              <span className={cn("block text-[13px]", strong)}>#INV-0142</span>
            </span>
            <Pill tone="green">Paid</Pill>
          </div>
          <div className={cn("mt-1 text-[10px]", muted)}>
            Acme Industries · GSTIN 27AAACA1234F1Z5
          </div>
          <ul className={cn(rule, "mt-2 text-[11px]")}>
            {lines.map(([item, amount]) => (
              <li key={item} className="flex justify-between gap-3 py-1.5">
                <span className={body}>{item}</span>
                <span className={body}>{amount}</span>
              </li>
            ))}
            <li className={cn("flex justify-between gap-3 py-1.5 text-[12px]", strong)}>
              <span>Total</span>
              <span>₹ 1,24,000</span>
            </li>
          </ul>
        </div>
        <div className={cn(box, "p-3 max-sm:hidden")}>
          <ol>
            {billing.map(([what, when], i) => (
              <li key={what} className="relative flex gap-2.5 pb-3 last:pb-0">
                {i < billing.length - 1 && (
                  <span className="absolute top-4 left-[7px] h-full w-0.5 bg-[#ff4d31]" />
                )}
                <span className="relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#ff4d31] text-white">
                  <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                </span>
                <span className="leading-tight">
                  <span className={cn("block text-[11px]", body)}>{what}</span>
                  <span className={cn("text-[10px]", muted)}>{when}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className={cn(box, "grid grid-cols-3 gap-3 p-3")}>
        <Stat label="Collected (Oct)" value="₹ 8.6L" note="+22% on Sep" />
        <Stat label="Outstanding" value="₹ 2.6L" />
        <Stat label="Avg. days to pay" value="6" note="was 19" />
      </div>
      <div className={cn(box, "min-h-0 flex-1 px-3")}>
        <ul className={rule}>
          {recent.map(([no, client, amount, status, tone]) => (
            <li key={no} className="flex items-center gap-3 py-2 text-[11px]">
              <span className={cn("w-14 shrink-0 text-[10px] max-sm:hidden", muted)}>{no}</span>
              <span className={cn("min-w-0 flex-1 truncate", body)}>{client}</span>
              <span className={strong}>{amount}</span>
              <span className="w-24 text-right">
                <Pill tone={tone}>{status}</Pill>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Crm>
  );
}

/* ---------- 07. Marketing automation ---------- */

const sequence: [day: string, step: string, pct: number, metric: string][] = [
  ["Day 0", "Welcome", 46, "opened"],
  ["Day 2", "Case study", 81, "read"],
  ["Day 5", "Offer", 30, "clicked"],
];

const byChannel: [string, number, string][] = [
  ["WhatsApp", 81, "81% read"],
  ["Email", 46, "46% opened"],
  ["SMS", 22, "22% clicked"],
];

function CampaignsView() {
  return (
    <Crm page="Campaigns">
      <div className="flex items-center gap-1.5">
        {["Email", "WhatsApp", "SMS"].map((c, i) => (
          <span
            key={c}
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px]",
              i === 0 ? "bg-[#ff4d31] font-semibold text-white" : cn(box, muted),
            )}
          >
            {c}
          </span>
        ))}
        <span className={cn("ml-auto text-[10px] max-sm:hidden", muted)}>
          Segment: Manufacturing · 1,240 contacts
        </span>
      </div>
      <div className={cn(box, "p-3")}>
        <div className={cn("mb-3", label)}>Nurture sequence</div>
        <ol className="space-y-3">
          {sequence.map(([day, step, pct, metric]) => (
            <li key={day} className="flex items-center gap-3 text-[11px]">
              <span className={cn("w-11 shrink-0 text-[10px]", muted)}>{day}</span>
              <span className={cn("w-20 shrink-0", strong)}>{step}</span>
              <span className={cn("h-2 flex-1 rounded-full", track)}>
                <span
                  className="block h-full rounded-full bg-[#ff4d31]"
                  style={{ width: `${pct}%` }}
                />
              </span>
              <span className={cn("w-20 shrink-0 text-right", body)}>
                {pct}% {metric}
              </span>
            </li>
          ))}
          <li className="flex items-center gap-3 text-[11px]">
            <span className={cn("w-11 shrink-0 text-[10px]", muted)}>Day 7</span>
            <span className={cn("w-20 shrink-0", strong)}>Call booked</span>
            <span className="flex-1" />
            <Pill tone="green">14 calls</Pill>
          </li>
        </ol>
      </div>
      <div className={cn(box, "grid grid-cols-3 gap-3 p-3")}>
        <Stat label="Sent" value="1,240" />
        <Stat label="Replies" value="186" note="15% reply rate" />
        <Stat label="Pipeline created" value="₹ 14.2L" />
      </div>
      <div className={cn(box, "min-h-0 flex-1 p-3")}>
        <div className={cn("mb-2.5 text-[11px]", strong)}>Engagement by channel</div>
        <HBars rows={byChannel} max={100} />
      </div>
    </Crm>
  );
}

/* ---------- 08. Customer support & ticketing ---------- */

const tickets: [
  id: string,
  subject: string,
  account: string,
  tone: Tone,
  status: string,
  sla: string,
][] = [
  ["TCK-2041", "Report export failing", "Acme Industries", "red", "Urgent", "48 min left"],
  ["TCK-2040", "Add three new users", "Zenith Foods", "amber", "In progress", "3 h left"],
  ["TCK-2038", "WhatsApp not syncing", "Nova Pharma", "orange", "Escalated", "1 h left"],
  ["TCK-2035", "Invoice copy needed", "Apex Steel", "green", "Resolved", "Met"],
];

const ticketChannels: [string, number][] = [
  ["Email", 45],
  ["WhatsApp", 38],
  ["Web form", 17],
];

function SupportView() {
  return (
    <Crm page="Support">
      <div className={cn(box, "grid grid-cols-3 items-center gap-3 p-3")}>
        <Stat label="Open tickets" value="12" />
        <Stat label="First response" value="18 min" note="SLA: 1 hour" />
        <div className="flex items-center gap-2.5">
          <Pct value={96}>
            <span className={cn("text-[10px]", strong)}>4.8</span>
          </Pct>
          <span className={cn("text-[10px]", muted)}>CSAT</span>
        </div>
      </div>
      <div className={cn(box, "px-3")}>
        <ul className={rule}>
          {tickets.map(([id, subject, account, tone, status, sla]) => (
            <li key={id} className="flex items-center gap-3 py-2 text-[11px]">
              <span className={cn("w-14 shrink-0 text-[10px] max-sm:hidden", muted)}>{id}</span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className={cn("block truncate", strong)}>{subject}</span>
                <span className={cn("block truncate text-[10px]", muted)}>{account}</span>
              </span>
              <span className={cn("w-16 text-right text-[10px] max-sm:hidden", muted)}>{sla}</span>
              <span className="w-20 text-right">
                <Pill tone={tone}>{status}</Pill>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid min-h-0 flex-1 gap-3 sm:grid-cols-2">
        <div className={cn(box, "flex items-center gap-3 p-3")}>
          <Ring size={60} stroke={8} parts={ticketChannels.map(([, n], i) => [n, shades[i]])}>
            <span className={cn("text-[10px]", strong)}>86</span>
          </Ring>
          <div>
            <div className={cn("mb-1.5 text-[11px]", strong)}>Tickets by channel</div>
            <Legend items={ticketChannels.map(([c, n], i) => [`${c} ${n}%`, shades[i]])} />
          </div>
        </div>
        <div className={cn(box, "flex items-center gap-3 p-3 max-sm:hidden")}>
          <Pct value={94} size={60}>
            <span className={cn("text-[11px]", strong)}>94%</span>
          </Pct>
          <span className="leading-tight">
            <span className={cn("block text-[11px]", strong)}>SLA met</span>
            <span className={cn("block text-[10px]", muted)}>this month, 81 of 86</span>
          </span>
        </div>
      </div>
    </Crm>
  );
}

/* ---------- content ---------- */

type Module = Step & { short: string };

const modules: Module[] = [
  {
    name: "Dashboard & Analytics",
    short: "Dashboard",
    icon: LayoutDashboard,
    text: "A live view of leads, deals and team performance, the first screen your team opens every morning.",
    features: [
      "Real-time KPIs for sales and leads",
      "Team and individual performance views",
      "Revenue forecasts by pipeline stage",
      "Custom widgets for each role",
      "Exports and scheduled reports",
    ],
    outcome: "Decisions made on live numbers, not last month's spreadsheet.",
    View: DashboardView,
  },
  {
    name: "Lead Management",
    short: "Leads",
    icon: UserPlus,
    text: "Capture leads from every channel and route them to the right person the moment they arrive.",
    features: [
      "Auto-capture from website, WhatsApp, ads and email",
      "Lead scoring and qualification",
      "Auto-assignment by region or product",
      "Duplicate detection and merging",
      "Source and campaign tracking",
    ],
    outcome: "No lead sits unanswered. Every enquiry gets an owner in seconds.",
    View: LeadsView,
  },
  {
    name: "Contact & Account Management",
    short: "Contacts",
    icon: Contact,
    text: "One complete profile for every customer, with history, conversations and documents in one place.",
    features: [
      "360° customer profiles",
      "Full communication history",
      "Company accounts with multiple contacts",
      "Notes, files and custom fields",
      "Segments and tags",
    ],
    outcome: "Anyone on your team can pick up a conversation with full context.",
    View: ContactsView,
  },
  {
    name: "Sales Pipeline & Deals",
    short: "Pipeline",
    icon: Kanban,
    text: "A visual pipeline showing every deal, its value and exactly what needs to happen next.",
    features: [
      "Drag-and-drop deal stages",
      "Custom pipelines per product or team",
      "Deal values and win probability",
      "Stage-based automations",
      "Lost-deal reason tracking",
    ],
    outcome: "Clear visibility on what's closing this month, and what's stuck.",
    View: PipelineView,
  },
  {
    name: "Tasks & Follow-ups",
    short: "Tasks",
    icon: CalendarClock,
    text: "Calls, meetings and reminders scheduled automatically, so nothing falls through the cracks.",
    features: [
      "Auto-created follow-up tasks",
      "Shared team calendar",
      "Call and meeting logging",
      "Reminders on WhatsApp and email",
      "Overdue task alerts",
    ],
    outcome: "Follow-ups happen on time, every time, without anyone chasing.",
    View: CalendarView,
  },
  {
    name: "Quotations & Invoicing",
    short: "Billing",
    icon: Receipt,
    text: "Turn a deal into a quote, and a quote into an invoice, in a few clicks.",
    features: [
      "Branded quote templates",
      "One-click quote-to-invoice",
      "GST-ready invoicing",
      "Payment links and status tracking",
      "Automatic payment reminders",
    ],
    outcome: "Faster billing and fewer missed payments.",
    View: BillingView,
  },
  {
    name: "Marketing Automation",
    short: "Campaigns",
    icon: Megaphone,
    text: "Run email, WhatsApp and SMS campaigns from the same system that holds your customer data.",
    features: [
      "Email and WhatsApp campaigns",
      "Drip and nurture sequences",
      "Audience segmentation",
      "Open, click and reply tracking",
      "Landing page and form integration",
    ],
    outcome: "Leads are nurtured automatically until they're ready to buy.",
    View: CampaignsView,
  },
  {
    name: "Customer Support & Ticketing",
    short: "Support",
    icon: Headset,
    text: "Every support request tracked from first message to resolution, with SLAs the whole team can see.",
    features: [
      "Tickets from email, WhatsApp and web",
      "Priorities and SLA timers",
      "Assignment and escalation rules",
      "Canned replies and a knowledge base",
      "CSAT survey after every ticket",
    ],
    outcome: "Customers get answers fast, and nothing waits in a shared inbox.",
    View: SupportView,
  },
];

export function CrmModules() {
  return (
    <BuildStack
      eyebrow="CRM modules"
      title={
        <>
          Everything your sales team needs, <span className="text-[#ff4d31]">in one CRM.</span>
        </>
      }
      subtitle="Scroll through the modules we build. Each one is shaped around how your team sells, and all of them share the same customer data."
      steps={modules}
    />
  );
}
