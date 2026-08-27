"use client";

import { useAuth } from "@/lib/auth/auth-provider";
import { Bookmark, Star, Blocks } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  return <div>Dashboard</div>;
}
