import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/provider/QueryProvider";
import { AuthProvider } from "@/lib/auth/auth-provider";
import ThemeProvider from "@/components/provider/ThemeProvider";

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

export const metadata: Metadata = {
  title: "Your App",
  description: "Your application description",
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
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
