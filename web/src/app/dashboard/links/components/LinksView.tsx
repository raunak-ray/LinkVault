"use client";

import { Button } from "@/components/motion/button/base";
import RecentLinkCard from "../../(dashboard)/components/RecentLinkCard";
import useGetAllLinks from "../hooks/useGetAllLinks";
import { useState } from "react";
import CreateLinkModal from "./CreateLinkModal";

export default function LinksView() {
  const { data } = useGetAllLinks();
  const [open, setIsOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-md md:text-xl lg:text-2xl font-bold text-white">
          All Links
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-sm md:text-md lg:text-lg text-white/60">
            {data?.data.length} links in your vault.
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
      {data?.data.map((link) => (
        <RecentLinkCard key={link.id} link={link} />
      ))}
      <CreateLinkModal open={open} onOpenChange={setIsOpen} />
    </div>
  );
}
