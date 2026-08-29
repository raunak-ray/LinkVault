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
}: { showSort?: boolean, showOnlyFavourite?: boolean }) {
  const [open, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<SortOptions>("newest");
  const [isFavourite, setIsFavourite] = useState<boolean | undefined>(
    undefined,
  );

  const debouncedSearch = useDebounce(search);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetAllLinks({
      isFavourite: showOnlyFavourite ? true : isFavourite,
      search:
        debouncedSearch.trim().length > 0 ? debouncedSearch.trim() : undefined,
      sort: SORT_OPTIONS[sort].value,
    });

  const handleFavouriteClick = () => {
    setIsFavourite((prev) => (prev === true ? undefined : true));
  };

  const links = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-md md:text-xl lg:text-2xl font-bold text-white">
          {showOnlyFavourite ?  "Favourite Links" : "All Links"}
        </h1>

        <div className="flex items-center justify-between">
          <p className="text-sm md:text-md lg:text-lg text-white/60">
            {links.length} links in your vault.
          </p>

          <Button
            type="button"
            variant="primary"
            onClick={() => setIsOpen(true)}
            className="bg-blue-900/80 font-semibold rounded-lg hover:bg-blue-900/40 cursor-pointer"
          >
            Add Link
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Search */}
        <div className="flex-1 min-w-55">
          <Input
            leftIcon={<Search className="size-4.5" />}
            type="text"
            aria-label="search input"
            placeholder="Search by title, url..."
            className="
              w-full
              h-10
              bg-transparent
              border-white/15
              text-white
              placeholder:text-white/40
              rounded-md
              transition-colors
              hover:border-white/25
            "
            value={search}
            onChange={(val) => setSearch(val)}
          />
        </div>

        {/* Sort */}
        {showSort && (
          <Select
            value={sort}
            onValueChange={(val) => setSort(val as SortOptions)}
            className="w-35 shrink-0"
          >
            <SelectTrigger
              className="
              h-10
              bg-transparent
              text-white
              font-medium
              border-white/15
              rounded-md
              transition-colors
              hover:border-blue-400/60
              hover:bg-blue-400/5
              focus-visible:border-blue-400
              focus-visible:ring-2
              focus-visible:ring-blue-400/15
            "
            >
              <SelectValue placeholder="Sort" />
            </SelectTrigger>

            <SelectContent
              className="
            bg-[#252e37]
            text-white
            border-white/10
            rounded-md
            shadow-xl
          "
            >
              {Object.entries(SORT_OPTIONS).map(([value, option]) => (
                <SelectItem
                  key={value}
                  value={value}
                  className="
                  cursor-pointer
                  rounded-md
                  text-white/70
                  hover:bg-blue-400/10
                  hover:text-blue-300
                  focus:bg-blue-400/10
                  focus:text-blue-300
                "
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Favourite */}
        {!showOnlyFavourite && (
          <Button
            type="button"
            variant="outline"
            onClick={handleFavouriteClick}
            className={`
            h-10
            shrink-0
            px-3.5
            gap-2
            font-medium
            rounded-md
            border-white/15
            transition-colors
            hover:bg-blue-400/10
            hover:border-blue-400/60
            ${isFavourite
                ? "bg-blue-400/15 border-blue-400/60 text-blue-300"
                : "bg-transparent text-white"
              }
          `}
          >
            <Star className="size-4" />
            Favourite
          </Button>
        )}
      </div>

      {links.map((link) => (
        <RecentLinkCard key={link.id} link={link} />
      ))}

      {hasNextPage && (
        <Button
          type="button"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="border border-white/20 bg-transparent mx-auto"
        >
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </Button>
      )}

      <CreateLinkModal open={open} onOpenChange={setIsOpen} />
    </div>
  );
}
