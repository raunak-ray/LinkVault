"use client";

import { Button } from "@/components/ui/button";
import { Cross, Menu, Save, X } from "lucide-motion";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  { id: "home", label: "Home", href: "#" },
  { id: "features", label: "Features", href: "#" },
  { id: "how-it-works", label: "How it works", href: "#" },
  { id: "faq", label: "FAQ", href: "#" },
];

export default function LandingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="sticky top-5 z-50 mx-auto w-full max-w-lg px-4 md:max-w-2xl lg:max-w-5xl">
      <div className="relative">
        {/* Navbar */}
        <header className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white backdrop-blur-2xl">
          <nav className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="#home"
              className="flex items-center justify-center gap-2"
            >
              <div className="rounded-full bg-blue-400 p-2 text-black">
                <Save className="h-5 w-5" />
              </div>

              <h2 className="font-mono text-md md:text-lg font-bold">
                LinkVault
              </h2>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden items-center gap-2 md:flex">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="rounded-full border border-transparent text-gray-300 hover:border-blue-500/40 hover:bg-blue-500/20 hover:text-white"
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2">
              {/* CTA */}
              <Button className="rounded-full text-sm md:text-md bg-blue-500/60 font-bold hover:bg-blue-500/80">
                <Link href="/register">Get Started</Link>
              </Button>

              {/* Mobile trigger */}
              <Button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/10 hover:text-white md:hidden"
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </nav>
        </header>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div
            className="
              absolute
              inset-x-4
              top-[calc(100%+1rem)]
              md:hidden
            "
          >
            <div
              className="
                rounded-3xl
                border border-white/20
                bg-black/20
                p-2
                shadow-2xl
                backdrop-blur-2xl
              "
            >
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="
                      w-full
                      justify-start
                      rounded-2xl
                      px-4
                      py-3
                      text-gray-300
                      hover:bg-blue-500/20
                      hover:text-white
                    "
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
