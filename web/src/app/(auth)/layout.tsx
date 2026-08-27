import GuestGuard from "@/components/auth/GuestGuard";
import { Suspense } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-grid-pattern opacity-60"
      />
      <div className="relative z-10">
        <Suspense
          fallback={
            <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            </div>
          }
        >
          <GuestGuard>{children}</GuestGuard>
        </Suspense>
      </div>
    </div>
  );
}
