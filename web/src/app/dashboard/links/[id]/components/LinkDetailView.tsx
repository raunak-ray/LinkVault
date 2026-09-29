"use client";

import {
  ArrowLeft,
  Calendar,
  Copy,
  ExternalLink,
  Folder,
  Pencil,
  Star,
  Trash2,
} from "lucide-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/motion/button/base";
import { getFaviconUrl } from "@/lib/utils";
import DeleteLinkModal from "../../components/DeleteLinkModal";
import EditLinkModal from "../../components/EditLinkModal";
import useDeleteLink from "../../hooks/useDeleteLink";
import useGetLinkById from "../../hooks/useGetLinkById";
import useMarkFavourite from "../../hooks/useMarkFavourite";

export default function LinkDetailView({ id }: { id: string }) {
  const router = useRouter();
  const { data, isLoading, isError } = useGetLinkById(id);
  const link = data?.data;
  const { mutate: fav } = useMarkFavourite();
  const { mutate: del, isPending: isDeleting } = useDeleteLink();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 animate-pulse">
        <div className="h-6 w-24 bg-primary/10 rounded" />
        <div className="h-52 rounded-xl bg-primary/10" />
        <div className="h-24 rounded-xl bg-primary/10" />
      </div>
    );
  }
  if (isError || !link) {
    return (
      <div className="mx-auto max-w-3xl text-center py-16">
        <p className="font-medium">Link not found</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard/links")}
          className="mt-4"
        >
          Back to links
        </Button>
      </div>
    );
  }

  const og = link.metadata.ogImage;
  const favicon = link.metadata.favicon || getFaviconUrl(link.url);

  return (
    <div className="mx-auto max-w-3xl">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="-ml-2 mb-4"
      >
        <ArrowLeft className="size-4" /> Back
      </Button>

      {/* Hero with ogImage */}
      <div className="overflow-hidden rounded-xl border border-border surface-panel">
        {og ? (
          <div className="relative h-48 md:h-64 w-full overflow-hidden bg-muted">
            {/* biome-ignore lint/performance/noImgElement: remote third-party favicon, next/image adds no value here */}
            <img src={og} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex items-end gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-card p-1.5 shadow-sm">
                {/* biome-ignore lint/performance/noImgElement: remote third-party favicon, next/image adds no value here */}
                <img src={favicon} alt="" className="size-6 object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-base font-semibold text-white drop-shadow md:text-xl">
                  {link.title || "Untitled"}
                </h1>
                <p className="truncate text-xs text-white/80 md:text-sm">
                  {new URL(link.url).hostname}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-2 w-full bg-primary" />
        )}

        <div className="p-5 md:p-6 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold leading-tight break-words md:text-2xl">
                {link.title || link.url}
              </h1>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex max-w-full items-center gap-1.5 text-sm text-primary hover:underline mt-1"
              >
                <span className="truncate">{link.url}</span>{" "}
                <ExternalLink className="size-3.5 shrink-0" />
              </a>
              {link.metadata.description && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {link.metadata.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={link.isFavourite ? "primary" : "outline"}
              size="sm"
              onClick={() =>
                fav({ id: link.id, isFavourite: !link.isFavourite })
              }
              className="gap-1.5"
            >
              <Star
                className={`size-4 ${link.isFavourite ? "fill-current" : ""}`}
              />{" "}
              {link.isFavourite ? "Favourited" : "Favourite"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditOpen(true)}
              className="gap-1.5"
            >
              <Pencil className="size-4" /> Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await navigator.clipboard.writeText(link.url);
              }}
              className="gap-1.5"
            >
              <Copy className="size-4" /> Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteOpen(true)}
              disabled={isDeleting}
              className="gap-1.5 text-destructive border-destructive/20 hover:bg-destructive/10"
            >
              <Trash2 className="size-4" /> Delete
            </Button>
          </div>

          <div className="grid gap-3 rounded-xl border border-border bg-muted/20 p-4 text-sm md:grid-cols-2">
            <div className="flex items-center gap-2">
              <Folder className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Collection</span>
              <Link
                href={`/dashboard/collections/${link.collection.id}`}
                className="ml-auto rounded-full bg-card border border-border px-2.5 py-1 text-xs font-medium hover:bg-accent"
              >
                {link.collection.name}
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Saved</span>
              <span className="ml-auto text-xs">
                {new Date(link.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Updated</span>
              <span className="ml-auto text-xs">
                {new Date(link.updatedAt).toLocaleString()}
              </span>
            </div>
          </div>

          {og && (
            <div className="overflow-hidden rounded-lg border border-border">
              {/* biome-ignore lint/performance/noImgElement: remote third-party favicon, next/image adds no value here */}
              <img
                src={og}
                alt="Preview"
                className="w-full object-cover max-h-[420px]"
              />
            </div>
          )}
        </div>
      </div>

      <EditLinkModal open={editOpen} onOpenChange={setEditOpen} link={link} />
      <DeleteLinkModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() =>
          del(link.id, {
            onSuccess: () => router.push("/dashboard/links"),
          })
        }
        isPending={isDeleting}
        linkLabel={link.title || link.url}
        collectionName={link.collection.name}
      />
    </div>
  );
}
