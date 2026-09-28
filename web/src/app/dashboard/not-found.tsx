import { NotFoundGlitch } from "@/components/motion/not-found/glitch";

/**
 * Dashboard-scoped 404 — renders inside the dashboard layout (sidebar + dock
 * stay visible) for unknown routes under /dashboard.
 */
export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[70svh] items-center justify-center">
      <NotFoundGlitch
        title="Not found in your vault"
        description="This page doesn't exist or the item was deleted."
        homeHref="/dashboard"
        homeLabel="Back to dashboard"
        browseHref="/dashboard/links"
        browseLabel="Browse links"
      />
    </div>
  );
}
