"use client";

// Floating macOS-style navigation dock (beui dock) for small screens.
// Desktop keeps the full sidebar; this dock is mobile-only (md:hidden).

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Blocks, Bookmark, House, Plus, Star } from "lucide-react";
import { Dock, DockItem } from "@/components/motion/dock";
import CreateLinkModal from "@/app/dashboard/links/components/CreateLinkModal";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: House, href: "/dashboard" },
  { id: "links", label: "All Links", icon: Bookmark, href: "/dashboard/links" },
  {
    id: "favourites",
    label: "Favourites",
    icon: Star,
    href: "/dashboard/favourites",
  },
  {
    id: "collections",
    label: "Collections",
    icon: Blocks,
    href: "/dashboard/collections",
  },
] as const;

export default function MobileDock() {
  const router = useRouter();
  const pathname = usePathname();
  const [addOpen, setAddOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <>
      <nav
        aria-label="Quick navigation"
        className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-1/2 z-40 -translate-x-1/2 md:hidden"
      >
        <Dock size={44}>
          {NAV.slice(0, 2).map(({ id, icon: Icon, label, href }) => (
            <DockItem
              key={id}
              aria-label={label}
              active={isActive(href)}
              onClick={() => router.push(href)}
            >
              <Icon className="h-5 w-5" />
            </DockItem>
          ))}

          <DockItem
            aria-label="Add link"
            onClick={() => setAddOpen(true)}
            className="bg-primary text-primary-foreground"
          >
            <Plus className="h-5 w-5" />
          </DockItem>

          {NAV.slice(2).map(({ id, icon: Icon, label, href }) => (
            <DockItem
              key={id}
              aria-label={label}
              active={isActive(href)}
              onClick={() => router.push(href)}
            >
              <Icon className="h-5 w-5" />
            </DockItem>
          ))}
        </Dock>
      </nav>

      <CreateLinkModal open={addOpen} onOpenChange={setAddOpen} />
    </>
  );
}
