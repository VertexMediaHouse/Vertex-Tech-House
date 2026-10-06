import { useEffect, useRef, useState } from "react";
import type * as React from "react";
import {
  motion,
  useReducedMotion,
  useMotionValueEvent,
  useScroll,
  useTime,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, CalendarDays, Mail, Sheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calTrigger } from "@/lib/contact";
import { Logo } from "./Logo";
import { SectionGlow } from "./SectionGlow";
import { BrandIcons } from "@/components/animation/BrandIcons";

/**
 * Scroll-driven assembly section: before it pins, the tool tiles roam freely; once it pins, they fly in,
 * straighten, and snap into one 3×3 block around Vertex. Everything is a pure function of
 * scroll progress, so scrolling back up plays it in reverse.
 */

type Tool = {
  name: string;
  icon: React.ReactNode;
  cell: number; // 0–8 in the 3×3 grid (4 is Vertex)
  from: [number, number, number]; // scattered x, y (fractions of half-viewport) and rotation
};

// Before scrolling, tiles roam freely: each follows two layered sine waves at unrelated
// speeds (smooth, never-repeating paths). The roaming fades out as soon as scrolling starts.
const ROAM: [number, number] = [0, 0.1];

const tools: Tool[] = [
  { name: "Gmail", icon: <Mail className="text-[#ea4335]" />, cell: 0, from: [-0.82, -0.3, -14] },
  { name: "Sheets", icon: <Sheet className="text-[#1e8e3e]" />, cell: 1, from: [0.62, -0.42, 9] },
  { name: "WhatsApp", icon: <BrandIcons.whatsapp />, cell: 2, from: [0.86, 0.02, -8] },
  { name: "Notion", icon: <BrandIcons.notion />, cell: 3, from: [-0.64, 0.3, 12] },
  { name: "OpenAI", icon: <BrandIcons.openai />, cell: 5, from: [0.7, 0.46, 15] },
  {
    name: "Calendar",
    icon: <CalendarDays className="text-[#4285f4]" />,
    cell: 6,
    from: [-0.88, 0.62, -10],
  },
  { name: "Drive", icon: <BrandIcons.googleDrive />, cell: 7, from: [-0.3, 0.9, 7] },
  { name: "n8n", icon: <BrandIcons.n8n />, cell: 8, from: [0.34, 0.86, -12] },
];

// scroll phases (fractions of the pinned scroll distance)
const FLY: [number, number] = [0.04, 0.5];
const SNAP: [number, number] = [0.5, 0.62];
const CTA: [number, number] = [0.62, 0.72]; // then the finished block holds until the pin ends

const steps = ["Scattered", "Connecting", "One system"];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, [a, b]: [number, number]) => clamp01((p - a) / (b - a));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function useViewport() {
  const [vp, setVp] = useState({ w: 1440, h: 900 });
  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return vp;
}

function Tile({
  tool,
  p,
  size,
  vp,
  index,
  roam,
}: {
  tool: Tool;
  p: MotionValue<number>;
  size: number;
  vp: { w: number; h: number };
  index: number;
  roam: boolean;
}) {
  const time = useTime();
  const col = (tool.cell % 3) - 1;
  const row = Math.floor(tool.cell / 3) - 1;
  const at = (q: number, ms: number) => {
    const gap = lerp(22, 6, ease(seg(q, SNAP)));
    const t = ease(seg(q, FLY));
    // roaming offset, strongest at the top of the page
    const w = roam ? 1 - ease(seg(q, ROAM)) : 0;
    const s = ms / 1000;
    const k = index * 1.37;
    const rx = (Math.sin(s * 0.23 + k) + 0.5 * Math.sin(s * 0.41 + k * 2.1)) * 0.2 * (vp.w / 2);
    const ry = (Math.cos(s * 0.19 + k * 1.7) + 0.5 * Math.sin(s * 0.37 + k)) * 0.16 * (vp.h / 2);
    const rr = Math.sin(s * 0.3 + k) * 10;
    return {
      x: lerp(tool.from[0] * (vp.w / 2) + rx * w, col * (size + gap), t),
      y: lerp(tool.from[1] * (vp.h / 2) + ry * w, row * (size + gap), t),
      r: lerp(tool.from[2] + rr * w, 0, t),
    };
  };
  const x = useTransform([p, time], ([q, ms]: number[]) => at(q, ms).x);
  const y = useTransform([p, time], ([q, ms]: number[]) => at(q, ms).y);
  const rotate = useTransform([p, time], ([q, ms]: number[]) => at(q, ms).r);
  const label = useTransform(p, (q) => 1 - seg(q, [0.3, 0.5]));

  return (
    <motion.div
      className="absolute top-1/2 left-1/2"
      style={{
        x,
        y,
        rotate,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }}
    >
      <div className="h-full w-full rounded-2xl liquid-glass border border-neutral-200/70 dark:border-white/10 dark:!bg-white/[0.03] p-[12%]">
        {/* white plate keeps dark brand marks (OpenAI, Notion) readable on glass */}
        <div className="flex h-full w-full items-center justify-center rounded-xl bg-white p-[16%] [&>svg]:h-full [&>svg]:w-full">
          {tool.icon}
        </div>
      </div>
      <motion.span
        style={{ opacity: label }}
        className="absolute top-full left-1/2 mt-2 -translate-x-1/2 font-mono text-[10px] whitespace-nowrap text-neutral-500 dark:text-neutral-400"
      >
        {tool.name}
      </motion.span>
    </motion.div>
  );
}

export function ToolAssembly() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const vp = useViewport();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // reduced motion: show the finished, assembled state
  const p = useTransform(scrollYProgress, (v) => (reduce ? 1 : v));

  const size = vp.w < 640 ? 58 : 80;
  const block = 3 * size + 2 * 6 + 28; // assembled block + frame padding

  // headline swap: the problem slides out before the answer slides in (never overlapping)
  const lineA = useTransform(p, (q) => 1 - seg(q, [0.44, 0.52]));
  const lineAY = useTransform(p, (q) => -24 * ease(seg(q, [0.44, 0.52])));
  const lineB = useTransform(p, (q) => seg(q, [0.52, 0.6]));
  const lineBY = useTransform(p, (q) => 24 * (1 - ease(seg(q, [0.52, 0.6]))));
  // progress track + which step is current
  const track = useTransform(p, (q) => seg(q, [0, SNAP[1]]));
  const [step, setStep] = useState(0);
  useMotionValueEvent(p, "change", (q) => setStep(q < 0.12 ? 0 : q < SNAP[1] ? 1 : 2));
  const frame = useTransform(p, (q) => ease(seg(q, SNAP)));
  const frameScale = useTransform(frame, [0, 1], [1.15, 1]);
  const cta = useTransform(p, (q) => seg(q, CTA));
  const ctaY = useTransform(p, (q) => lerp(16, 0, ease(seg(q, CTA))));
  const ctaEvents = useTransform(p, (q) => (q > CTA[0] ? "auto" : "none"));
  const hint = useTransform(p, (q) => 1 - seg(q, [0, 0.06]));

  return (
    <section
      ref={ref}
      id="one-system"
      className={reduce ? "relative w-full" : "relative h-[170vh] w-full md:h-[200vh]"}
    >
      <div
        className={`flex flex-col items-center overflow-hidden px-4 pt-28 pb-8 sm:px-6 md:pt-32 ${
          reduce ? "min-h-[100svh]" : "sticky top-0 h-[100svh]"
        }`}
      >
        {/* blue glow + hairline at the top, same as the other sections (stays put while pinned) */}
        <SectionGlow />

        {/* section chip, same style as the other sections */}
        <span className="relative z-10 mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-200/70 bg-white/60 px-3 py-1 text-xs font-semibold tracking-wider text-neutral-600 uppercase backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff4d31]" />
          Integrations
        </span>

        {/* headline: problem → answer */}
        <div className="relative z-10 grid w-full max-w-4xl text-center">
          <motion.h2
            style={{ opacity: lineA, y: lineAY }}
            className="col-start-1 row-start-1 text-4xl leading-[1.02] font-extrabold tracking-tighter text-neutral-950 sm:text-5xl lg:text-6xl dark:text-white"
          >
            Your business runs on 8 tools{" "}
            <span className="text-neutral-400 dark:text-neutral-500">
              that don’t talk to each other.
            </span>
          </motion.h2>
          <motion.p
            aria-hidden
            style={{ opacity: lineB, y: lineBY }}
            className="col-start-1 row-start-1 text-4xl leading-[1.02] font-extrabold tracking-tighter text-neutral-950 sm:text-5xl lg:text-6xl dark:text-white"
          >
            Vertex makes them <span className="text-[#ff4d31]">one system.</span>
          </motion.p>
        </div>

        {/* stage */}
        <div className="relative w-full flex-1">
          {/* the frame that appears when the block snaps together */}
          <motion.div
            style={{
              opacity: frame,
              scale: frameScale,
              width: block,
              height: block,
              marginLeft: -block / 2,
              marginTop: -block / 2,
            }}
            className="liquid-glass absolute top-1/2 left-1/2 rounded-[28px] border-2 border-[#ff4d31] dark:!bg-white/[0.03]"
          />

          {tools.map((t, i) => (
            <Tile key={t.name} tool={t} p={p} size={size} vp={vp} index={i} roam={!reduce} />
          ))}

          {/* Vertex at the centre */}
          <div
            className="absolute top-1/2 left-1/2 flex items-center justify-center rounded-2xl bg-neutral-950 dark:bg-white"
            style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
          >
            <Logo className="h-1/2 w-1/2" />
          </div>

          <motion.p
            style={{ opacity: hint }}
            className="absolute bottom-14 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-widest whitespace-nowrap text-neutral-500 uppercase dark:text-neutral-400"
          >
            scroll to connect ↓
          </motion.p>
        </div>

        {/* progress: a slim vertical step indicator on the right edge, clear of the tiles */}
        {!reduce && (
          <div className="absolute top-1/2 right-4 z-10 flex -translate-y-1/2 items-stretch gap-3 sm:right-8">
            <div className="flex flex-col justify-between py-1 text-right font-mono text-[10px] tracking-wider uppercase">
              {steps.map((label, i) => (
                <span
                  key={label}
                  className={`hidden transition-colors md:block ${
                    i === step
                      ? "text-neutral-900 dark:text-white"
                      : i < step
                        ? "text-[#ff4d31]"
                        : "text-neutral-400 dark:text-neutral-600"
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="relative h-40 w-[3px] overflow-hidden rounded-full bg-neutral-200 dark:bg-white/10">
              <motion.div
                style={{ scaleY: track }}
                className="absolute inset-0 origin-top rounded-full bg-[#ff4d31]"
              />
            </div>
          </div>
        )}

        {/* CTA arrives once the system is assembled */}
        <motion.div
          style={{ opacity: cta, y: ctaY, pointerEvents: ctaEvents }}
          className="relative z-10 text-center"
        >
          <p className="mx-auto max-w-xl text-base text-neutral-600 md:text-lg dark:text-neutral-400">
            n8n workflows, AI voice agents and custom CRMs, built to work as one.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Button
              className="group h-auto rounded-xl bg-[#ff4d31] px-6 py-3 text-base text-white hover:bg-[#e8462c]"
              {...calTrigger}
            >
              Book a Call
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto liquid-glass rounded-xl border-neutral-300 bg-transparent px-6 py-3 text-base dark:border-neutral-700"
            >
              <a href="#case-studies">See Our Work</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
