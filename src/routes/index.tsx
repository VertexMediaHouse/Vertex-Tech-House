import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Hero } from "@/components/site/Hero";
import { ServiceOverview } from "@/components/site/ServiceOverview";
import { Portfolio } from "@/components/site/Portfolio";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { Reviews, videoTestimonials } from "@/components/site/Reviews";
import { MediaHouseCTA } from "@/components/site/MediaHouseCTA";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [{ rel: "canonical", href: "https://vertextechhouse.com/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <PageShell after={<MediaHouseCTA />}>
      <Hero />
      <ServiceOverview />
      <Portfolio />
      <WhyChooseUs />
      <Reviews videos={videoTestimonials} />
    </PageShell>
  );
}
