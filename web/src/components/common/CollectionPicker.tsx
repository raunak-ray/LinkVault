"use client";

import { useState } from "react";
import useGetAllCollections from "@/app/dashboard/collections/hooks/useGetAllCollections";
import { DynamicIcon } from "lucide-react/dynamic";
import { Search, ChevronDown, Folder } from "lucide-motion";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export default function CollectionPicker({ value, onChange }: { value?: string; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data } = useGetAllCollections({ limit: 50, search: search.trim() || undefined });
  const collections = data?.pages.flatMap((p) => p.data) ?? [];
  const selected = collections.find((c) => c.id === value);

  return (
    <div className="space-y-1.5">
      <label className="px-1 text-sm font-medium text-foreground">Collection</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <button
              type="button"
              className="flex h-11 w-full items-center justify-between rounded-full border border-border bg-background px-3.5 text-sm transition-colors hover:border-ring/40"
            >
              <span className="flex items-center gap-2 truncate">
                {selected ? (
                  <>
                    <span className="flex size-6 items-center justify-center rounded-md border border-border" style={{ backgroundColor: `color-mix(in oklab, ${selected.color || "#6366F1"} 14%, transparent)` }}>
                      <DynamicIcon name={(selected.icon as any) || "folder"} className="size-3.5" style={{ color: selected.color || "#6366F1" }} />
                    </span>
                    <span className="truncate font-medium">{selected.name}</span>
                  </>
                ) : (
                  <>
                    <Folder className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Select collection</span>
                  </>
                )}
              </span>
              <ChevronDown className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
          }
        />
        <PopoverContent className="w-[var(--anchor-width)] p-0 overflow-hidden" align="start" sideOffset={8}>
          <div className="relative border-b border-border p-2">
            <Search className="absolute left-4 top-4 size-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search collections..."
              className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-1">
            {collections.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No collections</p>
            ) : (
              collections.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    onChange(c.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm hover:bg-accent text-left ${value === c.id ? "bg-accent" : ""}`}
                >
                  <span className="flex size-7 items-center justify-center rounded-md border border-border" style={{ backgroundColor: `color-mix(in oklab, ${c.color || "#6366F1"} 14%, transparent)` }}>
                    <DynamicIcon name={(c.icon as any) || "folder"} className="size-3.5" style={{ color: c.color || "#6366F1" }} />
                  </span>
                  <span className="truncate font-medium">{c.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{c.linkCount ?? 0}</span>
                </button>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
