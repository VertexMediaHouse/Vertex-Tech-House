import { motion } from "framer-motion";
import SpotlightCard from "./SpotlightCard";
import { cn } from "@/lib/utils";

interface Review {
  review: string;
  name: string;
  position: string;
  service: string;
}

interface VideoTestimonial {
  src: string;
  poster?: string;
  name: string;
  position: string;
  quote: string;
  service: string;
}

// TODO(content): drop the testimonial videos into public/assets/video/testimonials/ and fill in the details.
export const videoTestimonials: VideoTestimonial[] = [
  {
    src: "/assets/video/testimonials/1.mp4",
    name: "Client name",
    position: "Designation",
    quote: "One line from the video goes here.",
    service: "Website",
  },
  {
    src: "/assets/video/testimonials/2.mp4",
    name: "Client name",
    position: "Designation",
    quote: "One line from the video goes here.",
    service: "CRM",
  },
];

const ServiceTag = ({ service }: { service: string }) => (
  <span className="mt-3 inline-flex w-fit rounded-full bg-[#ff4d31]/10 px-2.5 py-0.5 text-xs font-semibold text-[#ff4d31]">
    {service}
  </span>
);

function VideoCard({ t }: { t: VideoTestimonial }) {
  return (
    <div className="grid grid-cols-5 gap-5 rounded-2xl border border-white/40 dark:border-white/10 liquid-glass dark:!bg-white/[0.03] p-4 md:p-5">
      <div className="col-span-2 relative aspect-[9/16] rounded-xl overflow-hidden bg-neutral-900">
        <video
          src={t.src}
          poster={t.poster}
          controls
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="col-span-3 flex flex-col py-2">
        <span className="text-5xl leading-none font-black text-[#ff4d31]">"</span>
        <p className="mt-1 text-lg md:text-xl font-semibold leading-snug text-neutral-900 dark:text-white">
          {t.quote}
        </p>
        <div className="mt-auto pt-6 border-t border-neutral-200/50 dark:border-white/5">
          <p className="text-base font-bold text-neutral-950 dark:text-white">{t.name}</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{t.position}</p>
          <ServiceTag service={t.service} />
        </div>
      </div>
    </div>
  );
}

// TODO(content): confirm these are real clients before launch.
const reviews: Review[] = [
  {
    review: "Our lead response time went from 4 hours to 90 seconds. Incredible system.",
    name: "James T.",
    position: "Operations Director",
    service: "Automation",
  },
  {
    review: "The content pipeline automation saves us literally 30 hours a week.",
    name: "Sarah Jenkins",
    position: "Marketing VP",
    service: "Automation",
  },
  {
    review: "Fully automated our customer support tier 1. Flawless execution.",
    name: "Michael Chen",
    position: "E-commerce founder",
    service: "AI Agents",
  },
  {
    review: "Our onboarding is now completely hands-off yet feels incredibly personal.",
    name: "David Ross",
    position: "SaaS CEO",
    service: "Automation",
  },
  {
    review: "Dhrumil exceeded expectations and was great to work with.",
    name: "Saradvij",
    position: "AI automation client",
    service: "AI Automation",
  },
];

const ReviewCard = ({ review, name, position, service }: Review) => {
  return (
    <div className="w-[380px] shrink-0 p-4">
      <SpotlightCard
        className={cn(
          "flex flex-col h-full p-8 rounded-xl",
          "liquid-glass dark:!bg-white/[0.03] border-white/40 dark:border-white/10",
          "backdrop-blur-xl backdrop-saturate-150 shadow-2xl shadow-orange-500/5",
        )}
        spotlightColor="rgba(120, 140, 180, 0.28)"
        darkSpotlightColor="rgba(255, 255, 255, 0.18)"
      >
        <div className="relative z-10 flex flex-col h-full">
          <p className="text-base leading-relaxed font-medium text-neutral-900 dark:text-white mb-8 whitespace-normal">
            "{review}"
          </p>

          <div className="mt-auto pt-6 border-t border-neutral-200/50 dark:border-white/5">
            <div className="flex flex-col gap-1">
              <span className="text-base font-bold text-neutral-950 dark:text-neutral-100 tracking-tight">
                {name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {position}
                </span>
              </div>
              <ServiceTag service={service} />
            </div>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
};

export function Reviews({ videos }: { videos?: VideoTestimonial[] }) {
  return (
    <section
      id="reviews"
      className="relative w-full overflow-hidden py-12 md:py-20 bg-white dark:bg-black"
    >
      {/* ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(60% 50% at 50% 0%, rgba(59,130,246,0.08), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300/60 dark:via-white/10 to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mb-10 flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] backdrop-blur-md px-3 py-1 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider"
        >
          Testimonials
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-neutral-950 dark:text-white"
        >
          Real clients. Real results.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg md:text-xl text-neutral-600 dark:text-neutral-400 font-medium"
        >
          Founders and operators who handed us their busywork - here's what happened.
        </motion.p>
      </div>

      {videos && (
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mb-6 grid md:grid-cols-2 gap-6">
          {videos.map((v, i) => (
            <VideoCard key={i} t={v} />
          ))}
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {/* a lighter edge fade than the shared .marquee-mask, so whole cards stay readable */}
        <div className="relative flex overflow-hidden py-1 [mask-image:linear-gradient(to_right,transparent,black_2%,black_98%,transparent)]">
          <div className="flex animate-marquee whitespace-nowrap hover:[animation-play-state:paused]">
            {[...reviews, ...reviews, ...reviews].map((review, i) => (
              <ReviewCard key={i} {...review} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
