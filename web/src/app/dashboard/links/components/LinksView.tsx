"use client";

import { Button } from "@/components/motion/button/base";
import RecentLinkCard from "../../(dashboard)/components/RecentLinkCard";
import useGetAllLinks from "../hooks/useGetAllLinks";
import { useState } from "react";
import CreateLinkModal from "./CreateLinkModal";
import { Search, Star } from "lucide-motion";
import { Input } from "@/components/motion/input";
import useDebounce from "@/lib/hooks/useDebounce";
import { SORT_OPTIONS, SortOptions } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/motion/select";

export default function LinksView({
  showSort = true,
  showOnlyFavourite = false,
  showAddButton = true,
}: { showSort?: boolean; showOnlyFavourite?: boolean; showAddButton?: boolean }) {
  const [open, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<SortOptions>("newest");
  const [isFavourite, setIsFavourite] = useState<boolean | undefined>(undefined);

  const debouncedSearch = useDebounce(search);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGetAllLinks({
    isFavourite: showOnlyFavourite ? true : isFavourite,
    search: debouncedSearch.trim().length > 0 ? debouncedSearch.trim() : undefined,
    sort: SORT_OPTIONS[sort].value,
  });

  const handleFavouriteClick = () => {
    setIsFavourite((prev) => (prev === true ? undefined : true));
  };

  const links = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{showOnlyFavourite ? "Favourite Links" : "All Links"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{isLoading ? "Loading..." : `${links.length} links in your vault.`}</p>
        </div>
        {showAddButton && (
          <Button type="button" size="sm" onClick={() => setIsOpen(true)} className="gap-2">
            Add Link
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex-1 min-w-60">
          <Input
            leftIcon={<Search className="size-4" />}
            type="text"
            aria-label="search input"
            placeholder="Search by title, url..."
            value={search}
            onChange={(val) => setSearch(val)}
            classNames={{ field: "rounded-lg bg-card border-border", input: "text-sm" }}
          />
        </div>

        {showSort && (
          <Select value={sort} onValueChange={(val) => setSort(val as SortOptions)} className="w-36 shrink-0">
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
        )}

        {!showOnlyFavourite && (
          <Button
            type="button"
            variant={isFavourite ? "primary" : "outline"}
            size="md"
            onClick={handleFavouriteClick}
            className="gap-2 rounded-md"
          >
            <Star className="size-4" />
            Favourite
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="surface-panel rounded-xl p-4 h-28 animate-pulse" />
          ))}
        </div>
      ) : links.length === 0 ? (
        <div className="surface-panel rounded-xl p-10 text-center border-dashed">
          <p className="font-medium">No links found</p>
          <p className="text-sm text-muted-foreground mt-1">{debouncedSearch ? `No results for "${debouncedSearch}"` : "Save your first link to get started."}</p>
          {showAddButton && (
            <Button size="sm" onClick={() => setIsOpen(true)} className="mt-4">
              Add Link
            </Button>
          )}
        </div>
      ) : (
        <>
          {links.map((link) => (
            <RecentLinkCard key={link.id} link={link} />
          ))}

          {hasNextPage && (
            <Button type="button" variant="outline" size="sm" onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="mx-auto">
              {isFetchingNextPage ? "Loading..." : "Load More"}
            </Button>
          )}
        </>
      )}

      <CreateLinkModal open={open} onOpenChange={setIsOpen} />
    </div>
  );
}
