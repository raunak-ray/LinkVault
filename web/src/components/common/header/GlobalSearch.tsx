"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Folder, ExternalLink } from "lucide-motion";
import { useRouter } from "next/navigation";
import useDebounce from "@/lib/hooks/useDebounce";
import useGlobalSearch from "@/app/dashboard/search/hooks/useGlobalSearch";
import { getFaviconUrl } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 300);
  const { data, isFetching } = useGlobalSearch(debounced);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    };
    window.addEventListener("keydown", onDown);
    return () => window.removeEventListener("keydown", onDown);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const links = data?.links ?? [];
  const collections = data?.collections ?? [];
  const hasResults = links.length > 0 || collections.length > 0;
  const showEmpty = debounced.trim().length >= 2 && !isFetching && !hasResults;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="flex h-9 w-full max-w-md items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm text-muted-foreground transition-colors hover:bg-accent"
          >
            <Search className="size-4" />
            <span className="truncate hidden sm:inline">Search your vault…</span>
            <span className="truncate sm:hidden">Search…</span>
            <kbd className="ml-auto hidden rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] sm:inline">⌘K</kbd>
          </button>
        }
      />
      <PopoverContent
        align="center"
        sideOffset={8}
        className="w-[min(420px,90vw)] p-0 overflow-hidden"
      >
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <Search className="size-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search links, collections..."
            autoFocus
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {isFetching && <span className="text-xs text-muted-foreground animate-pulse">…</span>}
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {!debounced.trim() ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">Type at least 2 characters to search</p>
          ) : showEmpty ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">No results for “{debounced}”</p>
          ) : (
            <>
              {collections.length > 0 && (
                <div className="mb-2">
                  <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Collections</p>
                  {collections.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setOpen(false);
                        router.push(`/dashboard/collections/${c.id}`);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm hover:bg-accent text-left"
                    >
                      <span className="flex size-7 items-center justify-center rounded-md border border-border" style={{ backgroundColor: `color-mix(in oklab, ${c.color || "#6366F1"} 14%, transparent)` }}>
                        <Folder className="size-3.5" style={{ color: c.color || "#6366F1" }} />
                      </span>
                      <span className="truncate font-medium">{c.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{c.linkCount ?? 0} links</span>
                    </button>
                  ))}
                </div>
              )}
              {links.length > 0 && (
                <div>
                  <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Links</p>
                  {links.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => {
                        setOpen(false);
                        router.push(`/dashboard/links/${l.id}`);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm hover:bg-accent text-left"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={l.metadata.favicon || getFaviconUrl(l.url)} alt="" className="size-7 rounded-md border border-border bg-card object-contain p-1" />
                      <span className="flex-1 truncate">
                        <span className="block truncate font-medium leading-tight">{l.title || l.url}</span>
                        <span className="block truncate text-xs text-muted-foreground">{l.url.replace(/^https?:\/\//, "").slice(0, 40)}</span>
                      </span>
                      <ExternalLink className="size-3.5 text-muted-foreground shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-muted/30 px-3 py-1.5 text-[11px] text-muted-foreground">
          <span>Press ESC to close</span>
          <span className="hidden sm:inline">↵ to open</span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
