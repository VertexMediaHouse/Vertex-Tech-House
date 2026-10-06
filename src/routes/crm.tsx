import { createFileRoute, redirect } from "@tanstack/react-router";

// Moved to /services/crm. Keep old links and search equity pointing there.
export const Route = createFileRoute("/crm")({
  beforeLoad: () => {
    throw redirect({ to: "/services/$slug", params: { slug: "crm" }, statusCode: 301 });
  },
});
