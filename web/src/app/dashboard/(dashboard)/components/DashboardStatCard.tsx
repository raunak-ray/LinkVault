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
    <Card className="flex-1 w-full surface-panel transition-all hover:shadow-[var(--shadow-lift)]">
      <CardHeader className="pb-2">
        <CardTitle className="flex gap-2 items-center text-sm justify-start text-muted-foreground">
          <Icon className="size-4" />
          {title || "Title"}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-semibold">{value || 0}</CardContent>
    </Card>
  );
}
