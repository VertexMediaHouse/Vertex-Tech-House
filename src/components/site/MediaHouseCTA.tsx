import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Home page: our sister company, Vertex Media House, as one oversized link. On desktop a real
 * reel follows the cursor and plays (moving across the line switches reels); on touch screens a
 * single reel sits under the text. Videos stream from vertexmediahouse.com and only load once
 * needed; local posters show until then, and always with reduced motion.
 */

const MEDIA_HOUSE = "https://vertexmediahouse.com";
const REELS = [1, 2, 5];
const services = ["Short-form reels", "Long-form editing", "Thumbnails", "Channel management"];

function Reel({ n, play, className }: { n: number; play: boolean; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string>();
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (play) {
      setSrc(`${MEDIA_HOUSE}/assets/video/${n}.mp4`); // first play loads it; kept after
      v.play().catch(() => {});
    } else v.pause();
  }, [play, n, src]);
  return (
    <video
      ref={ref}
      src={src}
      poster={`/assets/vmh/reel-${n}.jpg`}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      className={cn("h-full w-full object-cover", className)}
    />
  );
}

export function MediaHouseCTA() {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);
  const [reel, setReel] = useState(0);

  // cursor follower: springy position, tilted by horizontal speed
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });
  const tilt = useSpring(useTransform(useVelocity(sx), [-1600, 1600], [-10, 10], { clamp: true }), {
    stiffness: 200,
    damping: 20,
  });

  // touch screens: the inline reel plays once it's on screen
  const inline = useRef<HTMLDivElement>(null);
  const inlineInView = useInView(inline, { margin: "0px 0px -15% 0px" });

  const track = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
    setReel(
      Math.min(REELS.length - 1, Math.floor(((e.clientX - r.left) / r.width) * REELS.length)),
    );
  };

  return (
    <section className="relative w-full px-4 sm:px-6 md:px-8 py-16 md:py-24">
      <div className="relative mx-auto max-w-7xl">
        <div className="flex items-center justify-between border-b border-black/10 pb-4 text-sm text-neutral-500 dark:border-white/10 dark:text-neutral-400">
          <span>Our sister company</span>
          <span className="hidden sm:block">Video editing for creators & brands</span>
        </div>

        <a
          href={MEDIA_HOUSE}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Vertex Media House, our sister company (opens in a new tab)"
          onPointerEnter={(e) => {
            if (e.pointerType !== "mouse") return;
            // start the reel where the cursor enters, not where it last left
            const r = e.currentTarget.getBoundingClientRect();
            x.jump(e.clientX - r.left);
            y.jump(e.clientY - r.top);
            setHover(true);
          }}
          onPointerLeave={() => setHover(false)}
          onPointerMove={(e) => hover && track(e)}
          className="group relative block py-10 md:py-16"
        >
          <h2 className="text-5xl font-bold leading-[0.95] tracking-tighter text-neutral-950 sm:text-6xl md:text-7xl lg:text-8xl dark:text-white">
            Need video that
            <br />
            <span className="text-neutral-300 transition-colors duration-500 group-hover:text-neutral-950 dark:text-neutral-700 dark:group-hover:text-white">
              gets watched?
            </span>
          </h2>

          {/* touch screens: one reel under the text (desktop gets the cursor reel instead) */}
          <div
            ref={inline}
            className="mt-10 hidden aspect-[9/16] w-40 overflow-hidden [@media(hover:none)]:block rounded-2xl ring-1 ring-black/10 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.45)] sm:w-48 dark:ring-white/10"
          >
            <Reel n={REELS[1]} play={inlineInView && !reduce} />
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-6 md:mt-14">
            <span className="flex items-center gap-4">
              <img
                src="/assets/vmh/logo-on-light.png"
                alt=""
                className="h-8 w-auto md:h-10 dark:hidden"
              />
              <img
                src="/assets/vmh/logo-on-dark.png"
                alt=""
                className="hidden h-8 w-auto md:h-10 dark:block"
              />
            </span>
            <span className="flex items-center gap-4 text-base font-medium text-neutral-900 md:text-lg dark:text-white">
              Visit vertexmediahouse.com
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-black/15 transition-all duration-300 group-hover:border-[#ff4d31] group-hover:bg-[#ff4d31] group-hover:text-white md:h-14 md:w-14 dark:border-white/20">
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
              </span>
            </span>
          </div>

          {/* desktop: the reel that follows the cursor */}
          <motion.div
            aria-hidden
            style={{ x: sx, y: sy, rotate: reduce ? 0 : tilt }}
            className="pointer-events-none absolute top-0 left-0 z-10 [@media(hover:none)]:hidden"
          >
            <motion.div
              initial={false}
              animate={{ opacity: hover ? 1 : 0, scale: hover ? 1 : 0.6 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="relative -mt-[178px] -ml-[100px] aspect-[9/16] w-[200px] overflow-hidden rounded-[22px] bg-neutral-200 ring-1 ring-black/10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)] dark:bg-neutral-800 dark:ring-white/10"
            >
              {REELS.map((n, i) => (
                <div
                  key={n}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-300",
                    i === reel ? "opacity-100" : "opacity-0",
                  )}
                >
                  <Reel n={n} play={hover && i === reel && !reduce} />
                </div>
              ))}
            </motion.div>
          </motion.div>
        </a>

        <ul className="flex flex-wrap gap-x-8 gap-y-2 border-t border-black/10 pt-4 text-sm text-neutral-500 dark:border-white/10 dark:text-neutral-400">
          {services.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
