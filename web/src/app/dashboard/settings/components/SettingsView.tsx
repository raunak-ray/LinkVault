"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/auth-provider";
import { useTheme } from "@/components/provider/ThemeProvider";
import { Button } from "@/components/motion/button/base";
import { Input } from "@/components/motion/input";
import { Monitor, Moon, Sun } from "lucide-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api/user.api";
import { getErrorMessage } from "@/lib/api/get-error-message";
import { useLogout } from "@/lib/auth/use-logout";

type Tab = "profile" | "appearance" | "account";

export default function SettingsView() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [tab, setTab] = useState<Tab>("profile");
  const [name, setName] = useState(user?.name ?? "");
  const queryClient = useQueryClient();
  const { mutate: logout } = useLogout();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const updateMut = useMutation({
    mutationFn: () => userApi.updateMe({ name: name.trim() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      setFeedback("Profile updated");
      setTimeout(() => setFeedback(null), 2000);
    },
    onError: (e) => setFeedback(getErrorMessage(e)),
  });

  const deleteMut = useMutation({
    mutationFn: () => userApi.deleteMe(),
    onSuccess: async () => {
      await logout();
    },
  });

  const themes: { value: typeof theme; label: string; icon: any }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your vault and how it looks.</p>

      {/* Tabs - beui style */}
      <div className="mt-6 flex gap-1 rounded-lg bg-muted p-1 w-fit">
        {(["profile", "appearance", "account"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors ${tab === t ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="surface-panel max-w-xl space-y-5 rounded-xl p-5 mt-6">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-secondary text-lg font-medium">
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
            <Input id="p-name" value={name} onChange={(v) => setName(v)} placeholder="Your name" className="h-9" />
          </div>

          <div className="space-y-2">
            <label htmlFor="p-email" className="text-sm font-medium">
              Email
            </label>
            <Input id="p-email" value={user?.email ?? ""} readOnly className="h-9 bg-muted" />
            <p className="text-xs text-muted-foreground">Email addresses can&apos;t be changed yet.</p>
          </div>

          {feedback && <p className="text-sm text-primary">{feedback}</p>}

          <Button onClick={() => updateMut.mutate()} disabled={updateMut.isPending || !name.trim()}>
            {updateMut.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}

      {tab === "appearance" && (
        <div className="surface-panel max-w-xl rounded-xl p-5 mt-6">
          <h2 className="text-sm font-semibold">Theme</h2>
          <p className="mt-1 text-sm text-muted-foreground">Choose how Link Vault looks on this device.</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {themes.map((t) => {
              const Icon = t.icon;
              const active = theme === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTheme(t.value)}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-sm transition-colors hover:bg-accent ${active ? "border-primary bg-accent text-accent-foreground" : "border-border"}`}
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
          <div className="surface-panel space-y-3 rounded-xl p-5 text-sm">
            <h2 className="text-sm font-semibold">Account information</h2>
            <div className="flex justify-between border-t border-border pt-3">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <span className="text-muted-foreground">Account created</span>
              <span>{user?.createdAt ? new Date(user.createdAt as any).toLocaleDateString() : "—"}</span>
            </div>
          </div>

          <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-5">
            <h2 className="text-sm font-semibold text-destructive">Danger zone</h2>
            <p className="mt-1 text-sm text-muted-foreground">Deleting your account removes every link and collection in your vault.</p>
            <Button variant="outline" size="sm" className="mt-4 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => setDeleteOpen(true)}>
              Delete Account
            </Button>
          </div>

          {deleteOpen && (
            <div className="surface-panel rounded-xl p-5">
              <h3 className="font-semibold">Delete your account?</h3>
              <p className="mt-1 text-sm text-muted-foreground">This action cannot be undone. All of your links and collections will be permanently removed.</p>
              <div className="mt-4 flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setDeleteOpen(false)}>
                  Cancel
                </Button>
                <Button variant="outline" size="sm" onClick={() => deleteMut.mutate()} disabled={deleteMut.isPending} className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                  {deleteMut.isPending ? "Deleting..." : "Delete Account"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
