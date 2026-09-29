import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalize a stored collection icon name into the kebab-case form
 * `lucide-react/dynamic` expects (e.g. "Layers" / "book Open" -> "layers" / "book-open").
 */
export function resolveCollectionIcon(icon?: string | null) {
  if (!icon) return "folder";
  return (
    icon
      .trim()
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, "-")
      .toLowerCase() || "folder"
  );
}

export function getFaviconUrl(url: string, size = 64) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
  } catch {
    return `https://www.google.com/s2/favicons?domain=${url}&sz=${size}`;
  }
}
