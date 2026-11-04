import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-content";

/**
 * The public pages are crawlable and point at the sitemap; the app shell,
 * API surface, and iframe payloads are not content and stay out of the
 * index (dashboard and embed pages also carry noindex meta tags, so both
 * signals agree).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/api/", "/embed/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
