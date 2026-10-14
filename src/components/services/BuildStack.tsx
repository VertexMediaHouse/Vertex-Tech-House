import { useRef } from "react";
import type * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PIN_TOP, SectionWrap } from "./ServiceVisuals";

/*
 * A service built step by step, as a scroll stack. Same card as the ERP modules: the step on
 * the left, and on the right what's been built so far, one stage further along on each card.
 */

// Scroll between one card settling and the next arriving, as on the ERP page.
const GAP = 80;

export const muted = "text-neutral-500 dark:text-neutral-400";
export const strong = "font-semibold text-neutral-900 dark:text-white";

export const box =
  "rounded-lg border border-black/10 bg-white dark:border-white/10 dark:bg-neutral-900";
export const rule = "divide-y divide-black/5 dark:divide-white/5";
export const body = "text-neutral-800 dark:text-neutral-200";

export type Tone = "green" | "orange" | "amber" | "red" | "grey";
export const tones: Record<Tone, string> = {
  green: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  orange: "bg-[#ff4d31]/15 text-[#ff4d31]",
  amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  red: "bg-red-500/15 text-red-600 dark:text-red-400",
  grey: "bg-black/5 text-neutral-500 dark:bg-white/10 dark:text-neutral-400",
};

export function Pill({ tone, children }: { tone: Tone; children: React.ReactNode }) {
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

export function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="min-w-0">
      <div className={cn("truncate text-[10px]", muted)}>{label}</div>
      <div className={cn("text-[15px] tracking-tight", strong)}>{value}</div>
      {note && <div className={cn("truncate text-[10px]", muted)}>{note}</div>}
    </div>
  );
}

// chart series, all from the site palette
export const shades = ["#ff4d31", "#ff8a73", "#ffc2b5", "#a3a3a3", "#d4d4d4"];

/** Ring chart. `parts` are [value, colour], drawn clockwise from the top. */
export function Ring({
  parts,
  size = 84,
  stroke = 11,
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
  let start = 0;
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
        {parts.map(([v, color], i) => {
          const offset = -(start / total) * c;
          start += v;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={color}
              strokeWidth={stroke}
              strokeDasharray={`${(v / total) * c} ${c}`}
              strokeDashoffset={offset}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-tight">
        {children}
      </div>
    </div>
  );
}

/** Legend rows: a colour square and its label. */
export function Legend({
  items,
  className = "space-y-1",
}: {
  items: [label: string, color: string][];
  className?: string;
}) {
  return (
    <ul className={cn("text-[10px]", muted, className)}>
      {items.map(([label, color]) => (
        <li key={label} className="flex items-center gap-1.5">
          <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: color }} />
          {label}
        </li>
      ))}
    </ul>
  );
}

/** A small card floating over the bottom-right of a stage, for its numbers. */
export function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute right-3 bottom-3 rounded-lg border border-black/10 bg-white/95 p-2.5 text-[10px] shadow-sm max-sm:hidden dark:border-white/10 dark:bg-neutral-900/95">
      {children}
    </div>
  );
}

/** A window around each stage: traffic lights and what's open in it. */
export function Frame({ label, children }: { label: string; children: React.ReactNode }) {
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
          {label}
        </span>
        <span className="w-[46px]" />
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden" aria-hidden>
        {children}
      </div>
    </div>
  );
}

export type Step = {
  name: string;
  icon: React.ElementType;
  text: string;
  features: string[];
  /** one line on what the business gets from it */
  outcome?: string;
  View: () => React.ReactElement;
};

/* ---------- the section ---------- */

function Features({ s }: { s: Step }) {
  return (
    <ul className="space-y-2.5">
      {s.features.map((f) => (
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

export function BuildStack({
  eyebrow,
  title,
  subtitle,
  steps,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  steps: Step[];
}) {
  const n = steps.length;
  const col = useRef<HTMLDivElement>(null);

  // Scroll so card i has just settled on top of the stack.
  const pick = (i: number) => {
    const first = col.current?.firstElementChild as HTMLElement | null;
    if (!col.current || !first) return;
    const top = col.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + i * first.offsetHeight - (PIN_TOP - GAP), behavior: "smooth" });
  };

  return (
    <SectionWrap id="modules" eyebrow={eyebrow} title={title} subtitle={subtitle}>
      <div ref={col}>
        {steps.map((s, i) => (
          <div
            key={s.name}
            className="pointer-events-none sticky pt-20"
            style={{ top: PIN_TOP - GAP }}
          >
            <div className="pointer-events-auto h-[min(720px,calc(100svh_-_128px))] rounded-3xl border border-black/10 bg-white p-4 md:h-[580px] md:p-6 dark:border-white/10 dark:bg-[#111113]">
              <div className="flex h-full flex-col gap-4 md:grid md:grid-cols-12 md:items-center md:gap-8">
                <div className="shrink-0 md:col-span-5 md:pl-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff4d31]/15 text-[#ff4d31]">
                      <s.icon className="h-5 w-5" />
                    </span>
                    <span className={cn("text-sm font-semibold tabular-nums", muted)}>
                      {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight text-neutral-950 md:mt-5 md:text-3xl lg:text-4xl dark:text-white">
                    {s.name}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600 md:mt-3 md:text-base lg:text-lg dark:text-neutral-400">
                    {s.text}
                  </p>
                  {/* no room on phones */}
                  <div className="mt-6 text-sm max-md:hidden lg:text-base">
                    <Features s={s} />
                  </div>
                  {s.outcome && (
                    <p className="mt-5 text-sm text-neutral-700 max-md:hidden dark:text-neutral-300">
                      <span className="mr-2 text-xs font-semibold tracking-wider text-[#ff4d31] uppercase">
                        Outcome
                      </span>
                      {s.outcome}
                    </p>
                  )}
                  <div className="mt-8 flex gap-1.5 max-md:hidden">
                    {steps.map((x, j) => (
                      <button
                        key={x.name}
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
                  <s.View />
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
