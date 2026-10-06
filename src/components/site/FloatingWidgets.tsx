import { Mail, MessageCircle, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { EMAIL, WHATSAPP_URL } from "@/lib/contact";

function WidgetButton({
  label,
  onClick,
  href,
  hoverClass,
  children,
  ariaLabel,
}: {
  label: string;
  onClick?: () => void;
  href?: string;
  hoverClass?: string;
  children: React.ReactNode;
  ariaLabel: string;
}) {
  const inner = (
    <div
      className={cn(
        "group relative flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full",
        "liquid-glass border border-neutral-200/70 dark:border-white/10",
        "text-neutral-700 dark:text-neutral-200 shadow-lg",
        "transition-all duration-200 hover:scale-110 hover:shadow-xl",
        hoverClass,
      )}
    >
      {children}
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-2.5 py-1 text-xs font-medium opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
        {label}
      </span>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>
        {inner}
      </a>
    );
  }
  return (
    <button onClick={onClick} aria-label={ariaLabel} className="cursor-pointer">
      {inner}
    </button>
  );
}

export function FloatingWidgets() {
  const { theme, toggle } = useTheme();
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <WidgetButton
        label="WhatsApp"
        ariaLabel="Contact us on WhatsApp"
        href={WHATSAPP_URL}
        hoverClass="hover:text-green-600 hover:border-green-500/40"
      >
        <MessageCircle className="h-5 w-5" />
      </WidgetButton>
      <WidgetButton label="Email us" ariaLabel="Send us an email" href={`mailto:${EMAIL}`}>
        <Mail className="h-5 w-5" />
      </WidgetButton>
      <WidgetButton label="Toggle theme" ariaLabel="Toggle dark mode" onClick={toggle}>
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </WidgetButton>
    </div>
  );
}
