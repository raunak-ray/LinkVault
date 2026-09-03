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
import {
  Blocks,
  House,
  LogOut,
  PanelLeft,
  Settings,
  Star,
  Moon,
  Sun,
} from "lucide-motion";
import { Bookmark } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-provider";
import { useLogout } from "@/lib/auth/use-logout";
import { useTheme } from "@/components/provider/ThemeProvider";

const content = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: House,
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
  const { theme, toggle } = useTheme();

  return (
    <AnimatedSidebar
      ariaLabel="Dashboard navigation"
      collapsible="icon"
      panelClassName="border-sidebar-border bg-sidebar"
    >
      <AnimatedSidebarHeader className="px-4 pb-2 border-b border-sidebar-border h-14">
        <div className="flex gap-2 items-center justify-start">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Bookmark className="size-4" />
          </div>
          <h2 className="group-data-[state=collapsed]/sidebar:hidden font-semibold text-sidebar-foreground text-[15px] tracking-tight">
            Link Vault
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
                      icon={<Icon className="size-4 text-muted-foreground" />}
                      isActive={isActive}
                      href={item.href}
                      className="text-sidebar-foreground hover:bg-sidebar-accent data-[status=active]:bg-sidebar-accent data-[status=active]:font-medium"
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
              icon={
                theme === "dark" ? <Sun className="size-4 text-muted-foreground" /> : <Moon className="size-4 text-muted-foreground" />
              }
              onSelect={toggle}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </AnimatedSidebarMenuButton>
          </AnimatedSidebarMenuItem>
          <AnimatedSidebarMenuItem>
            {/*<AnimatedSidebarMenuButton
              icon={<Settings className="size-4 text-muted-foreground" />}
              onSelect={() => router.push("/dashboard/settings")}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              Settings
            </AnimatedSidebarMenuButton>*/}
          </AnimatedSidebarMenuItem>
          <AnimatedSidebarMenuItem>
            <AnimatedSidebarMenuButton
              icon={<LogOut className="size-4 text-muted-foreground" />}
              onSelect={() => logout()}
              className="text-sidebar-foreground hover:bg-destructive/10"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </AnimatedSidebarMenuButton>
          </AnimatedSidebarMenuItem>
        </AnimatedSidebarMenu>
      </AnimatedSidebarFooter>
    </AnimatedSidebar>
  );
}
