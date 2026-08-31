import RequireAuth from "@/components/auth/RequireAuth";
import Sidebar from "@/components/common/dashboard/Sidebar";
import {
  AnimatedSidebarProvider,
  AnimatedSidebarTrigger,
} from "@/components/motion/animated-sidebar";
import { PanelLeft } from "lucide-motion";
import { Suspense } from "react";
import ThemeToggle from "@/components/common/ThemeToggle";
export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#070d15]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      }
    >
      <RequireAuth>
        <AnimatedSidebarProvider>
          <div className="flex h-svh w-full overflow-hidden bg-background text-foreground">
            <Sidebar />

            <main className="relative min-w-0 flex-1 overflow-y-auto bg-background">
              {/* Fixed header */}
              <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/85 backdrop-blur px-4">
                <AnimatedSidebarTrigger className="text-foreground hover:bg-accent">
                  <PanelLeft className="size-5" />
                </AnimatedSidebarTrigger>
                <div className="ml-auto flex items-center gap-2">
                  <span className="hidden text-xs text-muted-foreground sm:inline">⌘K to search</span>
                  <ThemeToggle className="text-muted-foreground hover:text-foreground" />
                </div>
              </header>

              {/* Content */}
              <div className="min-w-0 flex-1 px-4 pb-28 pt-6 md:px-8 md:pb-16">{children}</div>
            </main>
          </div>
        </AnimatedSidebarProvider>
      </RequireAuth>
    </Suspense>
  );
}
