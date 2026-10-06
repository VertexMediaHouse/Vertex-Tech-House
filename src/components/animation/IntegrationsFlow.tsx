import type * as React from "react";
import { CalendarDays, Mail, Sheet } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { BrandIcons } from "./BrandIcons";

/**
 * Tools stream left → right through the Vertex "gate". Two identical copies of the rows
 * scroll in lockstep: the bottom copy is greyscale and faded, the top copy is full colour
 * but masked to the right of the gate — so every chip "switches on" as it passes through.
 */

type Tool = { name: string; icon: React.ReactNode };

const t = {
  drive: { name: "Google Drive", icon: <BrandIcons.googleDrive /> },
  notion: { name: "Notion", icon: <BrandIcons.notion /> },
  whatsapp: { name: "WhatsApp", icon: <BrandIcons.whatsapp /> },
  openai: { name: "OpenAI", icon: <BrandIcons.openai /> },
  docs: { name: "Google Docs", icon: <BrandIcons.googleDocs /> },
  messenger: { name: "Messenger", icon: <BrandIcons.messenger /> },
  n8n: { name: "n8n", icon: <BrandIcons.n8n /> },
  mail: { name: "Email", icon: <Mail className="text-[#ff4d31]" strokeWidth={2} /> },
  calendar: { name: "Calendar", icon: <CalendarDays className="text-[#5b8bd6]" strokeWidth={2} /> },
  sheets: { name: "Sheets", icon: <Sheet className="text-[#1e8e3e]" strokeWidth={2} /> },
} satisfies Record<string, Tool>;

const rows: { tools: Tool[]; duration: number }[] = [
  { tools: [t.drive, t.openai, t.mail, t.notion, t.messenger], duration: 34 },
  { tools: [t.whatsapp, t.n8n, t.calendar, t.docs, t.sheets], duration: 26 },
  { tools: [t.notion, t.sheets, t.drive, t.whatsapp, t.openai], duration: 40 },
];

function Chip({ tool }: { tool: Tool }) {
  return (
    <div className="flex shrink-0 items-center gap-2 rounded-xl liquid-glass border border-neutral-200/70 dark:border-white/10 dark:!bg-white/[0.03] py-1.5 pr-3.5 pl-1.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white p-1.5 dark:bg-white [&>svg]:h-full [&>svg]:w-full">
        {tool.icon}
      </span>
      <span className="text-xs font-medium whitespace-nowrap text-neutral-800 dark:text-neutral-200">
        {tool.name}
      </span>
    </div>
  );
}

function Rows() {
  return (
    <div className="flex h-full flex-col justify-center gap-4">
      {rows.map((row, i) => (
        <div key={i} className="flex overflow-hidden">
          {/* content twice; slide by one copy (-50%) → seamless loop */}
          <div
            className="flow-row flex w-max gap-3 pr-3"
            style={{ animationDuration: `${row.duration}s` }}
          >
            {[...row.tools, ...row.tools, ...row.tools, ...row.tools].map((tool, j) => (
              <Chip key={j} tool={tool} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function IntegrationsFlow() {
  return (
    <div className="relative h-[320px] w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <style>{`
        @keyframes flow-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        .flow-row { animation: flow-right linear infinite; }
        @media (prefers-reduced-motion: reduce) { .flow-row { animation: none; } }
      `}</style>

      {/* before the gate: raw, disconnected */}
      <div aria-hidden className="absolute inset-0 opacity-40 grayscale">
        <Rows />
      </div>

      {/* after the gate: same rows, full colour, revealed right of centre */}
      <div className="absolute inset-0 [mask-image:linear-gradient(to_right,transparent_50%,black_50%)]">
        <Rows />
      </div>

      {/* the gate */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#ff4d31] to-transparent"
      />
      <div className="absolute top-1/2 left-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center liquid-glass rounded-2xl border border-[#ff4d31]/40 !bg-white/85 dark:!bg-neutral-950/85">
        <Logo className="h-8 w-8" />
      </div>
    </div>
  );
}
