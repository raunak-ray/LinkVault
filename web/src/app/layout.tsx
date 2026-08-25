import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";
import LandingNavbar from "@/components/common/landing/Navbar";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Your App",
  description: "Your application description",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#333]">
        <LandingNavbar />
        {children}
      </body>
    </html>
  );
}