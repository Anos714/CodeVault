import type { Metadata, Viewport } from "next";
import {
  Geist_Mono,
  Instrument_Serif,
  Inter,
  Nunito,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SiteJsonLd } from "@/components/site/structured-data";
import {
  author,
  siteDescription,
  siteName,
  siteTagline,
  siteUrl,
} from "@/lib/site-content";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: "italic",
  subsets: ["latin"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const pageTitle = `${siteName} — ${siteTagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: pageTitle,
    template: "%s · CodeVault",
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "code snippet manager",
    "code snippets",
    "snippet library",
    "developer tools",
    "code search",
    "code organizer",
    "Monaco editor",
    "syntax highlighting",
    "code reuse",
    "open source",
    "self-hosted",
    "Chrome extension",
    "VS Code extension",
    "developer productivity",
  ],
  authors: [{ name: author.name, url: author.url }],
  creator: author.name,
  openGraph: {
    type: "website",
    url: siteUrl,
    title: pageTitle,
    description: siteDescription,
    siteName,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: siteDescription,
    creator: "@RahulSain714",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48 64x64" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0f" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        inter.variable,
        instrumentSerif.variable,
        nunito.variable,
        geistMono.variable,
        "h-full antialiased",
      )}
    >
      <body className="min-h-full flex flex-col bg-background font-sans">
        <SiteJsonLd />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
