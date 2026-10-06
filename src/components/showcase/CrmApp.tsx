import { useRef, useState } from "react";
import type * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  CalendarDays,
  Check,
  Inbox,
  Kanban,
  LayoutDashboard,
  Mail,
  Phone,
  Users,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AppShell,
  AreaChart,
  Avatar,
  Badge,
  Chips,
  Kpi,
  LinkBtn,
  Panel,
  PersonCell,
  Row,
  Table,
  gbp,
  matches,
  useShell,
  useCanvas,
  type ScreenProps,
  type Tone,
} from "./kit";

/* An interior studio's sales CRM: website enquiries land here, get scored, followed up and closed. */

type Lead = {
  name: string;
  project: string;
  source: string;
  budget: string;
  score: number;
  status: string;
  when: string;
  owner: string;
};

const leads: Lead[] = [
  {
    name: "Daniel Park",
    project: "Loft conversion",
    source: "Website",
    budget: "£35k–50k",
    score: 86,
    status: "New",
    when: "2 min ago",
    owner: "Sarah Mills",
  },
  {
    name: "Priya Shah",
    project: "Kitchen & dining",
    source: "Instagram",
    budget: "£20k–35k",
    score: 72,
    status: "Contacted",
    when: "1 hr ago",
    owner: "Zara Ahmed",
  },
  {
    name: "Marcus Reid",
    project: "Townhouse refurbishment",
    source: "Phone",
    budget: "£80k+",
    score: 64,
    status: "New",
    when: "3 hr ago",
    owner: "Sarah Mills",
  },
  {
    name: "Sofia Alvarez",
    project: "Hotel lobby, Casa Verde",
    source: "Referral",
    budget: "£120k+",
    score: 91,
    status: "Qualified",
    when: "5 hr ago",
    owner: "Zara Ahmed",
  },
  {
    name: "Tom Becker",
    project: "Living room styling",
    source: "Website",
    budget: "£8k–15k",
    score: 58,
    status: "Contacted",
    when: "Yesterday",
    owner: "Sarah Mills",
  },
  {
    name: "Hannah Cole",
    project: "Café interior",
    source: "Instagram",
    budget: "£25k–40k",
    score: 47,
    status: "Nurture",
    when: "Yesterday",
    owner: "Zara Ahmed",
  },
  {
    name: "Jonah Weiss",
    project: "Office fit-out",
    source: "Referral",
    budget: "£60k–80k",
    score: 79,
    status: "Qualified",
    when: "22 Sep",
    owner: "Sarah Mills",
  },
  {
    name: "Emily Ward",
    project: "Primary bedroom suite",
    source: "WhatsApp",
    budget: "£15k–25k",
    score: 66,
    status: "Contacted",
    when: "21 Sep",
    owner: "Zara Ahmed",
  },
  {
    name: "Richard Hale",
    project: "Country house, 3 rooms",
    source: "Phone",
    budget: "£90k+",
    score: 83,
    status: "Qualified",
    when: "20 Sep",
    owner: "Sarah Mills",
  },
];
const statusTone: Record<string, Tone> = {
  New: "sky",
  Contacted: "amber",
  Qualified: "green",
  Nurture: "grey",
};

const email = (name: string, i: number) =>
  `${name.toLowerCase().replace(" ", ".")}@${["gmail.com", "outlook.com", "icloud.com"][i % 3]}`;
const phone = (i: number) => `+44 7700 900${String(120 + i * 37).padStart(3, "0")}`;

/* ---------------- dashboard ---------------- */

const activity: [string, string, string][] = [
  ["Daniel Park", "sent an enquiry from the website", "2 min"],
  ["Priya Shah", "got an automatic WhatsApp reply", "1 hr"],
  ["Sofia Alvarez", "booked a consultation for Fri 26 Sep", "5 hr"],
  ["Omar Farouk", "opened the proposal (3rd time)", "Yesterday"],
  ["Nina Rossi", "signed · deal won for £86,500", "2 days"],
];

function Dashboard({ go }: { go: (p: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3 @max-md:grid-cols-2">
        <Kpi
          label="Open deals"
          value="38"
          delta="+6 this week"
          spark={[22, 26, 25, 29, 31, 34, 38]}
        />
        <Kpi
          label="Pipeline value"
          value="£1.28M"
          delta="+12.4% vs Aug"
          spark={[0.9, 0.94, 1.02, 1.0, 1.11, 1.2, 1.28]}
        />
        <Kpi
          label="Won this quarter"
          value="£412k"
          delta="+£86k this week"
          spark={[120, 180, 210, 260, 300, 326, 412]}
        />
        <Kpi
          label="First reply"
          value="4 min"
          delta="auto-reply on every lead"
          spark={[42, 35, 18, 12, 9, 6, 4]}
        />
      </div>
      <div className="grid grid-cols-5 gap-3 @max-md:grid-cols-1">
        <Panel
          className="col-span-3 @max-md:col-span-1"
          title="Revenue won"
          right={<span className="text-[12px] font-normal text-neutral-500">Last 12 months</span>}
        >
          <AreaChart
            data={[62, 58, 71, 69, 84, 92, 88, 104, 118, 126, 131, 148].map((v) => v * 1000)}
            labels={[
              "Oct",
              "Nov",
              "Dec",
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
            ]}
            fmt={(v) => `£${Math.round(v / 1000)}k`}
            h={170}
          />
        </Panel>
        <Panel
          className="col-span-2 @max-md:col-span-1"
          title="Recent activity"
          right={<LinkBtn onClick={() => go("Leads")}>View leads</LinkBtn>}
        >
          <ul className="space-y-3">
            {activity.map(([who, what, when]) => (
              <li key={who} className="flex items-start gap-2.5 text-[12px]">
                <Avatar name={who} size={26} />
                <span className="min-w-0 flex-1 leading-snug">
                  <span className="font-medium">{who}</span>{" "}
                  <span className="text-neutral-500">{what}</span>
                </span>
                <span className="shrink-0 text-[11px] text-neutral-400">{when}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      <Panel title="Due today" right={<LinkBtn onClick={() => go("Tasks")}>All tasks</LinkBtn>}>
        <TaskList compact />
      </Panel>
    </div>
  );
}

/* ---------------- leads ---------------- */

const LEAD_COLS = "1.5fr 1.4fr 0.9fr 0.9fr 1fr 0.9fr 0.8fr";

function Leads({ q }: { q: string }) {
  const [src, setSrc] = useState("All");
  const [open, setOpen] = useState<string | null>(null);
  const lead = leads.find((l) => l.name === open);
  const rows = leads.filter(
    (l) => (src === "All" || l.source === src) && matches(q, l.name, l.project, l.source),
  );
  return (
    <>
      <div className="mb-4 flex items-center justify-between @max-md:flex-col @max-md:items-start @max-md:gap-2">
        <Chips
          items={["All", "Website", "Instagram", "Referral", "Phone", "WhatsApp"]}
          value={src}
          onChange={setSrc}
        />
        <span className="flex items-center gap-1.5 text-[12px] text-neutral-500">
          <Zap className="h-3.5 w-3.5 text-amber-500" /> Auto-scored and routed on arrival
        </span>
      </div>
      <Table
        cols={LEAD_COLS}
        keep={[0, 4, 5]}
        head={["Name", "Project", "Source", "Budget", "Score", "Status", "Created"]}
        total={src === "All" && !q ? 214 : undefined}
      >
        {rows.map((l, i) => (
          <Row
            key={l.name}
            cols={LEAD_COLS}
            onClick={() => setOpen(l.name)}
            active={open === l.name}
          >
            <PersonCell name={l.name} sub={email(l.name, i)} />
            <span className="truncate">{l.project}</span>
            <span className="text-neutral-600">{l.source}</span>
            <span className="text-neutral-600">{l.budget}</span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-12 overflow-hidden rounded-full bg-neutral-100">
                <span
                  className={cn(
                    "block h-full rounded-full",
                    l.score >= 75
                      ? "bg-emerald-500"
                      : l.score >= 60
                        ? "bg-amber-400"
                        : "bg-neutral-300",
                  )}
                  style={{ width: `${l.score}%` }}
                />
              </span>
              <span className="tabular-nums">{l.score}</span>
            </span>
            <span>
              <Badge tone={statusTone[l.status]}>{l.status}</Badge>
            </span>
            <span className="text-neutral-500">{l.when}</span>
          </Row>
        ))}
      </Table>
      <AnimatePresence>
        {lead && (
          <PersonDrawer
            key={lead.name}
            name={lead.name}
            project={lead.project}
            value={lead.budget}
            stage={lead.status}
            source={lead.source}
            onClose={() => setOpen(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------- deals (drag-and-drop board) ---------------- */

const stages = ["Enquiry", "Consultation", "Proposal", "Won"];
const stageTone: Tone[] = ["sky", "amber", "violet", "green"];
type Deal = {
  name: string;
  project: string;
  value: number;
  stage: number;
  days: number;
  fresh?: boolean;
};
const seedDeals: Deal[] = [
  { name: "Daniel Park", project: "Loft conversion", value: 44000, stage: 0, days: 0, fresh: true },
  { name: "Priya Shah", project: "Kitchen & dining", value: 28000, stage: 0, days: 1 },
  { name: "Tom Becker", project: "Living room styling", value: 11500, stage: 0, days: 2 },
  { name: "Aisha Khan", project: "Two-bed apartment", value: 42000, stage: 1, days: 4 },
  { name: "Jonah Weiss", project: "Office fit-out", value: 68000, stage: 1, days: 6 },
  { name: "Grace Liu", project: "Show home staging", value: 19800, stage: 1, days: 3 },
  { name: "Omar Farouk", project: "Penthouse renovation", value: 124000, stage: 2, days: 9 },
  { name: "Nina Rossi", project: "Victorian terrace", value: 86500, stage: 3, days: 12 },
  { name: "Ben Carter", project: "Garden studio", value: 23400, stage: 3, days: 15 },
];

type DragState = { name: string; dx: number; dy: number; over: number };

function Deals({ q }: { q: string }) {
  const { toast } = useShell();
  const { scale } = useCanvas();
  const [deals, setDeals] = useState(seedDeals);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const cols = useRef<(HTMLDivElement | null)[]>([]);
  const scroller = useRef<HTMLDivElement>(null);
  const visible = deals.filter((d) => matches(q, d.name, d.project));
  const current = deals.find((d) => d.name === open);

  const moveTo = (name: string, stage: number) => {
    setDeals((all) =>
      all.map((d) => (d.name === name ? { ...d, stage, days: 0, fresh: false } : d)),
    );
    toast(`${name} moved to ${stages[stage]}`);
  };

  // the column under the pointer (nearest one horizontally), in screen coordinates
  const stageAt = (x: number) => {
    let best = 0;
    let dist = Infinity;
    cols.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const d = x < r.left ? r.left - x : x > r.right ? x - r.right : 0;
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    return best;
  };

  // Mouse: drag after a few pixels. Touch: press and hold, then drag (a plain swipe still
  // scrolls). A click or tap without dragging opens the deal.
  const begin = (e: React.PointerEvent, deal: Deal) => {
    if (e.button !== 0) return;
    const sx = e.clientX;
    const sy = e.clientY;
    const sl = scroller.current?.scrollLeft ?? 0;
    const touch = e.pointerType !== "mouse";
    let active = false;
    const timer = touch
      ? window.setTimeout(() => {
          active = true;
          setDrag({ name: deal.name, dx: 0, dy: 0, over: deal.stage });
        }, 260)
      : 0;

    function move(ev: PointerEvent) {
      const dx = ev.clientX - sx;
      const dy = ev.clientY - sy;
      if (!active) {
        if (touch) {
          if (Math.hypot(dx, dy) > 8) cleanup(); // moved before the hold: it's a scroll
          return;
        }
        if (Math.hypot(dx, dy) < 4) return;
        active = true;
      }
      // phone: nudge the sideways-scrolling board when dragging near its edges
      const sc = scroller.current;
      if (sc && sc.scrollWidth > sc.clientWidth) {
        const r = sc.getBoundingClientRect();
        if (ev.clientX > r.right - 36) sc.scrollLeft += 10;
        else if (ev.clientX < r.left + 36) sc.scrollLeft -= 10;
      }
      // pointer moves in screen px; the board lives inside the scaled frame
      const scrolled = (scroller.current?.scrollLeft ?? 0) - sl;
      setDrag({
        name: deal.name,
        dx: dx / scale + scrolled,
        dy: dy / scale,
        over: stageAt(ev.clientX),
      });
    }
    function up(ev: PointerEvent) {
      cleanup();
      setDrag(null);
      if (!active) return setOpen(deal.name);
      const to = stageAt(ev.clientX);
      if (to !== deal.stage) moveTo(deal.name, to);
    }
    function cancel() {
      cleanup();
      setDrag(null);
    }
    function blockScroll(ev: TouchEvent) {
      if (active) ev.preventDefault();
    }
    function cleanup() {
      window.clearTimeout(timer);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("touchmove", blockScroll);
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("touchmove", blockScroll, { passive: false });
  };

  const total = deals.filter((d) => d.stage < 3).reduce((a, d) => a + d.value, 0);

  return (
    <>
      <div className="mb-4 flex items-center justify-between text-[12px] text-neutral-500">
        <span>
          <span className="font-semibold text-neutral-900">{gbp(total)}</span> in open deals
          <span className="text-neutral-400 @max-md:hidden"> · drag cards between stages</span>
        </span>
        <Chips items={["Board", "List"]} value="Board" onChange={() => {}} />
      </div>
      {/* phone: the board scrolls sideways, columns keep their desktop width */}
      <div
        ref={scroller}
        className="@max-md:-mx-4 @max-md:overflow-x-auto @max-md:px-4 @max-md:[scrollbar-width:none]"
      >
        <div className="grid grid-cols-4 gap-3 @max-md:w-[864px]">
          {stages.map((s, i) => {
            const col = visible.filter((d) => d.stage === i);
            const target = drag !== null && drag.over === i;
            return (
              <div
                key={s}
                ref={(el) => {
                  cols.current[i] = el;
                }}
                className={cn(
                  "min-h-[300px] rounded-xl p-2.5 ring-1 transition-colors",
                  target
                    ? "bg-indigo-50/70 ring-2 ring-indigo-300"
                    : "bg-neutral-50 ring-neutral-100",
                )}
              >
                <div className="mb-2 flex h-5 items-center justify-between px-1 text-[12px] font-medium text-neutral-600">
                  <span className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        ["bg-sky-400", "bg-amber-400", "bg-violet-400", "bg-emerald-400"][i],
                      )}
                    />
                    {s}
                  </span>
                  <span className="text-neutral-400">{col.length}</span>
                </div>
                <div className="space-y-2">
                  {col.map((d) => {
                    const held = drag?.name === d.name ? drag : null;
                    return (
                      <div
                        key={d.name}
                        role="button"
                        tabIndex={0}
                        aria-label={`${d.name}, ${d.project}. Drag to change stage, or press Enter to open.`}
                        onPointerDown={(e) => begin(e, d)}
                        onDragStart={(e) => e.preventDefault()} // no native image drag from the avatar
                        onKeyDown={(e) => e.key === "Enter" && setOpen(d.name)}
                        style={
                          held
                            ? { transform: `translate(${held.dx}px, ${held.dy}px) rotate(2deg)` }
                            : undefined
                        }
                        className={cn(
                          "flex h-[92px] w-full cursor-grab flex-col rounded-lg border border-neutral-200 bg-white p-3 text-left select-none",
                          held
                            ? "pointer-events-none relative z-30 cursor-grabbing shadow-[0_18px_40px_-12px_rgba(0,0,0,0.35)] ring-1 ring-indigo-400/50"
                            : "shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md",
                        )}
                      >
                        <span className="flex w-full items-start justify-between gap-2">
                          <span className="min-w-0 leading-tight">
                            <span className="block truncate text-[13px] font-medium">{d.name}</span>
                            <span className="mt-0.5 block truncate text-[11px] text-neutral-500">
                              {d.project}
                            </span>
                          </span>
                          <Avatar name={d.name} size={24} />
                        </span>
                        <span className="mt-auto flex w-full items-center justify-between">
                          <span className="text-[12px] font-semibold tabular-nums">
                            {gbp(d.value)}
                          </span>
                          {d.fresh ? (
                            <Badge tone="sky">New · web form</Badge>
                          ) : (
                            <span className="text-[10px] text-neutral-400">
                              {d.days ? `${d.days}d in stage` : "just moved"}
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {current && (
          <PersonDrawer
            key={current.name}
            name={current.name}
            project={current.project}
            value={gbp(current.value)}
            stage={stages[current.stage]}
            source={current.fresh ? "Website" : "Referral"}
            onClose={() => setOpen(null)}
            onAdvance={
              current.stage < 3 ? () => moveTo(current.name, current.stage + 1) : undefined
            }
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------- side drawer (lead / deal detail) ---------------- */

function PersonDrawer({
  name,
  project,
  value,
  stage,
  source,
  onClose,
  onAdvance,
}: {
  name: string;
  project: string;
  value: string;
  stage: string;
  source: string;
  onClose: () => void;
  /** deals only: move to the next stage for real */
  onAdvance?: () => void;
}) {
  const { toast, accent } = useShell();
  const i = name.length;
  const timeline = [
    [`Enquiry received via ${source.toLowerCase()}`, "Mon 09:12"],
    ["Auto-reply sent on WhatsApp", "Mon 09:13"],
    ["Consultation booked (Cal.com)", "Mon 11:40"],
    ["Mood board and proposal shared", "Wed 16:05"],
  ];
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 z-20 bg-neutral-900/10"
      />
      <motion.aside
        initial={{ x: 360 }}
        animate={{ x: 0 }}
        exit={{ x: 360 }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="absolute inset-y-0 right-0 z-20 flex w-[340px] flex-col border-l @max-md:w-full border-neutral-200 bg-white shadow-[-16px_0_40px_-20px_rgba(0,0,0,0.25)]"
      >
        <div className="flex items-start gap-3 border-b border-neutral-200 p-5">
          <Avatar name={name} size={44} />
          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-semibold">{name}</div>
            <div className="text-[12px] text-neutral-500">{project}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto p-5 [scrollbar-width:thin]">
          <div className="flex items-center justify-between">
            <span className="text-[20px] font-semibold tracking-tight">{value}</span>
            <Badge tone={statusTone[stage] ?? stageTone[stages.indexOf(stage)] ?? "grey"}>
              {stage}
            </Badge>
          </div>
          <dl className="grid grid-cols-[80px_1fr] gap-y-2 text-[12px]">
            <dt className="text-neutral-500">Email</dt>
            <dd className="truncate">{email(name, i)}</dd>
            <dt className="text-neutral-500">Phone</dt>
            <dd>{phone(i)}</dd>
            <dt className="text-neutral-500">Source</dt>
            <dd>{source}</dd>
            <dt className="text-neutral-500">Owner</dt>
            <dd className="flex items-center gap-1.5">
              <Avatar name="Sarah Mills" size={18} /> Sarah Mills
            </dd>
          </dl>
          <div>
            <div className="mb-2 text-[11px] font-medium tracking-wider text-neutral-400 uppercase">
              Activity
            </div>
            <ol className="relative space-y-3 border-l border-neutral-200 pl-4">
              {timeline.map(([what, when]) => (
                <li key={what} className="relative text-[12px]">
                  <span className="absolute top-1 -left-[21px] h-2.5 w-2.5 rounded-full border-2 border-white bg-neutral-300" />
                  <div>{what}</div>
                  <div className="text-[11px] text-neutral-400">{when}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="flex gap-2 border-t border-neutral-200 p-4">
          <button
            type="button"
            onClick={() => toast(`Email draft opened for ${name.split(" ")[0]}`)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 py-2 text-[12px] font-medium hover:bg-neutral-50"
          >
            <Mail className="h-3.5 w-3.5" /> Email
          </button>
          <button
            type="button"
            onClick={() => toast(`Calling ${name.split(" ")[0]}…`)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 py-2 text-[12px] font-medium hover:bg-neutral-50"
          >
            <Phone className="h-3.5 w-3.5" /> Call
          </button>
          <button
            type="button"
            onClick={() => {
              if (onAdvance) onAdvance();
              else toast(`${name.split(" ")[0]} moved to the next stage`);
              onClose();
            }}
            className="flex-1 rounded-lg py-2 text-[12px] font-medium text-white"
            style={{ background: accent }}
          >
            Advance
          </button>
        </div>
      </motion.aside>
    </>
  );
}

/* ---------------- contacts ---------------- */

const contacts = [
  ...leads.map((l) => [l.name, l.project, l.owner, l.when] as const),
  ["Aisha Khan", "Two-bed apartment", "Zara Ahmed", "18 Sep"] as const,
  ["Omar Farouk", "Penthouse renovation", "Sarah Mills", "Yesterday"] as const,
  ["Nina Rossi", "Victorian terrace", "Sarah Mills", "2 days ago"] as const,
  ["Ben Carter", "Garden studio", "Zara Ahmed", "12 Sep"] as const,
  ["Grace Liu", "Show home staging", "Zara Ahmed", "10 Sep"] as const,
].sort((a, b) => a[0].localeCompare(b[0]));
const CONTACT_COLS = "1.6fr 1.2fr 1.3fr 1.1fr 0.9fr";

function Contacts({ q }: { q: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const rows = contacts.filter(([n, p]) => matches(q, n, p));
  return (
    <>
      <Table
        cols={CONTACT_COLS}
        keep={[0, 4]}
        head={["Name", "Phone", "Project", "Owner", "Last contact"]}
        total={q ? undefined : 1286}
      >
        {rows.map(([n, p, owner, last], i) => (
          <Row key={n} cols={CONTACT_COLS} onClick={() => setOpen(n)} active={open === n}>
            <PersonCell name={n} sub={email(n, i)} />
            <span className="text-neutral-600 tabular-nums">{phone(i)}</span>
            <span className="truncate">{p}</span>
            <span className="flex items-center gap-1.5 text-neutral-600">
              <Avatar name={owner} size={20} /> {owner}
            </span>
            <span className="text-neutral-500">{last}</span>
          </Row>
        ))}
      </Table>
      <AnimatePresence>
        {open && (
          <PersonDrawer
            key={open}
            name={open}
            project={contacts.find((c) => c[0] === open)![1]}
            value="Client"
            stage="Qualified"
            source="Website"
            onClose={() => setOpen(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------- tasks ---------------- */

const seedTasks = [
  {
    id: 1,
    title: "Call Daniel Park to arrange the loft survey",
    who: "Daniel Park",
    due: "Today",
    done: false,
    auto: true,
  },
  {
    id: 2,
    title: "Send revised proposal to Omar Farouk",
    who: "Omar Farouk",
    due: "Today",
    done: false,
    auto: false,
  },
  {
    id: 3,
    title: "Follow up with Priya Shah (no reply in 48h)",
    who: "Priya Shah",
    due: "Today",
    done: true,
    auto: true,
  },
  {
    id: 4,
    title: "Order fabric samples for Nina Rossi",
    who: "Nina Rossi",
    due: "Tomorrow",
    done: false,
    auto: false,
  },
  {
    id: 5,
    title: "Prepare consultation brief for Sofia Alvarez",
    who: "Sofia Alvarez",
    due: "Fri 26 Sep",
    done: false,
    auto: true,
  },
  {
    id: 6,
    title: "Site visit with Jonah Weiss",
    who: "Jonah Weiss",
    due: "Mon 29 Sep",
    done: false,
    auto: false,
  },
];

function TaskList({ compact }: { compact?: boolean }) {
  const [tasks, setTasks] = useState(seedTasks);
  const shown = compact ? tasks.filter((t) => t.due === "Today") : tasks;
  const groups = compact
    ? [["", shown]]
    : [
        ["Today", shown.filter((t) => t.due === "Today")],
        ["Upcoming", shown.filter((t) => t.due !== "Today")],
      ];
  return (
    <div className="space-y-4">
      {(groups as [string, typeof tasks][]).map(([label, list]) => (
        <div key={label}>
          {label && (
            <div className="mb-2 text-[11px] font-medium tracking-wider text-neutral-400 uppercase">
              {label} · {list.filter((t) => !t.done).length} open
            </div>
          )}
          <ul className="divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-200">
            {list.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-3 px-4 py-2.5 text-[12px] hover:bg-neutral-50"
              >
                <button
                  type="button"
                  aria-label={t.done ? "Mark as not done" : "Mark as done"}
                  onClick={() =>
                    setTasks((all) => all.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))
                  }
                  className={cn(
                    "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-colors",
                    t.done
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-neutral-300 hover:border-neutral-500",
                  )}
                >
                  {t.done && <Check className="h-3 w-3" strokeWidth={3} />}
                </button>
                <span className={cn("flex-1", t.done && "text-neutral-400 line-through")}>
                  {t.title}
                </span>
                {t.auto && (
                  <Badge tone="violet">
                    <Zap className="h-3 w-3" />
                    <span className="@max-md:hidden">Auto-created</span>
                  </Badge>
                )}
                <Avatar name={t.who} size={22} />
                <span className="w-[72px] text-right text-[11px] text-neutral-500">{t.due}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ---------------- reports ---------------- */

const ranges: Record<string, [number[], string[]]> = {
  "30 days": [
    [18.4, 22.6, 19.8, 27.4, 31.2],
    ["W1", "W2", "W3", "W4", "W5"],
  ],
  Quarter: [
    [104, 118, 148],
    ["Jul", "Aug", "Sep"],
  ],
  Year: [
    [62, 58, 71, 69, 84, 92, 88, 104, 118, 126, 131, 148],
    ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  ],
};
const funnel: [string, number][] = [
  ["Enquiries", 1240],
  ["Consultations", 496],
  ["Proposals", 214],
  ["Won", 81],
];
const bySource: [string, number][] = [
  ["Website", 42],
  ["Referral", 23],
  ["Instagram", 19],
  ["Phone", 10],
  ["WhatsApp", 6],
];

function Reports() {
  const [range, setRange] = useState("Year");
  const [data, labels] = ranges[range];
  const total = data.reduce((a, b) => a + b, 0);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Chips items={Object.keys(ranges)} value={range} onChange={setRange} />
        <span className="text-[12px] text-neutral-500">
          Revenue won:{" "}
          <span className="font-semibold text-neutral-900">
            {total >= 1000 ? `£${(total / 1000).toFixed(2)}M` : `£${Math.round(total)}k`}
          </span>
        </span>
      </div>
      <div className="grid grid-cols-4 gap-3 @max-md:grid-cols-2">
        <Kpi label="Win rate" value="38%" delta="+4 pts" />
        <Kpi label="Average deal" value="£41,600" delta="+£3.2k" />
        <Kpi label="Sales cycle" value="19 days" delta="−6 days" />
        <Kpi label="Lost to no reply" value="2%" delta="was 21% before automation" />
      </div>
      <Panel title="Revenue won">
        <AreaChart
          data={data.map((v) => v * 1000)}
          labels={labels}
          fmt={(v) => `£${Math.round(v / 1000)}k`}
          h={150}
        />
      </Panel>
      <div className="grid grid-cols-2 gap-3 @max-md:grid-cols-1">
        <Panel title="Conversion funnel">
          <div className="space-y-2.5">
            {funnel.map(([label, n]) => (
              <div key={label} className="text-[12px]">
                <div className="mb-1 flex justify-between">
                  <span>{label}</span>
                  <span className="text-neutral-500 tabular-nums">
                    {n.toLocaleString("en-GB")} · {Math.round((n / funnel[0][1]) * 100)}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(n / funnel[0][1]) * 100}%` }}
                    className="h-full rounded-full bg-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Leads by source">
          <div className="space-y-2.5">
            {bySource.map(([label, pct]) => (
              <div key={label} className="flex items-center gap-3 text-[12px]">
                <span className="w-16">{label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct * 2}%` }}
                    className="h-full rounded-full bg-indigo-300"
                  />
                </div>
                <span className="w-8 text-right text-neutral-500 tabular-nums">{pct}%</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ---------------- app ---------------- */

export function CrmApp({ onPath }: ScreenProps) {
  return (
    <AppShell
      brand="Northline"
      workspace="Sales CRM"
      accent="#4f46e5"
      initial="Deals"
      onPath={onPath}
      nav={[
        [LayoutDashboard, "Dashboard"],
        [Inbox, "Leads", 12],
        [Kanban, "Deals"],
        [Users, "Contacts"],
        [CalendarDays, "Tasks", 4],
        [BarChart3, "Reports"],
      ]}
      create={{
        Dashboard: ["Lead", ["Full name", "Email", "Project"]],
        Leads: ["Lead", ["Full name", "Email", "Project"]],
        Deals: ["Deal", ["Client", "Project", "Value (£)"]],
        Contacts: ["Contact", ["Full name", "Email", "Phone"]],
        Tasks: ["Task", ["Task", "Due date"]],
        Reports: ["Report", ["Report name", "Date range"]],
      }}
    >
      {(page, q, go) =>
        page === "Dashboard" ? (
          <Dashboard go={go} />
        ) : page === "Leads" ? (
          <Leads q={q} />
        ) : page === "Deals" ? (
          <Deals q={q} />
        ) : page === "Contacts" ? (
          <Contacts q={q} />
        ) : page === "Tasks" ? (
          <TaskList />
        ) : (
          <Reports />
        )
      }
    </AppShell>
  );
}
