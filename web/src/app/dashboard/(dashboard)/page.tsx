"use client";

import { useAuth } from "@/lib/auth/auth-provider";
import { Bookmark, Star, Blocks } from "lucide-react";
import DashboardStats from "./components/DashboardStats";
import useDashboard from "./hooks/useDashboard";
import { Button } from "@/components/motion/button/base";
import { ArrowUpRight, ExternalLink } from "lucide-motion";
import Link from "next/link";
import RecentLinkCard from "./components/RecentLinkCard";
import { DashboardResponse } from "./types";

export default function DashboardPage() {
  const { data } = useDashboard();
  const { user } = useAuth();

  const dashboard = data?.data;

  const totalLinks = dashboard?.totalLinks ?? 0;
  const totalCollections = dashboard?.totalCollections ?? 0;
  const totalFavouriteLinks = dashboard?.totalFavouriteLinks ?? 0;
  const recentLinks = dashboard?.recentLinks ?? [];

  const hour = new Date().getHours();

  const greet =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Evening" : "Good Night";

  return (
    <main className="flex flex-col gap-4">
      <div className="space-y-2">
        <h2 className="text-md md:text-xl text-white font-semibold">
          {greet}, <span>{user?.name}</span>
        </h2>
        <p className="text-white/60 text-sm md:text-md lg:text-lg">
          Here's what's in your vault.
        </p>
      </div>
      <DashboardStats
        totalCollections={totalCollections}
        totalFavourites={totalFavouriteLinks}
        totalLinks={totalLinks}
      />
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-sm md:text-md lg:text-lg">Recently saved</h1>
          <Link href={"/dashboard"}>
            <Button
              type="button"
              variant="ghost"
              size="md"
              whileHover=""
              className="hover:text-white group cursor-pointer"
            >
              View all links
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in">
                <ExternalLink className="size-4" />
              </span>
            </Button>
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          {recentLinks.map((link) => (
            <RecentLinkCard link={link} key={link.id} />
          ))}
        </div>
      </section>
    </main>
  );
}
