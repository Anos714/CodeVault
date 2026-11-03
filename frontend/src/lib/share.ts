import type { ShareLink } from "@/lib/snippet-types";

export const SHARE_EXPIRY_OPTIONS = [
  { label: "Never", value: null },
  { label: "1 day", value: 1 },
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
] as const;

export type ShareExpiryDays = (typeof SHARE_EXPIRY_OPTIONS)[number]["value"];

/** Absolute URL of a share link once the caller supplies the browser origin.
 *  With no origin it stays relative, which keeps SSR and the first client
 *  render identical. */
export function shareUrl(token: string, origin = ""): string {
  return `${origin}/s/${token}`;
}

export function isLinkExpired(link: ShareLink): boolean {
  if (!link.expiresAt) return false;
  return new Date(link.expiresAt).getTime() < Date.now();
}

export function expiryLabel(link: ShareLink): string {
  if (!link.expiresAt) return "never expires";
  if (isLinkExpired(link)) return "expired";
  const days = Math.ceil(
    (new Date(link.expiresAt).getTime() - Date.now()) / 86_400_000,
  );
  return days <= 1 ? "expires in <1 day" : `expires in ${days} days`;
}
