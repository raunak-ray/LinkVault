import { Bookmark } from "lucide-react";
import Link from "next/link";

/** Small LinkVault brand row used above the error / 404 stages. */
export default function ErrorBrand({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-90"
    >
      <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Bookmark className="size-4" />
      </span>
      <span className="text-base font-bold tracking-tight">LinkVault</span>
    </Link>
  );
}
