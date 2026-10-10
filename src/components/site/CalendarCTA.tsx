import { useState, useEffect } from "react";
import type * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Calendar, Clock, ArrowRight, ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlareHover } from "./GlareHover";
import { loadCal } from "@/lib/cal";
import { calTrigger } from "@/lib/contact";

/** Closing booking section on every page. Service pages pass their own heading and CTA label. */
export function CalendarCTA({
  eyebrow = "Free Audit Session",
  title = (
    <>
      Your business, our expertise – <span className="text-[#ff4d31]">let's talk!</span>
    </>
  ),
  subtitle = "Book a free 20-minute call with our team. We'll map what's worth automating first and what it would take.",
  action,
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  /** label for a booking button under the copy */
  action?: string;
}) {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const currentMonth = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });

  // Also wires up every "Book a call" popup button on the page.
  useEffect(() => {
    loadCal();
  }, []);

  const days = [
    { day: "", active: false },
    { day: "1", active: true },
    { day: "2", active: true },
    { day: "3", active: true },
    { day: "4", active: true },
    { day: "5", active: true },
    { day: "6", active: true },
    { day: "7", active: true },
    { day: "8", active: true },
    { day: "9", active: true },
    { day: "10", active: true },
    { day: "11", active: true },
    { day: "12", active: true },
    { day: "13", active: true },
    { day: "14", active: true },
    { day: "15", active: false },
    { day: "16", active: false },
    { day: "17", active: false },
    { day: "18", active: false },
    { day: "19", active: false },
    { day: "20", active: false },
    { day: "21", active: false },
    { day: "22", active: false },
    { day: "23", active: false },
    { day: "24", active: false },
    { day: "25", active: false },
    { day: "26", active: false },
    { day: "27", active: false },
    { day: "28", active: false },
    { day: "29", active: false },
    { day: "30", active: false },
    { day: "31", active: false },
  ];

  const timeSlots = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];

  return (
    <section
      id="contact"
      className="relative w-full px-4 py-16 md:py-24 overflow-hidden border-t border-black/5 dark:border-white/5 bg-[#f9fafb] dark:bg-[#030303] transition-colors duration-300"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 rounded-full bg-[#ff4d31]/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* Left Side: Call to Action Header */}
        <div className="max-w-xl text-center lg:text-left shrink-0">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] backdrop-blur-md px-3 py-1 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff4d31] animate-pulse" />
            {eyebrow}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-neutral-950 dark:text-white"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg md:text-xl text-neutral-600 dark:text-neutral-400 font-medium"
          >
            {subtitle}
          </motion.p>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 space-y-3 hidden sm:block"
          >
            <div className="flex items-center gap-2.5 text-sm text-neutral-600 dark:text-neutral-400">
              <ShieldCheck className="h-4.5 w-4.5 text-[#ff4d31]" />
              <span>
                No pitch. No pressure. Just honest feedback on what's working and what isn't
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-neutral-600 dark:text-neutral-400">
              <UserCheck className="h-4.5 w-4.5 text-emerald-500" />
              <span>Walk away with a clear action plan for what to build first.</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-neutral-600 dark:text-neutral-400">
              <Sparkles className="h-4.5 w-4.5 text-blue-500" />
              <span>Speak directly with the engineers who'd build it — not a sales rep.</span>
            </div>
          </motion.div>

          {action && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8"
            >
              <Button
                className="group h-auto rounded-xl bg-[#ff4d31] px-6 py-3 text-base text-white hover:bg-[#e8462c]"
                {...calTrigger}
              >
                {action}
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </motion.div>
          )}
        </div>

        {/* Right Side: Re-designed wide Horizontal Calendar widget */}
        <div className="w-full lg:max-w-[740px] relative">
          <GlareHover
            glareColor="#ffffff"
            glareOpacity={0.18}
            glareAngle={-30}
            glareSize={250}
            transitionDuration={800}
            playOnce={false}
            borderRadius="16px"
          >
            <div
              className={cn(
                "group relative liquid-glass bg-white/50 dark:bg-white/[0.02] rounded-2xl shadow-2xl p-6 md:p-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border border-black/10 dark:border-white/[0.12] overflow-hidden w-full h-full",
              )}
            >
              {/* Ambient visual badge */}
              <div className="flex items-center justify-between mb-6 border-b border-black/5 dark:border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4.5 w-4.5 text-[#ff4d31]" />
                  <h3 className="font-black text-neutral-900 dark:text-white text-base md:text-lg">
                    Cal.com Interactive Schedule
                  </h3>
                </div>
                <span className="text-[7.5px] font-bold text-neutral-500 dark:text-neutral-400 bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/5 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  EST timezone
                </span>
              </div>

              {/* Horizontal Grid Layout for Calendar Grid vs Selector Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* LEFT COLUMN: Calendar Month & Days */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-neutral-800 dark:text-neutral-200">
                    <span className="cursor-pointer text-base hover:text-[#ff4d31] transition-colors p-1 select-none">
                      &lt;
                    </span>
                    <span className="font-bold text-xs sm:text-sm tracking-wider uppercase">
                      {currentMonth}
                    </span>
                    <span className="cursor-pointer text-base hover:text-[#ff4d31] transition-colors p-1 select-none">
                      &gt;
                    </span>
                  </div>

                  {/* Days label row */}
                  <div className="grid grid-cols-7 gap-1 md:gap-1.5 text-[8.5px] sm:text-[9.5px] text-center font-bold text-neutral-400 dark:text-neutral-600">
                    <div>SUN</div>
                    <div>MON</div>
                    <div>TUE</div>
                    <div>WED</div>
                    <div>THU</div>
                    <div>FRI</div>
                    <div>SAT</div>
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-1.5 text-xs text-center">
                    {days.map((item, idx) => {
                      const isSelected = selectedDate === Number(item.day);
                      return (
                        <button
                          key={idx}
                          disabled={!item.active}
                          onClick={() => {
                            setSelectedDate(Number(item.day));
                            setSelectedTime(null);
                          }}
                          className={cn(
                            "h-8 w-8 rounded-lg flex items-center justify-center font-bold transition-all duration-300 relative select-none cursor-pointer",
                            item.active
                              ? isSelected
                                ? "bg-[#ff4d31] text-white shadow-lg shadow-[#ff4d31]/30 hover:bg-[#ff4d31]"
                                : "bg-white/30 dark:bg-white/[0.01] border border-black/5 dark:border-white/[0.04] text-neutral-900 dark:text-neutral-200 hover:border-[#ff4d31]/50 hover:bg-[#ff4d31]/5"
                              : "text-neutral-350 dark:text-neutral-700 cursor-not-allowed opacity-20",
                          )}
                          // Embed Cal.com triggering directly onto day selections
                          {...calTrigger}
                        >
                          {item.day}
                          {item.active && !isSelected && (
                            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 bg-[#ff4d31]/40 rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* RIGHT COLUMN: Interactive details and slots selection */}
                <div className="h-full flex flex-col justify-center border-t md:border-t-0 md:border-l border-black/5 dark:border-white/5 pt-6 md:pt-0 md:pl-8 min-h-[190px]">
                  {selectedDate === null ? (
                    <div className="text-center md:text-left py-4 space-y-3">
                      <div className="h-10 w-10 rounded-full bg-[#ff4d31]/10 flex items-center justify-center mx-auto md:mx-0">
                        <Clock className="h-5 w-5 text-[#ff4d31]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                          Available slots
                        </h4>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-450 mt-1">
                          Select a date on the calendar to view and trigger our scheduling options
                          instantly.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-fade-in">
                      <span className="text-[9px] font-bold text-neutral-450 dark:text-neutral-500 uppercase tracking-widest flex items-center gap-1.5 justify-center md:justify-start">
                        <Clock className="h-3 w-3 text-[#ff4d31]" />
                        Times for {currentMonth.split(" ")[0]} {selectedDate}
                      </span>

                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map((slot) => {
                          const isTimeSelected = selectedTime === slot;
                          return (
                            <button
                              key={slot}
                              onClick={() => setSelectedTime(slot)}
                              className={cn(
                                "py-2 rounded-lg text-[10px] font-bold border transition-all duration-300 cursor-pointer",
                                isTimeSelected
                                  ? "bg-[#ff4d31] text-white border-[#ff4d31] shadow-lg shadow-[#ff4d31]/20"
                                  : "border-black/10 dark:border-white/[0.08] bg-white/30 dark:bg-white/[0.01] hover:border-[#ff4d31]/50 text-neutral-850 dark:text-neutral-300",
                              )}
                              {...calTrigger}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>

                      <div className="text-[9.5px] text-neutral-500 dark:text-neutral-450 leading-normal text-center md:text-left">
                        Clicking any time slot triggers our verified Cal.com live overlay window.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </GlareHover>

          {/* Bottom Action Trigger Button */}
          <div className="mt-6 w-full flex justify-center">
            <button
              className="group w-full max-w-[360px] md:w-auto liquid-glass bg-white/50 dark:bg-white/[0.02] border border-black/10 dark:border-white/[0.12] text-neutral-850 dark:text-neutral-200 rounded-[5px] flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-black/[0.05] dark:hover:shadow-black/20 hover:border-[#ff4d31]/50 cursor-pointer"
              // Cal.com click action integration
              {...calTrigger}
            >
              <span className="px-6 md:px-12 py-3.5 font-bold text-xs uppercase tracking-widest whitespace-nowrap">
                Schedule a free consultation
              </span>
              <span className="bg-[#ff4d31]/10 text-[#ff4d31] m-1 p-2 px-3 border border-[#ff4d31]/20 rounded hidden md:flex items-center justify-center transition-colors group-hover:bg-[#ff4d31]/20">
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
