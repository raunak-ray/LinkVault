import RequireAuth from "@/components/auth/RequireAuth";
import Sidebar from "@/components/common/dashboard/Sidebar";
import {
  AnimatedSidebarProvider,
  AnimatedSidebarTrigger,
} from "@/components/motion/animated-sidebar";
import { PanelLeft } from "lucide-motion";
import { Suspense } from "react";
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
          <div className="flex h-svh w-full overflow-hidden bg-[#0f1218] text-white">
            <Sidebar />

            <main className="relative min-w-0 flex-1 overflow-y-auto">
              {/* Fixed header */}
              <header className="sticky top-0 z-50 flex h-15 shrink-0 items-center border-b border-white/10 bg-[#0f1218] px-4">
                <AnimatedSidebarTrigger className="text-white hover:bg-white/10">
                  <PanelLeft className="size-5" />
                </AnimatedSidebarTrigger>
              </header>

              {/* Content */}
              <div className="p-4 md:p-6">{children}</div>
            </main>
          </div>
        </AnimatedSidebarProvider>
      </RequireAuth>
    </Suspense>
  );
}
