/** Token shape check mirroring the server's `cv_pat_…` format. */

export const API_TOKEN_PREFIX = "cv_pat_";

export function isApiToken(value: string): boolean {
  return /^cv_pat_[A-Za-z0-9_-]{32,}$/.test(value.trim());
}
