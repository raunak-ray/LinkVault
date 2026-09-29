import type { Metadata } from "next";

// The dashboard index is a client component, so its title lives here.
export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
