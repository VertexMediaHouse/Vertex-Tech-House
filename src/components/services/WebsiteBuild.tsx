import type * as React from "react";
import { CodeXml, Component, Globe, Palette, PencilRuler, Rocket, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BuildStack,
  Frame,
  Legend,
  muted,
  Overlay,
  Ring,
  shades,
  strong,
  type Step,
} from "./BuildStack";

/* Website page: one site built step by step, wireframe → framework → UI → components → website → launch. */

const SERIF = { fontFamily: '"Fraunces", Georgia, serif' };
const HAND = { fontFamily: '"Caveat", cursive' };
const img = (f: string) => `/assets/showcase/${f}`;
const work: [string, string][] = [
  ["Harbor House", "harbor.jpg"],
  ["Olive & Oak", "olive.jpg"],
  ["Linen Loft", "linen.jpg"],
];

/* ---------- 1. Mockup: the page sketched in grey boxes ---------- */

/** Image placeholder: a box with a cross through it. */
function Xbox({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative rounded border-2 border-neutral-300 dark:border-neutral-600",
        className,
      )}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <path
          d="M0,0 L100,100 M100,0 L0,100"
          vectorEffect="non-scaling-stroke"
          className="stroke-neutral-300 dark:stroke-neutral-600"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

const bar = "rounded-full bg-neutral-200 dark:bg-neutral-700";

// top-level pages, and how many pages sit under each
const sitemap: [string, string][] = [
  ["Work", "6 projects"],
  ["Services", "3"],
  ["Studio", "1"],
  ["Contact", "1"],
];

function MockupView() {
  return (
    <Frame label="Home · wireframe">
      <div className="h-full bg-[radial-gradient(circle,rgba(0,0,0,0.08)_1px,transparent_1px)] [background-size:14px_14px] p-4 md:p-6 dark:bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)]">
        <div className="flex items-center gap-3">
          <span className="rounded border-2 border-neutral-300 px-2 py-0.5 text-[10px] font-bold text-neutral-400 dark:border-neutral-600">
            LOGO
          </span>
          <span className={cn(bar, "ml-auto h-2 w-8")} />
          <span className={cn(bar, "h-2 w-8")} />
          <span className={cn(bar, "h-2 w-8 max-sm:hidden")} />
          <span className="h-5 w-16 rounded-full border-2 border-neutral-300 dark:border-neutral-600" />
        </div>
        <div className="mt-5 grid grid-cols-5 gap-4">
          <div className="col-span-5 space-y-2.5 pt-2 sm:col-span-2">
            <span className={cn(bar, "block h-4 w-full bg-neutral-300 dark:bg-neutral-600")} />
            <span className={cn(bar, "block h-4 w-4/5 bg-neutral-300 dark:bg-neutral-600")} />
            <span className={cn(bar, "block h-2 w-full")} />
            <span className={cn(bar, "block h-2 w-3/4")} />
            <span className="mt-3 block h-6 w-24 rounded-full border-2 border-[#ff4d31]/60" />
          </div>
          <Xbox className="col-span-3 h-32 max-sm:hidden md:h-40" />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-1.5">
              <Xbox className="h-16 md:h-20" />
              <span className={cn(bar, "block h-2 w-2/3")} />
            </div>
          ))}
        </div>
        <span
          style={HAND}
          className="absolute top-[38%] left-[8%] -rotate-3 text-lg text-[#ff4d31] max-sm:hidden"
        >
          one clear next step ↑
        </span>
        <span
          style={HAND}
          className="absolute top-[22%] right-[14%] rotate-2 text-lg text-[#ff4d31] max-sm:hidden"
        >
          their best room, full width
        </span>
        <Overlay>
          <div className={cn("mb-2", strong)}>Sitemap · 9 pages</div>
          <div className="flex flex-col items-center">
            <span className="rounded bg-[#ff4d31] px-2 py-0.5 text-[9px] font-semibold text-white">
              Home
            </span>
            <span className="h-2 w-px bg-neutral-300 dark:bg-neutral-600" />
            <span className="h-px w-[78%] bg-neutral-300 dark:bg-neutral-600" />
            <div className="flex gap-1.5">
              {sitemap.map(([page, n]) => (
                <span key={page} className="flex flex-col items-center">
                  <span className="h-2 w-px bg-neutral-300 dark:bg-neutral-600" />
                  <span className="rounded border border-black/10 px-1.5 py-0.5 text-[9px] text-neutral-700 dark:border-white/15 dark:text-neutral-300">
                    {page}
                  </span>
                  <span className={cn("mt-0.5 text-[8px]", muted)}>{n}</span>
                </span>
              ))}
            </div>
          </div>
        </Overlay>
      </div>
    </Frame>
  );
}

/* ---------- 2. Framework: the page as components in code ---------- */

const tree: [string, number, boolean?][] = [
  ["app", 0],
  ["page.tsx", 1, true],
  ["components", 0],
  ["Nav.tsx", 1],
  ["Hero.tsx", 1],
  ["WorkGrid.tsx", 1],
  ["Contact.tsx", 1],
];

const code: [string, string][] = [
  ["export default function", " Home() {"],
  ["  return", " ("],
  ["    <>", ""],
  ["      <Nav", " />"],
  ["      <Hero", " />"],
  ["      <WorkGrid", " items={projects} />"],
  ["      <Contact", " />"],
  ["    </>", ""],
  ["  );", ""],
  ["}", ""],
];

/** A dashed region of the page with its component's name. */
function Region({ name, className }: { name: string; className?: string }) {
  return (
    <div
      className={cn(
        "relative rounded border border-dashed border-[#ff4d31]/60 bg-[#ff4d31]/[0.04]",
        className,
      )}
    >
      <span className="absolute top-1 left-1.5 font-mono text-[10px] text-[#ff4d31]">{`<${name} />`}</span>
    </div>
  );
}

const weight: [string, number][] = [
  ["Ours", 92],
  ["Typical", 480],
];

function FrameworkView() {
  return (
    <Frame label="northline / app / page.tsx">
      <div className="flex h-full">
        <div className="w-[52%] shrink-0 border-r border-black/5 bg-neutral-50 font-mono text-[11px] max-sm:hidden dark:border-white/5 dark:bg-neutral-950/60">
          <ul className="border-b border-black/5 p-3 dark:border-white/5">
            {tree.map(([f, depth, open]) => (
              <li
                key={f}
                className={cn(
                  "rounded px-1.5 py-0.5",
                  open ? "bg-[#ff4d31]/10 text-[#ff4d31]" : muted,
                )}
                style={{ paddingLeft: 6 + depth * 14 }}
              >
                {depth ? f : `${f}/`}
              </li>
            ))}
          </ul>
          <ol className="p-3 leading-[1.7]">
            {code.map(([a, b], i) => (
              <li key={i} className="flex gap-3 whitespace-pre">
                <span className="w-4 text-right text-neutral-300 dark:text-neutral-600">
                  {i + 1}
                </span>
                <span>
                  <span className="text-[#ff4d31]">{a}</span>
                  <span className="text-neutral-700 dark:text-neutral-300">{b}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="relative flex min-w-0 flex-1 flex-col gap-2 p-3">
          {/* 12-column grid behind the layout */}
          <div className="pointer-events-none absolute inset-3 grid grid-cols-12 gap-1.5">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className="bg-black/[0.03] dark:bg-white/[0.04]" />
            ))}
          </div>
          <Region name="Nav" className="h-8 shrink-0" />
          <Region name="Hero" className="min-h-0 flex-[3]" />
          <Region name="WorkGrid" className="min-h-0 flex-[2]" />
          <Region name="Contact" className="h-10 shrink-0" />
          <Overlay>
            <div className={cn("mb-2", strong)}>JavaScript per page</div>
            {weight.map(([label, kb]) => (
              <div key={label} className="mb-1 flex items-center gap-2 last:mb-0">
                <span className={cn("w-14", muted)}>{label}</span>
                <span className="block w-24">
                  <span
                    className={cn(
                      "block h-2 rounded-full",
                      label === "Ours" ? "bg-[#ff4d31]" : "bg-neutral-300 dark:bg-neutral-600",
                    )}
                    style={{ width: `${(kb / 480) * 100}%` }}
                  />
                </span>
                <span className={cn("w-12 text-right tabular-nums", strong)}>{kb} KB</span>
              </div>
            ))}
          </Overlay>
        </div>
      </div>
    </Frame>
  );
}

/* ---------- 3. UI: the page designed, with its type and colours ---------- */

const swatches: [string, string][] = [
  ["Ink", "#1f1c18"],
  ["Paper", "#f7f4ef"],
  ["Stone", "#e4dccf"],
  ["Brass", "#a8865a"],
];

/** The finished top of the home page; `live` adds the stats and the work row under it. */
function SitePage({ live }: { live?: boolean }) {
  return (
    <div className="bg-[#f7f4ef] text-[#1f1c18]">
      <div className="relative">
        <img src={img("hero.jpg")} alt="" className="h-48 w-full object-cover md:h-56" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />
        <div className="absolute inset-x-0 top-0 flex items-center gap-4 px-4 py-3 text-[10px] text-white">
          <span style={SERIF} className="text-[15px]">
            Northline
          </span>
          <span className="ml-auto max-sm:hidden">Work</span>
          <span className="max-sm:hidden">Studio</span>
          <span className="max-sm:hidden">Journal</span>
          <span className="rounded-full bg-white px-2.5 py-1 text-[#1f1c18] max-sm:ml-auto">
            Book a call
          </span>
        </div>
        <div className="absolute inset-x-4 bottom-4 text-white">
          <div className="text-[8px] tracking-[0.2em] uppercase opacity-80">
            Interior design studio · London &amp; Surrey
          </div>
          <div
            style={SERIF}
            className="mt-1 max-w-[320px] text-[22px] leading-[1.05] font-light md:text-[26px]"
          >
            Calm, considered interiors for the way you live.
          </div>
        </div>
      </div>
      {live && (
        <div className="grid grid-cols-3 border-b border-black/10 px-4 py-3">
          {[
            ["240+", "homes completed"],
            ["12 yrs", "in London & Surrey"],
            ["96%", "on budget"],
          ].map(([n, l]) => (
            <div key={l}>
              <div style={SERIF} className="text-[18px] font-light">
                {n}
              </div>
              <div className="text-[9px] text-[#1f1c18]/60">{l}</div>
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-3 gap-2 p-4">
        {work.map(([name, file]) => (
          <div key={name}>
            <img src={img(file)} alt="" className="aspect-[4/3] w-full rounded object-cover" />
            <div style={SERIF} className="mt-1 text-[11px]">
              {name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// share of the page in each swatch, in the same order
const coverage = [8, 60, 30, 2];

function UiView() {
  return (
    <Frame label="Home · design">
      <div className="flex h-full bg-neutral-100 dark:bg-neutral-950">
        <div className="min-w-0 flex-1 p-3 md:p-5">
          <div className={cn("mb-1.5 text-[10px]", muted)}>Home — Desktop</div>
          <div className="overflow-hidden rounded shadow-sm ring-1 ring-black/10">
            <SitePage />
          </div>
        </div>
        <div className="w-40 shrink-0 space-y-4 border-l border-black/5 bg-white p-3 text-[11px] max-sm:hidden dark:border-white/5 dark:bg-neutral-900">
          <div>
            <div className={cn("mb-2", strong)}>Colour</div>
            <ul className="space-y-1.5">
              {swatches.map(([name, hex]) => (
                <li key={name} className="flex items-center gap-2">
                  <span
                    className="h-4 w-4 rounded ring-1 ring-black/10 dark:ring-white/15"
                    style={{ background: hex }}
                  />
                  <span className="text-neutral-700 dark:text-neutral-300">{name}</span>
                  <span className={cn("ml-auto font-mono text-[9px]", muted)}>{hex}</span>
                </li>
              ))}
            </ul>
            {/* how much of the page each colour covers */}
            <div className="mt-2.5 flex h-2 overflow-hidden rounded-full ring-1 ring-black/10 dark:ring-white/15">
              {swatches.map(([name, hex], i) => (
                <span key={name} style={{ width: `${coverage[i]}%`, background: hex }} />
              ))}
            </div>
            <div className={cn("mt-1 text-[9px]", muted)}>
              Paper 60 · Stone 30 · Ink 8 · Brass 2
            </div>
          </div>
          <div>
            <div className={cn("mb-2", strong)}>Type</div>
            <div
              style={SERIF}
              className="text-[26px] leading-none font-light text-neutral-900 dark:text-white"
            >
              Aa
            </div>
            <div className={cn("mt-1 text-[10px]", muted)}>Fraunces Light · headings</div>
            <div className="mt-2 text-[18px] leading-none text-neutral-900 dark:text-white">Aa</div>
            <div className={cn("mt-1 text-[10px]", muted)}>Inter · body</div>
          </div>
          <div>
            <div className={cn("mb-2", strong)}>Spacing</div>
            <div className="flex items-end gap-1">
              {[4, 8, 12, 16, 24].map((s) => (
                <span
                  key={s}
                  className="bg-[#ff4d31]/40"
                  style={{ width: s / 1.5, height: s / 1.5 }}
                />
              ))}
            </div>
            <div className={cn("mt-1 text-[10px]", muted)}>8-point scale</div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ---------- 4. Components: the pieces, built once ---------- */

function Tile({
  name,
  className,
  children,
}: {
  name: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-black/10 bg-[#f7f4ef] p-2.5 text-[#1f1c18] dark:border-white/10",
        className,
      )}
    >
      <span className="mb-2 font-mono text-[9px] text-[#1f1c18]/50">{name}</span>
      <div className="flex min-h-0 flex-1 flex-col justify-center">{children}</div>
    </div>
  );
}

// times each component is used across the site
const reuse: [string, number][] = [
  ["Button", 38],
  ["ProjectCard", 24],
  ["Rating", 11],
  ["Input", 9],
];

function ComponentsView() {
  return (
    <Frame label="Components · 24">
      <div className="grid h-full grid-cols-2 gap-2.5 bg-neutral-50 p-3 md:grid-cols-3 md:p-4 dark:bg-neutral-950/60">
        <Tile name="Button" className="gap-1.5">
          <span className="self-start rounded-full bg-[#1f1c18] px-3 py-1.5 text-[10px] text-white">
            Start your project →
          </span>
          <span className="mt-1.5 self-start rounded-full border border-[#1f1c18]/30 px-3 py-1.5 text-[10px]">
            View our work
          </span>
        </Tile>
        <Tile name="ProjectCard" className="md:row-span-3">
          <img
            src={img("olive.jpg")}
            alt=""
            className="min-h-0 w-full flex-1 max-md:aspect-[4/3] rounded object-cover"
          />
          <div style={SERIF} className="mt-1.5 text-[13px]">
            Olive &amp; Oak
          </div>
          <div className="text-[9px] text-[#1f1c18]/60">Hove · Hospitality</div>
        </Tile>
        <Tile name="Nav" className="max-md:hidden">
          <div className="flex items-center gap-2 text-[9px]">
            <span style={SERIF} className="text-[12px]">
              Northline
            </span>
            <span className="ml-auto">Work</span>
            <span>Studio</span>
          </div>
        </Tile>
        <Tile name="Input">
          <span className="text-[9px] text-[#1f1c18]/60">Email</span>
          <span className="mt-1 rounded border border-[#1f1c18]/20 bg-white px-2 py-1.5 text-[10px] text-[#1f1c18]/40">
            you@example.com
          </span>
        </Tile>
        <Tile name="Rating" className="max-md:hidden">
          <span className="flex gap-0.5 text-[#a8865a]">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="h-3 w-3 fill-current" />
            ))}
          </span>
          <span className="mt-1 text-[10px]">4.9 from 180 reviews</span>
        </Tile>
        <Tile name="Used across 11 pages" className="max-sm:hidden">
          <div className="space-y-1.5">
            {reuse.map(([name, n]) => (
              <div key={name} className="flex items-center gap-2 text-[9px]">
                <span className="w-16 text-[#1f1c18]/60">{name}</span>
                <span className="block flex-1">
                  <span
                    className="block h-1.5 rounded-full bg-[#ff4d31]"
                    style={{ width: `${(n / 38) * 100}%` }}
                  />
                </span>
                <span className="w-4 text-right tabular-nums">{n}</span>
              </div>
            ))}
          </div>
        </Tile>
      </div>
    </Frame>
  );
}

/* ---------- 5. Website: the pages put together ---------- */

const devices: [string, number][] = [
  ["Phone", 68],
  ["Desktop", 27],
  ["Tablet", 5],
];

function WebsiteView() {
  return (
    <Frame label="northline.studio">
      <SitePage live />
      <Overlay>
        <div className="flex items-center gap-3">
          <Ring parts={devices.map(([, pct], i) => [pct, shades[i]])} size={52} stroke={7}>
            <span className={cn("text-[10px]", strong)}>68%</span>
          </Ring>
          <div>
            <div className={cn("mb-1", strong)}>Visitors by device</div>
            <Legend items={devices.map(([d, pct], i) => [`${d} ${pct}%`, shades[i]])} />
          </div>
        </div>
      </Overlay>
    </Frame>
  );
}

/* ---------- 6. Launch: live, fast and checked ---------- */

const scores: [string, number][] = [
  ["Performance", 98],
  ["Accessibility", 100],
  ["Best practices", 100],
  ["SEO", 100],
];

function Score({ label, value }: { label: string; value: number }) {
  const r = 20;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <div className="relative h-14 w-14">
        <svg viewBox="0 0 48 48" className="-rotate-90">
          <circle
            cx="24"
            cy="24"
            r={r}
            fill="none"
            strokeWidth="4"
            className="stroke-emerald-500/15"
          />
          <circle
            cx="24"
            cy="24"
            r={r}
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${(value / 100) * c} ${c}`}
            className="stroke-emerald-500"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[13px] font-semibold text-emerald-600 dark:text-emerald-400">
          {value}
        </span>
      </div>
      <span className={cn("text-[10px] leading-tight", muted)}>{label}</span>
    </div>
  );
}

function LaunchView() {
  return (
    <Frame label="northline.studio · live">
      <div className="flex h-full flex-col gap-4 bg-neutral-50 p-4 md:p-5 dark:bg-neutral-950/60">
        <div className="flex items-center gap-2 text-[11px]">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className={strong}>Live</span>
          <span className={muted}>· SSL · backups on · analytics connected</span>
        </div>
        <div className="flex min-h-0 flex-1 items-end justify-center gap-4">
          <div className="min-w-0 flex-1 self-stretch overflow-hidden rounded-lg ring-1 ring-black/10 max-sm:hidden dark:ring-white/10">
            <SitePage />
          </div>
          {/* the same site on a phone */}
          <div className="w-32 shrink-0 self-stretch overflow-hidden rounded-[18px] border-4 border-neutral-900 bg-[#f7f4ef] max-sm:mx-auto">
            <div className="relative h-[55%]">
              <img src={img("hero.jpg")} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div
                style={SERIF}
                className="absolute inset-x-2 bottom-2 text-[12px] leading-tight font-light text-white"
              >
                Calm, considered interiors.
              </div>
            </div>
            <div className="space-y-1.5 p-2">
              {work.slice(0, 2).map(([name, file]) => (
                <img
                  key={name}
                  src={img(file)}
                  alt=""
                  className="aspect-[2/1] w-full rounded object-cover"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 rounded-lg border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-neutral-900">
          {scores.map(([l, v]) => (
            <Score key={l} label={l} value={v} />
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ---------- content ---------- */

const steps: Step[] = [
  {
    name: "Wireframe & Mockup",
    icon: PencilRuler,
    text: "We plan every page around what your buyers need to see, and agree the structure before any design.",
    features: [
      "Goals and sitemap agreed",
      "Wireframes for the key pages",
      "Content planned section by section",
      "Signed off before design starts",
    ],
    View: MockupView,
  },
  {
    name: "Framework",
    icon: CodeXml,
    text: "The site is set up on a modern framework and split into components, so it's fast, secure and easy to grow.",
    features: [
      "Modern, maintainable codebase",
      "Page structure on a responsive grid",
      "Built for speed from the first line",
      "Version control from day one",
    ],
    View: FrameworkView,
  },
  {
    name: "UI Design",
    icon: Palette,
    text: "Your brand turned into a visual system of type, colour, photography and spacing, designed in full before we build.",
    features: [
      "Type and colour system",
      "Desktop and mobile designs",
      "Real content, not placeholder text",
      "Revisions until it's right",
    ],
    View: UiView,
  },
  {
    name: "Components",
    icon: Component,
    text: "Every piece is built once as a reusable component, so new pages are quick to make and always on brand.",
    features: [
      "Buttons, cards, forms and navigation",
      "Responsive at every screen size",
      "Accessible by default",
      "Ready for new pages later",
    ],
    View: ComponentsView,
  },
  {
    name: "Website",
    icon: Globe,
    text: "The components come together as real pages with your content, tested on every device and browser.",
    features: [
      "Every page built and filled",
      "Tested on phones, tablets and desktops",
      "Forms connected to your inbox and CRM",
      "Editable through a simple CMS",
    ],
    View: WebsiteView,
  },
  {
    name: "Launch",
    icon: Rocket,
    text: "Live on fast hosting, with SEO, analytics and backups set up on day one, and support after launch.",
    features: [
      "Domain, SSL and hosting handled",
      "Core Web Vitals in the green",
      "Analytics and Search Console set up",
      "Support after go-live",
    ],
    View: LaunchView,
  },
];

export function WebsiteBuild() {
  return (
    <BuildStack
      eyebrow="How we build"
      title={
        <>
          From first sketch <span className="text-[#ff4d31]">to live site.</span>
        </>
      }
      subtitle="Scroll through how a website comes together with us, one step at a time."
      steps={steps}
    />
  );
}
