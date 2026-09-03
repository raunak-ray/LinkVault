import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkResponse } from "../types";
import Link from "next/link";
import { ExternalLink, Star, Ellipsis, Pencil, Trash2, Copy, ExternalLink as LinkIcon } from "lucide-motion";
import { Button } from "@/components/motion/button/base";
import useMarkFavourite from "../../links/hooks/useMarkFavourite";
import useDeleteLink from "../../links/hooks/useDeleteLink";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EditLinkModal from "../../links/components/EditLinkModal";
import { getFaviconUrl } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export default function RecentLinkCard({ link }: { link: LinkResponse }) {
  const date = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(link.createdAt));

  const { mutate: markFavourite, isPending } = useMarkFavourite();
  const { mutate: deleteLink } = useDeleteLink();
  const isFavourite = link.isFavourite;
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm(`Delete "${link.title || link.url}"?`)) return;
    deleteLink(link.id);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link.url);
    setMenuOpen(false);
  };

  return (
    <>
      <Card className="group surface-panel cursor-pointer transition-all hover:shadow-[var(--shadow-lift)]">
        <CardHeader className="pb-3">
          <CardTitle className="grid grid-cols-[40px_1fr_auto] items-start gap-3">
            <Link href={`/dashboard/links/${link.id}`} className="rounded-full border border-border bg-card p-2 hover:bg-accent transition-colors">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={(link.metadata.favicon as string) || getFaviconUrl(link.url)}
                width={28}
                height={28}
                alt=""
                className="size-5 object-contain"
                onError={(e) => ((e.target as HTMLImageElement).src = getFaviconUrl(link.url))}
              />
            </Link>

            <Link href={`/dashboard/links/${link.id}`} className="min-w-0 hover:underline decoration-muted-foreground/30">
              <h1 className="truncate text-sm font-semibold leading-tight md:text-[15px]">{link.title || link.url.replace(/^https?:\/\//, "")}</h1>
              <p className="truncate text-xs text-muted-foreground">{link.url.replace(/^https?:\/\//, "")}</p>
            </Link>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isPending}
                aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
                onClick={() => markFavourite({ id: link.id, isFavourite: !isFavourite })}
                className="size-7"
              >
                <Star className={`size-4 ${isFavourite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
              </Button>

              <Popover open={menuOpen} onOpenChange={setMenuOpen}>
                <PopoverTrigger
                  render={
                    <Button type="button" variant="ghost" size="icon" className="size-7">
                      <Ellipsis className="size-4" />
                    </Button>
                  }
                />
                <PopoverContent align="end" sideOffset={8} className="w-48 p-1">
                  <button onClick={() => { setMenuOpen(false); router.push(`/dashboard/links/${link.id}`); }} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent">
                    <LinkIcon className="size-4" /> Open details
                  </button>
                  <button onClick={() => { setMenuOpen(false); window.open(link.url, "_blank"); }} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent">
                    <ExternalLink className="size-4" /> Open link
                  </button>
                  <button onClick={handleCopy} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent">
                    <Copy className="size-4" /> Copy link
                  </button>
                  <button onClick={() => { setMenuOpen(false); setEditOpen(true); }} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent">
                    <Pencil className="size-4" /> Edit
                  </button>
                  <div className="my-1 h-px bg-border" />
                  <button onClick={handleDelete} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10">
                    <Trash2 className="size-4" /> Delete
                  </button>
                </PopoverContent>
              </Popover>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-[40px_1fr] gap-3 pt-0">
          <div />
          <div className="space-y-2">
            {link.metadata.description && <p className="line-clamp-2 text-sm text-muted-foreground">{link.metadata.description}</p>}

            <div className="flex items-center gap-2 flex-wrap">
              <Link href={link.url} target="_blank" rel="noopener noreferrer" className="group/link inline-flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:underline">
                <span className="truncate max-w-[220px]">{link.url}</span>
                <ExternalLink className="size-3 shrink-0 opacity-0 transition-opacity group-hover/link:opacity-100" />
              </Link>

              <Link href={`/dashboard/collections/${link.collection.id}`} className="shrink-0">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-xs transition-colors hover:bg-accent">
                  <span className="size-1.5 rounded-full bg-primary" />
                  {link.collection.name}
                </span>
              </Link>

              <p className="ml-auto shrink-0 text-xs text-muted-foreground/70">{date}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditLinkModal open={editOpen} onOpenChange={setEditOpen} link={link} />
    </>
  );
}
