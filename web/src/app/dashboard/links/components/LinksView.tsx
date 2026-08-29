"use client";

import { Button } from "@/components/motion/button/base";
import RecentLinkCard from "../../(dashboard)/components/RecentLinkCard";
import useGetAllLinks from "../hooks/useGetAllLinks";
import { useState } from "react";
import CreateLinkModal from "./CreateLinkModal";
import { Star } from "lucide-motion";

export default function LinksView() {
  const [open, setIsOpen] = useState<boolean>(false);
  const [isFavourite, setIsFavourite] = useState<boolean | undefined>(
    undefined
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllLinks({
    isFavourite,
  });

  const handleFavouriteClick = () => {
    setIsFavourite((prev) => (prev === true ? undefined : true));
  };

  const links = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-md md:text-xl lg:text-2xl font-bold text-white">
          All Links
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

      <div>
        <Button
          type="button"
          variant="outline"
          onClick={handleFavouriteClick}
          className={`bg-transparent text-white font-semibold rounded-md border-white/20
            hover:bg-blue-400/20 hover:border-blue-400/40
            ${isFavourite ? "bg-blue-400/20 border-blue-400/40" : ""}
          `}
        >
          <Star />
          Favourite
        </Button>
      </div>

      {links.map((link) => (
        <RecentLinkCard
          key={link.id}
          link={link}
        />
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

      <CreateLinkModal
        open={open}
        onOpenChange={setIsOpen}
      />
    </div>
  );
}
