import * as React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CalendarCTA } from "./CalendarCTA";
import { FloatingWidgets } from "./FloatingWidgets";
import { GradualBlur } from "./GradualBlur";

export function PageShell({
  children,
  cta,
  after,
}: {
  children: React.ReactNode;
  /** heading and button for the closing booking section */
  cta?: React.ComponentProps<typeof CalendarCTA>;
  /** a section between the booking section and the footer */
  after?: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="relative min-h-[100dvh] w-full bg-neutral-100 text-neutral-950 dark:bg-black dark:text-white">
        <main className="relative w-full bg-white dark:bg-neutral-950">
          <Navbar />
          {children}
          <CalendarCTA {...cta} />
          {after}
          <Footer />
        </main>
        <FloatingWidgets />
        <GradualBlur
          position="bottom"
          height="4rem"
          strength={1.5}
          divCount={6}
          exponential
          opacity={1}
        />
      </div>
    </ThemeProvider>
  );
}
