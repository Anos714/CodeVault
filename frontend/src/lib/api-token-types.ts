/**
 * Shared API-token shapes. Kept free of server imports so client components
 * can type the settings UI without pulling `node:crypto` or the database in.
 */

export type ApiTokenSummary = {
  id: string;
  name: string;
  /** first characters of the raw token, e.g. `cv_pat_ab12cd` */
  prefix: string;
  /** ISO datestring, or null when the token has never been used */
  lastUsedAt: string | null;
  /** ISO datestring, or null for a token that never expires */
  expiresAt: string | null;
  /** ISO datestring, or null while the token is active */
  revokedAt: string | null;
  /** ISO datestring */
  createdAt: string;
};
