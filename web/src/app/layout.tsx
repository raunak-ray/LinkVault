import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";
import OfflineBanner from "@/components/common/OfflineBanner";
import QueryProvider from "@/components/provider/QueryProvider";
import ThemeProvider from "@/components/provider/ThemeProvider";
import { AuthProvider } from "@/lib/auth/auth-provider";
import { ToastProvider } from "@/lib/toast/toast-provider";

export const runtime = "nodejs";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const APP_NAME = "LinkVault";

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — save links, find them later`,
    template: `%s · ${APP_NAME}`,
  },
  description:
    "Your private vault for saved links. Paste a URL and LinkVault pulls the title, description and favicon for you, then keeps everything searchable and organised in collections.",
  applicationName: APP_NAME,
  keywords: ["bookmarks", "link vault", "read later", "link manager"],
  openGraph: {
    title: `${APP_NAME} — save links, find them later`,
    description:
      "Paste a URL and LinkVault pulls the title, description and favicon for you, then keeps everything searchable and organised in collections.",
    siteName: APP_NAME,
    type: "website",
  },
};

const themeScript = `(() => { try { const s = localStorage.getItem('linkvault-theme') || 'system'; const d = window.matchMedia('(prefers-color-scheme: dark)').matches; const r = s === 'system' ? (d ? 'dark' : 'light') : s; if (r === 'dark') document.documentElement.classList.add('dark'); } catch {} })();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/* Applies the stored theme before paint to avoid a flash. Static,
            build-time constant script with no user input interpolated. */}
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static, build-time constant script; no user input is interpolated */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <ToastProvider>
                <OfflineBanner />
                {children}
              </ToastProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
