import { CAL_NAMESPACE } from "./contact";

const brand = "#ff4d31";

/* eslint-disable @typescript-eslint/no-explicit-any, prefer-rest-params */
// Cal.com's official embed loader, plus the site's theme. Safe to call more than once.
export function loadCal(): any {
  const win = window as any;
  (function (C: any, A: string, L: string) {
    const p = function (a: any, ar: any) {
      a.q.push(ar);
    };
    const d = C.document;
    C.Cal =
      C.Cal ||
      function () {
        const cal = C.Cal;
        const ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api: any = function () {
            p(api, arguments);
          };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
  })(window, "https://app.cal.com/embed/embed.js", "init");

  win.Cal("init", CAL_NAMESPACE, { origin: "https://app.cal.com" });
  win.Cal.ns[CAL_NAMESPACE]("ui", {
    theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
    hideEventTypeDetails: false,
    layout: "month_view",
    cssVarsPerTheme: {
      dark: { "cal-brand": brand, "cal-bg": "#0a0a0a", "cal-bg-emphasis": "#171717" },
      light: { "cal-brand": brand, "cal-bg": "#ffffff", "cal-bg-emphasis": "#f5f5f5" },
    },
  });
  return win.Cal.ns[CAL_NAMESPACE];
}
