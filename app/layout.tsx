import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Inter_Tight } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { OG_LOCALE, SITE_DESCRIPTION, SITE_LOCALE, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import "./globals.css";

const pally = localFont({
  src: "./fonts/Pally-Variable.woff2",
  variable: "--font-pally",
  weight: "400 700",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME}: ${SITE_TAGLINE}`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: { siteName: SITE_NAME, locale: OG_LOCALE, type: "website" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#F1F1F1",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={SITE_LOCALE} className={`${pally.variable} ${interTight.variable} antialiased`}>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: "!rounded-2xl !border !border-border !bg-card !text-ink !font-sans",
          }}
        />
        {/* The analytics endpoint only exists on Vercel deployments. */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
