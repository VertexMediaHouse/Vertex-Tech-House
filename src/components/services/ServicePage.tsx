import type * as React from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  AppWindow,
  ArrowRight,
  BellRing,
  Bot,
  Boxes,
  ChartColumn,
  Code2,
  FileText,
  Globe,
  Handshake,
  Inbox,
  Kanban,
  LayoutTemplate,
  Magnet,
  MessagesSquare,
  MousePointerClick,
  Package,
  Palette,
  Plug,
  RefreshCw,
  Search,
  ShoppingCart,
  Users,
  Wallet,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { calTrigger } from "@/lib/contact";
import { PageShell } from "@/components/site/PageShell";
import { SectionGlow } from "@/components/site/SectionGlow";
import { LogoMarquee } from "@/components/site/Marquee";
import { FeatureCard } from "@/components/site/WhyChooseUs";
import { CaseStudies } from "@/components/site/CaseStudies";
import { ToolAssembly } from "@/components/site/ToolAssembly";
import { Reviews, videoTestimonials } from "@/components/site/Reviews";
import { ErpModules } from "./ErpModules";
import type { CalendarCTA } from "@/components/site/CalendarCTA";
import {
  AutomationStages,
  CrmStages,
  HeroApp,
  SectionWrap,
  StepProcess,
  WebsiteStages,
  type Step,
} from "./ServiceVisuals";

/**
 * The four service pages (/services/$slug), built the way Vertex Media House's service pages are:
 * split hero with the product in action → logos → the problem → work → a scroll-driven
 * "How it works" → other services → what's included → reviews → FAQ → booking.
 */

export type ServiceSlug = "automation" | "website" | "erp" | "crm";

type Service = {
  slug: ServiceSlug;
  name: string;
  /** short name for the footer */
  label: string;
  icon: React.ElementType;
  blurb: string;
  summary: string;
  metaTitle: string;
  metaDescription: string;
  badge: string;
  title: string;
  accent: string;
  intro: string;
  cta: string;
  booking: React.ComponentProps<typeof CalendarCTA>;
  /** without it, put a section of your own in `showcase` */
  problem?: { title: React.ReactNode; subtitle: string; items: [string, string][] };
  /** extra sections between the problem and "How it works" */
  showcase?: React.ComponentType;
  /** without it, `after` takes the place of "How it works" */
  process?: {
    title: React.ReactNode;
    subtitle: string;
    steps: Step[];
    stages: (props: { stage: number }) => React.ReactElement;
  };
  /** extra sections after "How it works" */
  after?: React.ComponentType;
  deliverables: { icon: React.ElementType; title: string; description: string }[];
  reviews: boolean;
  faqs: [string, string][];
};

const o = (t: string) => <span className="text-[#ff4d31]">{t}</span>;

export const services: Record<ServiceSlug, Service> = {
  automation: {
    slug: "automation",
    name: "Business Automation",
    label: "Automation",
    icon: Workflow,
    blurb: "Workflows that take repetitive work off your team.",
    summary:
      "n8n workflows and AI agents that capture leads, follow up, sync data and send reports, so your team stops doing a system's job.",
    metaTitle: "Business Automation Services | Vertex Tech House",
    metaDescription:
      "We design and build business automation with n8n and AI: workflows, lead follow-up, data sync and integrations that take repetitive manual work off your team.",
    badge: "n8n · AI agents · Integrations",
    title: "Automate the work.",
    accent: "Scale the business.",
    intro:
      "We design and build automation systems that take repetitive work off your team and connect the tools your business already runs on, from lead follow-up to weekly reporting.",
    cta: "Talk to Us",
    booking: {
      eyebrow: "Free automation audit",
      title: <>Find out what {o("to automate first.")}</>,
      subtitle:
        "Book a free 20-minute call. We'll look at how your team works and tell you what's worth automating, what it would take and what it would save.",
      action: "Talk to Us",
    },
    problem: {
      title: <>Your team is doing {o("a system's job.")}</>,
      subtitle:
        "In most growing businesses the slow part isn't the work itself. It's the copying, chasing and checking around it.",
      items: [
        ["Repetitive manual tasks", "The same clicks, copies and checks, done by hand every day."],
        ["Data entry", "Details retyped from emails and forms into spreadsheets and systems."],
        ["Manual follow-ups", "Leads and invoices wait until someone remembers to chase them."],
        ["Disconnected tools", "Your CRM, inbox and spreadsheets each hold part of the picture."],
        ["Human error", "One wrong field travels quietly through every step after it."],
        ["No visibility", "Nobody can see what's stuck, what's done or where the hours go."],
      ],
    },
    showcase: () => <CaseStudies category="Automation" />,
    process: {
      title: <>Five steps. {o("Zero busywork.")}</>,
      subtitle: "Scroll to watch one workflow go from a manual chore to a system that runs itself.",
      steps: [
        {
          name: "Understand",
          text: "We map the process with your team and find where the hours go.",
        },
        {
          name: "Design",
          text: "The workflow, the data it needs and what happens when things go wrong.",
        },
        { name: "Build", text: "Built in n8n and tested against real data and edge cases." },
        {
          name: "Integrate",
          text: "Connected to your live tools and switched on alongside your team.",
        },
        { name: "Optimise", text: "We watch every run and automate the next bottleneck." },
      ],
      stages: AutomationStages,
    },
    after: ToolAssembly,
    deliverables: [
      {
        icon: Workflow,
        title: "Workflow automation",
        description:
          "Multi-step processes in n8n that run on a trigger or schedule: onboarding, approvals, handovers.",
      },
      {
        icon: Magnet,
        title: "Lead automation",
        description: "Every form, call and DM captured, enriched and routed in seconds.",
      },
      {
        icon: Handshake,
        title: "Sales automation",
        description: "Deals created, owners assigned and follow-ups sent on schedule.",
      },
      {
        icon: RefreshCw,
        title: "Data synchronisation",
        description: "Records kept identical across your CRM, sheets and other tools.",
      },
      {
        icon: FileText,
        title: "Documents & reports",
        description: "Quotes, contracts and reports generated and filed automatically.",
      },
      {
        icon: Bot,
        title: "AI-powered workflows",
        description:
          "AI agents that read, sort and draft, with a person approving where it counts.",
      },
    ],
    reviews: true,
    faqs: [
      [
        "Which tools do you build automations with?",
        "Mostly n8n, and Zapier or Make when your team already uses them. We connect the tools you have instead of replacing them.",
      ],
      [
        "How long does it take?",
        "Most workflows go live within 1–2 weeks, depending on how many tools and edge cases are involved.",
      ],
      [
        "What if something breaks?",
        "Every flow is tested against real data and edge cases before launch, and post-launch support is included so issues get fixed quickly.",
      ],
      [
        "Do we own the workflows?",
        "Yes. Everything runs in your accounts, with full docs and a handover walkthrough. No lock-in to us.",
      ],
    ],
  },

  website: {
    slug: "website",
    name: "Website Development",
    label: "Websites",
    icon: Globe,
    blurb: "Fast, search-ready sites that turn visitors into enquiries.",
    summary:
      "Strategy, design and development in one team. Fast, search-ready websites where every enquiry lands in your CRM.",
    metaTitle: "Website Design & Development | Vertex Tech House",
    metaDescription:
      "Business websites designed and built for speed, search and conversion: responsive design, landing pages, CMS and web apps, with every enquiry flowing into your CRM.",
    badge: "Design · Development · SEO",
    title: "Websites built to",
    accent: "move your business forward.",
    intro:
      "Strategy, design and development in one team. We build fast, search-ready websites that explain what you do clearly and turn visitors into enquiries.",
    cta: "Start Your Project",
    booking: {
      eyebrow: "Free project call",
      title: <>Let's plan {o("your new website.")}</>,
      subtitle:
        "Book a free 20-minute call. Tell us what the site needs to do and we'll outline the scope, timeline and next steps.",
      action: "Start Your Project",
    },
    problem: {
      title: <>A website that {o("doesn't sell.")}</>,
      subtitle: "Most business sites look fine and do very little. These are the usual reasons.",
      items: [
        ["Slow pages", "Visitors leave before the page loads, and search engines notice."],
        ["Unclear message", "People can't tell what you do or who it's for in five seconds."],
        [
          "Built for desktop",
          "Most visitors are on a phone, and the site was an afterthought there.",
        ],
        ["No clear next step", "No obvious way to enquire, book or buy on the pages that matter."],
        ["Lost enquiries", "Form submissions sit in an inbox instead of reaching your pipeline."],
        ["Hard to update", "Every small change needs a developer, so the site goes stale."],
      ],
    },
    process: {
      title: <>Six steps. {o("One launch.")}</>,
      subtitle: "Scroll to watch one site go from a sitemap to live and improving.",
      steps: [
        {
          name: "Strategy",
          text: "The audience, the job of every page and how success is measured.",
        },
        { name: "UX/UI", text: "Wireframes, then full designs you approve before any code." },
        {
          name: "Development",
          text: "Responsive, accessible and fast, on a stack you can grow with.",
        },
        { name: "Testing", text: "Every page checked across devices, browsers, forms and speed." },
        { name: "Launch", text: "Domain, redirects and analytics set up so nothing breaks." },
        { name: "Optimisation", text: "We watch real visitors and improve what holds them back." },
      ],
      stages: WebsiteStages,
    },
    deliverables: [
      {
        icon: Palette,
        title: "Website design",
        description: "Layouts and visuals built around your message, your brand and your buyer.",
      },
      {
        icon: Code2,
        title: "Website development",
        description: "Clean, modern code that loads fast and is easy to maintain.",
      },
      {
        icon: MousePointerClick,
        title: "Landing pages",
        description: "Single-purpose pages for campaigns and launches, built to convert.",
      },
      {
        icon: AppWindow,
        title: "Custom web applications",
        description: "Portals, dashboards and booking tools when a brochure site isn't enough.",
      },
      {
        icon: Search,
        title: "SEO-ready architecture",
        description:
          "Clean structure, metadata and schema so search engines understand every page.",
      },
      {
        icon: LayoutTemplate,
        title: "CMS integration",
        description:
          "Update pages, posts and case studies yourself, without waiting on a developer.",
      },
    ],
    reviews: false,
    faqs: [
      [
        "Can I update the site myself?",
        "Yes. We set up a CMS around your content so you can edit pages, posts and case studies without a developer.",
      ],
      [
        "Will it work on phones?",
        "Every page is designed for phones first, then tested on tablets and desktops before launch.",
      ],
      [
        "Is SEO included?",
        "The technical foundations are: fast pages, clean structure, metadata, schema and redirects from your old URLs. Ongoing content work is separate.",
      ],
      [
        "Can enquiries go straight into our CRM?",
        "Yes. Forms, bookings and chat can feed your CRM or an automation, so every enquiry is captured and followed up.",
      ],
    ],
  },

  erp: {
    slug: "erp",
    name: "ERP Systems",
    label: "ERP",
    icon: Boxes,
    blurb: "Finance, stock, sales and people in one system.",
    summary:
      "Custom ERP systems that bring finance, inventory, sales, purchasing and HR into one place, with live visibility across every department.",
    metaTitle: "Custom ERP Development | Vertex Tech House",
    metaDescription:
      "Custom ERP systems that bring finance, inventory, sales, purchasing and HR into one place, with real-time reporting and automation built in.",
    badge: "Finance · Inventory · Operations",
    title: "One system for",
    accent: "your entire business.",
    intro:
      "We design and build ERP systems around how your business actually runs, bringing finance, stock, sales and people into one place with live visibility across every department.",
    cta: "Discuss Your ERP Requirements",
    booking: {
      eyebrow: "Free consultation",
      title: <>Let's map {o("your operations.")}</>,
      subtitle:
        "Book a free 20-minute call. Walk us through how the business runs today and we'll outline what your ERP should cover first.",
      action: "Discuss Your ERP Requirements",
    },
    after: ErpModules,
    deliverables: [
      {
        icon: Wallet,
        title: "Finance & invoicing",
        description: "Invoices, payments and cash flow, created from orders without re-typing.",
      },
      {
        icon: Package,
        title: "Inventory",
        description: "Live stock levels across locations, with reorder alerts before you run out.",
      },
      {
        icon: ShoppingCart,
        title: "Sales & orders",
        description: "Quotes, orders and deliveries tracked from first price to final payment.",
      },
      {
        icon: Users,
        title: "HR & payroll",
        description: "Staff records, leave and payroll runs without the spreadsheet.",
      },
      {
        icon: ChartColumn,
        title: "Reporting & dashboards",
        description: "Real-time views for each team and one clear view for leadership.",
      },
      {
        icon: Workflow,
        title: "Operations & automation",
        description: "Approvals, alerts and handovers that run themselves on n8n workflows.",
      },
    ],
    reviews: false,
    faqs: [
      [
        "Will it fit how we work?",
        "That's the point of a custom build. We map each department first, then build the modules you need and leave out the rest.",
      ],
      [
        "Can you move our data out of spreadsheets?",
        "Yes. Data migration is part of every rollout: we clean, validate and import your existing records.",
      ],
      [
        "Can it connect to our other tools?",
        "Yes. Through APIs and n8n workflows the ERP can sync with your CRM, accounting, email and other systems.",
      ],
      [
        "How do you avoid disrupting the business?",
        "We roll out in stages, test real scenarios with your team and train every role before go-live.",
      ],
    ],
  },

  crm: {
    slug: "crm",
    name: "CRM Development",
    label: "CRM",
    icon: Kanban,
    blurb: "Every lead, deal and follow-up in one place.",
    summary:
      "A CRM built around how your team sells. Every lead captured, every follow-up sent and every deal visible from first contact to close.",
    metaTitle: "Custom CRM Development | Vertex Tech House",
    metaDescription:
      "Custom CRM systems built around your sales process: lead management, pipelines, follow-ups, reporting and automation, with no per-seat fees.",
    badge: "Leads · Pipeline · Follow-ups",
    title: "Turn customer data into",
    accent: "better business.",
    intro:
      "We build CRMs around how your team sells, so every lead is captured, every follow-up happens and every deal is visible from first contact to close.",
    cta: "Build Your CRM",
    booking: {
      eyebrow: "Free consultation",
      title: <>Let's build {o("your CRM.")}</>,
      subtitle:
        "Book a free 20-minute call. We'll look at how your team sells today and outline the CRM that fits it.",
      action: "Build Your CRM",
    },
    problem: {
      title: <>Revenue slips {o("through the cracks.")}</>,
      subtitle:
        "Without one place for customers, good leads go cold and nobody can say exactly why.",
      items: [
        [
          "Leads getting lost",
          "Enquiries arrive by form, phone and DM, and some never get a reply.",
        ],
        ["Poor follow-up", "Follow-ups rely on memory, so the busiest weeks lose the most deals."],
        ["Scattered information", "Notes, emails and history spread across inboxes and sheets."],
        [
          "No pipeline visibility",
          "You can't see what's closing this month, or where deals stall.",
        ],
        ["Manual reporting", "Every sales meeting starts with someone rebuilding the numbers."],
        ["Inconsistent process", "Everyone sells their own way, so results are hard to repeat."],
      ],
    },
    process: {
      title: <>Six steps. {o("No lost leads.")}</>,
      subtitle: "Scroll to watch a messy inbox become a pipeline your team actually uses.",
      steps: [
        { name: "Understand", text: "Your sales process, your team and where deals get stuck." },
        { name: "Design", text: "Stages, fields, views and permissions designed with your team." },
        { name: "Configure", text: "We build the CRM and the automations around it." },
        { name: "Integrate", text: "Email, calendar and forms connected, your data migrated in." },
        { name: "Launch", text: "Team training and a supported go-live, so adoption sticks." },
        { name: "Optimise", text: "We refine the pipeline as you learn what works." },
      ],
      stages: CrmStages,
    },
    deliverables: [
      {
        icon: Inbox,
        title: "Lead management",
        description: "Leads from every channel captured, scored and assigned automatically.",
      },
      {
        icon: Kanban,
        title: "Sales pipeline",
        description: "Your stages on one board, with deal values and next steps at a glance.",
      },
      {
        icon: BellRing,
        title: "Follow-ups & tasks",
        description: "Reminders, sequences and to-dos, so no lead waits on someone's memory.",
      },
      {
        icon: MessagesSquare,
        title: "Customer communication",
        description: "Email and WhatsApp conversations logged against the right contact.",
      },
      {
        icon: ChartColumn,
        title: "Reporting & analytics",
        description: "Live revenue, conversion and activity dashboards for the whole team.",
      },
      {
        icon: Plug,
        title: "Integrations",
        description: "Connected to your email, calendar, website forms and n8n workflows.",
      },
    ],
    reviews: true,
    faqs: [
      [
        "Why not use an off-the-shelf CRM?",
        "If one fits, use it. We build when your process doesn't fit the template or per-seat pricing adds up: your stages, fields and rules, with no per-seat fees.",
      ],
      [
        "Can you migrate our existing data?",
        "Yes. We move your data out of spreadsheets or your old CRM, clean it up and import it.",
      ],
      [
        "Will my team actually use it?",
        "We design it with them, keep it to what they need and train everyone at launch so adoption sticks.",
      ],
      [
        "Does it connect to email and WhatsApp?",
        "Yes. Email, calendar, WhatsApp, website forms and n8n workflows can all feed the CRM.",
      ],
    ],
  },
};

export const serviceList = [services.website, services.erp, services.crm, services.automation];

function Hero({ s }: { s: Service }) {
  return (
    <section className="relative w-full overflow-hidden px-4 sm:px-6 md:px-8 pt-10 md:pt-16 pb-12">
      <SectionGlow />
      <div className="relative mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full liquid-glass border border-white/30 dark:border-white/10 px-3 py-1 text-xs font-mono uppercase tracking-widest text-neutral-700 dark:text-neutral-300"
          >
            <s.icon className="h-3.5 w-3.5 text-[#ff4d31]" />
            {s.badge}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tighter text-neutral-950 dark:text-white leading-[0.95]"
          >
            {s.title} <span className="text-[#ff4d31]">{s.accent}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-xl text-lg lg:text-xl text-neutral-600 dark:text-neutral-400"
          >
            {s.intro}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button
              className="rounded-xl px-6 py-3 h-auto bg-[#ff4d31] text-white hover:bg-[#e8462c]"
              {...calTrigger}
            >
              {s.cta}
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl px-6 py-3 h-auto border-neutral-300 dark:border-neutral-700 bg-transparent"
            >
              <a href="#included">What's included</a>
            </Button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          // Fixed height so every service hero is the same size; the app is sized to fit it.
          className="lg:col-span-7 lg:h-[574px] lg:flex lg:flex-col lg:justify-center"
        >
          <HeroApp app={s.slug} />
        </motion.div>
      </div>
    </section>
  );
}

function Problem({ p }: { p: NonNullable<Service["problem"]> }) {
  return (
    <SectionWrap id="problem" eyebrow="The problem" title={p.title} subtitle={p.subtitle}>
      <ol className="grid gap-x-12 md:grid-cols-2">
        {p.items.map(([title, body], i) => (
          <motion.li
            key={title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.45, delay: (i % 2) * 0.1 }}
            className="flex gap-5 border-t border-neutral-200 py-6 dark:border-white/10"
          >
            <span className="w-6 shrink-0 pt-1 font-mono text-xs text-[#ff4d31]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-lg md:text-xl font-semibold tracking-tight text-neutral-950 dark:text-white">
                {title}
              </h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
                {body}
              </p>
            </div>
          </motion.li>
        ))}
      </ol>
    </SectionWrap>
  );
}

function Faq({ faqs }: { faqs: Service["faqs"] }) {
  return (
    <SectionWrap eyebrow="FAQ" title="Questions, answered.">
      <Accordion type="single" collapsible className="mx-auto max-w-3xl">
        {faqs.map(([q, a]) => (
          <AccordionItem key={q} value={q} className="border-neutral-200 dark:border-white/10">
            <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-neutral-900 dark:text-white">
              {q}
            </AccordionTrigger>
            <AccordionContent className="text-base text-neutral-600 dark:text-neutral-400">
              {a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </SectionWrap>
  );
}

function OtherServices({ current }: { current: ServiceSlug }) {
  return (
    <SectionWrap eyebrow="More services" title="Need the full system?">
      <div className="grid sm:grid-cols-3 gap-5">
        {serviceList
          .filter((x) => x.slug !== current)
          .map((x) => (
            <Link
              key={x.slug}
              to="/services/$slug"
              params={{ slug: x.slug }}
              className="group liquid-glass rounded-2xl border border-black/10 dark:border-white/10 p-6 transition-all hover:-translate-y-1 hover:border-[#ff4d31]/50"
            >
              <x.icon className="h-7 w-7 text-[#ff4d31]" />
              <h3 className="mt-4 text-xl font-bold text-neutral-900 dark:text-white">{x.name}</h3>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{x.blurb}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#ff4d31]">
                Explore{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
      </div>
    </SectionWrap>
  );
}

export function ServicePage({ slug }: { slug: ServiceSlug }) {
  const s = services[slug];
  const Showcase = s.showcase;
  const After = s.after;
  return (
    <PageShell cta={s.booking}>
      <Hero s={s} />
      <div className="py-6">
        <LogoMarquee />
      </div>
      {s.problem && <Problem p={s.problem} />}
      {Showcase && <Showcase />}
      {s.process && (
        <StepProcess
          title={s.process.title}
          subtitle={s.process.subtitle}
          steps={s.process.steps}
          stageView={s.process.stages}
        />
      )}
      {After && <After />}
      <OtherServices current={slug} />
      <div id="included" className="scroll-mt-24">
        <SectionWrap eyebrow="What's included" title={<>Everything you {o("get.")}</>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {s.deliverables.map((d, i) => (
              <FeatureCard key={d.title} {...d} index={i % 3} />
            ))}
          </div>
        </SectionWrap>
      </div>
      {s.reviews && <Reviews rows={1} videos={videoTestimonials} />}
      <Faq faqs={s.faqs} />
    </PageShell>
  );
}
