import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://codevault-olive.vercel.app";
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
    "MERN",
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
      { url: "/favicon.ico", sizes: "any" },
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
    { media: "(prefers-color-scheme: light)", color: "#f7f8fa" },
    { media: "(prefers-color-scheme: dark)", color: "#101418" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        geistSans.variable,
        geistMono.variable,
        "h-full antialiased",
      )}
    >
      <body className="min-h-full flex flex-col bg-background font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
