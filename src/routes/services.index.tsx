import { createFileRoute } from "@tanstack/react-router";
import {
  Bot,
  Workflow,
  PhoneCall,
  Send,
  Network,
  Terminal,
  Database,
  Kanban,
  Inbox,
  Plug,
  ChartColumn,
  ArrowRightLeft,
} from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { Packages } from "@/components/site/ServiceSections";
import { ServiceHero } from "@/components/site/ServiceHero";
import { ToolAssembly } from "@/components/site/ToolAssembly";
import { LogoMarquee } from "@/components/site/Marquee";
import { Services, type ServiceItem } from "@/components/site/Services";
import { CaseStudies } from "@/components/site/CaseStudies";
import { Showcase } from "@/components/site/Showcase";
import { Reviews } from "@/components/site/Reviews";

const description =
  "Custom websites, ERP systems, CRM builds and AI automation, designed to work together.";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Websites, ERP, CRM & Automation Services | Vertex Tech House" },
      { name: "description", content: description },
      {
        property: "og:title",
        content: "Websites, ERP, CRM & Automation Services | Vertex Tech House",
      },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://vertextechhouse.com/services" },
    ],
    links: [{ rel: "canonical", href: "https://vertextechhouse.com/services" }],
  }),
  component: ServicesPage,
});

const automation: ServiceItem[] = [
  {
    icon: Workflow,
    title: "n8n Workflow Automation",
    description:
      "n8n, Zapier or Make, wired into the tools you already use. We map your process, remove the manual steps, and build flows that just run.",
  },
  {
    icon: PhoneCall,
    title: "AI Voice Agents",
    description:
      "Voice agents that answer inbound calls, qualify leads, book meetings and follow up around the clock, with every call logged to your CRM.",
  },
  {
    icon: Send,
    title: "Outbound Campaigns",
    description:
      "Enriched lead lists, personalised sequences, and automated follow-ups. The right message reaches the right person without anyone touching a keyboard.",
  },
  {
    icon: Bot,
    title: "AI Chat & Task Agents",
    description:
      "Agents that don't just answer questions but take action, from lead qualification to first-line customer support.",
  },
  {
    icon: Network,
    title: "Multi-agent Systems",
    description:
      "Pipelines where several AI agents hand work to each other to research, write, approve and publish without a human in the middle.",
  },
  {
    icon: Terminal,
    title: "Content Pipelines",
    description:
      "From idea to published post on autopilot. Systems that research, draft, format and schedule content across every platform.",
  },
];

const crm: ServiceItem[] = [
  {
    icon: Database,
    title: "Custom CRM Builds",
    description:
      "A CRM designed around your sales process: your stages, your fields, your rules. No bloated SaaS seats, no features you'll never use.",
  },
  {
    icon: Kanban,
    title: "Pipeline & Deal Tracking",
    description:
      "See every deal, its stage and its next step at a glance. Automatic reminders mean no follow-up is ever forgotten.",
  },
  {
    icon: Inbox,
    title: "Lead Capture & Routing",
    description:
      "Leads from forms, ads, calls and DMs land in your CRM automatically, enriched, scored and routed to the right person in seconds.",
  },
  {
    icon: Plug,
    title: "Integrations With Your Stack",
    description:
      "Email, calendar, WhatsApp, payments and n8n workflows. Your CRM talks to the rest of your tools, so nothing gets typed twice.",
  },
  {
    icon: ChartColumn,
    title: "Dashboards & Reporting",
    description:
      "Live views of revenue, conversion and team activity, without rebuilding a spreadsheet every Monday.",
  },
  {
    icon: ArrowRightLeft,
    title: "Migration & Onboarding",
    description:
      "We move your data out of spreadsheets or your old CRM, clean it up, and train your team so adoption actually sticks.",
  },
];

function ServicesPage() {
  return (
    <PageShell>
      <ServiceHero />
      <div className="py-8 md:py-10">
        <LogoMarquee />
      </div>
      <Showcase />
      <Services
        id="crm"
        eyebrow="CRM"
        title={
          <>
            Your pipeline, <span className="text-[#ff4d31]">finally in one place.</span>
          </>
        }
        subtitle="A CRM built around how your team sells. Every lead, deal and follow-up tracked without anyone typing."
        items={crm}
      />
      <Services
        id="automation"
        eyebrow="Automation"
        title={
          <>
            Stop doing work <span className="text-[#ff4d31]">a system can do.</span>
          </>
        }
        subtitle="n8n workflows, AI voice agents and outbound campaigns that handle the repetitive work while you focus on growth."
        items={automation}
      />
      <ToolAssembly />
      <CaseStudies />
      <Reviews rows={1} />
      <Packages />
    </PageShell>
  );
}
