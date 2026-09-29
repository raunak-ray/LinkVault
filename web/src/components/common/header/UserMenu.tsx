"use client";

import { LogOut, Moon, Settings, Sun } from "lucide-motion";
import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/provider/ThemeProvider";
import { useAuth } from "@/lib/auth/auth-provider";
import { useLogout } from "@/lib/auth/use-logout";

export default function UserMenu() {
  const { user } = useAuth();
  const { mutate: logout } = useLogout();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const initials = (user?.name || user?.email || "U")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((v) => !v)}
        className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-secondary text-xs font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {user?.avatar ? (
          // biome-ignore lint/performance/noImgElement: remote avatar URL, next/image adds no value
          <img
            src={user.avatar}
            alt=""
            className="size-8 rounded-full object-cover"
          />
        ) : (
          <span aria-hidden>{initials}</span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Account"
            initial={{ opacity: 0, scale: 0.96, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-[var(--shadow-lift)]"
          >
            <div className="px-3 py-2 border-b border-border mb-1 flex items-center gap-2">
              <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-xs font-medium">
                {user?.avatar ? (
                  // biome-ignore lint/performance/noImgElement: remote avatar URL, next/image adds no value
                  <img
                    src={user.avatar}
                    alt=""
                    className="size-10 rounded-full object-cover"
                  />
                ) : (
                  <span aria-hidden>{initials}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              type="button"
              role="menuitem"
              aria-current={
                pathname === "/dashboard/settings" ? "page" : undefined
              }
              onClick={() => {
                setOpen(false);
                router.push("/dashboard/settings");
              }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
            >
              <Settings className="size-4" /> Settings
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                toggle();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
            >
              {theme === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}{" "}
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
            <div className="my-1 h-px bg-border" />
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"
            >
              <LogOut className="size-4" /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
