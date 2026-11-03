/** URL helpers shared by commands and the status bar. */

export function normalizeBaseUrl(raw: string): string {
  const value = raw.trim();
  if (!value) throw new Error("Enter your CodeVault URL.");
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("Enter a valid URL, e.g. http://localhost:3000.");
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
