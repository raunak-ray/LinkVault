import { BookMarked, LayoutGrid, Star } from "lucide-motion";
import DashboardStatsCard from "./DashboardStatCard";

export default function DashboardStats({
  totalLinks,
  totalCollections,
  totalFavourites,
}: {
  totalLinks: number;
  totalCollections: number;
  totalFavourites: number;
}) {
  const stats = [
    { title: "Links Saved", value: totalLinks, icon: BookMarked },
    { title: "Collections", value: totalCollections, icon: LayoutGrid },
    { title: "Favourites", value: totalFavourites, icon: Star },
  ];

  return (
    <div className="flex flex-col sm:flex-row w-full items-center justify-center gap-4">
      {stats.map((stat) => (
        <DashboardStatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}
