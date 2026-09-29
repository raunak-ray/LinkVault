"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getOnlineSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  // Assume online during SSR to avoid hydration mismatch.
  return true;
}

/** True when the browser has network connectivity. */
export function useOnline(): boolean {
  return useSyncExternalStore(subscribe, getOnlineSnapshot, getServerSnapshot);
}

/** True when the browser is offline (no network). */
export function useOffline(): boolean {
  return !useOnline();
}

export default useOnline;
