import { createFileRoute, notFound } from "@tanstack/react-router";
import { ServicePage, services, type ServiceSlug } from "@/components/services/ServicePage";

const SITE = "https://vertextechhouse.com";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    if (!(params.slug in services)) throw notFound();
  },
  head: ({ params }) => {
    const s = services[params.slug as ServiceSlug];
    if (!s) return {};
    const url = `${SITE}/services/${s.slug}`;
    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: s.name,
          serviceType: s.name,
          description: s.metaDescription,
          url,
          provider: { "@type": "Organization", name: "Vertex Tech House", url: SITE },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "Services", item: `${SITE}/services` },
            { "@type": "ListItem", position: 3, name: s.name, item: url },
          ],
        },
      ],
    };
    return {
      meta: [
        { title: s.metaTitle },
        { name: "description", content: s.metaDescription },
        { property: "og:title", content: s.metaTitle },
        { property: "og:description", content: s.metaDescription },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
    };
  },
  component: function ServiceRoute() {
    return <ServicePage slug={Route.useParams().slug as ServiceSlug} />;
  },
});
