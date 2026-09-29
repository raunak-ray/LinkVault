"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Monitor, Moon, Sun } from "lucide-motion";
import { type ComponentType, useEffect, useState } from "react";
import { Button } from "@/components/motion/button/base";
import { Input } from "@/components/motion/input";
import { useTheme } from "@/components/provider/ThemeProvider";
import { getErrorMessage } from "@/lib/api/get-error-message";
import { useAuth } from "@/lib/auth/auth-provider";
import { useLogout } from "@/lib/auth/use-logout";
import { useToast } from "@/lib/toast/toast-provider";
import { userApi } from "../api/user.api";
import DeleteAccountModal from "./DeleteAccountModal";

type Tab = "profile" | "appearance" | "account";

export default function SettingsView() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [tab, setTab] = useState<Tab>("profile");
  // Seed from the signed-in user, but keep the field in sync when `/auth/me`
  // resolves after mount, otherwise the form opens empty for a moment.
  const [name, setName] = useState(user?.name ?? "");
  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);
  const queryClient = useQueryClient();
  const { mutate: logout } = useLogout();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { toast } = useToast();

  const updateMut = useMutation({
    mutationFn: () => userApi.updateMe({ name: name.trim() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("Profile updated", "Your name was saved.");
    },
    onError: (e) => toast.error("Couldn't save profile", getErrorMessage(e)),
  });

  const deleteMut = useMutation({
    mutationFn: () => userApi.deleteMe(),
    onSuccess: async () => {
      toast.success("Account deleted", "Your vault was removed.");
      await logout();
    },
    onError: (e) => toast.error("Couldn't delete account", getErrorMessage(e)),
  });

  const themes: {
    value: typeof theme;
    label: string;
    icon: ComponentType<{ className?: string }>;
  }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-xl font-semibold md:text-2xl">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your vault and how it looks.
      </p>

      {/* Tabs - beui style */}
      <div className="mt-6 flex w-full gap-1 overflow-x-auto rounded-lg bg-muted p-1 sm:w-fit">
        {(["profile", "appearance", "account"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={tab === t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors sm:flex-none sm:px-4 ${tab === t ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="surface-panel max-w-xl space-y-5 rounded-xl p-4 mt-6 sm:p-5">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-secondary text-lg font-medium">
              {(user?.name || "U").slice(0, 2).toUpperCase()}
            </div>
            <Button variant="outline" size="sm" disabled>
              Change avatar
            </Button>
          </div>

          <div className="space-y-2">
            <label htmlFor="p-name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="p-name"
              value={name}
              onChange={(v) => setName(v)}
              placeholder="Your name"
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="p-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="p-email"
              value={user?.email ?? ""}
              readOnly
              className="h-9 bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email addresses can&apos;t be changed yet.
            </p>
          </div>

          <Button
            onClick={() => updateMut.mutate()}
            disabled={updateMut.isPending || !name.trim()}
          >
            {updateMut.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}

      {tab === "appearance" && (
        <div className="surface-panel max-w-xl rounded-xl p-4 mt-6 sm:p-5">
          <h2 className="text-sm font-semibold">Theme</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose how LinkVault looks on this device.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
            {themes.map((t) => {
              const Icon = t.icon;
              const active = theme === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTheme(t.value)}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-xs transition-colors hover:bg-accent sm:p-4 sm:text-sm ${active ? "border-primary bg-accent text-accent-foreground" : "border-border"}`}
                >
                  <Icon className="size-5" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {tab === "account" && (
        <div className="mt-6 space-y-4 max-w-xl">
          <div className="surface-panel space-y-3 rounded-xl p-4 text-sm sm:p-5">
            <h2 className="text-sm font-semibold">Account information</h2>
            <div className="flex flex-wrap justify-between gap-x-3 gap-y-1 border-t border-border pt-3">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium break-all">{user?.email}</span>
            </div>
            <div className="flex flex-wrap justify-between gap-x-3 gap-y-1 border-t border-border pt-3">
              <span className="text-muted-foreground">Account created</span>
              <span>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "—"}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-destructive">
              Danger zone
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Deleting your account removes every link and collection in your
              vault.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground sm:w-auto"
              onClick={() => setDeleteOpen(true)}
            >
              Delete Account
            </Button>
          </div>
        </div>
      )}

      <DeleteAccountModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => deleteMut.mutate()}
        isPending={deleteMut.isPending}
        email={user?.email}
      />
    </div>
  );
}
