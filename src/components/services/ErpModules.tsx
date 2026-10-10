import { useRef } from "react";
import type * as React from "react";
import {
  Briefcase,
  ChartColumn,
  Check,
  ChevronDown,
  Cog,
  CreditCard,
  DollarSign,
  Layers,
  Package,
  Search,
  ShoppingBag,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/showcase/kit";
import { PIN_TOP, SectionWrap } from "./ServiceVisuals";

/* ERP page: the modules as a scroll stack of big cards, each fully covering the one before. */

// Scroll between one card settling and the next arriving. It's transparent padding on top of each
// card (md:pt-20), not a margin, so every card pins the same way and the last one reaches the top.
const GAP = 80;

/* ---------- mockup pieces ---------- */

const muted = "text-neutral-500 dark:text-neutral-400";
const strong = "font-semibold text-neutral-900 dark:text-white";
const box = "rounded-lg border border-black/10 bg-white dark:border-white/10 dark:bg-neutral-900";
const line = "bg-black/10 dark:bg-white/15";
// chart series, all from the site palette
const shades = ["#ff4d31", "#ff8a73", "#ffc2b5", "#a3a3a3"];

type Tone = "green" | "orange" | "amber" | "red" | "grey";
const tones: Record<Tone, string> = {
  green: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  orange: "bg-[#ff4d31]/15 text-[#ff4d31]",
  amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  red: "bg-red-500/15 text-red-600 dark:text-red-400",
  grey: "bg-black/5 text-neutral-500 dark:bg-white/10 dark:text-neutral-400",
};

function Pill({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

function Panel({
  title,
  right,
  className,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(box, "p-3", className)}>
      <div className={cn("mb-2.5 flex items-center justify-between gap-2 text-[11px]", strong)}>
        {title}
        {right}
      </div>
      {children}
    </div>
  );
}

function Person({ name, sub, size = 20 }: { name: string; sub?: string; size?: number }) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <Avatar name={name} size={size} />
      <span className="min-w-0 leading-tight">
        <span className={cn("block truncate text-[11px]", strong)}>{name}</span>
        {sub && <span className={cn("block truncate text-[10px]", muted)}>{sub}</span>}
      </span>
    </span>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="min-w-0">
      <div className={cn("truncate text-[10px]", muted)}>{label}</div>
      <div className={cn("text-[15px] tracking-tight", strong)}>{value}</div>
      {note && (
        <div className="truncate text-[10px] text-emerald-600 dark:text-emerald-400">{note}</div>
      )}
    </div>
  );
}

/** Ring chart. `parts` are [value, colour]; a "transparent" part leaves the track showing. */
function Donut({
  parts,
  size = 108,
  stroke = 14,
  children,
}: {
  parts: [number, string][];
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const total = parts.reduce((s, [v]) => s + v, 0);
  const starts = parts.map((_, i) => parts.slice(0, i).reduce((s, [v]) => s + v, 0));
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-black/5 dark:stroke-white/10"
        />
        {parts.map(([v, color], i) => (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={`${(v / total) * c} ${c}`}
            strokeDashoffset={-(starts[i] / total) * c}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-tight">
        {children}
      </div>
    </div>
  );
}

/** Filled line for `data`, with an optional dashed comparison line on the same scale. */
function Trend({
  data,
  compare,
  className,
}: {
  data: number[];
  compare?: number[];
  className?: string;
}) {
  const all = [...data, ...(compare ?? [])];
  const max = Math.max(...all);
  const min = Math.min(...all) * 0.85;
  const pts = (d: number[]) =>
    d
      .map((v, i) => `${(i / (d.length - 1)) * 300},${96 - ((v - min) / (max - min)) * 88}`)
      .join(" L");
  return (
    <svg viewBox="0 0 300 100" preserveAspectRatio="none" className={cn("w-full", className)}>
      <path d={`M0,100 L${pts(data)} L300,100 Z`} className="fill-[#ff4d31]/10" />
      {compare && (
        <path
          d={`M${pts(compare)}`}
          fill="none"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          vectorEffect="non-scaling-stroke"
          className="stroke-neutral-400"
        />
      )}
      <path
        d={`M${pts(data)}`}
        fill="none"
        stroke="#ff4d31"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Legend({ items }: { items: [string, string][] }) {
  return (
    <div className={cn("flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-normal", muted)}>
      {items.map(([label, cls]) => (
        <span key={label} className="flex items-center gap-1.5">
          <span className={cn("h-2 w-2 rounded-sm", cls)} />
          {label}
        </span>
      ))}
    </div>
  );
}

/* ---------- 1. Sales & orders: one order's journey ---------- */

const orderSteps = [
  ["Quote", "12 Sep"],
  ["Confirmed", "14 Sep"],
  ["Picked", "20 Sep"],
  ["Shipped", "Today"],
  ["Invoiced", "On delivery"],
];

function SalesView() {
  const now = 3;
  return (
    <div className="space-y-3">
      <div className={cn(box, "p-3")}>
        <div className="flex items-center gap-3">
          <Person name="Nina Rossi" sub="SO-1048 · Victorian terrace" size={26} />
          <Pill tone="orange">Out for delivery</Pill>
          <span className={cn("ml-auto text-sm", strong)}>£18,420</span>
        </div>
        <ol className="mt-4 flex">
          {orderSteps.map(([label, date], i) => (
            <li key={label} className="relative flex flex-1 flex-col items-center text-center">
              {i > 0 && (
                <span
                  className={cn(
                    "absolute top-3 right-1/2 h-0.5 w-full",
                    i <= now ? "bg-[#ff4d31]" : line,
                  )}
                />
              )}
              <span
                className={cn(
                  "relative flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold",
                  i < now && "bg-[#ff4d31] text-white",
                  i === now &&
                    "border-2 border-[#ff4d31] bg-white text-[#ff4d31] dark:bg-neutral-900",
                  i > now && "bg-neutral-100 text-neutral-400 dark:bg-neutral-800",
                )}
              >
                {i < now ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
              </span>
              <span className={cn("mt-1.5 text-[10px]", strong)}>{label}</span>
              <span className={cn("text-[9px]", muted)}>{date}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Line items">
          <ul className="space-y-1.5 text-[11px]">
            {[
              ["Bespoke kitchen units", "1 × £13,310", "£13,310"],
              ["Oak veneer panels", "12 × £86", "£1,032"],
              ["Brass handle set", "24 × £42", "£1,008"],
            ].map(([item, qty, total]) => (
              <li key={item} className="flex items-baseline gap-2">
                <span className="min-w-0 flex-1 truncate text-neutral-800 dark:text-neutral-200">
                  {item}
                </span>
                <span className={cn("text-[10px] max-sm:hidden", muted)}>{qty}</span>
                <span className={strong}>{total}</span>
              </li>
            ))}
            <li
              className={cn(
                "flex justify-between border-t border-black/10 pt-1.5 dark:border-white/10",
                muted,
              )}
            >
              <span>VAT 20%</span>
              <span>£3,070</span>
            </li>
            <li className={cn("flex justify-between", strong)}>
              <span>Total</span>
              <span>£18,420</span>
            </li>
          </ul>
        </Panel>
        <Panel title="Activity" className="max-lg:hidden">
          <ul>
            {[
              ["Out for delivery with DPD", "Today · 09:12"],
              ["Picked and packed by Marcus", "20 Sep · 16:40"],
              ["Deposit received · £5,526", "14 Sep · 11:05"],
              ["Quote accepted online", "14 Sep · 10:58"],
            ].map(([what, when], i) => (
              <li key={what} className="relative flex gap-2.5 pb-3 last:pb-0">
                {i < 3 && <span className={cn("absolute top-3 left-[3px] h-full w-px", line)} />}
                <span
                  className={cn(
                    "relative mt-1 h-[7px] w-[7px] shrink-0 rounded-full",
                    i === 0 ? "bg-[#ff4d31]" : "bg-neutral-300 dark:bg-neutral-600",
                  )}
                />
                <span className="leading-tight">
                  <span className="block text-[11px] text-neutral-800 dark:text-neutral-200">
                    {what}
                  </span>
                  <span className={cn("text-[10px]", muted)}>{when}</span>
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

/* ---------- 2. Inventory: stock against reorder points ---------- */

// item, on hand, reorder point, target stock
const stock: [string, number, number, number][] = [
  ["Oak veneer", 14, 20, 60],
  ["Linen", 320, 100, 400],
  ["Brass sets", 48, 30, 80],
  ["Marble slab", 3, 4, 10],
  ["Chalk paint", 26, 10, 40],
  ["Walnut", 9, 12, 40],
  ["Tiles", 410, 150, 500],
  ["Velvet", 58, 40, 120],
];

function InventoryView() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1 text-[11px]">
        {["All locations", "London", "Leeds"].map((t, i) => (
          <span
            key={t}
            className={cn(
              "rounded-md px-2.5 py-1 font-medium",
              i === 0 ? "bg-[#ff4d31] text-white" : cn("bg-black/5 dark:bg-white/10", muted),
            )}
          >
            {t}
          </span>
        ))}
      </div>
      <Panel
        title="Stock vs reorder point"
        right={
          <Legend
            items={[
              ["On hand", "bg-emerald-500"],
              ["Below reorder", "bg-amber-500"],
            ]}
          />
        }
      >
        <div className="flex h-40 items-end gap-2 border-b border-black/10 dark:border-white/10">
          {stock.map(([name, have, reorder, target], i) => (
            <div key={name} className={cn("relative h-full flex-1", i > 5 && "max-sm:hidden")}>
              <div
                className={cn(
                  "absolute inset-x-0 bottom-0 rounded-t",
                  have < reorder ? "bg-amber-500" : "bg-emerald-500/80",
                )}
                style={{ height: `${(have / target) * 100}%` }}
              />
              {/* reorder point */}
              <div
                className="absolute -inset-x-1 border-t-2 border-dashed border-neutral-700 dark:border-neutral-300"
                style={{ bottom: `${(reorder / target) * 100}%` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex gap-2">
          {stock.map(([name], i) => (
            <span
              key={name}
              className={cn(
                "flex-1 truncate text-center text-[9px]",
                muted,
                i > 5 && "max-sm:hidden",
              )}
            >
              {name}
            </span>
          ))}
        </div>
      </Panel>
      <div className="grid grid-cols-3 gap-3 px-1">
        <Stat label="Stock value" value="£212,480" />
        <Stat label="Below reorder" value="3 items" />
        <Stat label="Stock turn" value="6.2×" note="+0.8 vs last year" />
      </div>
      <div className={cn(box, "flex items-center gap-2 px-3 py-2 text-[11px]")}>
        <Pill tone="orange">Auto</Pill>
        <span className="truncate text-neutral-800 dark:text-neutral-200">
          PO-4471 raised for 4 × marble worktop slab from Stone & Co
        </span>
      </div>
    </div>
  );
}

/* ---------- 3. Manufacturing: the week's production schedule ---------- */

type Job = [start: number, length: number, label: string, state: "done" | "now" | "next"];
const lanes: [string, Job[]][] = [
  [
    "CNC router",
    [
      [0, 1.4, "WO-311 Carcasses", "done"],
      [1.5, 1.8, "WO-314 Wardrobe panels", "now"],
      [3.5, 1.4, "WO-316 Shelving", "next"],
    ],
  ],
  [
    "Joinery",
    [
      [0.3, 1.9, "WO-309 Studio frame", "done"],
      [2.3, 2.6, "WO-311 Kitchen assembly", "now"],
    ],
  ],
  [
    "Spray booth",
    [
      [0.8, 1.2, "WO-310 Doors", "done"],
      [3.1, 1.5, "WO-311 Lacquer", "next"],
    ],
  ],
  [
    "Upholstery",
    [
      [0, 2.9, "WO-312 Banquette seating", "now"],
      [3.1, 1.7, "WO-315 Cushions", "next"],
    ],
  ],
  [
    "QC & pack",
    [
      [2, 0.9, "WO-310", "done"],
      [4, 0.9, "WO-309", "next"],
    ],
  ],
];
const jobTone = {
  done: "bg-emerald-500/85 text-white",
  now: "bg-[#ff4d31] text-white",
  next: "bg-black/[0.07] text-neutral-600 dark:bg-white/10 dark:text-neutral-300",
};

function ManufacturingView() {
  const today = 2.55; // Wednesday afternoon
  return (
    <div className="space-y-3">
      <Panel
        title="Production schedule · week 39"
        right={
          <span className="max-sm:hidden">
            <Legend
              items={[
                ["Done", "bg-emerald-500"],
                ["Running", "bg-[#ff4d31]"],
                ["Planned", "bg-black/15 dark:bg-white/20"],
              ]}
            />
          </span>
        }
      >
        <div className="flex text-[9px]">
          <span className="w-16 shrink-0 lg:w-20" />
          {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => (
            <span key={d} className={cn("flex-1", muted)}>
              {d}
            </span>
          ))}
        </div>
        <div className="relative mt-1">
          {lanes.map(([lane, jobs]) => (
            <div
              key={lane}
              className="flex items-center border-t border-black/5 py-1.5 dark:border-white/5"
            >
              <span className="w-16 shrink-0 truncate text-[10px] text-neutral-700 lg:w-20 dark:text-neutral-300">
                {lane}
              </span>
              <div className="relative h-6 flex-1">
                {jobs.map(([start, len, label, state]) => (
                  <span
                    key={label}
                    className={cn(
                      "absolute inset-y-0 flex items-center overflow-hidden rounded px-1.5 text-[9px] font-medium whitespace-nowrap",
                      jobTone[state],
                    )}
                    style={{ left: `${(start / 5) * 100}%`, width: `${(len / 5) * 100}%` }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {/* today */}
          <div className="pointer-events-none absolute inset-y-0 right-0 left-16 lg:left-20">
            <span
              className="absolute inset-y-0 w-0.5 bg-neutral-900 dark:bg-white"
              style={{ left: `${(today / 5) * 100}%` }}
            />
          </div>
        </div>
      </Panel>
      <div className={cn(box, "p-3")}>
        <div className="flex items-center gap-2 text-[11px]">
          <span className={strong}>WO-311 · Bespoke kitchen</span>
          <span className={cn("max-sm:hidden", muted)}>for Nina Rossi</span>
          <span className={cn("ml-auto", strong)}>18 / 29 units</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
          <div className="h-full w-[62%] rounded-full bg-[#ff4d31]" />
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <Pill tone="green">Oak veneer reserved</Pill>
          <Pill tone="green">Brass handles reserved</Pill>
          <Pill tone="amber">Marble slab · awaiting PO</Pill>
        </div>
      </div>
    </div>
  );
}

/* ---------- 4. Purchasing: a purchase order going through approval ---------- */

const approval: [string, string, "done" | "now" | "next"][] = [
  ["Requested", "Marcus Reid · 22 Sep", "done"],
  ["Budget check", "Within project budget", "done"],
  ["Approval", "Waiting on Sarah Mills", "now"],
  ["Sent to supplier", "Emailed automatically", "next"],
  ["Received & matched", "PO · delivery note · invoice", "next"],
];

function ProcurementView() {
  return (
    <div className="grid gap-3 lg:grid-cols-5">
      {/* the document itself */}
      <div className={cn(box, "p-4 lg:col-span-3")}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className={cn("text-[9px] font-semibold tracking-widest uppercase", muted)}>
              Purchase order
            </div>
            <div className={cn("text-lg tracking-tight", strong)}>PO-4471</div>
          </div>
          <Pill tone="orange">Awaiting approval</Pill>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-[10px]">
          {[
            ["Supplier", "Stone & Co", "Unit 4, Leeds LS9"],
            ["Deliver to", "Northline Studio", "London E8"],
          ].map(([k, a, b]) => (
            <div key={k}>
              <div className={muted}>{k}</div>
              <div className={strong}>{a}</div>
              <div className={muted}>{b}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-[10px]">
          <div className={cn("flex border-b border-black/10 pb-1 dark:border-white/10", muted)}>
            <span className="flex-1">Item</span>
            <span className="w-8 text-right">Qty</span>
            <span className="w-14 text-right">Price</span>
            <span className="w-14 text-right">Total</span>
          </div>
          {[
            ["Marble worktop slab", "4", "£1,240", "£4,960"],
            ["Delivery & install", "1", "£180", "£180"],
          ].map(([item, qty, price, total]) => (
            <div
              key={item}
              className="flex border-b border-black/5 py-1.5 text-neutral-800 dark:border-white/5 dark:text-neutral-200"
            >
              <span className="flex-1 truncate">{item}</span>
              <span className="w-8 text-right">{qty}</span>
              <span className="w-14 text-right">{price}</span>
              <span className="w-14 text-right">{total}</span>
            </div>
          ))}
          <div className={cn("flex justify-end gap-6 pt-1.5", muted)}>
            <span>VAT £1,028</span>
            <span className={strong}>Total £6,168</span>
          </div>
        </div>
        <p className={cn("mt-3 text-[10px]", muted)}>
          Raised automatically when stock fell below the reorder point.
        </p>
      </div>
      {/* who it goes through */}
      <Panel title="Approval chain" className="lg:col-span-2 max-lg:hidden">
        <ol>
          {approval.map(([step, sub, state], i) => (
            <li key={step} className="relative flex gap-2.5 pb-4 last:pb-0">
              {i < approval.length - 1 && (
                <span
                  className={cn(
                    "absolute top-5 left-[9px] h-full w-0.5",
                    state === "done" ? "bg-emerald-500" : line,
                  )}
                />
              )}
              <span
                className={cn(
                  "relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                  state === "done" && "bg-emerald-500 text-white",
                  state === "now" && "border-2 border-[#ff4d31] bg-white dark:bg-neutral-900",
                  state === "next" && "bg-neutral-100 dark:bg-neutral-800",
                )}
              >
                {state === "done" && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
              <span className="min-w-0 leading-tight">
                <span className={cn("block text-[11px]", state === "next" ? muted : strong)}>
                  {step}
                </span>
                <span className={cn("block truncate text-[10px]", muted)}>{sub}</span>
                {state === "now" && (
                  <span className="mt-1.5 flex gap-1.5 text-[10px] font-semibold">
                    <span className="rounded bg-[#ff4d31] px-2 py-0.5 text-white">Approve</span>
                    <span className={cn("rounded bg-black/5 px-2 py-0.5 dark:bg-white/10", muted)}>
                      Reject
                    </span>
                  </span>
                )}
              </span>
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  );
}

/* ---------- 5. Warehouse & supply chain: what's on the road ---------- */

// map points in the 400×160 viewBox; hubs are our own sites
const places: [x: number, y: number, label: string, hub: boolean][] = [
  [340, 26, "Stone & Co", false],
  [250, 40, "Leeds warehouse", true],
  [150, 60, "Daniel Park", false],
  [272, 126, "London studio", true],
  [196, 140, "Nina Rossi", false],
];

function WarehouseView() {
  return (
    <div className="space-y-3">
      <div className={cn(box, "overflow-hidden")}>
        <div
          className="relative aspect-[400/160] w-full"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(128,128,128,.22) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        >
          <svg viewBox="0 0 400 160" className="absolute inset-0 h-full w-full">
            {/* roads */}
            <g
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              className="stroke-black/[0.05] dark:stroke-white/[0.06]"
            >
              <path d="M0,96 C90,86 150,20 400,52" />
              <path d="M30,160 C130,112 250,168 400,118" />
              <path d="M118,0 C150,60 230,98 236,160" />
            </g>
            {/* routes: delivered, in transit, scheduled */}
            <g fill="none" strokeLinecap="round">
              <path d="M340,26 L250,40" strokeWidth="2" className="stroke-emerald-500" />
              <path d="M250,40 Q200,40 150,60" strokeWidth="2" className="stroke-emerald-500" />
              <path
                d="M250,40 Q300,84 272,126"
                stroke="#ff4d31"
                strokeWidth="2.5"
                strokeDasharray="6 5"
              />
              <path
                d="M272,126 Q236,150 196,140"
                strokeWidth="2"
                strokeDasharray="3 4"
                className="stroke-neutral-400"
              />
            </g>
            {places.map(([x, y, label, hub]) =>
              hub ? (
                <rect
                  key={label}
                  x={x - 6}
                  y={y - 6}
                  width="12"
                  height="12"
                  rx="3"
                  fill="#ff4d31"
                />
              ) : (
                <circle
                  key={label}
                  cx={x}
                  cy={y}
                  r="5"
                  className="fill-neutral-800 dark:fill-neutral-200"
                />
              ),
            )}
          </svg>
          {places.map(([x, y, label]) => (
            <span
              key={label}
              className="absolute -translate-x-1/2 translate-y-2.5 rounded bg-white/90 px-1.5 text-[9px] font-medium whitespace-nowrap text-neutral-700 dark:bg-neutral-900/90 dark:text-neutral-200"
              style={{ left: `${(x / 400) * 100}%`, top: `${(y / 160) * 100}%` }}
            >
              {label}
            </span>
          ))}
          {/* the van, part way along Leeds → London */}
          <span
            className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#ff4d31] text-white ring-4 ring-white dark:ring-neutral-900"
            style={{ left: "70.4%", top: "55.3%" }}
          >
            <Truck className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
      <div className="grid gap-3 lg:grid-cols-5">
        <Panel title="Shipments" className="lg:col-span-3">
          <ul className="space-y-2 text-[11px]">
            {(
              [
                ["Leeds → London studio", "SH-2091 · 14 items · ETA 15:40", "In transit", "orange"],
                ["Stone & Co → Leeds", "SH-2090 · 4 marble slabs", "Delivered", "green"],
                ["London → Nina Rossi", "SH-2092 · kitchen units · tomorrow", "Scheduled", "grey"],
              ] as const
            ).map(([route, sub, s, tone]) => (
              <li key={route} className="flex items-center gap-2">
                <span className="min-w-0 flex-1 leading-tight">
                  <span className={cn("block truncate", strong)}>{route}</span>
                  <span className={cn("block truncate text-[10px]", muted)}>{sub}</span>
                </span>
                <Pill tone={tone}>{s}</Pill>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Capacity" className="lg:col-span-2 max-lg:hidden">
          {(
            [
              ["Leeds", 78],
              ["London", 41],
            ] as const
          ).map(([site, pct]) => (
            <div key={site} className="mb-2.5 text-[10px] last:mb-0">
              <div className="flex justify-between">
                <span className={muted}>{site}</span>
                <span className={strong}>{pct}% full</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                <div className="h-full rounded-full bg-[#ff4d31]" style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

/* ---------- 6. Projects: one job's board and budget ---------- */

const board: [string, [string, string, string][]][] = [
  [
    "To do",
    [
      ["Order lighting fixtures", "Emily Ward", "Procurement"],
      ["Snagging walkthrough", "Marcus Reid", "Site"],
    ],
  ],
  [
    "In progress",
    [
      ["Kitchen install", "Tom Becker", "Site"],
      ["Bathroom tiling", "Marcus Reid", "Site"],
    ],
  ],
  ["Review", [["Joinery drawings v3", "Sarah Mills", "Design"]]],
  [
    "Done",
    [
      ["Electrics first fix", "Leo Martins", "Site"],
      ["Plastering", "Leo Martins", "Site"],
    ],
  ],
];

function ProjectView() {
  return (
    <div className="space-y-3">
      <div className={cn(box, "flex items-center gap-3 p-3")}>
        <Donut
          parts={[
            [64, "#ff4d31"],
            [36, "transparent"],
          ]}
          size={56}
          stroke={7}
        >
          <span className={cn("text-[11px]", strong)}>64%</span>
        </Donut>
        <div className="min-w-0 flex-1 leading-tight">
          <div className={cn("text-sm", strong)}>Penthouse renovation</div>
          <div className={cn("text-[10px]", muted)}>Omar Farouk · handover 18 Nov</div>
          <div className="mt-1 text-[10px] text-neutral-700 dark:text-neutral-300">
            £79,360 of £124,000 budget used
          </div>
        </div>
        <div className="flex -space-x-2 max-sm:hidden">
          {["Sarah Mills", "Leo Martins", "Marcus Reid", "Tom Becker"].map((p) => (
            <span key={p} className="rounded-full ring-2 ring-white dark:ring-neutral-900">
              <Avatar name={p} size={24} />
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {board.map(([col, tasks], ci) => (
          <div
            key={col}
            className={cn(
              "rounded-lg bg-black/[0.03] p-2 dark:bg-white/[0.04]",
              ci > 1 && "max-lg:hidden",
            )}
          >
            <div className="mb-2 flex items-center justify-between text-[10px]">
              <span className={strong}>{col}</span>
              <span className={muted}>{tasks.length}</span>
            </div>
            <div className="space-y-1.5">
              {tasks.map(([task, who, tag]) => (
                <div key={task} className={cn(box, "p-2")}>
                  <div
                    className={cn(
                      "text-[10px] leading-snug",
                      col === "Done" ? cn("line-through", muted) : strong,
                    )}
                  >
                    {task}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <Pill
                      tone={tag === "Design" ? "orange" : tag === "Procurement" ? "amber" : "grey"}
                    >
                      {tag}
                    </Pill>
                    <Avatar name={who} size={18} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 7. HR: the org chart ---------- */

const teams: [string, string, number, string[]][] = [
  ["Sarah Mills", "Design lead", 8, ["Emily Ward", "Sofia Alvarez"]],
  ["Leo Martins", "Projects lead", 14, ["Marcus Reid", "Tom Becker"]],
  ["Hannah Cole", "Finance & ops", 6, ["Grace Liu", "Ben Carter"]],
];

function OrgNode({ name, role, away }: { name: string; role: string; away?: boolean }) {
  return (
    <div className={cn(box, "relative flex w-full items-center gap-2 p-2")}>
      <Person name={name} sub={role} size={26} />
      <span
        className={cn(
          "absolute top-2 right-2 h-2 w-2 rounded-full",
          away ? "bg-amber-500" : "bg-emerald-500",
        )}
      />
    </div>
  );
}

function HrView() {
  return (
    <div className="space-y-0">
      <div className="mx-auto w-44">
        <OrgNode name="Richard Hale" role="Managing director" />
      </div>
      <div className={cn("mx-auto h-3 w-px", line)} />
      <div className="relative grid grid-cols-3 gap-2 lg:gap-3">
        <span className={cn("absolute top-0 right-[16.7%] left-[16.7%] h-px", line)} />
        {teams.map(([lead, role, size, members]) => (
          <div key={lead} className="flex min-w-0 flex-col items-center">
            <span className={cn("h-3 w-px", line)} />
            <OrgNode name={lead} role={`${role} · ${size}`} away={lead === "Leo Martins"} />
            <span className={cn("h-3 w-px", line)} />
            <div className="w-full space-y-1.5 rounded-lg bg-black/[0.03] p-2 dark:bg-white/[0.04]">
              {members.map((m) => (
                <Person key={m} name={m} size={18} />
              ))}
              <span className={cn("block text-[10px]", muted)}>+{size - 3} more</span>
            </div>
          </div>
        ))}
      </div>
      <div className={cn(box, "mt-3 grid grid-cols-3 gap-3 px-3 py-2")}>
        <Stat label="Headcount" value="42" note="+3 this quarter" />
        <Stat label="Starting Monday" value="2" />
        <Stat label="Open roles" value="3" />
      </div>
    </div>
  );
}

/* ---------- 8. Payroll & attendance: the month at a glance ---------- */

// one letter per working day in September: present, remote, late (T), leave, sick
const attendance: [string, string][] = [
  ["Sarah", "PPPPRPPPPRPPPPRPPPPR"],
  ["Leo", "PPPPPPPPPPLLLLLPPPPP"],
  ["Marcus", "PPTPPPPPPPPTPPPPPPPP"],
  ["Emily", "RPPPPRPPPPRPPPSSPPPP"],
  ["Tom", "PPPPPPPTPPPPPPPPLLPP"],
  ["Hannah", "PRPRPPRPRPPRPRPPRPRP"],
];
const dayTone: Record<string, string> = {
  P: "bg-emerald-500",
  R: "bg-emerald-500/35",
  T: "bg-amber-400",
  L: "bg-[#ff4d31]",
  S: "bg-red-500",
};
const payRun: [string, number][] = [
  ["Net pay", 31240],
  ["Income tax", 6120],
  ["National Insurance", 3410],
  ["Pension", 1410],
];

function PayrollView() {
  return (
    <div className="grid gap-3 lg:grid-cols-5">
      <Panel
        title="Attendance · September"
        right={<span className={cn("text-[10px] font-normal", muted)}>20 working days</span>}
        className="lg:col-span-3"
      >
        <div className="space-y-1.5">
          {attendance.map(([who, days]) => (
            <div key={who} className="flex items-center gap-2">
              <span className="w-12 shrink-0 truncate text-[10px] text-neutral-700 dark:text-neutral-300">
                {who}
              </span>
              <div className="grid flex-1 grid-cols-[repeat(20,minmax(0,1fr))] gap-[3px]">
                {[...days].map((d, i) => (
                  <span key={i} className={cn("aspect-square rounded-[3px]", dayTone[d])} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Legend
            items={[
              ["Present", dayTone.P],
              ["Remote", dayTone.R],
              ["Late", dayTone.T],
              ["Leave", dayTone.L],
              ["Sick", dayTone.S],
            ]}
          />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3 border-t border-black/5 pt-2.5 dark:border-white/5">
          <Stat label="Attendance" value="96.4%" />
          <Stat label="Late arrivals" value="4" />
          <Stat label="Overtime" value="38h" />
        </div>
      </Panel>
      <Panel title="Payroll run · 28 Sep" className="lg:col-span-2 max-lg:hidden">
        <div className="flex justify-center">
          <Donut parts={payRun.map(([, v], i) => [v, shades[i]])}>
            <span className={cn("text-[9px]", muted)}>Gross</span>
            <span className={cn("text-[13px]", strong)}>£42,180</span>
          </Donut>
        </div>
        <ul className="mt-3 space-y-1 text-[10px]">
          {payRun.map(([k, v], i) => (
            <li key={k} className="flex items-center gap-1.5">
              <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: shades[i] }} />
              <span className={cn("flex-1 truncate", muted)}>{k}</span>
              <span className={strong}>£{v.toLocaleString("en-GB")}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 rounded-md bg-[#ff4d31] py-1.5 text-center text-[11px] font-semibold text-white">
          Run payroll for 42 people
        </div>
      </Panel>
    </div>
  );
}

/* ---------- 9. Finance & accounting: where the money went ---------- */

// label, top and bottom of the bar in £k, kind
const waterfall: [string, number, number, "total" | "down" | "net"][] = [
  ["Revenue", 184.2, 0, "total"],
  ["Cost of sales", 184.2, 97.8, "down"],
  ["Gross profit", 97.8, 0, "total"],
  ["Operating costs", 97.8, 63.2, "down"],
  ["Net profit", 63.2, 0, "net"],
];
const aging: [string, number, string][] = [
  ["Current", 42300, "bg-emerald-500"],
  ["1–30 days", 18100, "bg-amber-400"],
  ["31–60 days", 8200, "bg-[#ff4d31]"],
  ["60+ days", 4320, "bg-red-600"],
];

function FinanceView() {
  const max = 200;
  const owed = aging.reduce((s, [, v]) => s + v, 0);
  return (
    <div className="space-y-3">
      <Panel title="Profit & loss · September" right={<Pill tone="green">34% net margin</Pill>}>
        <div className="flex h-44 gap-3 border-b border-black/10 dark:border-white/10">
          {waterfall.map(([label, top, bottom, kind]) => (
            <div key={label} className="relative h-full flex-1">
              <div
                className={cn(
                  "absolute inset-x-0 rounded-sm",
                  kind === "total" && "bg-neutral-800 dark:bg-neutral-300",
                  kind === "down" && "bg-red-500/80",
                  kind === "net" && "bg-[#ff4d31]",
                )}
                style={{
                  bottom: `${(bottom / max) * 100}%`,
                  height: `${((top - bottom) / max) * 100}%`,
                }}
              />
              <span
                className={cn("absolute inset-x-0 pb-0.5 text-center text-[10px]", strong)}
                style={{ bottom: `${(top / max) * 100}%` }}
              >
                {kind === "down" ? "−" : ""}£{(top - bottom).toFixed(1)}k
              </span>
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex gap-3">
          {waterfall.map(([label]) => (
            <span key={label} className={cn("flex-1 truncate text-center text-[9px]", muted)}>
              {label}
            </span>
          ))}
        </div>
      </Panel>
      <div className="grid gap-3 lg:grid-cols-5">
        <Panel
          title="Money owed to you"
          right={<span className={strong}>£{owed.toLocaleString("en-GB")}</span>}
          className="lg:col-span-3"
        >
          <div className="flex h-3 overflow-hidden rounded-full">
            {aging.map(([k, v, cls]) => (
              <span key={k} className={cls} style={{ width: `${(v / owed) * 100}%` }} />
            ))}
          </div>
          <div className="mt-2">
            <Legend items={aging.map(([k, , cls]) => [k, cls])} />
          </div>
        </Panel>
        <Panel title="Bank" className="lg:col-span-2 max-lg:hidden">
          <div className="text-[11px] leading-snug">
            <span className={strong}>142 / 142</span>{" "}
            <span className={muted}>transactions matched today</span>
          </div>
          <div className="mt-2">
            <Pill tone="green">VAT Q3 ready to file</Pill>
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ---------- 10. Reports & BI: everything in one view ---------- */

const serviceMix: [string, number][] = [
  ["Kitchens", 38],
  ["Renovations", 29],
  ["Furniture", 21],
  ["Styling", 12],
];

function ReportsView() {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
        {["This quarter", "All locations", "vs last year"].map((f) => (
          <span key={f} className={cn(box, "flex items-center gap-1 px-2 py-1", muted)}>
            {f}
            <ChevronDown className="h-3 w-3" />
          </span>
        ))}
        <span className="ml-auto rounded-md bg-[#ff4d31] px-2.5 py-1 font-semibold text-white max-sm:hidden">
          Export
        </span>
      </div>
      <div className="grid gap-3 lg:grid-cols-5">
        <Panel
          title="Revenue"
          right={
            <Legend
              items={[
                ["This year", "bg-[#ff4d31]"],
                ["Last year", "bg-neutral-400"],
              ]}
            />
          }
          className="lg:col-span-3"
        >
          <div className={cn("text-lg tracking-tight", strong)}>
            £1.42M{" "}
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              +18.6%
            </span>
          </div>
          <Trend
            data={[62, 58, 71, 69, 84, 92, 88, 104, 118, 126, 131, 148]}
            compare={[54, 52, 58, 61, 66, 70, 74, 79, 84, 88, 95, 101]}
            className="mt-1 h-24"
          />
        </Panel>
        <Panel title="Revenue by service" className="lg:col-span-2 max-lg:hidden">
          <div className="flex items-center gap-3">
            <Donut parts={serviceMix.map(([, v], i) => [v, shades[i]])} size={84} stroke={12}>
              <span className={cn("text-[11px]", strong)}>£1.42M</span>
            </Donut>
            <ul className="min-w-0 flex-1 space-y-1 text-[10px]">
              {serviceMix.map(([k, v], i) => (
                <li key={k} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: shades[i] }} />
                  <span className={cn("flex-1 truncate", muted)}>{k}</span>
                  <span className={strong}>{v}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>
      <div className="grid gap-3 lg:grid-cols-5">
        <Panel title="Top clients" className="lg:col-span-3">
          <ul className="space-y-2">
            {(
              [
                ["Omar Farouk", "£124,000", 100],
                ["Nina Rossi", "£86,500", 70],
                ["Jonah Weiss", "£68,000", 55],
              ] as const
            ).map(([who, value, w]) => (
              <li key={who} className="flex items-center gap-2 text-[10px]">
                <span className="w-20 shrink-0 truncate text-neutral-700 dark:text-neutral-300">
                  {who}
                </span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                  <span
                    className="block h-full rounded-full bg-[#ff4d31]"
                    style={{ width: `${w}%` }}
                  />
                </span>
                <span className={cn("w-14 text-right", strong)}>{value}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Gross margin" className="lg:col-span-2 max-lg:hidden">
          <div className={cn("text-2xl tracking-tight", strong)}>53.1%</div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
            +2.4 pts vs last quarter
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ---------- content ---------- */

type Module = {
  slug: string;
  name: string;
  /** sidebar label */
  short: string;
  icon: React.ElementType;
  text: string;
  features: string[];
  View: () => React.ReactElement;
};

// Ordered the way an order moves through the business, ending with the view over all of it.
const modules: Module[] = [
  {
    slug: "sales",
    name: "Sales & Order Management",
    short: "Sales & Orders",
    icon: ShoppingBag,
    text: "Quotes, orders and deliveries in one flow, from the first price to the final invoice.",
    features: [
      "Quote to order in one click",
      "Live order status for every customer",
      "Deposits and invoices raised from the order",
      "Sales by rep, product and region",
    ],
    View: SalesView,
  },
  {
    slug: "inventory",
    name: "Inventory Management",
    short: "Inventory",
    icon: Package,
    text: "Live stock across every location, with reorders raised before anything runs out.",
    features: [
      "Live stock across locations",
      "Reorder points and automatic POs",
      "SKU, batch and serial tracking",
      "Real-time stock valuation",
    ],
    View: InventoryView,
  },
  {
    slug: "manufacturing",
    name: "Manufacturing & Production",
    short: "Manufacturing",
    icon: Cog,
    text: "Work orders, materials and machines scheduled together, so the shop floor always knows what's next.",
    features: [
      "Bills of materials and work orders",
      "Scheduling by workstation",
      "Materials reserved automatically",
      "Progress tracked live",
    ],
    View: ManufacturingView,
  },
  {
    slug: "procurement",
    name: "Purchase & Procurement",
    short: "Purchasing",
    icon: ShoppingCart,
    text: "Purchase orders raised, approved and matched to what actually arrived.",
    features: [
      "Requests and approval chains",
      "Supplier prices and lead times",
      "Automatic POs from reorder points",
      "Three-way match: PO, delivery, invoice",
    ],
    View: ProcurementView,
  },
  {
    slug: "warehouse",
    name: "Warehouse & Supply Chain",
    short: "Warehouse",
    icon: Truck,
    text: "Goods in, goods out and everything on the road, tracked from supplier to customer.",
    features: [
      "Shipment and delivery tracking",
      "Bin locations and pick lists",
      "Transfers between sites",
      "Capacity across warehouses",
    ],
    View: WarehouseView,
  },
  {
    slug: "projects",
    name: "Project Management",
    short: "Projects",
    icon: Layers,
    text: "Every job's tasks, budget and deadline in one place, tied to its costs and stock.",
    features: [
      "A task board for every project",
      "Budget against actual, live",
      "Time and materials logged per job",
      "Milestones and client handovers",
    ],
    View: ProjectView,
  },
  {
    slug: "hr",
    name: "HR Management",
    short: "HR",
    icon: Briefcase,
    text: "Your people, roles and reporting lines, from their first day to every review.",
    features: [
      "Staff records and documents",
      "Org chart and reporting lines",
      "Onboarding checklists",
      "Reviews and training records",
    ],
    View: HrView,
  },
  {
    slug: "payroll",
    name: "Payroll & Attendance",
    short: "Payroll",
    icon: CreditCard,
    text: "Attendance feeds payroll directly, so the monthly run takes minutes, not days.",
    features: [
      "Clock-ins, leave and absence",
      "Rotas and overtime",
      "Tax, NI and pension worked out",
      "Payslips sent automatically",
    ],
    View: PayrollView,
  },
  {
    slug: "finance",
    name: "Finance & Accounting",
    short: "Finance",
    icon: DollarSign,
    text: "Invoices, payments and the books, created from the work your team already does.",
    features: [
      "Invoices, bills and payments",
      "Bank reconciliation",
      "P&L, balance sheet and cash flow",
      "VAT returns ready to file",
    ],
    View: FinanceView,
  },
  {
    slug: "reports",
    name: "Reports & Business Intelligence",
    short: "Reports & BI",
    icon: ChartColumn,
    text: "Every module feeds one set of reports, so leadership sees the whole business in one place.",
    features: [
      "Live dashboards for every team",
      "Drill down from any number",
      "Scheduled reports by email",
      "Compare periods and locations",
    ],
    View: ReportsView,
  },
];

/* ---------- the section ---------- */

function Features({ m }: { m: Module }) {
  return (
    <ul className="space-y-2.5">
      {m.features.map((f) => (
        <li key={f} className="flex items-start gap-2.5 text-neutral-700 dark:text-neutral-300">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ff4d31]/15 text-[#ff4d31]">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          {f}
        </li>
      ))}
    </ul>
  );
}

/** One module's screen inside the ERP's app window. */
function ModuleCard({ m }: { m: Module }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white dark:border-white/10 dark:bg-neutral-900">
      <div className="flex items-center gap-3 border-b border-black/5 bg-neutral-100 px-3 py-2 dark:border-white/5 dark:bg-neutral-950">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span
          className={cn(
            "mx-auto truncate rounded-md bg-white px-3 py-0.5 text-[11px] dark:bg-neutral-800",
            muted,
          )}
        >
          ops.northline.app/{m.slug}
        </span>
        <span className="w-[46px]" />
      </div>
      <div className="flex min-h-0 flex-1" aria-hidden>
        <aside className="w-36 shrink-0 border-r border-black/5 bg-neutral-50 p-2 max-lg:hidden dark:border-white/5 dark:bg-neutral-950/60">
          <div className="mb-3 flex items-center gap-2 px-2 pt-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#ff4d31] text-[11px] font-bold text-white">
              N
            </span>
            <span className={cn("text-[11px]", strong)}>Northline</span>
          </div>
          {modules.map((x) => (
            <div
              key={x.slug}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px]",
                x === m
                  ? "bg-[#ff4d31]/10 font-semibold text-[#ff4d31]"
                  : "text-neutral-600 dark:text-neutral-400",
              )}
            >
              <x.icon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{x.short}</span>
            </div>
          ))}
        </aside>
        <div className="min-w-0 flex-1 overflow-hidden bg-neutral-50/60 p-3 md:p-4 dark:bg-transparent">
          <div className="mb-3 flex items-center gap-2">
            <span className={cn("text-sm", strong)}>{m.short}</span>
            <span
              className={cn(
                "ml-auto flex items-center gap-1.5 rounded-md border border-black/10 px-2 py-1 text-[10px] max-sm:hidden dark:border-white/10",
                muted,
              )}
            >
              <Search className="h-3 w-3" />
              Search
            </span>
            <Avatar name="Sarah Mills" size={22} />
          </div>
          <m.View />
        </div>
      </div>
    </div>
  );
}

export function ErpModules() {
  const n = modules.length;
  const col = useRef<HTMLDivElement>(null);

  // Scroll so card i has just settled on top of the stack.
  const pick = (i: number) => {
    const first = col.current?.firstElementChild as HTMLElement | null;
    if (!col.current || !first) return;
    const top = col.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + i * first.offsetHeight - (PIN_TOP - GAP), behavior: "smooth" });
  };

  return (
    <SectionWrap
      id="modules"
      eyebrow="Modules"
      title={
        <>
          Every department, <span className="text-[#ff4d31]">one system.</span>
        </>
      }
      subtitle="Scroll through the modules we build. Each one is shaped around how that team works, and all of them share the same data."
    >
      {/* Every card pins at the same spot, so the next one slides up and covers it completely.
          On phones a card is sized to the screen, so it can pin too. */}
      <div ref={col}>
        {modules.map((m, i) => (
          <div
            key={m.slug}
            className="pointer-events-none sticky pt-20"
            style={{ top: PIN_TOP - GAP }}
          >
            <div className="pointer-events-auto h-[min(720px,calc(100svh_-_128px))] rounded-3xl border border-black/10 bg-white p-4 md:h-[580px] md:p-6 dark:border-white/10 dark:bg-[#111113]">
              <div className="flex h-full flex-col gap-4 md:grid md:grid-cols-12 md:items-center md:gap-8">
                <div className="shrink-0 md:col-span-5 md:pl-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff4d31]/15 text-[#ff4d31]">
                      <m.icon className="h-5 w-5" />
                    </span>
                    <span className={cn("text-sm font-semibold tabular-nums", muted)}>
                      {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-neutral-950 md:mt-5 md:text-3xl lg:text-4xl dark:text-white">
                    {m.name}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600 md:mt-3 md:text-base lg:text-lg dark:text-neutral-400">
                    {m.text}
                  </p>
                  {/* no room on phones */}
                  <div className="mt-6 text-sm max-md:hidden lg:text-base">
                    <Features m={m} />
                  </div>
                  <div className="mt-8 flex gap-1.5 max-md:hidden">
                    {modules.map((x, j) => (
                      <button
                        key={x.slug}
                        type="button"
                        onClick={() => pick(j)}
                        aria-label={`Show ${x.name}`}
                        aria-current={j === i ? "step" : undefined}
                        className="group flex-1 py-2"
                      >
                        <span
                          className={cn(
                            "block h-1 rounded-full transition-colors",
                            j <= i
                              ? "bg-[#ff4d31]"
                              : "bg-black/10 group-hover:bg-black/20 dark:bg-white/10 dark:group-hover:bg-white/20",
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="min-h-0 min-w-0 flex-1 md:col-span-7 md:h-full">
                  <ModuleCard m={m} />
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* a little scroll with the last card settled before the stack moves on */}
        <div aria-hidden className="h-32" />
      </div>
    </SectionWrap>
  );
}
