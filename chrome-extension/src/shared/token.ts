/** Token shape check for the options form (mirrors the server's format). */

export const API_TOKEN_PREFIX = "cv_pat_";

export function isApiToken(value: string): boolean {
  return /^cv_pat_[A-Za-z0-9_-]{32,}$/.test(value.trim());
}
