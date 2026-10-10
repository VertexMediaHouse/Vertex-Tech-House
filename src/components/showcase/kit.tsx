import { Children, createContext, useContext, useEffect, useId, useRef, useState } from "react";
import type * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bell, ChevronDown, ChevronLeft, ChevronRight, Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shared building blocks for the interactive portfolio screens. A screen is laid out at a fixed
 * size (1120×700 desktop, 390×700 phone) and scaled to fit its frame. The canvas is a CSS
 * container, so screens adapt to the phone size with `@max-md:` variants.
 */

export const W = 1120;
export const H = 700;
const PHONE: [number, number] = [390, 700];

export type ScreenProps = { onPath: (path: string) => void };

export const gbp = (n: number) => "£" + n.toLocaleString("en-GB");
export const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("");
export const matches = (q: string, ...fields: string[]) =>
  fields.some((f) => f.toLowerCase().includes(q.trim().toLowerCase()));

export function useTick(ms: number) {
  const reduce = useReducedMotion();
  const [t, setT] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setT((v) => v + 1), ms);
    return () => clearInterval(id);
  }, [ms, reduce]);
  return t;
}

/* ---------- scaling: the screen is laid out at a fixed size and scaled to its frame ---------- */

const CanvasContext = createContext({ scale: 1, w: W, h: H });
export const useCanvas = () => useContext(CanvasContext);

export function Fit({ phone, children }: { phone?: boolean; children: React.ReactNode }) {
  const [w, h] = phone ? PHONE : [W, H];
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / w));
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);
  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden bg-white"
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      <div
        style={{
          width: w,
          height: h,
          transform: `scale(${scale})`,
          transformOrigin: "0 0",
          fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
        }}
        className="@container absolute top-0 left-0 text-neutral-900 antialiased"
      >
        <CanvasContext.Provider value={{ scale, w, h }}>{children}</CanvasContext.Provider>
      </div>
    </div>
  );
}

/* ---------- people: real photos where we have one, initials otherwise ---------- */

const PHOTOS = new Set([
  "sarah-mills",
  "daniel-park",
  "priya-shah",
  "tom-becker",
  "aisha-khan",
  "leo-martins",
  "grace-liu",
  "omar-farouk",
  "nina-rossi",
  "ben-carter",
  "marcus-reid",
  "sofia-alvarez",
  "hannah-cole",
  "jonah-weiss",
  "emily-ward",
  "richard-hale",
]);
export const photo = (name: string) => {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  return PHOTOS.has(slug) ? `/assets/showcase/people/${slug}.jpg` : undefined;
};

export function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  const src = photo(name);
  return src ? (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      className="shrink-0 rounded-full object-cover ring-1 ring-black/5"
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-neutral-100 font-semibold text-neutral-600"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials(name)}
    </span>
  );
}

export function PersonCell({ name, sub }: { name: string; sub: string }) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <Avatar name={name} />
      <span className="min-w-0 leading-tight">
        <span className="block truncate font-medium">{name}</span>
        <span className="block truncate text-[11px] text-neutral-500">{sub}</span>
      </span>
    </span>
  );
}

/* ---------- app shell: clickable sidebar, working search, "new" dialog, toasts ---------- */

export type NavItem = [React.ElementType, string, number?];
type Toast = { id: number; text: string };

const ShellContext = createContext<{ toast: (text: string) => void; accent: string }>({
  toast: () => {},
  accent: "#4f46e5",
});
export const useShell = () => useContext(ShellContext);

export function AppShell({
  brand,
  workspace,
  accent,
  nav,
  initial,
  onPath,
  create,
  children,
}: {
  brand: string;
  workspace: string;
  accent: string;
  nav: NavItem[];
  initial: string;
  onPath: (path: string) => void;
  /** per page: what the "New" button creates, and the form fields it asks for */
  create: Record<string, [string, string[]]>;
  children: (page: string, q: string, go: (page: string) => void) => React.ReactNode;
}) {
  const [page, setPage] = useState(initial);
  const [q, setQ] = useState("");
  const [dialog, setDialog] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const go = (p: string) => {
    setPage(p);
    setQ("");
  };
  const toast = (text: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  };
  useEffect(() => onPath(`/${page.toLowerCase()}`), [page, onPath]);
  const [thing, fields] = create[page] ?? create[initial];

  return (
    <ShellContext.Provider value={{ toast, accent }}>
      <div className="flex h-full text-[13px]">
        <aside className="flex h-full w-[208px] shrink-0 flex-col border-r border-neutral-200 bg-[#fafafa] px-3 py-4 @max-md:hidden">
          <div className="mb-5 flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-neutral-100">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-semibold text-white"
              style={{ background: accent }}
            >
              {brand[0]}
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block text-[13px] font-semibold">{brand}</span>
              <span className="block text-[11px] text-neutral-500">{workspace}</span>
            </span>
            <ChevronDown className="ml-auto h-3.5 w-3.5 text-neutral-400" />
          </div>
          <div className="mb-1.5 px-2.5 text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
            Workspace
          </div>
          {nav.map(([Icon, name, count]) => (
            <button
              key={name}
              type="button"
              onClick={() => go(name)}
              className={cn(
                "mb-0.5 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-left transition-colors",
                name === page
                  ? "bg-white font-medium text-neutral-900 shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-neutral-200"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800",
              )}
            >
              <Icon className="h-4 w-4" style={name === page ? { color: accent } : undefined} />
              {name}
              {count !== undefined && (
                <span className="ml-auto rounded-md bg-neutral-200/70 px-1.5 text-[10px] font-medium text-neutral-600">
                  {count}
                </span>
              )}
            </button>
          ))}
          <div className="mt-auto flex items-center gap-2.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-2">
            <Avatar name="Sarah Mills" size={30} />
            <div className="min-w-0 leading-tight">
              <div className="text-[12px] font-medium">Sarah Mills</div>
              <div className="truncate text-[11px] text-neutral-500">sarah@northline.studio</div>
            </div>
          </div>
        </aside>

        <div className="relative flex min-w-0 flex-1 flex-col bg-white">
          <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-3.5 @max-md:flex-wrap @max-md:gap-3 @max-md:px-4 @max-md:py-3">
            <div className="flex items-center gap-2.5">
              {/* phone: no sidebar, so the brand sits next to the title */}
              <span
                className="hidden h-8 w-8 items-center justify-center rounded-lg text-[13px] font-semibold text-white @max-md:flex"
                style={{ background: accent }}
              >
                {brand[0]}
              </span>
              <div>
                <div className="text-[11px] text-neutral-400">
                  {brand} <span className="mx-1">/</span>
                  <span className="text-neutral-600">{page}</span>
                </div>
                <div className="text-[18px] leading-tight font-semibold tracking-tight">{page}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 @max-md:w-full">
              <label className="flex w-[230px] items-center gap-2 rounded-lg border border-neutral-200 px-3 py-[7px] text-[12px] text-neutral-400 focus-within:border-neutral-400 @max-md:w-auto @max-md:flex-1">
                <Search className="h-3.5 w-3.5 shrink-0" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={`Search ${page.toLowerCase()}…`}
                  className="w-full min-w-0 bg-transparent text-neutral-800 outline-none placeholder:text-neutral-400"
                />
                <kbd className="rounded border border-neutral-200 px-1 font-sans text-[10px] @max-md:hidden">
                  ⌘K
                </kbd>
              </label>
              <button
                type="button"
                onClick={() => toast("You're all caught up")}
                className="relative flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50"
              >
                <Bell className="h-3.5 w-3.5" />
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500" />
              </button>
              <button
                type="button"
                onClick={() => setDialog(true)}
                className="flex h-[34px] items-center gap-1 rounded-lg px-3 text-[12px] font-medium text-white hover:opacity-90"
                style={{ background: accent }}
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="@max-md:hidden">New {thing.toLowerCase()}</span>
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
            {/* opacity only: a transform here would trap the absolutely positioned drawers */}
            <motion.div
              key={page}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="p-6 @max-md:p-4"
            >
              {children(page, q, go)}
            </motion.div>
          </div>

          {/* phone: bottom tab bar replaces the sidebar */}
          <nav className="hidden border-t border-neutral-200 bg-white px-1 pt-1 pb-2 @max-md:flex">
            {nav.map(([Icon, name]) => (
              <button
                key={name}
                type="button"
                onClick={() => go(name)}
                className="flex flex-1 flex-col items-center gap-0.5 py-1 text-[10px] font-medium"
                style={{ color: name === page ? accent : "#8a8a8a" }}
              >
                <Icon className="h-[18px] w-[18px]" />
                {name}
              </button>
            ))}
          </nav>

          <AnimatePresence>
            {dialog && (
              <CreateDialog
                thing={thing}
                fields={fields}
                accent={accent}
                onClose={() => setDialog(false)}
                onCreate={() => {
                  setDialog(false);
                  toast(`${thing} created`);
                }}
              />
            )}
          </AnimatePresence>

          <div className="pointer-events-none absolute right-6 bottom-6 z-40 flex flex-col items-end gap-2 @max-md:inset-x-4 @max-md:bottom-20 @max-md:items-center">
            <AnimatePresence>
              {toasts.map((t) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="rounded-lg bg-neutral-900 px-3.5 py-2.5 text-[12px] font-medium text-white shadow-lg"
                >
                  {t.text}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </ShellContext.Provider>
  );
}

function CreateDialog({
  thing,
  fields,
  accent,
  onClose,
  onCreate,
}: {
  thing: string;
  fields: string[];
  accent: string;
  onClose: () => void;
  onCreate: () => void;
}) {
  return (
    <div className="absolute inset-0 z-30 flex items-start justify-center bg-neutral-900/20 pt-24">
      <motion.form
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.18 }}
        onSubmit={(e) => {
          e.preventDefault();
          onCreate();
        }}
        className="w-[420px] rounded-xl border @max-md:w-[calc(100%-32px)] border-neutral-200 bg-white p-5 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.3)]"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[15px] font-semibold">New {thing.toLowerCase()}</div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3">
          {fields.map((f, i) => (
            <label key={f} className="block">
              <span className="mb-1 block text-[11px] font-medium text-neutral-600">{f}</span>
              <input
                autoFocus={i === 0}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] outline-none focus:border-neutral-400"
              />
            </label>
          ))}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-[12px] font-medium hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg px-3 py-1.5 text-[12px] font-medium text-white"
            style={{ background: accent }}
          >
            Create {thing.toLowerCase()}
          </button>
        </div>
      </motion.form>
    </div>
  );
}

/* ---------- pieces ---------- */

const tones = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  amber: "bg-amber-50 text-amber-700 ring-amber-600/15",
  sky: "bg-sky-50 text-sky-700 ring-sky-600/15",
  violet: "bg-violet-50 text-violet-700 ring-violet-600/15",
  red: "bg-red-50 text-red-700 ring-red-600/15",
  grey: "bg-neutral-100 text-neutral-600 ring-neutral-500/15",
};
export type Tone = keyof typeof tones;

export function Badge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ring-1 ring-inset",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function Kpi({
  label,
  value,
  delta,
  bad,
  spark,
}: {
  label: string;
  value: string;
  delta: string;
  bad?: boolean;
  spark?: number[];
}) {
  const { accent } = useShell();
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="text-[12px] text-neutral-500">{label}</div>
      <div className="mt-1 flex items-end justify-between gap-2">
        <div className="text-[22px] font-semibold tracking-tight @max-md:text-[18px]">{value}</div>
        {spark && <Spark data={spark} color={bad ? "#dc2626" : accent} />}
      </div>
      <div
        className={cn("mt-0.5 text-[11px] font-medium", bad ? "text-red-600" : "text-emerald-600")}
      >
        {delta}
      </div>
    </div>
  );
}

function Spark({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * 64},${22 - ((v - min) / (max - min || 1)) * 20}`)
    .join(" ");
  return (
    <svg width="64" height="24" className="mb-1 shrink-0 @max-md:hidden">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Panel({
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
    <div className={cn("rounded-xl border border-neutral-200 bg-white p-4", className)}>
      <div className="mb-3 flex items-center justify-between text-[13px] font-medium">
        {title}
        {right}
      </div>
      {children}
    </div>
  );
}

export function LinkBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  const { accent } = useShell();
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[12px] font-medium hover:underline"
      style={{ color: accent }}
    >
      {children}
    </button>
  );
}

export function Chips({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex max-w-full gap-0.5 overflow-x-auto rounded-lg bg-neutral-100 p-0.5 [scrollbar-width:none]">
      {items.map((it) => (
        <button
          key={it}
          type="button"
          onClick={() => onChange(it)}
          className={cn(
            "shrink-0 rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors",
            it === value
              ? "bg-white text-neutral-900 shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
              : "text-neutral-500 hover:text-neutral-800",
          )}
        >
          {it}
        </button>
      ))}
    </div>
  );
}

// on the phone canvas a table keeps only its `keep` columns
const KeepContext = createContext<number[] | undefined>(undefined);
const gridVars = (cols: string, keep?: number[]) =>
  ({
    "--cols": cols,
    "--mcols": keep
      ? cols
          .split(" ")
          .filter((_, i) => keep.includes(i))
          .join(" ")
      : cols,
  }) as React.CSSProperties;
const GRID =
  "grid gap-2 [grid-template-columns:var(--cols)] @max-md:[grid-template-columns:var(--mcols)]";
const dropped = (keep: number[] | undefined, i: number) =>
  keep && !keep.includes(i) && "@max-md:hidden";

export function Table({
  cols,
  head,
  total,
  keep,
  children,
}: {
  cols: string;
  head: string[];
  /** full record count, for the pagination footer */
  total?: number;
  /** column indexes still shown on a phone */
  keep?: number[];
  children: React.ReactNode;
}) {
  const shown = Children.count(children);
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200">
      <div
        className={cn(GRID, "bg-neutral-50 px-4 py-2 text-[11px] font-medium text-neutral-500")}
        style={gridVars(cols, keep)}
      >
        {head.map((h, i) => (
          <span key={i} className={cn(dropped(keep, i))}>
            {h}
          </span>
        ))}
      </div>
      <KeepContext.Provider value={keep}>
        {shown ? (
          children
        ) : (
          <div className="px-4 py-10 text-center text-[12px] text-neutral-400">
            No results match your search
          </div>
        )}
      </KeepContext.Provider>
      {total !== undefined && (
        <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50/60 px-4 py-2 text-[11px] text-neutral-500">
          <span>
            Showing {shown ? 1 : 0}–{shown} of {total.toLocaleString("en-US")}
          </span>
          <span className="flex gap-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-300">
              <ChevronLeft className="h-3.5 w-3.5" />
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-md border border-neutral-200 bg-white">
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </span>
        </div>
      )}
    </div>
  );
}

export function Row({
  cols,
  onClick,
  active,
  children,
}: {
  cols: string;
  onClick?: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  const keep = useContext(KeepContext);
  return (
    <div
      onClick={onClick}
      className={cn(
        GRID,
        "items-center border-t border-neutral-100 px-4 py-2.5 text-[12px] transition-colors hover:bg-neutral-50",
        onClick && "cursor-pointer",
        active && "bg-neutral-50",
      )}
      style={gridVars(cols, keep)}
    >
      {/* each cell sits in a one-item grid so it stays a block, whatever its own display */}
      {Children.toArray(children).map((cell, i) => (
        <div key={i} className={cn("grid min-w-0", dropped(keep, i))}>
          {cell}
        </div>
      ))}
    </div>
  );
}

// smooth area chart with a hover crosshair
export function AreaChart({
  data,
  labels,
  fmt,
  h = 150,
}: {
  data: number[];
  labels: string[];
  fmt: (v: number) => string;
  h?: number;
}) {
  const { accent } = useShell();
  const id = useId();
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data) * 1.15;
  const n = data.length;
  const p = data.map((v, i) => [(i / (n - 1)) * 100, 100 - (v / max) * 100] as const);
  let line = `M${p[0][0]},${p[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const a = p[i - 1] ?? p[i];
    const b = p[i];
    const c = p[i + 1];
    const d = p[i + 2] ?? c;
    line += ` C${b[0] + (c[0] - a[0]) / 6},${b[1] + (c[1] - a[1]) / 6} ${c[0] - (d[0] - b[0]) / 6},${c[1] - (d[1] - b[1]) / 6} ${c[0]},${c[1]}`;
  }
  const at = hover ?? n - 1;

  return (
    <div className="flex gap-2">
      <div
        className="flex shrink-0 flex-col justify-between text-right text-[10px] text-neutral-400"
        style={{ height: h }}
      >
        {[1, 0.66, 0.33, 0].map((k) => (
          <span key={k} className="-translate-y-1/2 first:translate-y-0 last:translate-y-0">
            {fmt(Math.round((max * k) / 100) * 100)}
          </span>
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <div className="relative" style={{ height: h }} onMouseLeave={() => setHover(null)}>
          {[0, 33.3, 66.6, 100].map((y) => (
            <div
              key={y}
              className="absolute inset-x-0 border-t border-dashed border-neutral-200"
              style={{ top: `${y}%` }}
            />
          ))}
          <motion.svg
            key={data.join()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={accent} stopOpacity="0.16" />
                <stop offset="1" stopColor={accent} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${line} L100,100 L0,100 Z`} fill={`url(#${id})`} />
            <path
              d={line}
              fill="none"
              stroke={accent}
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </motion.svg>
          {/* crosshair + dot + value */}
          <div
            className="pointer-events-none absolute inset-y-0 border-l border-neutral-300"
            style={{ left: `${p[at][0]}%` }}
          />
          <div
            className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
            style={{ left: `${p[at][0]}%`, top: `${p[at][1]}%`, background: accent }}
          />
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-md bg-neutral-900 px-2 py-1 text-[11px] whitespace-nowrap text-white"
            style={{
              left: `clamp(40px, ${p[at][0]}%, calc(100% - 40px))`,
              top: `calc(${p[at][1]}% - 34px)`,
            }}
          >
            <span className="text-neutral-400">{labels[at]} </span>
            {fmt(data[at])}
          </div>
          {/* hover targets */}
          <div className="absolute inset-0 flex">
            {data.map((_, i) => (
              <div key={i} className="h-full flex-1" onMouseEnter={() => setHover(i)} />
            ))}
          </div>
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-neutral-400">
          {labels.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
