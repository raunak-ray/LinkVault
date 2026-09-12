import LandingNavbar from "@/components/common/landing/Navbar";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-grid-pattern opacity-25 dark:opacity-60"
      />

      <div className="relative z-10">
        <LandingNavbar />
        {children}
      </div>
    </div>
  );
}
