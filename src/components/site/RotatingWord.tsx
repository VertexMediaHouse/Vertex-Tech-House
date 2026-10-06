import * as React from "react";

export function RotatingWord({ words, interval = 2200 }: { words: string[]; interval?: number }) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setIndex((v) => (v + 1) % words.length);
    }, interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  const longest = words.reduce((a, b) => (a.length >= b.length ? a : b), "");

  return (
    <span className="relative inline-grid align-baseline">
      {/* Hidden spacer to maintain width based on the longest word */}
      <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">
        {longest}
      </span>
      <span className="col-start-1 row-start-1 relative overflow-hidden pb-4 md:pb-8">
        {words.map((w, idx) => {
          // Determine the state of each word
          // We want the current word to be at 0
          // The word that just passed to be at -100%
          // All other words to be at 100% (waiting to come in)

          const isCurrent = idx === index;
          const isPrevious = idx === (index - 1 + words.length) % words.length;

          let translateY = "100%";
          let opacity = 0;
          let transition = "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)";

          if (isCurrent) {
            translateY = "0%";
            opacity = 1;
          } else if (isPrevious) {
            translateY = "-100%";
            opacity = 0;
          } else {
            // Immediate reset to 100% for words that are neither current nor previous
            // This prevents them from sliding "backwards" through the visible area
            transition = "none";
          }

          return (
            <div
              key={w}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
              style={{
                opacity,
                transform: `translateY(${translateY})`,
                transition,
              }}
            >
              <span className="bg-gradient-to-r from-neutral-950 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
                {w}
              </span>
            </div>
          );
        })}
      </span>
    </span>
  );
}
