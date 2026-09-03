"use client";

import { useAuth } from "@/lib/auth/auth-provider";
import DashboardStats from "./components/DashboardStats";
import useDashboard from "./hooks/useDashboard";
import { Button } from "@/components/motion/button/base";
import { ExternalLink } from "lucide-motion";
import Link from "next/link";
import RecentLinkCard from "./components/RecentLinkCard";

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();
  const { user } = useAuth();

  const dashboard = data?.data;

  const totalLinks = dashboard?.totalLinks ?? 0;
  const totalCollections = dashboard?.totalCollections ?? 0;
  const totalFavouriteLinks = dashboard?.totalFavouriteLinks ?? 0;
  const recentLinks = dashboard?.recentLinks ?? [];

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good Morning" : hour < 18 ? "Good Evening" : "Good Night";

  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl space-y-6">
        <div className="space-y-2 animate-pulse">
          <div className="h-6 w-48 bg-primary/10 rounded" />
          <div className="h-4 w-64 bg-primary/10 rounded" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="surface-panel rounded-xl p-4">
              <div className="h-3 w-16 bg-primary/10 rounded animate-pulse" />
              <div className="mt-3 h-7 w-12 bg-primary/10 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="surface-panel rounded-xl p-4 h-28 animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl flex flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-xl md:text-2xl font-semibold">
          {greet}, <span>{user?.name}</span>
        </h2>
        <p className="text-sm text-muted-foreground">Here&apos;s what&apos;s in your vault.</p>
      </div>
      <DashboardStats totalCollections={totalCollections} totalFavourites={totalFavouriteLinks} totalLinks={totalLinks} />
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-semibold md:text-base">Recently saved</h1>
          <Link href="/dashboard/links">
            <Button type="button" variant="ghost" size="sm" className="group gap-1.5">
              View all links
              <ExternalLink className="size-4 opacity-60 group-hover:opacity-100 transition-opacity" />
            </Button>
          </Link>
        </div>
        {recentLinks.length === 0 ? (
          <div className="surface-panel rounded-xl p-8 text-center border-dashed">
            <p className="text-sm text-muted-foreground">No links yet. Save your first link to see it here.</p>
            <Link href="/dashboard/links" className="mt-3 inline-block">
              <Button size="sm">Add Link</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recentLinks.map((link) => (
              <RecentLinkCard link={link} key={link.id} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
