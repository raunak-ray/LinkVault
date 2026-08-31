"use client";

import { CollectionResponse } from "../../(dashboard)/types";
import { DynamicIcon } from "lucide-react/dynamic";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/motion/button/base";
import { Ellipsis, Pencil, Trash2 } from "lucide-motion";
import useDeleteCollection from "../hooks/useDeleteCollection";
import EditCollectionModal from "./EditCollectionModal";
import { useQueryClient } from "@tanstack/react-query";
import { getFaviconUrl } from "@/lib/utils";

const FALLBACK_COLORS = ["#6366F1", "#14b8a6", "#22c55e", "#f59e0b", "#f97316", "#ec4899", "#06b6d4"];

function getFallbackColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return FALLBACK_COLORS[hash % FALLBACK_COLORS.length];
}

function formatDate(d: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(d));
}

function useIsHoverCapable() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover)").matches;
}

export default function CollectionCard({ collection }: { collection: CollectionResponse }) {
  const color = collection.color || getFallbackColor(collection.name);
  const iconName = (collection.icon as string) || "folder";
  const preview = collection.previewLinks ?? [];
  const linkCount = collection.linkCount ?? preview.length;
  const remaining = Math.max(0, linkCount - preview.length);

  const [hover, setHover] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduce = useReducedMotion();
  const queryClient = useQueryClient();
  const { mutate: deleteCollection } = useDeleteCollection();

  const spring = { type: "spring" as const, stiffness: 320, damping: 26 };

  const handleDelete = () => {
    setMenuOpen(false);
    if (!confirm(`Delete collection "${collection.name}"? This cannot be undone.`)) return;
    deleteCollection(collection.id, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["collections"] }),
    });
  };

  return (
    <>
      <div
        className="group relative pt-3"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
      >
        {/* behind layers */}
        <motion.div
          aria-hidden
          animate={
            reduce
              ? {}
              : hover
                ? { rotate: -3.5, y: -10, x: -6 }
                : { rotate: -1.6, y: -6, x: 0 }
          }
          transition={spring}
          className="absolute inset-x-3 top-3 h-24 origin-bottom rounded-xl border border-border"
          style={{ backgroundColor: `color-mix(in oklab, ${color} 10%, var(--card))` }}
        />
        <motion.div
          aria-hidden
          animate={
            reduce
              ? {}
              : hover
                ? { rotate: 2.5, y: -5, x: 6 }
                : { rotate: 1.2, y: -3, x: 0 }
          }
          transition={spring}
          className="absolute inset-x-2 top-3 h-24 origin-bottom rounded-xl border border-border"
          style={{ backgroundColor: `color-mix(in oklab, ${color} 16%, var(--card))` }}
        />

        <motion.div
          animate={reduce ? {} : { y: hover ? -2 : 0 }}
          transition={spring}
          className="surface-panel relative rounded-xl p-4 shadow-[var(--shadow-lift)]"
        >
          <span aria-hidden className="absolute inset-x-4 top-0 h-px rounded-full" style={{ backgroundColor: color }} />

          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="flex size-9 items-center justify-center rounded-lg border border-border shrink-0"
                style={{ backgroundColor: `color-mix(in oklab, ${color} 14%, transparent)` }}
              >
                <DynamicIcon name={iconName as never} className="size-[18px]" style={{ color }} />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-card-foreground">{collection.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {linkCount} {linkCount === 1 ? "link" : "links"} · {formatDate(collection.updatedAt ?? collection.createdAt)}
                </p>
              </div>
            </div>

            <div className="relative z-20">
              <Button
                variant="ghost"
                size="icon"
                className={`size-7 text-muted-foreground transition-opacity ${menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100"}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMenuOpen((v) => !v);
                }}
                aria-label="Collection actions"
              >
                <Ellipsis className="size-4" />
              </Button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} aria-hidden />
                  <div className="absolute right-0 top-8 z-20 w-48 rounded-xl border border-border bg-popover p-1 shadow-[var(--shadow-lift)]">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMenuOpen(false);
                        setEditOpen(true);
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                    >
                      <Pencil className="size-4" /> Edit collection
                    </button>
                    <div className="my-1 h-px bg-border" />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete();
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" /> Delete collection
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-3 space-y-1">
            {preview.length ? (
              preview.slice(0, 3).map((link) => (
                <div key={link.id} className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={link.favicon || getFaviconUrl(link.url)}
                    alt=""
                    loading="lazy"
                    className="size-4 shrink-0 rounded-sm border border-border/50 bg-card object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <span className="truncate">{link.title || link.url.replace(/^https?:\/\//, "")}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">Empty deck — nothing saved yet.</p>
            )}
            {remaining > 0 && <p className="pt-0.5 text-xs text-muted-foreground/80">+{remaining} more</p>}
          </div>

          {/* full card link */}
          <Link
            href={`/dashboard/collections/${collection.id}`}
            aria-label={`Open ${collection.name}`}
            className="absolute inset-0 z-10 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          />
        </motion.div>
      </div>

      <EditCollectionModal open={editOpen} onOpenChange={setEditOpen} collection={collection} />
    </>
  );
}

export function CollectionCardSkeleton() {
  return (
    <div className="surface-panel rounded-xl p-4">
      <div className="animate-pulse bg-primary/10 size-9 rounded-lg" />
      <div className="animate-pulse rounded-md bg-primary/10 mt-3 h-4 w-24" />
      <div className="animate-pulse rounded-md bg-primary/10 mt-2 h-3 w-16" />
    </div>
  );
}
