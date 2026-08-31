"use client";

import useGetCollectionById from "../hooks/useGetCollectionById";
import useGetAllLinks from "../../links/hooks/useGetAllLinks";
import { Button } from "@/components/motion/button/base";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Pencil, Trash2, Link2, Search } from "lucide-motion";
import { DynamicIcon } from "lucide-react/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useDebounce from "@/lib/hooks/useDebounce";
import { Input } from "@/components/motion/input";
import RecentLinkCard from "../../(dashboard)/components/RecentLinkCard";
import EditCollectionModal from "./EditCollectionModal";
import useDeleteCollection from "../hooks/useDeleteCollection";
import { useQueryClient } from "@tanstack/react-query";

export default function CollectionDetailView({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: collectionRes, isLoading, isError } = useGetCollectionById(id);
  const collection = collectionRes?.data;

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [editOpen, setEditOpen] = useState(false);
  const { mutate: deleteCollection, isPending: isDeleting } = useDeleteCollection();

  const {
    data: linksData,
    isLoading: linksLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllLinks({
    collectionId: id,
    search: debouncedSearch.trim() ? debouncedSearch.trim() : undefined,
    sort: "createdAt:desc",
  });

  const links = linksData?.pages.flatMap((p) => p.data) ?? [];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl flex flex-col gap-6 animate-pulse">
        <div className="h-6 w-32 bg-primary/10 rounded" />
        <div className="h-32 surface-panel rounded-xl" />
        <div className="h-10 bg-primary/5 rounded-lg w-full" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 surface-panel rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !collection) {
    return (
      <div className="mx-auto max-w-5xl flex flex-col gap-4">
        <Button variant="ghost" onClick={() => router.back()} className="w-fit">
          <ArrowLeft className="size-4" /> Back
        </Button>
        <Card className="surface-panel p-8 text-center">
          <p className="font-medium">Collection not found</p>
          <p className="text-muted-foreground text-sm mt-1">It may have been deleted.</p>
          <Button variant="outline" onClick={() => router.push("/dashboard/collections")} className="mt-4">
            Go to collections
          </Button>
        </Card>
      </div>
    );
  }

  const color = collection.color || "#6366F1";
  const iconName = (collection.icon as string) || "folder";

  const handleDelete = () => {
    if (!confirm(`Delete collection "${collection.name}"? Links will remain but become unassigned? This cannot be undone.`)) return;
    deleteCollection(collection.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["collections"] });
        router.push("/dashboard/collections");
      },
    });
  };

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-6">
      <Button variant="ghost" onClick={() => router.back()} className="w-fit -ml-2">
        <ArrowLeft className="size-4" /> Back to collections
      </Button>

      {/* Collection header card - inspired by lovable but keep vault taste */}
      <Card className="relative overflow-hidden surface-panel">
        <div className="h-1 w-full" style={{ backgroundColor: color }} />
        <div className="p-5 md:p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-4 items-start min-w-0">
              <div
                className="size-12 rounded-2xl border border-border flex items-center justify-center shrink-0"
                style={{ backgroundColor: `color-mix(in oklab, ${color} 14%, transparent)`, borderColor: `color-mix(in oklab, ${color} 25%, var(--border))` }}
              >
                <DynamicIcon name={iconName as never} className="size-6" style={{ color }} />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-bold truncate">{collection.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {collection.linkCount ?? links.length} {collection.linkCount === 1 ? "link" : "links"} · Updated{" "}
                  {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
                    new Date(collection.updatedAt ?? collection.createdAt),
                  )}
                </p>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => setEditOpen(true)} className="gap-1.5">
                <Pencil className="size-3.5" /> Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="gap-1.5 text-destructive border-destructive/20 hover:bg-destructive/10"
              >
                <Trash2 className="size-3.5" /> {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Search */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            leftIcon={<Search className="size-4" />}
            placeholder="Search in this collection..."
            value={search}
            onChange={(v) => setSearch(v)}
            className="h-9"
            classNames={{ field: "rounded-lg bg-card border-border" }}
          />
        </div>
      </div>

      {/* Links list */}
      {linksLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 surface-panel rounded-xl animate-pulse" />
          ))}
        </div>
      ) : links.length === 0 ? (
        <Card className="surface-panel border-dashed p-10 flex flex-col items-center gap-3">
          <div className="size-12 rounded-2xl bg-muted border border-border flex items-center justify-center">
            <Link2 className="size-6 text-muted-foreground" />
          </div>
          <p className="font-medium">No links in this collection</p>
          <p className="text-muted-foreground text-sm text-center">
            {debouncedSearch ? `No results for "${debouncedSearch}"` : "Add links and assign them to this collection."}
          </p>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {links.map((link) => (
              <RecentLinkCard key={link.id} link={link} />
            ))}
          </div>

          {hasNextPage && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="mx-auto"
            >
              {isFetchingNextPage ? "Loading..." : "Load more"}
            </Button>
          )}
        </>
      )}

      <EditCollectionModal open={editOpen} onOpenChange={setEditOpen} collection={collection} />
    </div>
  );
}
