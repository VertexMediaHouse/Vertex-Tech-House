import { useEffect, useRef } from "react";
import type * as React from "react";
import { CalendarDays, Mail } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { BrandIcons } from "./BrandIcons";

/**
 * Tools drifting around the Vertex hub, each tethered to it by a flowing line.
 * Every icon wanders on two layered sine waves at unrelated speeds, so the paths are
 * smooth, rounded swings that never visibly repeat. Positions are written straight to
 * the DOM each frame (no React re-renders) and the loop pauses while offscreen.
 */

type Tool = {
  key: string;
  node: React.ReactNode;
  fx: number; // resting spot as a fraction of the half-width / half-height
  fy: number;
};

const tools: Tool[] = [
  { key: "drive", node: <BrandIcons.googleDrive />, fx: -0.72, fy: -0.62 },
  { key: "n8n", node: <BrandIcons.n8n />, fx: -0.22, fy: -0.85 },
  { key: "openai", node: <BrandIcons.openai />, fx: 0.38, fy: -0.75 },
  { key: "mail", node: <Mail className="text-[#ff4d31]" strokeWidth={2} />, fx: 0.82, fy: -0.35 },
  { key: "notion", node: <BrandIcons.notion />, fx: -0.86, fy: 0.12 },
  { key: "docs", node: <BrandIcons.googleDocs />, fx: 0.84, fy: 0.3 },
  { key: "whatsapp", node: <BrandIcons.whatsapp />, fx: -0.55, fy: 0.72 },
  {
    key: "calendar",
    node: <CalendarDays className="text-[#5b8bd6]" strokeWidth={2} />,
    fx: 0.05,
    fy: 0.88,
  },
  { key: "messenger", node: <BrandIcons.messenger />, fx: 0.55, fy: 0.75 },
];

// fixed per-icon wave settings (deterministic so SSR and client agree)
const waves = tools.map((_, i) => ({
  ax: 14 + ((i * 7) % 12), // px
  ay: 12 + ((i * 5) % 12),
  f1: 0.00031 + i * 0.000037,
  f2: 0.00047 + ((i * 3) % 5) * 0.000041,
  p1: i * 1.7,
  p2: i * 2.9,
}));

const ICON = 44;

export function IntegrationsFloat() {
  const boxRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);

  useEffect(() => {
    const box = boxRef.current;
    const svg = svgRef.current;
    if (!box || !svg) return;

    let w = 0;
    let h = 0;
    const measure = () => {
      w = box.clientWidth;
      h = box.clientHeight;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    };

    const place = (t: number) => {
      const cx = w / 2;
      const cy = h / 2;
      // keep icons (plus their swing) inside the box
      const rx = Math.max(0, w / 2 - ICON / 2 - 30);
      const ry = Math.max(0, h / 2 - ICON / 2 - 26);
      tools.forEach((tool, i) => {
        const v = waves[i];
        const x =
          cx +
          tool.fx * rx +
          v.ax * Math.sin(t * v.f1 + v.p1) +
          v.ax * 0.5 * Math.sin(t * v.f2 * 1.7 + v.p2);
        const y =
          cy +
          tool.fy * ry +
          v.ay * Math.cos(t * v.f2 + v.p2) +
          v.ay * 0.5 * Math.sin(t * v.f1 * 2.3 + v.p1);
        const icon = iconRefs.current[i];
        const line = lineRefs.current[i];
        if (icon) icon.style.transform = `translate(${x - ICON / 2}px, ${y - ICON / 2}px)`;
        if (line) {
          line.setAttribute("x1", String(cx));
          line.setAttribute("y1", String(cy));
          line.setAttribute("x2", String(x));
          line.setAttribute("y2", String(y));
        }
      });
    };

    measure();
    place(0);
    const ro = new ResizeObserver(() => {
      measure();
      place(performance.now());
    });
    ro.observe(box);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => ro.disconnect();

    let raf = 0;
    const tick = (t: number) => {
      place(t);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) raf = requestAnimationFrame(tick);
    });
    io.observe(box);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={boxRef} className="relative h-[320px] w-full overflow-hidden">
      <style>{`
        @keyframes if-flow { to { stroke-dashoffset: -18; } }
        .if-line { stroke-dasharray: 3 6; animation: if-flow 1.2s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .if-line { animation: none; } }
      `}</style>

      {/* tethers */}
      <svg ref={svgRef} aria-hidden className="absolute inset-0 h-full w-full">
        {tools.map((t, i) => (
          <line
            key={t.key}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            className="if-line"
            stroke="#ff4d31"
            strokeOpacity="0.35"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        ))}
      </svg>

      {/* tools */}
      {tools.map((t, i) => (
        <div
          key={t.key}
          ref={(el) => {
            iconRefs.current[i] = el;
          }}
          className="absolute top-0 left-0 will-change-transform"
        >
          <div
            className="flex items-center justify-center rounded-2xl border border-neutral-200 bg-white p-2.5 shadow-[0_6px_20px_-6px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:scale-110 dark:border-white/10 [&>svg]:h-full [&>svg]:w-full"
            style={{ width: ICON, height: ICON }}
          >
            {t.node}
          </div>
        </div>
      ))}

      {/* hub */}
      <div className="absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-[#ff4d31]/40 bg-white shadow-[0_6px_20px_-6px_rgba(0,0,0,0.25)] dark:bg-[#141417]">
        <Logo className="h-9 w-9" />
      </div>
    </div>
  );
}
