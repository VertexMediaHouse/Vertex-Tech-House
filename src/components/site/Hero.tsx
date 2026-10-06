import { Button } from "@/components/ui/button";
import { LogoMarquee } from "./Marquee";
import { RotatingWord } from "./RotatingWord";
import { LightRays } from "./LightRays";
import { useTheme } from "@/components/theme-provider";
import { calTrigger } from "@/lib/contact";

const words = ["n8n Workflows", "AI Agents", "Custom CRMs", "Automation"];

export function Hero() {
  const { theme } = useTheme();

  return (
    <section className="relative w-full overflow-hidden px-4 sm:px-6 md:px-8 py-10 md:py-20">
      {theme === "dark" && (
        <div className="absolute inset-0 z-0">
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={1}
            lightSpread={0.5}
            rayLength={3}
            followMouse={true}
            mouseInfluence={0.25}
            noiseAmount={0}
            distortion={0}
            pulsating={false}
            fadeDistance={1}
            saturation={1}
          />
        </div>
      )}
      <div className="relative mx-auto max-w-7xl text-center z-10">
        <h1
          className="animate-fade-up text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-neutral-950 dark:text-white flex flex-col items-center justify-center"
          style={{ animationDelay: "0.05s" }}
        >
          {/* Mobile Layout */}
          <div className="flex flex-col items-center md:hidden gap-0.5 text-[2.3rem] sm:text-5xl leading-[1.1] tracking-tighter">
            <span className="whitespace-nowrap">We automate your</span>
            <span className="whitespace-nowrap">business with</span>
            <div className="flex items-center gap-3 mt-1 text-5xl sm:text-6xl leading-none font-extrabold whitespace-nowrap">
              <RotatingWord words={words} />
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex flex-col items-center">
            <span>
              We automate{" "}
              <span className="relative inline-block">
                your business
                <svg
                  className="absolute -bottom-4 -left-[0%] w-[100%] h-2 text-[#ff4d31]"
                  viewBox="0 0 200 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 12C40 -1 160 -1 200 12"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              with
            </span>
            <div className="mt-4">
              <div className="text-7xl lg:text-8xl leading-none font-extrabold">
                <RotatingWord words={words} />
              </div>
            </div>
          </div>
        </h1>
        <p
          className="animate-fade-up mx-auto mt-6 md:mt-8 max-w-2xl text-lg md:text-xl font-medium text-neutral-700 dark:text-neutral-300"
          style={{ animationDelay: "0.2s" }}
        >
          We build n8n workflows, AI voice agents and custom CRMs that capture, follow up and close
          while your team sleeps.
        </p>
        <div
          className="animate-fade-up mt-8 md:mt-10 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "0.35s" }}
        >
          <div className="relative group">
            <Button
              className="rounded-xl px-6 py-3 h-auto bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 transition-transform hover:scale-[1.03]"
              {...calTrigger}
            >
              Book a Call
            </Button>
            <div className="absolute -top-[-15px] -left-20 hidden lg:flex flex-col items-center pointer-events-none">
              <svg
                className="w-16 h-12 text-[#ff4d31]/80"
                viewBox="0 0 60 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 32C5 32 10 5 50 8M50 8L40 15M50 8L42 2"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-2xl text-[#ff4d31] font-['Caveat'] -mt-3 ml-[-50px]">
                It's free
              </span>
            </div>
          </div>
          <Button
            asChild
            variant="outline"
            className="liquid-glass rounded-xl px-6 py-3 h-auto border-neutral-300 dark:border-neutral-700 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <a href="#services">Our Services</a>
          </Button>
        </div>

        <div className="animate-fade-up mt-16 md:mt-24" style={{ animationDelay: "0.5s" }}>
          <LogoMarquee />
        </div>
      </div>
    </section>
  );
}
