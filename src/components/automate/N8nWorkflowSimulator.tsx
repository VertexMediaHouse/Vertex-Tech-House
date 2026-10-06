import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/* ── n8n node colour themes (Light & Dark Responsive) ── */
const NODE_COLORS: Record<
  string,
  { bg: string; border: string; text: string; glow: string; rawBorder: string }
> = {
  trigger: {
    bg: "fill-purple-50/80 dark:fill-[#2d1f3d]/90",
    border: "stroke-purple-400 dark:stroke-purple-500",
    text: "fill-purple-900 dark:fill-[#d2a8ea]",
    glow: "rgba(155,89,182,0.25)",
    rawBorder: "#9b59b6",
  },
  http: {
    bg: "fill-blue-50/80 dark:fill-[#1a2f3d]/90",
    border: "stroke-blue-400 dark:stroke-blue-500",
    text: "fill-blue-900 dark:fill-[#7ec8e3]",
    glow: "rgba(52,152,219,0.25)",
    rawBorder: "#3498db",
  },
  ai: {
    bg: "fill-emerald-50/80 dark:fill-[#1a3d2a]/90",
    border: "stroke-emerald-400 dark:stroke-emerald-500",
    text: "fill-emerald-900 dark:fill-[#81e6a8]",
    glow: "rgba(46,204,113,0.25)",
    rawBorder: "#2ecc71",
  },
  n8n: {
    bg: "fill-pink-50/80 dark:fill-[#3d1f2a]/90",
    border: "stroke-pink-400 dark:stroke-[#ea4b71]",
    text: "fill-pink-900 dark:fill-[#f5a0b8]",
    glow: "rgba(234,75,113,0.25)",
    rawBorder: "#ea4b71",
  },
  output: {
    bg: "fill-amber-50/80 dark:fill-[#3d3520]/90",
    border: "stroke-amber-400 dark:stroke-amber-500",
    text: "fill-amber-900 dark:fill-[#f5cf7a]",
    glow: "rgba(243,156,18,0.25)",
    rawBorder: "#f39c12",
  },
  data: {
    bg: "fill-teal-50/80 dark:fill-[#1f2d3d]/90",
    border: "stroke-teal-400 dark:stroke-teal-500",
    text: "fill-teal-900 dark:fill-[#76d7c4]",
    glow: "rgba(26,188,156,0.25)",
    rawBorder: "#1abc9c",
  },
};

/* ── Workflow nodes ── */
const NODES = [
  {
    id: "webhook",
    label: "Webhook Trigger",
    type: "trigger",
    icon: "⚡",
    x: 60,
    y: 120,
    desc: "POST /api/lead",
  },
  {
    id: "enrich",
    label: "HTTP Request",
    type: "http",
    icon: "🌐",
    x: 250,
    y: 40,
    desc: "Enrich via API",
  },
  { id: "ai", label: "AI Agent", type: "ai", icon: "🤖", x: 250, y: 200, desc: "GPT-4o classify" },
  {
    id: "router",
    label: "n8n Router",
    type: "n8n",
    icon: "🔀",
    x: 440,
    y: 120,
    desc: "Score → Route",
  },
  { id: "crm", label: "CRM Update", type: "data", icon: "📊", x: 630, y: 40, desc: "HubSpot push" },
  {
    id: "notify",
    label: "Slack Notify",
    type: "output",
    icon: "💬",
    x: 630,
    y: 200,
    desc: "#sales-alerts",
  },
];

/* ── Connections ── */
const CONNECTIONS = [
  { from: "webhook", to: "enrich" },
  { from: "webhook", to: "ai" },
  { from: "enrich", to: "router" },
  { from: "ai", to: "router" },
  { from: "router", to: "crm" },
  { from: "router", to: "notify" },
];

/* ── Execution log lines ── */
const EXEC_LOG = [
  { time: "00:00.012", node: "Webhook Trigger", status: "✓", msg: "POST received • 1 item" },
  { time: "00:00.048", node: "HTTP Request", status: "✓", msg: "200 OK • enriched payload" },
  { time: "00:00.051", node: "AI Agent", status: "✓", msg: "classified → hot_lead (0.94)" },
  { time: "00:01.230", node: "n8n Router", status: "✓", msg: "routed → [CRM, Slack]" },
  { time: "00:01.445", node: "CRM Update", status: "✓", msg: "contact created #4829" },
  { time: "00:01.502", node: "Slack Notify", status: "✓", msg: "alert posted → #sales" },
];

const NW = 140,
  NH = 52;

function getConnectorOut(id: string) {
  const n = NODES.find((n) => n.id === id)!;
  return { x: n.x + NW, y: n.y + NH / 2 };
}
function getConnectorIn(id: string) {
  const n = NODES.find((n) => n.id === id)!;
  return { x: n.x, y: n.y + NH / 2 };
}
/* ── Animated flowing dot using SMIL ── */
function FlowDot({ pathD, active, delay }: { pathD: string; active: boolean; delay: number }) {
  if (!active) return null;
  return (
    <circle r="3" fill="#ea4b71" style={{ filter: "drop-shadow(0 0 3px #ea4b71)" }}>
      <animateMotion path={pathD} dur="1.6s" begin={`${delay}s`} repeatCount="indefinite" />
    </circle>
  );
}

export function N8nWorkflowSimulator() {
  const [executingIdx, setExecutingIdx] = useState(-1);
  const [logLines, setLogLines] = useState<typeof EXEC_LOG>([]);
  const [execCount, setExecCount] = useState(1);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;

    let cancelled = false;
    let step = 0;
    setLogLines([]);
    setExecutingIdx(-1);

    function tick() {
      if (cancelled) return;

      if (step < EXEC_LOG.length) {
        const currentStep = step;
        setExecutingIdx(currentStep);
        setLogLines((prev) => [...prev, EXEC_LOG[currentStep]]);
        step++;
        setTimeout(
          () => {
            if (!cancelled) tick();
          },
          600 + Math.random() * 400,
        );
      } else {
        /* Pause, then restart the cycle */
        setTimeout(() => {
          if (cancelled) return;
          step = 0;
          setLogLines([]);
          setExecutingIdx(-1);
          setExecCount((c) => c + 1);
          setTimeout(() => {
            if (!cancelled) tick();
          }, 800);
        }, 2500);
      }
    }

    const startTimer = setTimeout(() => {
      if (!cancelled) tick();
    }, 600);

    return () => {
      cancelled = true;
      clearTimeout(startTimer);
    };
  }, [isRunning]);

  const doneNodes = new Set(logLines.map((l) => l.node));
  const activeNode = executingIdx >= 0 ? EXEC_LOG[executingIdx]?.node : null;

  return (
    <div className="w-full h-full liquid-glass rounded-2xl border border-black/10 dark:border-white/[0.12] shadow-2xl shadow-black/10 dark:shadow-black/40 flex flex-col overflow-hidden relative select-none font-mono text-[9px] text-neutral-600 dark:text-neutral-400">
      {/* ─── Top bar ─── */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-black/5 dark:border-white/5 bg-white/40 dark:bg-black/40 shrink-0">
        <div className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full bg-[#ff5f56] cursor-pointer"
            onClick={() => setIsRunning(!isRunning)}
          />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <span className="text-[10px] tracking-wide text-neutral-850 dark:text-neutral-200 font-medium">
          n8n / <em className="text-[#ea4b71] not-italic font-semibold">Lead_Automation.json</em>
        </span>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider",
              isRunning
                ? "bg-[#ea4b71]/10 text-[#ea4b71] animate-pulse"
                : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400",
            )}
          >
            {isRunning ? "Executing" : "Paused"}
          </span>
        </div>
      </div>

      {/* ─── Canvas + Side panel ─── */}
      <div className="flex flex-grow overflow-hidden min-h-0">
        {/* Workflow Canvas */}
        <div className="flex-grow relative overflow-hidden bg-white/40 dark:bg-[#111113]">
          {/* Dot grid background */}
          <div
            className="absolute inset-0 opacity-20 dark:opacity-30"
            style={{
              backgroundImage: "radial-gradient(circle, #888 0.8px, transparent 0.8px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Full SVG canvas — nodes + connections in one coordinate system */}
          <svg
            className="absolute inset-0 w-full h-full text-neutral-600 dark:text-neutral-400"
            viewBox="0 0 830 300"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Connections */}
            {CONNECTIONS.map((conn, i) => {
              const from = getConnectorOut(conn.from);
              const to = getConnectorIn(conn.to);
              const midX = (from.x + to.x) / 2;
              const pathD = `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
              const fromNode = NODES.find((n) => n.id === conn.from)!;
              const fromDone = doneNodes.has(fromNode.label);
              const isActive = fromDone || activeNode === fromNode.label;

              return (
                <g key={i}>
                  <path
                    d={pathD}
                    className={cn(
                      "transition-all duration-500 fill-none",
                      isActive
                        ? "stroke-[#ea4b71] opacity-90"
                        : "stroke-neutral-300 dark:stroke-neutral-850 opacity-40",
                    )}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    strokeDasharray={isActive ? "none" : "5 5"}
                  />
                  {isActive && (
                    <path
                      d={pathD}
                      stroke="#ea4b71"
                      strokeWidth={4}
                      fill="none"
                      opacity={0.15}
                      style={{ filter: "blur(3px)" }}
                    />
                  )}
                  <FlowDot pathD={pathD} active={isActive} delay={i * 0.25} />
                </g>
              );
            })}

            {/* Nodes as SVG foreignObject for perfect alignment */}
            {NODES.map((node) => {
              const color = NODE_COLORS[node.type];
              const isDone = doneNodes.has(node.label);
              const isActive = activeNode === node.label;
              const lit = isDone || isActive;

              return (
                <g key={node.id}>
                  {/* Node glow */}
                  {isActive && (
                    <rect
                      x={node.x - 4}
                      y={node.y - 4}
                      width={NW + 8}
                      height={NH + 8}
                      rx={10}
                      fill="none"
                      stroke={color.rawBorder}
                      strokeWidth={1}
                      opacity={0.4}
                      style={{ filter: `drop-shadow(0 0 12px ${color.glow})` }}
                    />
                  )}

                  {/* Node body */}
                  <rect
                    x={node.x}
                    y={node.y}
                    width={NW}
                    height={NH}
                    rx={8}
                    className={cn(
                      "transition-all duration-400",
                      color.bg,
                      color.border,
                      lit
                        ? "stroke-2"
                        : "stroke-1.5 dark:stroke-1 stroke-black/10 dark:stroke-[#333]",
                    )}
                  />

                  {/* Connector dots */}
                  <circle
                    cx={node.x}
                    cy={node.y + NH / 2}
                    r={4}
                    className={cn(
                      "transition-colors duration-300",
                      lit
                        ? color.text
                        : "fill-neutral-200 dark:fill-[#222] stroke-neutral-300 dark:stroke-[#444]",
                    )}
                  />
                  <circle
                    cx={node.x + NW}
                    cy={node.y + NH / 2}
                    r={4}
                    className={cn(
                      "transition-colors duration-300",
                      lit
                        ? color.text
                        : "fill-neutral-200 dark:fill-[#222] stroke-neutral-300 dark:stroke-[#444]",
                    )}
                  />

                  {/* Icon */}
                  <text x={node.x + 12} y={node.y + 22} fontSize="14" textAnchor="start">
                    {node.icon}
                  </text>

                  {/* Label */}
                  <text
                    x={node.x + 30}
                    y={node.y + 22}
                    fontSize="10"
                    fontWeight="700"
                    fontFamily="ui-monospace, monospace"
                    className={cn(
                      "transition-all duration-400 font-sans",
                      lit ? color.text : "fill-neutral-500 dark:fill-[#777]",
                    )}
                  >
                    {node.label}
                  </text>

                  {/* Description */}
                  <text
                    x={node.x + 12}
                    y={node.y + 38}
                    fontSize="8"
                    fontFamily="ui-monospace, monospace"
                    className={cn(
                      "transition-all duration-400",
                      lit ? color.text : "fill-neutral-400 dark:fill-[#555]",
                    )}
                    opacity={0.7}
                  >
                    {node.desc}
                  </text>

                  {/* Status indicator */}
                  {isDone && (
                    <>
                      <circle cx={node.x + NW - 4} cy={node.y + 4} r={6} fill="#27c93f" />
                      <text
                        x={node.x + NW - 4}
                        y={node.y + 7.5}
                        fontSize="7"
                        fontWeight="900"
                        fill="#000"
                        textAnchor="middle"
                        fontFamily="ui-monospace, monospace"
                      >
                        ✓
                      </text>
                    </>
                  )}
                  {isActive && !isDone && (
                    <circle cx={node.x + NW - 4} cy={node.y + 4} r={5} fill="#ea4b71">
                      <animate
                        attributeName="opacity"
                        values="1;0.3;1"
                        dur="0.8s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Canvas zoom indicator */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[7px] text-neutral-500 dark:text-neutral-600 bg-white/60 dark:bg-black/40 px-1.5 py-0.5 rounded border border-black/5 dark:border-white/5 shadow-sm">
            <span>100%</span>
            <span className="text-neutral-350 dark:text-neutral-700">|</span>
            <span>6 nodes</span>
          </div>
        </div>

        {/* ─── Right side: Execution log ─── */}
        <div className="hidden sm:flex w-[200px] flex-col border-l border-black/5 dark:border-white/5 bg-white/30 dark:bg-[#151518] shrink-0">
          <div className="px-2.5 py-2 border-b border-black/5 dark:border-white/5 flex items-center justify-between text-neutral-850 dark:text-neutral-200">
            <span className="text-[8px] font-semibold uppercase tracking-wider text-neutral-500">
              Execution Log
            </span>
            <span className="text-[7px] text-[#ea4b71] font-bold">#{execCount}</span>
          </div>

          <div className="flex-grow overflow-hidden px-2 py-1.5 space-y-1">
            {logLines.map((line, i) => (
              <div
                key={`${execCount}-${i}`}
                className={cn(
                  "flex flex-col rounded px-1.5 py-1 border transition-all duration-300",
                  i === logLines.length - 1
                    ? "border-[#ea4b71]/30 bg-[#ea4b71]/5 dark:bg-[#ea4b71]/10 text-[#ea4b71]"
                    : "border-black/[0.03] dark:border-white/[0.03] bg-white/40 dark:bg-white/[0.01] text-neutral-600 dark:text-neutral-450",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[7px] text-neutral-450 dark:text-neutral-500">
                    {line.time}
                  </span>
                  <span className="text-[7px] text-[#27c93f] font-bold">{line.status}</span>
                </div>
                <span className="text-[8px] text-neutral-850 dark:text-neutral-300 font-semibold truncate">
                  {line.node}
                </span>
                <span className="text-[7px] text-neutral-500 dark:text-neutral-550 truncate">
                  {line.msg}
                </span>
              </div>
            ))}

            {logLines.length === 0 && (
              <div className="flex items-center justify-center h-full text-[8px] text-neutral-400">
                Waiting for execution…
              </div>
            )}
          </div>

          <div className="px-2.5 py-1.5 border-t border-black/5 dark:border-white/5 text-[7px] space-y-0.5 bg-white/20 dark:bg-transparent">
            <div className="flex justify-between text-neutral-500 dark:text-neutral-500">
              <span>Status</span>
              <span
                className={cn(
                  "font-bold",
                  logLines.length === EXEC_LOG.length ? "text-[#27c93f]" : "text-[#ea4b71]",
                )}
              >
                {logLines.length === EXEC_LOG.length
                  ? "Success"
                  : isRunning
                    ? "Running…"
                    : "Paused"}
              </span>
            </div>
            <div className="flex justify-between text-neutral-500 dark:text-neutral-500">
              <span>Nodes</span>
              <span className="text-neutral-750 dark:text-neutral-400">
                {logLines.length}/{EXEC_LOG.length}
              </span>
            </div>
            <div className="flex justify-between text-neutral-500 dark:text-neutral-500">
              <span>Mode</span>
              <span className="text-[#ea4b71] font-semibold">Production</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom bar ─── */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-black/5 dark:border-white/5 shrink-0 bg-white/30 dark:bg-black/20 text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={cn(
              "px-2 py-0.5 rounded text-[7.5px] font-bold border flex items-center gap-1 transition-colors cursor-pointer",
              isRunning
                ? "border-red-500/30 bg-red-500/10 text-red-650 dark:text-red-400 hover:bg-red-500/20"
                : "border-[#27c93f]/30 bg-[#27c93f]/10 text-[#27c93f] hover:bg-[#27c93f]/20",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isRunning ? "bg-red-500 animate-pulse" : "bg-[#27c93f]",
              )}
            />
            {isRunning ? "Stop" : "Execute"}
          </button>
          <span className="text-[7px] text-neutral-500 dark:text-neutral-650 font-bold">
            Workflow active
          </span>
        </div>
        <div className="flex items-center gap-3 text-[7px] text-neutral-500 dark:text-neutral-650">
          <span>n8n v1.42.1</span>
          <span className="h-1 w-1 rounded-full bg-[#27c93f]" />
          <span className="text-[#27c93f]">Connected</span>
        </div>
      </div>
    </div>
  );
}
