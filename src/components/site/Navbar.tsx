import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Menu, FolderHeart, Info, HelpCircle, ChevronDown, LayoutGrid } from "lucide-react";
import { LogoLockup } from "./Logo";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { calTrigger, WHATSAPP_URL } from "@/lib/contact";
import { serviceList } from "@/components/services/ServicePage";

const navLinks = [
  { label: "Our Work", href: "/#our-work", icon: FolderHeart },
  { label: "Why Us", href: "/#why-choose-us", icon: Info },
  { label: "Reviews", href: "/#reviews", icon: HelpCircle },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full flex justify-center px-4 py-4 pointer-events-none">
      <nav
        aria-label="Primary"
        className="pointer-events-auto relative w-full max-w-4xl rounded-2xl border border-white/40 dark:border-white/10 px-4 md:px-6 py-2.5 md:py-4 flex items-center justify-between liquid-glass dark:!bg-neutral-900/80 backdrop-blur-2xl saturate-150 shadow-lg shadow-black/5"
        style={{ transform: "translateZ(0)" }}
      >
        <Link
          to="/"
          aria-label="Vertex Tech House home"
          className="flex items-center gap-2 shrink-0"
        >
          <LogoLockup />
        </Link>

        <div className="hidden md:flex items-center gap-1 text-sm ml-10 mr-4">
          {/* Services: the four service pages, on hover or keyboard focus */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1 px-3 py-2 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              Services
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-200">
              <div className="w-80 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-2 shadow-xl">
                {serviceList.map((s) => (
                  <Link
                    key={s.slug}
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="flex items-start gap-3 rounded-xl p-3 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <s.icon className="h-5 w-5 mt-0.5 shrink-0 text-[#ff4d31]" />
                    <span>
                      <span className="block font-semibold text-neutral-900 dark:text-white">
                        {s.name}
                      </span>
                      <span className="block text-xs text-neutral-500">{s.blurb}</span>
                    </span>
                  </Link>
                ))}
                <div className="my-1 h-px bg-neutral-200 dark:bg-white/10" />
                <Link
                  to="/services"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
                >
                  <LayoutGrid className="h-5 w-5 text-neutral-400" />
                  All services & live demos
                </Link>
              </div>
            </div>
          </div>

          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="px-3 py-2 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <Button
            asChild
            className="rounded-x bg-green-500 text-white hover:bg-green-600 dark:bg-green-500 dark:text-white dark:hover:bg-green-600 transition-transform hover:scale-[1.03] ml-4"
          >
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Whatsapp
            </a>
          </Button>
          <Button
            className="rounded-x bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 transition-transform hover:scale-[1.03] ml-2"
            {...calTrigger}
          >
            Book a Call
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] sm:w-96 rounded-l-3xl">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex flex-col gap-1 mt-8">
                <p className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Services
                </p>
                {serviceList.map((s) => (
                  <Link
                    key={s.slug}
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-4 px-3 py-3 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <s.icon className="h-5 w-5 text-[#ff4d31]" />
                    <span className="text-sm font-medium">{s.name}</span>
                  </Link>
                ))}
                <Link
                  to="/services"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-4 px-3 py-3 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <LayoutGrid className="h-5 w-5 text-neutral-400" />
                  <span className="text-sm font-medium">All services & live demos</span>
                </Link>
                <div className="my-2 h-px bg-neutral-200 dark:bg-white/10" />
                {navLinks.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-4 px-3 py-3 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <l.icon className="h-5 w-5 text-neutral-400" />
                    <span className="text-sm font-medium">{l.label}</span>
                  </a>
                ))}
                <Button
                  asChild
                  className="mt-4 rounded-full bg-green-500 text-white hover:bg-green-600 dark:bg-green-500 dark:text-white dark:hover:bg-green-600"
                >
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                  >
                    Whatsapp
                  </a>
                </Button>
                <Button
                  className="mt-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
                  onClick={() => setMobileOpen(false)}
                  {...calTrigger}
                >
                  Book a Call
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
