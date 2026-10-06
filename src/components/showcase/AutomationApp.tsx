import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { Maximize2, Minus, Play, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCanvas, type ScreenProps } from "./kit";

/*
 * Real n8n workflow screenshots on a pannable canvas. It tours the workflow by itself until
 * the visitor drags, zooms or switches workflow; then it's theirs.
 * Desktop fills the frame with the screenshot; the phone frame shows it whole and zooms deeper.
 */

const flows = [
  {
    key: "construction",
    label: "Construction pipeline",
    src: "/assets/imgs/Construction_Automation.png",
  },
  { key: "bulk-email", label: "Bulk email engine", src: "/assets/imgs/BulkEmail_Automation.png" },
];
const SHOT = 1079 / 1919; // screenshot aspect (h / w)
const clamp = (v: number, m: number) => Math.min(m, Math.max(-m, v));

export function AutomationApp({ onPath }: ScreenProps) {
  const reduce = useReducedMotion();
  const { scale: fit, w: W, h: H } = useCanvas();
  const phone = W < 500;
  const peak = phone ? 3 : 2; // tour zoom
  const maxZoom = phone ? 4 : 3;
  const contentH = phone ? W * SHOT : H; // object-contain on the phone, object-cover on desktop

  const [flow, setFlow] = useState(0);
  const [touring, setTouring] = useState(!reduce);
  const s = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);

  useEffect(() => onPath(`/workflow/${flows[flow].key}`), [flow, onPath]);

  const limits = (scale: number) => [
    ((scale - 1) * W) / 2,
    Math.max(0, (scale * contentH - H) / 2),
  ];

  // guided tour: zoom in and walk along the workflow, left to right, then back out
  useEffect(() => {
    if (!touring) return;
    const mx = ((peak - 1) * W) / 2;
    const dy = phone ? 0 : 0.04 * H;
    const opts = {
      duration: 18,
      times: [0, 0.2, 0.45, 0.7, 1],
      ease: "easeInOut" as const,
      repeat: Infinity,
      repeatDelay: 1,
    };
    const runs = [
      animate(s, [1, peak, peak, peak, 1], opts),
      animate(x, [0, 0.96 * mx, 0.08 * mx, -0.88 * mx, 0], opts),
      animate(y, [0, dy, dy, dy, 0], opts),
    ];
    return () => runs.forEach((r) => r.stop());
  }, [touring, flow, s, x, y, W, H, peak, phone]);

  const zoomTo = (next: number) => {
    setTouring(false);
    const ns = Math.min(maxZoom, Math.max(1, next));
    const k = ns / s.get();
    const [mx, my] = limits(ns);
    animate(s, ns, { duration: 0.3 });
    animate(x, clamp(x.get() * k, mx), { duration: 0.3 });
    animate(y, clamp(y.get() * k, my), { duration: 0.3 });
  };
  const pick = (i: number) => {
    setFlow(i);
    setTouring(false);
    s.set(1);
    x.set(0);
    y.set(0);
  };

  const switcher = (className: string) => (
    <div
      className={cn(
        "flex rounded-lg border border-neutral-200 bg-white p-0.5 text-[12px] shadow-sm",
        className,
      )}
    >
      {flows.map((f, i) => (
        <button
          key={f.key}
          type="button"
          onClick={() => pick(i)}
          className={cn(
            "flex-1 rounded-md px-3 py-1.5 font-medium whitespace-nowrap transition-colors",
            i === flow ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100",
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#f5f5f5]">
      <div
        onPointerDown={(e) => {
          setTouring(false);
          drag.current = { px: e.clientX, py: e.clientY, x: x.get(), y: y.get() };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          // pointer moves in screen pixels; the canvas lives inside the scaled frame
          const [mx, my] = limits(s.get());
          x.set(clamp(d.x + (e.clientX - d.px) / fit, mx));
          y.set(clamp(d.y + (e.clientY - d.py) / fit, my));
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
        onDoubleClick={() => zoomTo(s.get() + 0.75)}
        className="h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
      >
        <motion.img
          key={flows[flow].key}
          src={flows[flow].src}
          alt={`n8n workflow: ${flows[flow].label}`}
          draggable={false}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ scale: s, x, y }}
          className={cn("h-full w-full select-none", phone ? "object-contain" : "object-cover")}
        />
      </div>

      {/* phone: workflow switch across the top */}
      {switcher("absolute inset-x-4 top-4 hidden @max-md:flex")}

      {/* canvas controls */}
      <div className="absolute right-5 bottom-5 flex flex-row-reverse items-center gap-2 text-[12px] @max-md:inset-x-4 @max-md:right-4 @max-md:bottom-4 @max-md:justify-between">
        {switcher("@max-md:hidden")}
        <div className="flex rounded-lg border border-neutral-200 bg-white p-0.5 shadow-sm">
          {[
            [Minus, "Zoom out", () => zoomTo(s.get() - 0.5)],
            [Maximize2, "Fit to view", () => zoomTo(1)],
            [Plus, "Zoom in", () => zoomTo(s.get() + 0.5)],
          ].map(([Icon, label, fn]) => {
            const I = Icon as typeof Minus;
            return (
              <button
                key={label as string}
                type="button"
                aria-label={label as string}
                title={label as string}
                onClick={fn as () => void}
                className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100"
              >
                <I className="h-3.5 w-3.5" />
              </button>
            );
          })}
        </div>
        {touring ? (
          <span className="flex h-9 items-center rounded-lg bg-neutral-900/85 px-3 font-medium text-white">
            {phone ? "Drag to explore" : "Drag to explore · double-click to zoom"}
          </span>
        ) : (
          !reduce && (
            <button
              type="button"
              onClick={() => setTouring(true)}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 font-medium text-neutral-600 shadow-sm hover:bg-neutral-100"
            >
              <Play className="h-3.5 w-3.5" /> Tour
            </button>
          )
        )}
      </div>
    </div>
  );
}
