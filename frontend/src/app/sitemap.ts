import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-content";

/**
 * Only static, public, indexable pages belong here. Dashboard routes are
 * auth-gated, /s/[token] links are unlisted by design, and /embed/[id] is a
 * chrome-free iframe payload — none of them should be crawled.
 */
const staticRoutes = ["/", "/auth", "/privacy-policy", "/terms-and-conditions"];

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route === "/" ? "" : route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.6,
  }));
}
