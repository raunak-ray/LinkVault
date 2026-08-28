"use client";

import { useAuth } from "@/lib/auth/auth-provider";
import { Bookmark, Star, Blocks } from "lucide-react";
import DashboardStats from "./components/DashboardStats";
import useDashboard from "./hooks/useDashboard";

export default function DashboardPage() {
  const { data } = useDashboard();
  const { user } = useAuth();

  const totalCollections = data?.data.totalCollections ?? 0;
  const totalFavourites = data?.data.totalFavouriteLinks ?? 0;
  const totalLinks = data?.data.totalLinks ?? 0;

  const hour = new Date().getHours();

  const greet = hour < 12 ? "Good Morning" : hour < 18 ? "Good Evening" : "Good Night";


  return (
    <div>
      <div className="mb-2 space-y-2">
        <h2 className="text-md md:text-xl text-white font-semibold">{greet}, <span>{user?.name}</span></h2>
        <p className="text-white/60 text-sm md:text-md lg:text-lg">Here's what's in your vault.</p>
      </div>
      <DashboardStats totalCollections={totalCollections} totalFavourites={totalFavourites} totalLinks={totalLinks} />
    </div>
  );
}
