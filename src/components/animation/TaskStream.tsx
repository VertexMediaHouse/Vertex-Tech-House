import { useEffect, useState } from "react";
import type * as React from "react";
import { CalendarDays, Check, FileText, Mail, PhoneMissed, Sheet } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { BrandIcons } from "./BrandIcons";

/**
 * "Autopilot": messy incoming work streams down into the Vertex bar and comes out below as
 * finished actions. Two copies of the list scroll in lockstep — the "raw" copy is visible
 * only above the bar, the "done" copy only below it — so each item is transformed while it
 * passes behind the bar. Rows are a fixed height in both copies so they stay aligned.
 */

type Task = { icon: React.ReactNode; raw: string; done: string; ms: string };

const tasks: Task[] = [
  {
    icon: <Mail className="text-[#ff4d31]" />,
    raw: "“Pricing for 20 seats?”",
    done: "Lead qualified · reply sent",
    ms: "0.8s",
  },
  {
    icon: <BrandIcons.whatsapp />,
    raw: "“hi, is this still available?”",
    done: "Answered by AI agent",
    ms: "1.2s",
  },
  {
    icon: <Sheet className="text-[#1e8e3e]" />,
    raw: "leads_final_v3.xlsx",
    done: "142 leads synced to CRM",
    ms: "2.4s",
  },
  {
    icon: <PhoneMissed className="text-[#e5484d]" />,
    raw: "Missed call · +44 7700 9…",
    done: "Call back booked · Tue 11:00",
    ms: "0.6s",
  },
  {
    icon: <CalendarDays className="text-[#5b8bd6]" />,
    raw: "Demo request from website",
    done: "Meeting booked & confirmed",
    ms: "0.9s",
  },
  {
    icon: <BrandIcons.notion />,
    raw: "Weekly report (manual)",
    done: "Report sent to the team",
    ms: "3.1s",
  },
  {
    icon: <FileText className="text-[#7c5cff]" />,
    raw: "Form submitted · no owner",
    done: "Deal created in pipeline",
    ms: "0.4s",
  },
];

const ROW = 52; // px, identical in both copies
const GAP = 12;
const BAR = 64; // height of the autopilot bar
const PER_ITEM_S = 2.2;

// deterministic mess for the raw copy
const mess = tasks.map((_, i) => ({
  x: [-28, 18, -10, 30, -22, 8, -34][i % 7],
  r: [-2.2, 1.6, -1, 2.4, -1.8, 0.8, 2][i % 7],
}));

function RawRow({ task, i }: { task: Task; i: number }) {
  return (
    <div className="flex justify-center" style={{ height: ROW }}>
      <div
        className="flex h-full w-[82%] items-center gap-3 liquid-glass rounded-xl border border-dashed border-neutral-300 px-3 opacity-70 dark:border-white/15 dark:!bg-white/[0.02]"
        style={{ transform: `translateX(${mess[i].x}px) rotate(${mess[i].r}deg)` }}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white p-1.5 opacity-60 grayscale [&>svg]:h-full [&>svg]:w-full">
          {task.icon}
        </span>
        <span className="truncate text-xs text-neutral-500 dark:text-neutral-400">{task.raw}</span>
      </div>
    </div>
  );
}

function DoneRow({ task }: { task: Task }) {
  return (
    <div className="flex justify-center" style={{ height: ROW }}>
      <div className="flex h-full w-full items-center gap-3 rounded-xl liquid-glass border border-neutral-200/70 dark:border-white/10 dark:!bg-white/[0.03] px-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-neutral-100 bg-white p-1.5 dark:border-transparent [&>svg]:h-full [&>svg]:w-full">
          {task.icon}
        </span>
        <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-neutral-900 dark:text-white">
          {task.done}
        </span>
        <span className="shrink-0 font-mono text-[10px] text-neutral-400 dark:text-neutral-500">
          {task.ms}
        </span>
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
      </div>
    </div>
  );
}

function Stream({ variant }: { variant: "raw" | "done" }) {
  const list = [...tasks, ...tasks];
  return (
    <div className="ts-stream flex flex-col" style={{ gap: GAP }}>
      {list.map((task, i) =>
        variant === "raw" ? (
          <RawRow key={i} task={task} i={i % tasks.length} />
        ) : (
          <DoneRow key={i} task={task} />
        ),
      )}
    </div>
  );
}

export function TaskStream() {
  const [handled, setHandled] = useState(1284);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setHandled((n) => n + 1), PER_ITEM_S * 1000);
    return () => clearInterval(id);
  }, []);

  const loop = tasks.length * (ROW + GAP); // px height of one copy
  const barTop = `calc(50% - ${BAR / 2}px)`;
  const barBottom = `calc(50% + ${BAR / 2}px)`;

  return (
    <div className="group relative mx-auto h-full w-full max-w-[460px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)]">
      <style>{`
        @keyframes ts-down { from { transform: translateY(-${loop}px); } to { transform: translateY(0); } }
        .ts-stream { animation: ts-down ${tasks.length * PER_ITEM_S}s linear infinite; }
        .group:hover .ts-stream { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .ts-stream { animation: none; } }
      `}</style>

      {/* inbox: raw copy, visible above the bar */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 bottom-0"
        style={{
          maskImage: `linear-gradient(to bottom, black ${barTop}, transparent ${barTop})`,
          WebkitMaskImage: `linear-gradient(to bottom, black ${barTop}, transparent ${barTop})`,
        }}
      >
        <Stream variant="raw" />
      </div>

      {/* done: finished copy, visible below the bar */}
      <div
        className="absolute inset-x-0 top-0 bottom-0"
        style={{
          maskImage: `linear-gradient(to bottom, transparent ${barBottom}, black ${barBottom})`,
          WebkitMaskImage: `linear-gradient(to bottom, transparent ${barBottom}, black ${barBottom})`,
        }}
      >
        <Stream variant="done" />
      </div>

      {/* the autopilot bar */}
      <div
        className="absolute inset-x-0 flex items-center gap-3 rounded-2xl border border-neutral-900 bg-neutral-950 px-4 text-white dark:border-white/15 dark:bg-white dark:text-neutral-950"
        style={{ top: barTop, height: BAR }}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-neutral-950">
          <Logo className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Vertex AI</p>
          <p className="font-mono text-[10px] opacity-60">n8n · AI agents · CRM</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-sm font-semibold tabular-nums">
            {handled.toLocaleString("en-US")}
          </p>
          <p className="font-mono text-[10px] opacity-60">tasks handled</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- horizontal version: lanes flow left → right through a vertical Vertex bar ---------- */

const CARD_W = 260; // px, identical in both copies
const CARD_H = 52;
const CARD_GAP = 16;
const LANE_GAP = 14;
const BAR_W = 76;
const lanes = [
  { shift: 0, dur: 17 },
  { shift: 3, dur: 20.5 },
  { shift: 5, dur: 15.5 },
  { shift: 2, dur: 19 },
];

const hMess = tasks.map((_, i) => ({
  y: [-5, 4, -2, 6, -6, 2, -3][i % 7],
  r: [-1.6, 1.2, -0.8, 1.8, -1.4, 0.6, 1.5][i % 7],
}));

function HCard({ task, i, variant }: { task: Task; i: number; variant: "raw" | "done" }) {
  if (variant === "raw") {
    return (
      <div className="shrink-0" style={{ width: CARD_W, height: CARD_H }}>
        <div
          className="flex h-full items-center gap-3 liquid-glass rounded-xl border border-dashed border-neutral-300 px-3 opacity-70 dark:border-white/15 dark:!bg-white/[0.02]"
          style={{ transform: `translateY(${hMess[i].y}px) rotate(${hMess[i].r}deg)` }}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white p-1.5 opacity-60 grayscale [&>svg]:h-full [&>svg]:w-full">
            {task.icon}
          </span>
          <span className="truncate text-xs text-neutral-500 dark:text-neutral-400">
            {task.raw}
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className="shrink-0" style={{ width: CARD_W, height: CARD_H }}>
      <div className="flex h-full items-center gap-2.5 rounded-xl liquid-glass border border-neutral-200/70 dark:border-white/10 dark:!bg-white/[0.03] px-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-neutral-100 bg-white p-1.5 dark:border-transparent [&>svg]:h-full [&>svg]:w-full">
          {task.icon}
        </span>
        <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-neutral-900 dark:text-white">
          {task.done}
        </span>
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
      </div>
    </div>
  );
}

function Lanes({ variant }: { variant: "raw" | "done" }) {
  return (
    <div className="flex h-full flex-col justify-center" style={{ gap: LANE_GAP }}>
      {lanes.map((lane, l) => {
        const order = tasks.map((_, k) => (k + lane.shift) % tasks.length);
        return (
          <div key={l} className="flex">
            <div
              className="tsh-lane flex"
              style={{ gap: CARD_GAP, paddingRight: CARD_GAP, animationDuration: `${lane.dur}s` }}
            >
              {[...order, ...order].map((k, j) => (
                <HCard key={j} task={tasks[k]} i={k} variant={variant} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function TaskStreamHorizontal() {
  const [handled, setHandled] = useState(1284);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setHandled((n) => n + 1), 700);
    return () => clearInterval(id);
  }, []);

  const loop = tasks.length * (CARD_W + CARD_GAP); // px width of one copy
  const barL = `calc(50% - ${BAR_W / 2}px)`;
  const barR = `calc(50% + ${BAR_W / 2}px)`;
  const lanesH = lanes.length * CARD_H + (lanes.length - 1) * LANE_GAP;

  return (
    <div className="group relative w-full" style={{ height: lanesH + 90 }}>
      <style>{`
        @keyframes tsh-right { from { transform: translateX(-${loop}px); } to { transform: translateX(0); } }
        .tsh-lane { animation: tsh-right linear infinite; }
        .group:hover .tsh-lane { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .tsh-lane { animation: none; } }
      `}</style>

      <div className="absolute inset-x-0 bottom-0 top-[58px] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {/* inbox: raw copy, left of the bar */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            maskImage: `linear-gradient(to right, black ${barL}, transparent ${barL})`,
            WebkitMaskImage: `linear-gradient(to right, black ${barL}, transparent ${barL})`,
          }}
        >
          <Lanes variant="raw" />
        </div>
        {/* done: finished copy, right of the bar */}
        <div
          className="absolute inset-0"
          style={{
            maskImage: `linear-gradient(to right, transparent ${barR}, black ${barR})`,
            WebkitMaskImage: `linear-gradient(to right, transparent ${barR}, black ${barR})`,
          }}
        >
          <Lanes variant="done" />
        </div>
      </div>

      {/* captions + counter */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-[10%] font-mono text-[10px] tracking-widest text-neutral-400 uppercase dark:text-neutral-600">
        <span>inbox</span>
        <span className="rounded-full liquid-glass border border-neutral-200/70 dark:border-white/10 dark:!bg-white/[0.03] px-3 py-1 text-[11px] tracking-normal text-neutral-600 normal-case dark:text-neutral-300">
          <span className="font-semibold text-neutral-950 tabular-nums dark:text-white">
            {handled.toLocaleString("en-US")}
          </span>{" "}
          tasks handled
        </span>
        <span>done</span>
      </div>

      {/* the vertical Vertex AI bar */}
      <div
        className="absolute bottom-[-12px] flex flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-900 bg-neutral-950 text-white dark:border-white/15 dark:bg-white dark:text-neutral-950"
        style={{ left: barL, width: BAR_W, top: 46 }}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-neutral-950">
          <Logo className="h-6 w-6" />
        </span>
        <span className="font-mono text-[10px] font-semibold tracking-[0.25em] uppercase [writing-mode:vertical-rl]">
          Vertex AI
        </span>
      </div>
    </div>
  );
}
