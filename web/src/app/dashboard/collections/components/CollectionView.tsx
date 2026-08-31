"use client";

import { useState } from "react";
import useGetAllCollections from "../hooks/useGetAllCollections";
import CollectionCard, { CollectionCardSkeleton } from "./CollectionCard";
import { Button } from "@/components/motion/button/base";
import { Input } from "@/components/motion/input";
import { Search, Plus, Layers } from "lucide-motion";
import useDebounce from "@/lib/hooks/useDebounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/motion/select";
import CreateCollectionModal from "./CreateCollectionModal";

type SortOption = "newest" | "oldest" | "name-asc" | "name-desc";

const SORT_OPTIONS: Record<SortOption, { label: string; value: string }> = {
  newest: { label: "Newest", value: "createdAt:desc" },
  oldest: { label: "Oldest", value: "createdAt:asc" },
  "name-asc": { label: "Name A-Z", value: "name:asc" },
  "name-desc": { label: "Name Z-A", value: "name:desc" },
};

export default function CollectionView() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  const debouncedSearch = useDebounce(search);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllCollections({
    search: debouncedSearch.trim() ? debouncedSearch.trim() : undefined,
    sort: SORT_OPTIONS[sort].value,
  });

  const collections = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header - matches lovable */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Collections</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep related links together so they&apos;re easy to find later.
          </p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)} className="gap-2">
          <Plus className="size-4" /> New Collection
        </Button>
      </div>

      {/* Optional toolbar - hidden on empty to mirror lovable, but keep for power users */}
      {(collections.length > 0 || debouncedSearch) && !isLoading && (
        <div className="mt-6 flex items-center gap-2.5 flex-wrap">
          <div className="flex-1 min-w-60">
            <Input
              leftIcon={<Search className="size-4" />}
              type="text"
              aria-label="search collections"
              placeholder="Search collections..."
              value={search}
              onChange={(val) => setSearch(val)}
              className="h-9"
              classNames={{
                field: "rounded-lg bg-card border-border",
                input: "text-sm",
              }}
            />
          </div>
          <Select
            value={sort}
            onValueChange={(val) => setSort(val as SortOption)}
            className="w-36 shrink-0"
          >
            <SelectTrigger className="h-9 bg-card border-border">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SORT_OPTIONS).map(([value, option]) => (
                <SelectItem key={value} value={value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="mt-6">
        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CollectionCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="surface-panel rounded-xl p-8 flex flex-col items-center gap-3 text-center">
            <p className="font-medium">Failed to load collections</p>
            <p className="text-sm text-muted-foreground">{(error as Error)?.message || "Something went wrong"}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2">
              Retry
            </Button>
          </div>
        ) : collections.length === 0 ? (
          <div className="surface-panel rounded-xl p-10 flex flex-col items-center gap-3 text-center border-dashed">
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
              <Layers className="size-5 text-muted-foreground" />
            </div>
            <h3 className="font-semibold">No collections yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {debouncedSearch
                ? `No results for "${debouncedSearch}"`
                : "Collections keep your vault tidy. Create one for the topics you save most."}
            </p>
            {!debouncedSearch && (
              <Button size="sm" onClick={() => setOpen(true)} className="mt-1">
                New Collection
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {collections.map((collection) => (
                <CollectionCard collection={collection} key={collection.id} />
              ))}
            </div>
            {hasNextPage && (
              <div className="flex justify-center mt-6">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <CreateCollectionModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
