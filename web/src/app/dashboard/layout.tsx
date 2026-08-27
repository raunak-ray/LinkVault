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
          <div className="flex min-h-svh w-full bg-[#070d15] text-white">
            <Sidebar />
            <main className="min-w-0 flex-1">
              <header className="flex h-14 items-center px-4 border-b border-white/10">
                <AnimatedSidebarTrigger className="text-white hover:bg-white/10">
                  <PanelLeft className="size-5" />
                </AnimatedSidebarTrigger>
              </header>
              <div className="p-4 md:p-6">{children}</div>
            </main>
          </div>
        </AnimatedSidebarProvider>
      </RequireAuth>
    </Suspense>
  );
}
