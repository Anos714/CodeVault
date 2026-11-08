/** URL helpers — pure so they can be unit-tested without a browser. */

/**
 * Normalize a user-entered CodeVault URL:
 * - trim whitespace
 * - require http(s)
 * - strip a trailing slash and any trailing path? No: allow a sub-path
 *   deployment (e.g. https://example.com/vault) but strip trailing slashes.
 */
export function normalizeBaseUrl(raw: string): string {
  const value = raw.trim();
  if (!value) throw new Error("Enter your CodeVault URL.");
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(
      "Enter a valid URL, e.g. https://codevault-olive.vercel.app.",
    );
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("CodeVault URL must start with http:// or https://.");
  }
  return url.toString().replace(/\/+$/, "");
}

export function snippetWebUrl(baseUrl: string, id: string): string {
  return `${normalizeBaseUrl(baseUrl)}/dashboard/snippets/${encodeURIComponent(id)}`;
}

export function vaultWebUrl(baseUrl: string): string {
  return `${normalizeBaseUrl(baseUrl)}/dashboard/snippets`;
}

export function settingsWebUrl(baseUrl: string): string {
  return `${normalizeBaseUrl(baseUrl)}/dashboard/settings`;
}
