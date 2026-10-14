import type { MetadataRoute } from "next";

/**
 * Only static, public, indexable pages belong here. Dashboard routes are
 * auth-gated, /s/[token] links are unlisted by design, and /embed/[id] is a
 * chrome-free iframe payload — none of them should be crawled.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.BETTER_AUTH_URL ??
  "https://codevault-olive.vercel.app";

const staticRoutes = ["/", "/auth", "/privacy-policy", "/terms-and-conditions"];

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route === "/" ? "" : route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.6,
  }));
}
