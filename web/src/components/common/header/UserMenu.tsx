"use client";

import { useAuth } from "@/lib/auth/auth-provider";
import { useLogout } from "@/lib/auth/use-logout";
import { useTheme } from "@/components/provider/ThemeProvider";
import { Button } from "@/components/motion/button/base";
import { User, Settings, LogOut, Moon, Sun } from "lucide-motion";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const { user } = useAuth();
  const { mutate: logout } = useLogout();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const initials = (user?.name || user?.email || "U").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <img src={user?.avatar} alt={user?.name} className="size-8 rounded-full" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-[var(--shadow-lift)]"
          >
            <div className="px-3 py-2 border-b border-border mb-1 flex items-center gap-2">
              <div className="bg-white/10 rounded-full p-1">
                <img src={user?.avatar} alt={user?.name} className="size-8 rounded-full" />
              </div>
              <div>
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <button onClick={() => { setOpen(false); router.push("/dashboard/settings"); }} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent">
              <Settings className="size-4" /> Settings
            </button>
            <button onClick={toggle} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent">
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />} {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
            <div className="my-1 h-px bg-border" />
            <button onClick={() => logout()} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10">
              <LogOut className="size-4" /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
