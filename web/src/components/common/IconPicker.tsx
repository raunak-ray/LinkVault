"use client";

import { useState, useMemo } from "react";
import { DynamicIcon } from "lucide-react/dynamic";
import { Search, Grid3x3 } from "lucide-motion";
import { Button } from "@/components/motion/button/base";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const PRESET_ICONS = ["folder", "code-xml", "book-open", "brain", "briefcase", "star", "heart", "layers", "bookmark", "globe"] as const;

const ALL_ICONS = [
  "folder",
  "code-xml",
  "book-open",
  "brain",
  "briefcase",
  "star",
  "heart",
  "layers",
  "bookmark",
  "globe",
  "lightbulb",
  "rocket",
  "hammer",
  "database",
  "cloud",
  "shield",
  "zap",
  "cpu",
  "palette",
  "music",
  "camera",
  "film",
  "gamepad-2",
  "graduation-cap",
  "pen-tool",
  "layout-grid",
  "package",
  "shopping-bag",
  "bell",
  "calendar",
  "clock",
  "mail",
  "message-circle",
  "users",
  "award",
  "trending-up",
] as const;

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export default function IconPicker({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return ALL_ICONS;
    const q = normalize(search);
    return ALL_ICONS.filter((n) => normalize(n).includes(q));
  }, [search]);

  return (
    <div>
      <p className="px-1 text-sm font-medium text-foreground mb-1.5">Icon</p>
      <div className="flex flex-wrap gap-2">
        {PRESET_ICONS.map((name) => {
          const active = value === name;
          return (
            <button
              key={name}
              type="button"
              onClick={() => onChange(name)}
              className={`flex size-9 items-center justify-center rounded-lg border transition-colors ${active ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground"}`}
              aria-label={name}
            >
              <DynamicIcon name={name as any} className="size-4" />
            </button>
          );
        })}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <Button type="button" variant="outline" size="sm" className="h-9 gap-1.5">
                <Grid3x3 className="size-4" /> Browse all
              </Button>
            }
          />
          <PopoverContent className="w-72 p-3" align="start" sideOffset={8}>
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search icons..."
                className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
              />
            </div>
            <div className="grid max-h-56 grid-cols-6 gap-1.5 overflow-y-auto pr-1">
              {filtered.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    onChange(name.trim());
                    setOpen(false);
                  }}
                  className={`flex size-9 items-center justify-center rounded-lg border text-muted-foreground hover:bg-accent hover:text-foreground ${value?.trim() === name.trim() ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
                  title={name}
                >
                  <DynamicIcon name={name.trim() as any} className="size-4" />
                </button>
              ))}
              {filtered.length === 0 && <p className="col-span-6 py-6 text-center text-sm text-muted-foreground">No icons found</p>}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {value && <p className="mt-1.5 text-xs text-muted-foreground">Selected: <span className="font-medium text-foreground">{value}</span></p>}
    </div>
  );
}
