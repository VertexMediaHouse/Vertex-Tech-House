import { createFileRoute, redirect } from "@tanstack/react-router";

// Moved to /services/automation. Keep old links and search equity pointing there.
export const Route = createFileRoute("/automate")({
  beforeLoad: () => {
    throw redirect({ to: "/services/$slug", params: { slug: "automation" }, statusCode: 301 });
  },
});
