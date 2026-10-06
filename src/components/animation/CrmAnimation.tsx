/**
 * CRM pipeline board: a deal card slides New Lead → Qualified → Won on loop and lands in an
 * empty slot in each column. The deal is laid out in the same grid as the columns, so its
 * translate is exactly one column + gap at any width. Themed for light + dark.
 */
const columns = [
  { label: "NEW LEAD", color: "#5b8bd6" },
  { label: "QUALIFIED", color: "#f5c343" },
  { label: "WON", color: "#2f7a4a" },
];

const GAP = "12px";

function Placeholder() {
  return (
    <div className="space-y-2 rounded-lg liquid-glass border border-neutral-200/70 dark:border-white/10 dark:!bg-white/[0.03] p-3">
      <div className="h-2 w-3/4 rounded-full bg-neutral-300 dark:bg-white/20" />
      <div className="h-2 w-1/2 rounded-full bg-neutral-200 dark:bg-white/10" />
    </div>
  );
}

export function CrmAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes crm-move {
          0%, 22%   { transform: translateX(0); }
          33%, 55%  { transform: translateX(calc(100% + ${GAP})); }
          66%, 100% { transform: translateX(calc(200% + ${GAP} * 2)); }
        }
        @keyframes crm-border {
          0%, 22%   { border-color: #5b8bd6; }
          33%, 55%  { border-color: #f5c343; }
          66%, 100% { border-color: #2f7a4a; }
        }
        @keyframes crm-won {
          0%, 68% { opacity: 0; transform: scale(0); }
          74%     { opacity: 1; transform: scale(1.25); }
          78%, 94% { opacity: 1; transform: scale(1); }
          100%    { opacity: 0; transform: scale(1); }
        }
        @keyframes crm-fade {
          0%, 94% { opacity: 1; }
          100%    { opacity: 0; }
        }
        .crm-deal { animation: crm-move 7s cubic-bezier(.65,0,.35,1) infinite, crm-fade 7s linear infinite; }
        .crm-deal-card { animation: crm-border 7s cubic-bezier(.65,0,.35,1) infinite; }
        .crm-won { animation: crm-won 7s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .crm-deal, .crm-deal-card, .crm-won { animation: none; }
        }
      `}</style>

      <div
        className="absolute inset-x-[5%] top-1/2 grid -translate-y-1/2 grid-cols-3"
        style={{ columnGap: GAP, rowGap: "10px" }}
      >
        {columns.map((c) => (
          <div
            key={c.label}
            className="flex items-center gap-1.5 truncate text-[10px] font-bold tracking-[0.12em] text-neutral-700 sm:text-[11px] dark:text-neutral-300"
          >
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: c.color }} />
            {c.label}
          </div>
        ))}
        {columns.map((c) => (
          <Placeholder key={c.label} />
        ))}
        {/* empty drop slots the deal lands in */}
        {/* explicit cells so the deal (also explicit) can overlap slot 1 instead of displacing it */}
        {["col-start-1", "col-start-2", "col-start-3"].map((col) => (
          <div
            key={col}
            className={`${col} row-start-3 h-[62px] rounded-lg border border-dashed border-neutral-400/50 dark:border-white/15`}
          />
        ))}

        {/* moving deal: sits in the first slot's cell, translated across */}
        <div className="crm-deal relative col-start-1 row-start-3 h-[62px]">
          <div className="crm-deal-card liquid-glass h-full rounded-lg border-2 border-[#5b8bd6] p-2.5 dark:!bg-white/[0.06]">
            <div className="flex items-center justify-between gap-2 text-[11px] font-bold sm:text-xs">
              <span className="truncate text-neutral-800 dark:text-white">Acme Inc.</span>
              <span className="text-[#ff4d31]">$12k</span>
            </div>
            <div className="mt-2 h-2 w-2/3 rounded-full bg-neutral-200 dark:bg-white/15" />
          </div>
          <div className="crm-won absolute -top-2.5 -right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#2f7a4a] shadow-lg ring-2 ring-white">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12l4 4 10-10"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
