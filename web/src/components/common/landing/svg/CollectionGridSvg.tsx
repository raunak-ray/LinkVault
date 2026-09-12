"use client";

import { BookOpen, Brain, Code2, Palette } from "lucide-react";

export default function CollectionGridSvg() {
  const collections = [
    {
      title: "Design",
      count: "48 links",
      color: "var(--primary)",
      icon: Palette,
    },
    {
      title: "Development",
      count: "132 links",
      color: "var(--mint)",
      icon: Code2,
    },
    {
      title: "Research",
      count: "29 links",
      color: "oklch(70% 0.09 205)",
      icon: Brain,
    },
    {
      title: "Reading List",
      count: "16 links",
      color: "oklch(68% 0.11 60)",
      icon: BookOpen,
    },
  ];

  return (
    <div className="relative w-full h-52 flex items-center justify-center select-none overflow-hidden rounded-xl bg-surface/50 p-4 border border-border/50">
      <div className="grid grid-cols-2 gap-2.5 w-full max-w-[340px]">
        {collections.map((col) => {
          const Icon = col.icon;
          return (
            <div
              key={col.title}
              className="group/item flex items-center gap-2.5 rounded-lg border border-border bg-card p-2.5 transition-colors duration-200 hover:border-primary/40 hover:bg-card/90"
            >
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded-md text-foreground transition-transform duration-200"
                style={{
                  backgroundColor: `color-mix(in oklch, ${col.color} 15%, transparent)`,
                  color: col.color,
                }}
              >
                <Icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">
                  {col.title}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground">
                  {col.count}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
