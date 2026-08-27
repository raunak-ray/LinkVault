import LandingNavbar from "@/components/common/landing/Navbar";

export default function LandingLayout({
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

      <div className="relative z-10 text-white">
        <LandingNavbar />
        {children}
      </div>
    </div>
  );
}
