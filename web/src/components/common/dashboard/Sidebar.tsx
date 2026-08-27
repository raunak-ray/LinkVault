"use client";

import {
  AnimatedSidebar,
  AnimatedSidebarContent,
  AnimatedSidebarFooter,
  AnimatedSidebarGroup,
  AnimatedSidebarGroupContent,
  AnimatedSidebarHeader,
  AnimatedSidebarMenu,
  AnimatedSidebarMenuButton,
  AnimatedSidebarMenuItem,
} from "@/components/motion/animated-sidebar";
import { Blocks, LogOut, PanelLeft, Settings, Star } from "lucide-motion";
import { Bookmark, Home } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-provider";
import { useLogout } from "@/lib/auth/use-logout";

const content = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
  },
  {
    id: "links",
    label: "All Links",
    icon: Bookmark,
    href: "/dashboard/links",
  },
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
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  return (
    <AnimatedSidebar
      ariaLabel="Dashboard navigation"
      collapsible="icon"
      panelClassName="border-white/20 bg-[#13171d]"
    >
      <AnimatedSidebarHeader className="px-4 pb-2">
        <div className="flex gap-2 items-center justify-start">
          <div className="rounded-full bg-blue-400/20 p-2 border-white/10 border">
            <Bookmark className="size-5 " />
          </div>
          <h2 className="group-data-[state=collapsed]/sidebar:hidden font-bold">
            LinkVault
          </h2>
        </div>
      </AnimatedSidebarHeader>

      <AnimatedSidebarContent className="px-2 pt-1">
        <AnimatedSidebarGroup>
          <AnimatedSidebarGroupContent>
            <AnimatedSidebarMenu>
              {content.map((item) => {
                const Icon = item.icon;

                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);

                return (
                  <AnimatedSidebarMenuItem key={item.id}>
                    <AnimatedSidebarMenuButton
                      icon={<Icon className="size-4" />}
                      isActive={isActive}
                      href={item.href}
                      className="
                            text-white
                            hover:bg-[#334b5f3f]
                          "
                    >
                      {item.label}
                    </AnimatedSidebarMenuButton>
                  </AnimatedSidebarMenuItem>
                );
              })}
            </AnimatedSidebarMenu>
          </AnimatedSidebarGroupContent>
        </AnimatedSidebarGroup>
      </AnimatedSidebarContent>
      <AnimatedSidebarFooter>
        <AnimatedSidebarMenu>
          <AnimatedSidebarMenuItem>
            <AnimatedSidebarMenuButton
              icon={<Settings className="size-4" />}
              onSelect={() => router.push("/settings")}
              className="text-white hover:bg-[#334b5f3f]"
            >
              Settings
            </AnimatedSidebarMenuButton>
          </AnimatedSidebarMenuItem>
          <AnimatedSidebarMenuItem>
            <AnimatedSidebarMenuButton
              icon={<LogOut className="size-4" />}
              onSelect={() => logout()}
              className="text-white hover:bg-red-500/20"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </AnimatedSidebarMenuButton>
          </AnimatedSidebarMenuItem>
          {user && (
            <div className="px-2 py-3 group-data-[state=collapsed]/sidebar:hidden">
              <p className="text-xs text-white/60 truncate">{user.name}</p>
              <p className="text-[11px] text-white/40 truncate">{user.email}</p>
            </div>
          )}
        </AnimatedSidebarMenu>
      </AnimatedSidebarFooter>
    </AnimatedSidebar>
  );
}
