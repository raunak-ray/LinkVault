import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComponentType } from "react";

export default function DashboardStatsCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="flex-1 w-full bg-[#131822] border border-white/10 hover:border-white/30">
      <CardHeader className="">
        <CardTitle className="flex gap-2 items-center text-sm md:text-md justify-start text-white/60">
          <Icon className="size-4" />
          {title || "Title"}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-2xl text-white">{value || 0}</CardContent>
    </Card>
  );
}
