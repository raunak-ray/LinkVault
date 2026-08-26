import LandingNavbar from "@/components/common/landing/Navbar";

export default function LandingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="">
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute inset-0 grid"/>
                <div className="absolute left-1/2 top-[60%] h-[500px] w-full -translate-x-1/2 blur-5xl bg-white/10"/>
            </div>
            
            <div className="z-10 text-white">
                <LandingNavbar />
                {children}
            </div>
        </main>
    );
}
