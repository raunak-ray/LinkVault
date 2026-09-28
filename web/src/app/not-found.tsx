import ErrorBrand from "@/components/common/ErrorBrand";
import { NotFoundGlitch } from "@/components/motion/not-found/glitch";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col bg-background text-foreground">
      <div className="flex justify-center pt-8">
        <ErrorBrand />
      </div>
      <div className="flex flex-1 items-center justify-center pb-16">
        <NotFoundGlitch
          title="Lost in the vault?"
          description="The page you are looking for moved, vanished, or never existed."
          homeHref="/"
          homeLabel="Back home"
          browseHref="/dashboard"
          browseLabel="Go to dashboard"
        />
      </div>
    </main>
  );
}
