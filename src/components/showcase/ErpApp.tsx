import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Boxes,
  Check,
  FileText,
  LayoutDashboard,
  Loader2,
  ShoppingCart,
  Truck,
  Wallet,
  Zap,
} from "lucide-react";
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
  useTick,
  type ScreenProps,
  type Tone,
} from "./kit";

/* The same studio's back office: client orders, stock, suppliers, invoicing and payroll. */

/* ---------------- data ---------------- */

const orders: [string, string, string, number, number, string, string][] = [
  ["SO-1048", "Nina Rossi", "Victorian terrace", 14, 18420, "Pending", "24 Sep"],
  ["SO-1047", "Omar Farouk", "Penthouse renovation", 32, 46890, "Packed", "24 Sep"],
  ["SO-1046", "Ben Carter", "Garden studio", 6, 5240, "Shipped", "23 Sep"],
  ["SO-1045", "Sofia Alvarez", "Hotel lobby, Casa Verde", 48, 61300, "Shipped", "22 Sep"],
  ["SO-1044", "Grace Liu", "Show home staging", 21, 9870, "Delivered", "21 Sep"],
  ["SO-1043", "Aisha Khan", "Two-bed apartment", 11, 7615, "Delivered", "19 Sep"],
  ["SO-1042", "Jonah Weiss", "Office fit-out", 27, 22480, "Pending", "18 Sep"],
  ["SO-1041", "Richard Hale", "Country house, 3 rooms", 9, 12960, "Delivered", "16 Sep"],
];
const orderTone: Record<string, Tone> = {
  Pending: "amber",
  Packed: "violet",
  Shipped: "sky",
  Delivered: "green",
};

const skus: [string, string, string, number, string, number][] = [
  ["NL-FAB-021", "Bouclé fabric, oat", "Textiles", 184, "m", 72],
  ["NL-LGT-114", "Pendant light, brushed brass", "Lighting", 12, "pcs", 18],
  ["NL-FUR-307", "Oak dining chair", "Furniture", 46, "pcs", 58],
  ["NL-FIN-045", "Limewash paint, chalk 5L", "Finishes", 38, "tins", 41],
  ["NL-FUR-512", "Linen sofa, 3-seat", "Furniture", 3, "pcs", 12],
  ["NL-TIL-230", "Zellige tile, white", "Tiles", 96, "m²", 64],
  ["NL-HDW-078", "Cabinet handle, knurled brass", "Hardware", 420, "pcs", 86],
];

const pos: [string, string, string, number, string, string][] = [
  [
    "PO-4472",
    "Lumière Lighting",
    "Pendant light, brushed brass × 24",
    5760,
    "2 Oct",
    "Pending approval",
  ],
  ["PO-4471", "Hartley Upholstery", "Linen sofa, 3-seat × 6", 14280, "9 Oct", "Pending approval"],
  ["PO-4468", "Atelier Tiles", "Zellige tile, white × 120 m²", 6840, "29 Sep", "Approved"],
  ["PO-4465", "Oakwood Joinery", "Oak dining chair × 40", 9600, "27 Sep", "In transit"],
  ["PO-4460", "Kensington Paints", "Limewash paint, chalk × 60", 2340, "19 Sep", "Received"],
];
const poTone: Record<string, Tone> = {
  "Pending approval": "amber",
  Approved: "sky",
  "In transit": "violet",
  Received: "green",
};

const invoices: [string, string, string, string, number, string][] = [
  ["INV-2093", "Nina Rossi", "24 Sep", "8 Oct", 18420, "Due"],
  ["INV-2092", "Omar Farouk", "22 Sep", "6 Oct", 23445, "Due"],
  ["INV-2091", "Sofia Alvarez", "15 Sep", "29 Sep", 30650, "Paid"],
  ["INV-2088", "Ben Carter", "28 Aug", "11 Sep", 2620, "Overdue"],
  ["INV-2086", "Aisha Khan", "25 Aug", "8 Sep", 4300, "Overdue"],
  ["INV-2084", "Grace Liu", "20 Aug", "3 Sep", 9870, "Paid"],
  ["INV-2081", "Richard Hale", "14 Aug", "28 Aug", 12960, "Paid"],
];
const invTone: Record<string, Tone> = { Due: "sky", Paid: "green", Overdue: "red" };

const staff: [string, string, string, number][] = [
  ["Sarah Mills", "Studio Director", "Management", 6400],
  ["James Okafor", "Senior Designer", "Design", 4800],
  ["Mei Tanaka", "Interior Designer", "Design", 3900],
  ["Lucas Brandt", "Project Manager", "Delivery", 4200],
  ["Ana Costa", "Finance & Ops", "Operations", 3700],
  ["Ethan Hughes", "Lead Installer", "Delivery", 3300],
  ["Zara Ahmed", "Client Coordinator", "Sales", 3100],
];

/* ---------------- overview ---------------- */

const revenue = [98, 104, 121, 96, 112, 131, 128, 142, 156, 149, 167, 184];
const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

function Overview({ go }: { go: (p: string) => void }) {
  const [range, setRange] = useState("12M");
  const n = range === "12M" ? 12 : 6;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3 @max-md:grid-cols-2">
        <Kpi
          label="Revenue, September"
          value="£184,240"
          delta="+10.2% vs Aug"
          spark={revenue.slice(-7)}
        />
        <Kpi
          label="Open orders"
          value="23"
          delta="6 ship this week"
          spark={[14, 17, 16, 19, 21, 20, 23]}
        />
        <Kpi
          label="Stock value"
          value="£212,480"
          delta="2 items below reorder point"
          spark={[190, 196, 204, 199, 207, 210, 212]}
        />
        <Kpi
          label="Overdue invoices"
          value="£6,920"
          delta="2 invoices · reminders queued"
          bad
          spark={[12, 9, 11, 8, 9, 7, 6.9]}
        />
      </div>
      <div className="grid grid-cols-5 gap-3 @max-md:grid-cols-1">
        <Panel
          className="col-span-3 @max-md:col-span-1"
          title="Revenue"
          right={<Chips items={["6M", "12M"]} value={range} onChange={setRange} />}
        >
          <AreaChart
            data={revenue.slice(-n).map((v) => v * 1000)}
            labels={months.slice(-n)}
            fmt={(v) => `£${Math.round(v / 1000)}k`}
            h={170}
          />
        </Panel>
        <Panel
          className="col-span-2 @max-md:col-span-1"
          title="Recent orders"
          right={<LinkBtn onClick={() => go("Orders")}>View all</LinkBtn>}
        >
          <ul className="space-y-2.5">
            {orders.slice(0, 5).map(([id, client, , , total, status]) => (
              <li key={id} className="flex items-center gap-2.5 text-[12px]">
                <Avatar name={client} size={26} />
                <span className="min-w-0 flex-1 leading-tight">
                  <span className="block truncate font-medium">{client}</span>
                  <span className="block text-[11px] text-neutral-500">{id}</span>
                </span>
                <span className="font-medium tabular-nums">{gbp(total)}</span>
                <Badge tone={orderTone[status]}>{status}</Badge>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      <Panel
        title="Low stock"
        right={<LinkBtn onClick={() => go("Purchasing")}>Purchase orders</LinkBtn>}
      >
        <div className="grid grid-cols-2 gap-3 @max-md:grid-cols-1">
          {skus
            .filter((s) => s[5] < 30)
            .map(([sku, name, , qty, unit]) => (
              <div
                key={sku}
                className="flex items-center justify-between rounded-lg bg-amber-50/60 px-3 py-2.5 text-[12px] ring-1 ring-amber-200/70"
              >
                <span>
                  <span className="font-medium">{name}</span>{" "}
                  <span className="text-neutral-500">
                    · {qty} {unit} left
                  </span>
                </span>
                <Badge tone="sky">
                  <Zap className="h-3 w-3" /> PO drafted
                </Badge>
              </div>
            ))}
        </div>
      </Panel>
    </div>
  );
}

/* ---------------- orders ---------------- */

const ORDER_COLS = "0.8fr 1.5fr 1.5fr 0.6fr 0.9fr 0.9fr 0.7fr";

function Orders({ q }: { q: string }) {
  const [status, setStatus] = useState("All");
  const [open, setOpen] = useState<string | null>(null);
  const rows = orders.filter(
    (o) => (status === "All" || o[5] === status) && matches(q, o[0], o[1], o[2]),
  );
  return (
    <>
      <div className="mb-4">
        <Chips
          items={["All", "Pending", "Packed", "Shipped", "Delivered"]}
          value={status}
          onChange={setStatus}
        />
      </div>
      <Table
        cols={ORDER_COLS}
        keep={[1, 4, 5]}
        head={["Order", "Client", "Project", "Items", "Total", "Status", "Date"]}
        total={status === "All" && !q ? 1048 : undefined}
      >
        {rows.map(([id, client, project, items, total, st, date]) => (
          <div key={id}>
            <Row
              cols={ORDER_COLS}
              onClick={() => setOpen(open === id ? null : id)}
              active={open === id}
            >
              <span className="font-mono text-[11px] text-neutral-500">{id}</span>
              <PersonCell name={client} sub="Client" />
              <span className="truncate">{project}</span>
              <span className="tabular-nums">{items}</span>
              <span className="font-medium tabular-nums">{gbp(total)}</span>
              <span>
                <Badge tone={orderTone[st]}>{st}</Badge>
              </span>
              <span className="text-neutral-500">{date}</span>
            </Row>
            {/* order detail expands inline */}
            <AnimatePresence initial={false}>
              {open === id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden bg-neutral-50"
                >
                  <div className="grid grid-cols-4 gap-4 px-4 py-3 text-[12px] @max-md:grid-cols-2">
                    {["Order placed", "Packed", "Shipped", "Delivered"].map((s, i) => {
                      const done = i <= ["Pending", "Packed", "Shipped", "Delivered"].indexOf(st);
                      return (
                        <div key={s} className="flex items-center gap-2">
                          <span
                            className={
                              done
                                ? "flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-white"
                                : "h-5 w-5 rounded-full border border-neutral-300"
                            }
                          >
                            {done && <Check className="h-3 w-3" strokeWidth={3} />}
                          </span>
                          <span className={done ? "" : "text-neutral-400"}>{s}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </Table>
    </>
  );
}

/* ---------------- inventory (live: low stock raises a PO on its own) ---------------- */

const INV_COLS = "1fr 1.8fr 0.9fr 0.8fr 1.1fr 1.1fr";

function Inventory({ q }: { q: string }) {
  const t = useTick(2600);
  const raised = t % 2 === 1;
  const rows = skus.filter((s) => matches(q, s[0], s[1], s[2]));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3 @max-md:grid-cols-2">
        <Kpi label="Active SKUs" value="1,284" delta="+38 this month" />
        <Kpi label="Stock value" value="£212,480" delta="+4.1%" />
        <Kpi label="Below reorder point" value="2" delta="POs drafted automatically" bad />
        <Kpi label="Incoming" value="5 POs" delta="£38,820 on order" />
      </div>
      <Table
        cols={INV_COLS}
        keep={[1, 3, 5]}
        head={["SKU", "Item", "Category", "On hand", "Stock level", "Status"]}
        total={q ? undefined : 1284}
      >
        {rows.map(([sku, name, cat, qty, unit, lvl], i) => {
          const low = lvl < 30;
          return (
            <Row key={sku} cols={INV_COLS}>
              <span className="font-mono text-[11px] text-neutral-500">{sku}</span>
              <span className="truncate font-medium">{name}</span>
              <span className="text-neutral-600">{cat}</span>
              <span className="tabular-nums">
                {qty} <span className="text-neutral-400">{unit}</span>
              </span>
              <span className="mr-4 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                <span
                  className={
                    low
                      ? "block h-full rounded-full bg-amber-500"
                      : "block h-full rounded-full bg-teal-600"
                  }
                  style={{ width: `${lvl}%` }}
                />
              </span>
              <span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={low ? (raised ? "po" : "low") : "ok"}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="inline-block"
                  >
                    <Badge tone={!low ? "green" : raised ? "sky" : "amber"}>
                      {!low ? "In stock" : raised ? `PO-447${i === 1 ? 2 : 1} raised` : "Low stock"}
                    </Badge>
                  </motion.span>
                </AnimatePresence>
              </span>
            </Row>
          );
        })}
      </Table>
    </div>
  );
}

/* ---------------- purchasing ---------------- */

const PO_COLS = "0.8fr 1.2fr 2fr 0.8fr 0.7fr 1.3fr";

function Purchasing({ q }: { q: string }) {
  const { toast } = useShell();
  const [approved, setApproved] = useState<string[]>([]);
  const rows = pos.filter((p) => matches(q, p[0], p[1], p[2]));
  return (
    <Table
      cols={PO_COLS}
      keep={[1, 3, 5]}
      head={["PO", "Supplier", "Items", "Amount", "ETA", "Status"]}
      total={q ? undefined : 312}
    >
      {rows.map(([id, supplier, items, amount, eta, status]) => {
        const st = approved.includes(id) ? "Approved" : status;
        return (
          <Row key={id} cols={PO_COLS}>
            <span className="font-mono text-[11px] text-neutral-500">{id}</span>
            <span className="font-medium">{supplier}</span>
            <span className="truncate text-neutral-600">{items}</span>
            <span className="font-medium tabular-nums">{gbp(amount)}</span>
            <span className="text-neutral-500">{eta}</span>
            <span className="flex flex-wrap items-center gap-1.5">
              <Badge tone={poTone[st]}>{st}</Badge>
              {st === "Pending approval" && (
                <button
                  type="button"
                  onClick={() => {
                    setApproved((a) => [...a, id]);
                    toast(`${id} approved and emailed to ${supplier}`);
                  }}
                  className="rounded-md bg-teal-700 px-2 py-0.5 text-[11px] font-medium text-white hover:bg-teal-800"
                >
                  Approve
                </button>
              )}
            </span>
          </Row>
        );
      })}
    </Table>
  );
}

/* ---------------- invoices ---------------- */

const INVOICE_COLS = "0.9fr 1.6fr 0.8fr 0.8fr 0.9fr 0.8fr 1.1fr";

function Invoices({ q }: { q: string }) {
  const { toast } = useShell();
  const [filter, setFilter] = useState("All");
  const [sent, setSent] = useState<string[]>([]);
  const rows = invoices.filter(
    (v) => (filter === "All" || v[5] === filter) && matches(q, v[0], v[1]),
  );
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3 @max-md:grid-cols-1">
        <Kpi label="Paid in September" value="£53,480" delta="12 invoices" />
        <Kpi label="Outstanding" value="£41,865" delta="2 due in the next 14 days" />
        <Kpi label="Overdue" value="£6,920" delta="2 invoices · 13+ days late" bad />
      </div>
      <Chips items={["All", "Due", "Overdue", "Paid"]} value={filter} onChange={setFilter} />
      <Table
        cols={INVOICE_COLS}
        keep={[1, 4, 5, 6]}
        head={["Invoice", "Client", "Issued", "Due", "Amount", "Status", ""]}
        total={filter === "All" && !q ? 2093 : undefined}
      >
        {rows.map(([id, client, issued, due, amount, status]) => (
          <Row key={id} cols={INVOICE_COLS}>
            <span className="font-mono text-[11px] text-neutral-500">{id}</span>
            <PersonCell name={client} sub="Client" />
            <span className="text-neutral-500">{issued}</span>
            <span className="text-neutral-500">{due}</span>
            <span className="font-medium tabular-nums">{gbp(amount)}</span>
            <span>
              <Badge tone={invTone[status]}>{status}</Badge>
            </span>
            <span className="text-right">
              {status === "Overdue" &&
                (sent.includes(id) ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                    <Check className="h-3 w-3" /> Reminder sent
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSent((s) => [...s, id]);
                      toast(`Reminder emailed to ${client}`);
                    }}
                    className="rounded-md border border-neutral-200 px-2 py-0.5 text-[11px] font-medium hover:bg-neutral-100"
                  >
                    Send reminder
                  </button>
                ))}
              {status !== "Overdue" && (
                <button
                  type="button"
                  onClick={() => toast(`${id}.pdf downloaded`)}
                  className="text-[11px] font-medium text-neutral-500 hover:text-neutral-900"
                >
                  <FileText className="mr-1 inline h-3 w-3" />
                  PDF
                </button>
              )}
            </span>
          </Row>
        ))}
      </Table>
    </div>
  );
}

/* ---------------- payroll ---------------- */

const PAY_COLS = "1.7fr 1.1fr 1fr 0.9fr";

function Payroll({ q }: { q: string }) {
  const { toast } = useShell();
  const [run, setRun] = useState<"idle" | "running" | "done">("idle");
  const rows = staff.filter((s) => matches(q, s[0], s[1], s[2]));
  const status = {
    idle: ["Scheduled", "grey"],
    running: ["Processing", "amber"],
    done: ["Paid", "green"],
  }[run] as [string, Tone];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-neutral-200 p-4 @max-md:flex-col @max-md:items-stretch @max-md:gap-4">
        <div className="flex gap-10 text-[12px] @max-md:grid @max-md:grid-cols-2 @max-md:gap-3">
          <div>
            <div className="text-neutral-500">Pay period</div>
            <div className="mt-0.5 text-[15px] font-semibold">1–30 Sep 2026</div>
          </div>
          <div>
            <div className="text-neutral-500">Employees</div>
            <div className="mt-0.5 text-[15px] font-semibold">14</div>
          </div>
          <div>
            <div className="text-neutral-500">Gross pay</div>
            <div className="mt-0.5 text-[15px] font-semibold">£52,600</div>
          </div>
          <div>
            <div className="text-neutral-500">Pay date</div>
            <div className="mt-0.5 text-[15px] font-semibold">
              {run === "done" ? "Paid today" : "Tue 30 Sep"}
            </div>
          </div>
        </div>
        <button
          type="button"
          disabled={run !== "idle"}
          onClick={() => {
            setRun("running");
            setTimeout(() => {
              setRun("done");
              toast("Payroll sent · payslips emailed to 14 people");
            }, 1600);
          }}
          className="flex h-9 items-center gap-1.5 rounded-lg bg-teal-700 px-4 text-[12px] font-medium text-white hover:bg-teal-800 disabled:opacity-80"
        >
          {run === "running" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {run === "done" && <Check className="h-3.5 w-3.5" />}
          {run === "idle" ? "Run payroll" : run === "running" ? "Processing…" : "Payroll complete"}
        </button>
      </div>
      <Table
        cols={PAY_COLS}
        keep={[0, 2, 3]}
        head={["Employee", "Department", "Monthly gross", "Status"]}
        total={q ? undefined : 14}
      >
        {rows.map(([name, role, dept, pay]) => (
          <Row key={name} cols={PAY_COLS}>
            <PersonCell name={name} sub={role} />
            <span className="text-neutral-600">{dept}</span>
            <span className="font-medium tabular-nums">{gbp(pay)}</span>
            <span>
              <Badge tone={status[1]}>{status[0]}</Badge>
            </span>
          </Row>
        ))}
      </Table>
    </div>
  );
}

/* ---------------- app ---------------- */

export function ErpApp({ onPath }: ScreenProps) {
  return (
    <AppShell
      brand="Northline"
      workspace="Operations"
      accent="#0f766e"
      initial="Overview"
      onPath={onPath}
      nav={[
        [LayoutDashboard, "Overview"],
        [ShoppingCart, "Orders", 23],
        [Boxes, "Inventory"],
        [Truck, "Purchasing", 2],
        [FileText, "Invoices"],
        [Wallet, "Payroll"],
      ]}
      create={{
        Overview: ["Order", ["Client", "Project", "Delivery date"]],
        Orders: ["Order", ["Client", "Project", "Delivery date"]],
        Inventory: ["Item", ["Item name", "SKU", "Quantity"]],
        Purchasing: ["Purchase order", ["Supplier", "Item", "Quantity"]],
        Invoices: ["Invoice", ["Client", "Amount (£)", "Due date"]],
        Payroll: ["Employee", ["Full name", "Role", "Monthly gross (£)"]],
      }}
    >
      {(page, q, go) =>
        page === "Overview" ? (
          <Overview go={go} />
        ) : page === "Orders" ? (
          <Orders q={q} />
        ) : page === "Inventory" ? (
          <Inventory q={q} />
        ) : page === "Purchasing" ? (
          <Purchasing q={q} />
        ) : page === "Invoices" ? (
          <Invoices q={q} />
        ) : (
          <Payroll q={q} />
        )
      }
    </AppShell>
  );
}
