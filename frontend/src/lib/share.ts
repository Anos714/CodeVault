import type { ShareLink, Snippet } from "@/lib/snippet-data";

export const SHARE_EXPIRY_OPTIONS = [
  { label: "Never", value: null },
  { label: "1 day", value: 1 },
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
] as const;

export type ShareExpiryDays = (typeof SHARE_EXPIRY_OPTIONS)[number]["value"];

/** Absolute URL of a share link — the window origin in the browser, the
 *  metadata base when prerendering on the server. */
export function shareUrl(token: string): string {
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://codevault-olive.vercel.app";
  return `${base}/s/${token}`;
}

export function mintShareLink(days: ShareExpiryDays): ShareLink {
  const createdAt = new Date().toISOString();
  return {
    token: crypto.randomUUID().replace(/-/g, ""),
    expiresAt: days
      ? new Date(Date.now() + days * 86_400_000).toISOString()
      : null,
    createdAt,
    revoked: false,
  };
}

export function isLinkExpired(link: ShareLink): boolean {
  if (!link.expiresAt) return false;
  return new Date(link.expiresAt).getTime() < Date.now();
}

/** A link grants access when it exists, isn't revoked, and hasn't aged out. */
export function isLinkUsable(link: ShareLink | undefined): link is ShareLink {
  return Boolean(link && !link.revoked && !isLinkExpired(link));
}

export function expiryLabel(link: ShareLink): string {
  if (!link.expiresAt) return "never expires";
  if (isLinkExpired(link)) return "expired";
  const days = Math.ceil(
    (new Date(link.expiresAt).getTime() - Date.now()) / 86_400_000,
  );
  return days <= 1 ? "expires in <1 day" : `expires in ${days} days`;
}

/**
 * Resolve a snippet purely from an unlisted token. Kept outside the store so
 * it can be called from server code (the /s/[token] route) and by the store's
 * own actions without a self-referential type cycle.
 */
export function resolveSnippetByShareToken(
  snippets: Snippet[],
  token: string,
): Snippet | undefined {
  return snippets.find((item) =>
    item.shareLinks?.some((link) => link.token === token && isLinkUsable(link)),
  );
}
