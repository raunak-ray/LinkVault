"use client";

import {
    AnimatedSidebar,
    AnimatedSidebarClose,
    AnimatedSidebarContent,
    AnimatedSidebarFooter,
    AnimatedSidebarGroup,
    AnimatedSidebarGroupContent,
    AnimatedSidebarHeader,
    AnimatedSidebarMenu,
    AnimatedSidebarMenuButton,
    AnimatedSidebarMenuItem,
    AnimatedSidebarProvider,
    AnimatedSidebarTrigger,
} from "@/components/motion/animated-sidebar";
import { Blocks, ListCollapse, PanelLeft, Settings, Star } from "lucide-motion";
import { Bookmark, Home, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

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

    return (
        <AnimatedSidebarProvider>
            <div className="flex min-h-svh w-full">
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
                            <h2 className="group-data-[state=collapsed]/sidebar:hidden font-bold">LinkVault</h2>
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
                                    onSelect={() => router.push("/setting")}
                                    className="text-white hover:bg-[#334b5f3f]"
                                >
                                    Settings
                                </AnimatedSidebarMenuButton>
                            </AnimatedSidebarMenuItem>
                        </AnimatedSidebarMenu>
                    </AnimatedSidebarFooter>
                </AnimatedSidebar>

                {/* Main application area */}
                <main className="min-w-0 flex-1">
                    <header className="flex h-14 items-center px-4">
                        <AnimatedSidebarTrigger className="text-white hover:bg-white/10">
                            <PanelLeft className="size-5" />
                        </AnimatedSidebarTrigger>
                    </header>
                </main>
            </div>
        </AnimatedSidebarProvider>
    );
}
