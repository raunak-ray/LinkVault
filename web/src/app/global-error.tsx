"use client";

// Root-layout fallback: renders WITHOUT app/layout, so it cannot use Tailwind,
// theme providers, or any app component. Plain CSS mirrors the theme tokens.

const CSS = `
  :root {
    --bg: oklch(97% 0.008 250);
    --fg: oklch(26% 0.018 258);
    --muted: oklch(52% 0.016 258);
    --primary: oklch(56% 0.132 245);
    --primary-fg: oklch(99% 0.002 250);
    --card: oklch(98.2% 0.004 250);
    --border: oklch(90% 0.01 250);
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: oklch(18.3% 0.012 258);
      --fg: oklch(94.5% 0.006 250);
      --muted: oklch(70% 0.012 256);
      --primary: oklch(72% 0.115 242);
      --primary-fg: oklch(20% 0.014 258);
      --card: oklch(22.1% 0.014 258);
      --border: oklch(100% 0 0 / 0.1);
    }
  }
  * { box-sizing: border-box; margin: 0; }
  body {
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding: 1rem;
    text-align: center;
    background: var(--bg);
    color: var(--fg);
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  }
  .code {
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-weight: 700;
    font-size: clamp(5rem, 18vw, 11rem);
    line-height: 1;
    letter-spacing: -0.05em;
  }
  .title { font-size: 1.125rem; font-weight: 600; }
  .desc { font-size: 0.875rem; color: var(--muted); max-width: 24rem; margin-top: 0.5rem; }
  .row { display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; }
  .btn {
    height: 2.75rem;
    padding: 0 1.5rem;
    border-radius: 999px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    border: 1px solid transparent;
  }
  .btn-primary { background: var(--primary); color: var(--primary-fg); }
  .btn-secondary { background: var(--card); color: var(--fg); border-color: var(--border); }
`;

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static, build-time constant CSS; no user input is interpolated */}
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="code" role="img" aria-label="500">
          500
        </div>
        <div>
          <p className="title">Something went wrong</p>
          <p className="desc">
            The app hit a critical error. Your vault is safe — try again or come
            back later.
          </p>
        </div>
        <div className="row">
          <button type="button" onClick={reset} className="btn btn-primary">
            Try again
          </button>
          <a href="/" className="btn btn-secondary">
            Back home
          </a>
        </div>
      </body>
    </html>
  );
}
