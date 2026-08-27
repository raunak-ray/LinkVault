import Sidebar from "@/components/common/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="text-white flex min-h-screen">
      <div className="">
        <Sidebar />
      </div>
      <div className="flex-1">{children}</div>
    </main>
  );
}
