import { Webhook, Sparkles, Filter, Database, Send, Check } from "lucide-react";

/**
 * A live workflow run: a progress rail fills across five steps, each step lights up while it
 * runs and settles with its timing, and a log line narrates the current step. 7s CSS loop.
 */

const steps = [
  { icon: Webhook, label: "Trigger", ms: "12ms", log: ["webhook", "lead received from Meta Ads"] },
  {
    icon: Sparkles,
    label: "Enrich",
    ms: "640ms",
    log: ["ai.enrich", "company, role & intent found"],
  },
  { icon: Filter, label: "Qualify", ms: "8ms", log: ["qualify", "score 87 · hot lead"] },
  { icon: Database, label: "CRM", ms: "210ms", log: ["crm.upsert", "deal created in pipeline"] },
  { icon: Send, label: "Follow-up", ms: "330ms", log: ["whatsapp", "intro sent · run ok in 1.2s"] },
];

const start = (i: number) => 6 + i * 16; // % of the loop where step i starts

const css =
  steps
    .map((_, i) => {
      const t = start(i);
      const next = i < steps.length - 1 ? start(i + 1) : 94;
      return `
  @keyframes vs-step-${i} {
    0%, ${t}% { border-color: var(--vs-mb); color: var(--vs-mc); box-shadow: 0 0 0 0 transparent; transform: scale(1); }
    ${t + 3}%, ${t + 10}% { border-color: #ff4d31; color: #ff4d31; box-shadow: 0 0 0 4px rgba(255,77,49,.14); transform: scale(1.08); }
    ${t + 14}%, 93% { border-color: rgba(255,77,49,.45); color: #ff4d31; box-shadow: 0 0 0 0 transparent; transform: scale(1); }
    98%, 100% { border-color: var(--vs-mb); color: var(--vs-mc); box-shadow: 0 0 0 0 transparent; transform: scale(1); }
  }
  @keyframes vs-done-${i} {
    0%, ${t + 11}% { opacity: 0; transform: translateY(3px); }
    ${t + 14}%, 93% { opacity: 1; transform: translateY(0); }
    98%, 100% { opacity: 0; }
  }
  @keyframes vs-log-${i} {
    0%, ${t}% { opacity: 0; transform: translateY(6px); }
    ${t + 1.5}%, ${next - 1}% { opacity: 1; transform: translateY(0); }
    ${next}%, 100% { opacity: 0; transform: translateY(-6px); }
  }
  .vs-step-${i} { animation: vs-step-${i} 7s ease-in-out infinite; }
  .vs-done-${i} { animation: vs-done-${i} 7s ease-out infinite; }
  .vs-log-${i} { animation: vs-log-${i} 7s ease-out infinite; }`;
    })
    .join("") +
  `
  @keyframes vs-rail {
    0%, ${start(0)}% { transform: scaleX(0); opacity: 1; }
    ${steps.map((_, i) => `${start(i)}% { transform: scaleX(${i / (steps.length - 1)}); }`).join(" ")}
    93% { transform: scaleX(1); opacity: 1; }
    98% { transform: scaleX(1); opacity: 0; }
    100% { transform: scaleX(0); opacity: 0; }
  }
  .vs-rail { transform-origin: left; animation: vs-rail 7s linear infinite; }
  @media (prefers-reduced-motion: reduce) {
    [class*="vs-"] { animation: none !important; }
    .vs-rail { transform: scaleX(1); }
    .vs-log-${steps.length - 1} { opacity: 1 !important; }
  }`;

export function AutomationAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden [--vs-mb:rgba(0,0,0,0.1)] [--vs-mc:#a3a3a3] dark:[--vs-mb:rgba(255,255,255,0.1)] dark:[--vs-mc:#737373]">
      <style>{css}</style>

      {/* dotted grid fading out toward the edges */}
      <div
        aria-hidden
        className="absolute inset-0 [background-image:radial-gradient(circle,rgba(0,0,0,0.09)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] dark:[background-image:radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)]"
      />

      <div className="relative flex h-full flex-col justify-center gap-5 px-4 sm:px-10">
        {/* header */}
        <div className="flex items-center justify-between font-mono text-[10px] sm:text-[11px]">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-600 dark:text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              LIVE
            </span>
            <span className="text-neutral-600 dark:text-neutral-300">lead-intake.workflow</span>
          </div>
          <span className="hidden text-neutral-400 sm:inline dark:text-neutral-500">
            n8n · run #4,812
          </span>
        </div>

        {/* step rail */}
        <div className="relative">
          <div className="absolute top-[19px] right-[10%] left-[10%] h-px bg-neutral-200 dark:bg-white/10" />
          <div className="vs-rail absolute top-[18.5px] right-[10%] left-[10%] h-[2px] rounded-full bg-gradient-to-r from-[#ff4d31]/40 via-[#ff4d31] to-[#ff8a5c]" />
          <ol className="relative grid grid-cols-5">
            {steps.map((s, i) => (
              <li key={s.label} className="flex flex-col items-center gap-1.5">
                <span
                  className={`vs-step-${i} flex h-10 w-10 items-center justify-center liquid-glass rounded-xl border border-[var(--vs-mb)] text-[var(--vs-mc)] dark:!bg-white/[0.03]`}
                >
                  <s.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </span>
                <span className="text-[10px] font-semibold text-neutral-700 sm:text-xs dark:text-neutral-200">
                  {s.label}
                </span>
                <span
                  className={`vs-done-${i} flex items-center gap-0.5 font-mono text-[9px] text-neutral-400 sm:text-[10px] dark:text-neutral-500`}
                >
                  <Check className="h-2.5 w-2.5 text-emerald-500" strokeWidth={3} />
                  {s.ms}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* narrated log */}
        <div className="relative h-9 overflow-hidden rounded-lg liquid-glass border border-neutral-200/70 dark:border-white/10 dark:!bg-white/[0.03] font-mono text-[10px] sm:text-xs">
          {steps.map((s, i) => (
            <div
              key={s.label}
              className={`vs-log-${i} absolute inset-0 flex items-center gap-2 truncate px-3 opacity-0`}
            >
              <span className="text-neutral-400 dark:text-neutral-600">›</span>
              <span className="text-[#ff4d31]">{s.log[0]}</span>
              <span className="truncate text-neutral-600 dark:text-neutral-400">{s.log[1]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
