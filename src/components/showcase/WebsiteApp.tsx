import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Instagram, Menu, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCanvas, type ScreenProps } from "./kit";

/*
 * A client website (interior design studio) running inside the browser frame. It is a real,
 * scrollable page: nav links jump to sections, projects filter and open, the enquiry form submits.
 * Until the visitor touches it, it gives itself a slow guided scroll. Its "headings" are divs so
 * the embedded demo doesn't add to the host page's heading outline (SEO).
 */

const SERIF = { fontFamily: '"Fraunces", Georgia, serif' };
const img = (f: string) => `/assets/showcase/${f}`;

const work = [
  {
    slug: "harbor-house",
    name: "Harbor House",
    place: "Richmond, London",
    type: "Residential",
    file: "harbor.jpg",
    blurb:
      "A 1930s family home opened up around one sunlit living room. Oak, tan leather and a lot of plants.",
  },
  {
    slug: "olive-and-oak",
    name: "Olive & Oak",
    place: "Hove, East Sussex",
    type: "Hospitality",
    file: "olive.jpg",
    blurb:
      "A members' lounge for a seaside hotel, soft pinks and rattan with a woven feature wall.",
  },
  {
    slug: "linen-loft",
    name: "Linen Loft",
    place: "Shoreditch, London",
    type: "Residential",
    file: "linen.jpg",
    blurb: "A warehouse flat calmed down with limewash, bouclé and natural fibres throughout.",
  },
  {
    slug: "cedar-residence",
    name: "Cedar Residence",
    place: "Guildford, Surrey",
    type: "Architecture",
    file: "cedar.jpg",
    blurb: "A new-build family house in timber and glass, designed with our architecture partners.",
  },
  {
    slug: "maple-street",
    name: "Maple Street",
    place: "Clapham, London",
    type: "Residential",
    file: "maple.jpg",
    blurb:
      "A Victorian terrace re-planned for a young family, with rattan pendants and a garden room.",
  },
  {
    slug: "the-ashford",
    name: "The Ashford",
    place: "Kensington, London",
    type: "Hospitality",
    file: "ashford.jpg",
    blurb: "Twelve guest suites in a boutique hotel. Quiet palettes, one bold chair in every room.",
  },
];

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export function WebsiteApp({ onPath }: ScreenProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [touring, setTouring] = useState(!reduce);
  const [solid, setSolid] = useState(false);
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<(typeof work)[number] | null>(null);
  const [sent, setSent] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const phone = useCanvas().w < 500;

  useEffect(() => onPath("/"), [onPath]);

  // guided scroll: down the whole page, a pause, back to the top; stops for good once touched
  useEffect(() => {
    const el = ref.current;
    if (!touring || !el) return;
    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      const max = el.scrollHeight - el.clientHeight;
      const t = ((now - t0) / 1000) % 32;
      const k =
        t < 2 ? 0 : t < 26 ? ease((t - 2) / 24) : t < 28 ? 1 : t < 31 ? 1 - ease((t - 28) / 3) : 0;
      el.scrollTop = k * max;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [touring]);

  const stop = () => setTouring(false);
  const jump = (id: string) => {
    stop();
    setMenu(false);
    const el = ref.current;
    const target = el?.querySelector<HTMLElement>(`#nl-${id}`);
    if (el && target) el.scrollTo({ top: target.offsetTop - 88, behavior: "smooth" });
    onPath(`/#${id}`);
  };
  const show = (p: (typeof work)[number] | null) => {
    setOpen(p);
    onPath(p ? `/work/${p.slug}` : "/#work");
  };

  const shown = work.filter((w) => filter === "All" || w.type === filter);

  return (
    <div className="relative h-full bg-[#f7f4ef] text-[#1f1c18]">
      <div
        ref={ref}
        onWheel={stop}
        onPointerDown={stop}
        onTouchStart={stop}
        onKeyDown={stop}
        onScroll={(e) => setSolid(e.currentTarget.scrollTop > (phone ? 480 : 540))}
        className="relative h-full overflow-y-auto [scrollbar-width:thin]"
      >
        {/* announcement bar */}
        <div className="flex h-8 items-center justify-center gap-2 bg-[#1f1c18] text-[11px] tracking-wide text-white/85 @max-md:text-[10px]">
          Now booking projects for spring 2027
          <button
            type="button"
            onClick={() => jump("contact")}
            className="underline underline-offset-2"
          >
            Book a consultation
          </button>
        </div>

        {/* nav: transparent over the hero, solid once you scroll past it */}
        <nav
          className={cn(
            "sticky top-0 z-30 flex h-16 items-center justify-between px-12 transition-colors duration-300 @max-md:px-5",
            solid || menu
              ? "border-b border-black/5 bg-[#f7f4ef]/90 text-[#1f1c18] backdrop-blur-md"
              : "text-white",
          )}
        >
          <button
            type="button"
            onClick={() => jump("top")}
            style={SERIF}
            className="text-[22px] tracking-[0.18em] @max-md:text-[18px]"
          >
            NORTHLINE
          </button>
          <div className="flex gap-9 text-[13px] @max-md:hidden">
            {[
              ["Work", "work"],
              ["Services", "services"],
              ["Studio", "studio"],
              ["Journal", "journal"],
            ].map(([label, id]) => (
              <button
                key={id}
                type="button"
                onClick={() => jump(id)}
                className="opacity-80 transition-opacity hover:opacity-100"
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => jump("contact")}
            className={cn(
              "rounded-full px-5 py-2 text-[13px] transition-colors @max-md:hidden",
              solid
                ? "bg-[#1f1c18] text-white hover:bg-black"
                : "bg-white text-[#1f1c18] hover:bg-white/90",
            )}
          >
            Book a consultation
          </button>
          {/* phone: menu button + dropdown */}
          <button
            type="button"
            aria-label={menu ? "Close menu" : "Open menu"}
            onClick={() => {
              stop();
              setMenu((m) => !m);
            }}
            className="hidden h-10 w-10 items-center justify-center rounded-full @max-md:flex"
          >
            {menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <AnimatePresence>
            {menu && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute inset-x-0 top-full border-b border-black/5 bg-[#f7f4ef] px-5 pt-2 pb-6 text-[#1f1c18] shadow-[0_20px_30px_-20px_rgba(0,0,0,0.25)]"
              >
                {[
                  ["Work", "work"],
                  ["Services", "services"],
                  ["Studio", "studio"],
                  ["Journal", "journal"],
                ].map(([label, id]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => jump(id)}
                    style={SERIF}
                    className="block w-full border-b border-black/10 py-3.5 text-left text-[24px] font-light"
                  >
                    {label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => jump("contact")}
                  className="mt-5 w-full rounded-full bg-[#1f1c18] py-3 text-[14px] text-white"
                >
                  Book a consultation
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* hero */}
        <section
          id="nl-top"
          className="relative -mt-16 h-[640px] overflow-hidden @max-md:h-[580px]"
        >
          <img
            src={img("hero.jpg")}
            alt="Living room by Northline"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/35" />
          <div className="absolute inset-x-12 bottom-14 flex items-end justify-between gap-10 text-white @max-md:inset-x-5 @max-md:bottom-8 @max-md:flex-col @max-md:items-start @max-md:gap-6">
            <div className="max-w-[640px]">
              <div className="mb-4 text-[12px] tracking-[0.22em] text-white/80 uppercase @max-md:text-[10px]">
                Interior design studio · London &amp; Surrey
              </div>
              <div
                style={SERIF}
                className="text-[64px] leading-[1.02] font-light tracking-tight @max-md:text-[40px]"
              >
                Calm, considered interiors for the way you live.
              </div>
              <div className="mt-7 flex gap-3">
                <button
                  type="button"
                  onClick={() => jump("contact")}
                  className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] text-[#1f1c18] hover:bg-white/90 @max-md:px-5"
                >
                  Start your project <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => jump("work")}
                  className="rounded-full border border-white/50 px-6 py-3 text-[14px] hover:bg-white/10 @max-md:px-5"
                >
                  View our work
                </button>
              </div>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-md @max-md:px-4 @max-md:py-3">
              <div className="flex gap-0.5 text-amber-300">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <div className="mt-1.5 text-[13px]">4.9 from 180 Google reviews</div>
            </div>
          </div>
        </section>

        {/* numbers */}
        <section className="grid grid-cols-4 border-b border-black/10 px-12 py-10 @max-md:grid-cols-2 @max-md:gap-y-7 @max-md:px-5 @max-md:py-8">
          {[
            ["240+", "homes and spaces completed"],
            ["12 yrs", "designing in London & Surrey"],
            ["96%", "of projects delivered on budget"],
            ["3 wks", "from first call to concept"],
          ].map(([n, l]) => (
            <div
              key={l}
              className="border-l border-black/10 pl-6 first:border-l-0 first:pl-0 @max-md:border-l-0 @max-md:pl-0"
            >
              <div style={SERIF} className="text-[36px] font-light @max-md:text-[30px]">
                {n}
              </div>
              <div className="mt-1 text-[13px] text-[#1f1c18]/60">{l}</div>
            </div>
          ))}
        </section>

        {/* studio */}
        <section
          id="nl-studio"
          className="grid grid-cols-[1.1fr_1fr] items-center gap-16 px-12 py-24 @max-md:grid-cols-1 @max-md:gap-12 @max-md:px-5 @max-md:py-16"
        >
          <div>
            <div className="text-[12px] tracking-[0.22em] text-[#9a5b3c] uppercase">The studio</div>
            <p
              style={SERIF}
              className="mt-5 text-[34px] leading-[1.2] font-light @max-md:text-[26px]"
            >
              We design rooms that feel calm on a Tuesday morning and wonderful on a Saturday night.
            </p>
            <p className="mt-6 max-w-[460px] text-[15px] leading-relaxed text-[#1f1c18]/70">
              A small team of designers, project managers and makers. We take a handful of projects
              a year and see every one through, from the first sketch to the last cushion.
            </p>
            <button
              type="button"
              onClick={() => jump("work")}
              className="mt-8 flex items-center gap-2 border-b border-[#1f1c18] pb-1 text-[14px]"
            >
              See the work <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          <div className="relative">
            <img
              src={img("studio.jpg")}
              alt=""
              loading="lazy"
              className="h-[460px] w-full rounded-[24px] object-cover @max-md:h-[340px]"
            />
            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white px-5 py-4 @max-md:left-4 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.25)]">
              <div className="text-[11px] tracking-[0.18em] text-[#1f1c18]/50 uppercase">
                Currently on site
              </div>
              <div style={SERIF} className="mt-1 text-[18px]">
                Maple Street, Clapham
              </div>
            </div>
          </div>
        </section>

        {/* work */}
        <section id="nl-work" className="px-12 pb-24 @max-md:px-5 @max-md:pb-16">
          <div className="mb-10 flex items-end justify-between @max-md:mb-7 @max-md:flex-col @max-md:items-start @max-md:gap-5">
            <div style={SERIF} className="text-[44px] leading-none font-light @max-md:text-[34px]">
              Selected work
            </div>
            <div className="flex gap-2 @max-md:-mx-5 @max-md:max-w-[calc(100%+40px)] @max-md:overflow-x-auto @max-md:px-5 @max-md:[scrollbar-width:none]">
              {["All", "Residential", "Hospitality", "Architecture"].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => {
                    stop();
                    setFilter(f);
                  }}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-1.5 text-[13px] transition-colors",
                    f === filter
                      ? "border-[#1f1c18] bg-[#1f1c18] text-white"
                      : "border-black/15 hover:border-black/40",
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          {/* keyed fade, not layout animation: layout maths breaks inside the scaled frame */}
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-3 gap-x-6 gap-y-10 @max-md:grid-cols-1 @max-md:gap-y-8"
          >
            {shown.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => show(p)}
                className="group text-left"
              >
                <div className="overflow-hidden rounded-[18px]">
                  <img
                    src={img(p.file)}
                    alt={p.name}
                    loading="lazy"
                    className="h-[300px] w-full object-cover transition-transform duration-700 group-hover:scale-105 @max-md:h-[250px]"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span style={SERIF} className="text-[21px]">
                    {p.name}
                  </span>
                  <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="text-[13px] text-[#1f1c18]/55">
                  {p.place} · {p.type}
                </div>
              </button>
            ))}
          </motion.div>
        </section>

        {/* services */}
        <section
          id="nl-services"
          className="bg-[#1f1c18] px-12 py-24 text-white @max-md:px-5 @max-md:py-16"
        >
          <div className="flex items-end justify-between @max-md:flex-col @max-md:items-start @max-md:gap-4">
            <div
              style={SERIF}
              className="max-w-[520px] text-[44px] leading-[1.05] font-light @max-md:text-[34px]"
            >
              Three ways to work with us
            </div>
            <p className="max-w-[340px] text-[14px] leading-relaxed text-white/60">
              Every project starts with a free 30-minute call and a site visit.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-3 gap-6 @max-md:mt-10 @max-md:grid-cols-1 @max-md:gap-4">
            {[
              [
                "01",
                "Full interior design",
                "Concept, drawings, sourcing and installation, managed end to end.",
                "From £25k",
              ],
              [
                "02",
                "Renovation & build",
                "We run the trades, the programme and the budget, so you don't have to.",
                "From £60k",
              ],
              [
                "03",
                "Styling & sourcing",
                "Furniture, lighting, art and textiles for rooms that feel finished.",
                "From £8k",
              ],
            ].map(([n, t, d, price]) => (
              <div
                key={n}
                className="flex flex-col rounded-[20px] border border-white/10 p-7 transition-colors hover:bg-white/[0.04] @max-md:p-6"
              >
                <span className="text-[12px] text-white/40">{n}</span>
                <span style={SERIF} className="mt-8 text-[24px] @max-md:mt-5">
                  {t}
                </span>
                <span className="mt-3 text-[14px] leading-relaxed text-white/60">{d}</span>
                <span className="mt-8 text-[13px] text-[#e2b393]">{price}</span>
              </div>
            ))}
          </div>
        </section>

        {/* testimonial */}
        <section id="nl-journal" className="px-12 py-24 text-center @max-md:px-5 @max-md:py-16">
          <p
            style={SERIF}
            className="mx-auto max-w-[820px] text-[32px] leading-[1.3] font-light @max-md:text-[22px]"
          >
            “They turned a tired Victorian terrace into the calmest house we've ever lived in, and
            it came in under budget. We still can't quite believe it.”
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <img
              src="/assets/showcase/people/nina-rossi.jpg"
              alt=""
              className="h-11 w-11 rounded-full object-cover"
            />
            <div className="text-left text-[13px]">
              <div className="font-medium">Nina Rossi</div>
              <div className="text-[#1f1c18]/55">Victorian terrace, Islington</div>
            </div>
          </div>
        </section>

        {/* contact */}
        <section
          id="nl-contact"
          className="mx-12 mb-16 grid grid-cols-2 gap-14 rounded-[28px] bg-[#ebe4d8] p-12 @max-md:mx-4 @max-md:mb-10 @max-md:grid-cols-1 @max-md:gap-8 @max-md:rounded-[22px] @max-md:p-6"
        >
          <div>
            <div
              style={SERIF}
              className="text-[44px] leading-[1.05] font-light @max-md:text-[32px]"
            >
              Tell us about your space
            </div>
            <p className="mt-5 max-w-[380px] text-[15px] leading-relaxed text-[#1f1c18]/70">
              Share a few details and we'll reply within one working day to book a call.
            </p>
            <div className="mt-10 space-y-1 text-[14px] text-[#1f1c18]/70 @max-md:mt-6">
              <div>14 Coldharbour Lane, London SE5</div>
              <div>+44 20 7946 0321</div>
              <div>hello@northline.studio</div>
            </div>
          </div>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-start justify-center"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1f1c18] text-white">
                  <Check className="h-5 w-5" />
                </span>
                <div style={SERIF} className="mt-5 text-[28px]">
                  Thank you{sent.trim() ? `, ${sent}` : ""}.
                </div>
                <p className="mt-2 text-[14px] text-[#1f1c18]/65">
                  We've received your enquiry and will be in touch within one working day.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(null)}
                  className="mt-6 text-[13px] underline underline-offset-2"
                >
                  Send another enquiry
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                exit={{ opacity: 0 }}
                onFocus={stop}
                onSubmit={(e) => {
                  e.preventDefault();
                  const name = String(new FormData(e.currentTarget).get("name") || "").split(
                    " ",
                  )[0];
                  setSent(name || " ");
                  onPath("/thank-you");
                }}
                className="grid grid-cols-2 gap-3 @max-md:grid-cols-1"
              >
                <Field name="name" label="Name" placeholder="Jane Doe" />
                <Field name="email" label="Email" type="email" placeholder="jane@email.com" />
                <label className="block">
                  <span className="mb-1.5 block text-[12px] text-[#1f1c18]/60">Project</span>
                  <select className="w-full rounded-xl border border-black/10 bg-white px-3.5 py-3 text-[14px] outline-none focus:border-black/40">
                    <option>Full renovation</option>
                    <option>One or two rooms</option>
                    <option>Styling & sourcing</option>
                    <option>Hospitality</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12px] text-[#1f1c18]/60">Budget</span>
                  <select className="w-full rounded-xl border border-black/10 bg-white px-3.5 py-3 text-[14px] outline-none focus:border-black/40">
                    <option>£8k–25k</option>
                    <option>£25k–60k</option>
                    <option>£60k–120k</option>
                    <option>£120k+</option>
                  </select>
                </label>
                <label className="col-span-2 block @max-md:col-span-1">
                  <span className="mb-1.5 block text-[12px] text-[#1f1c18]/60">
                    About the space
                  </span>
                  <textarea
                    rows={3}
                    placeholder="A Victorian terrace in Islington, kitchen and living room…"
                    className="w-full resize-none rounded-xl border border-black/10 bg-white px-3.5 py-3 text-[14px] outline-none placeholder:text-[#1f1c18]/35 focus:border-black/40"
                  />
                </label>
                <button
                  type="submit"
                  className="col-span-2 mt-1 flex items-center @max-md:col-span-1 justify-center gap-2 rounded-full bg-[#1f1c18] py-3.5 text-[14px] text-white hover:bg-black"
                >
                  Send enquiry <ArrowRight className="h-4 w-4" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </section>

        {/* footer */}
        <footer className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 border-t border-black/10 px-12 pt-12 pb-10 text-[13px] @max-md:grid-cols-2 @max-md:gap-8 @max-md:px-5">
          <div className="@max-md:col-span-2">
            <div style={SERIF} className="text-[20px] tracking-[0.18em]">
              NORTHLINE
            </div>
            <p className="mt-3 max-w-[260px] text-[#1f1c18]/55">
              Interior design and renovation for homes and hospitality.
            </p>
          </div>
          {[
            ["Studio", ["About", "Journal", "Careers"]],
            ["Work", ["Residential", "Hospitality", "Architecture"]],
            ["Contact", ["hello@northline.studio", "+44 20 7946 0321"]],
          ].map(([h, items]) => (
            <div key={h as string}>
              <div className="mb-3 font-medium">{h}</div>
              <ul className="space-y-1.5 text-[#1f1c18]/55">
                {(items as string[]).map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-4 flex items-center justify-between border-t @max-md:col-span-2 border-black/10 pt-6 text-[12px] text-[#1f1c18]/45">
            <span>© 2026 Northline Studio Ltd.</span>
            <Instagram className="h-4 w-4" />
          </div>
        </footer>
      </div>

      {/* project lightbox */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => show(null)}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 p-10 backdrop-blur-sm @max-md:p-0"
          >
            <motion.div
              initial={{ y: 20, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative grid h-full max-h-[560px] w-full grid-cols-[1.5fr_1fr] overflow-hidden rounded-[24px] bg-[#f7f4ef] @max-md:max-h-none @max-md:grid-cols-1 @max-md:grid-rows-[300px_1fr] @max-md:rounded-none"
            >
              <img src={img(open.file)} alt={open.name} className="h-full w-full object-cover" />
              <div className="flex flex-col p-9 @max-md:p-6">
                <button
                  type="button"
                  onClick={() => show(null)}
                  className="absolute top-5 right-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-[#f7f4ef] hover:bg-black/5 @max-md:top-4 @max-md:right-4"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="text-[12px] tracking-[0.2em] text-[#9a5b3c] uppercase">
                  {open.type}
                </div>
                <div
                  style={SERIF}
                  className="mt-4 text-[36px] leading-tight font-light @max-md:mt-3 @max-md:text-[30px]"
                >
                  {open.name}
                </div>
                <div className="mt-1 text-[14px] text-[#1f1c18]/55">{open.place}</div>
                <p className="mt-6 text-[15px] leading-relaxed text-[#1f1c18]/75">{open.blurb}</p>
                <div className="mt-auto flex items-center justify-between border-t border-black/10 pt-5">
                  <button
                    type="button"
                    onClick={() => {
                      show(null);
                      jump("contact");
                    }}
                    className="rounded-full bg-[#1f1c18] px-5 py-2.5 text-[13px] text-white"
                  >
                    Start a similar project
                  </button>
                  <button
                    type="button"
                    onClick={() => show(work[(work.indexOf(open) + 1) % work.length])}
                    className="flex items-center gap-1.5 text-[13px]"
                  >
                    Next project <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] text-[#1f1c18]/60">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-black/10 bg-white px-3.5 py-3 text-[14px] outline-none placeholder:text-[#1f1c18]/35 focus:border-black/40"
      />
    </label>
  );
}
