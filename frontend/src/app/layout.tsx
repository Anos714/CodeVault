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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.BETTER_AUTH_URL ??
  "https://codevault-olive.vercel.app";
const description =
  "CodeVault is your centralized, syntax-aware code snippet library. Store, organize, search, and reuse the code you write — with Monaco editing, tagging, and private/public control.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CodeVault — Your Modern Code Snippet Library",
    template: "%s · CodeVault",
  },
  description,
  applicationName: "CodeVault",
  keywords: [
    "code snippets",
    "snippet manager",
    "code library",
    "developer tools",
    "syntax highlighting",
    "Monaco editor",
    "Next.js",
    "code search",
    "programming",
  ],
  authors: [{ name: "Rahul Sain", url: "https://github.com/Anos714" }],
  creator: "Rahul Sain",
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "CodeVault — Your Modern Code Snippet Library",
    description,
    siteName: "CodeVault",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeVault — Your Modern Code Snippet Library",
    description,
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
