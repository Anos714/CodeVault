/**
 * CodeVault database schema — the single source of truth for Drizzle.
 *
 * The `user`, `session`, `account` and `verification` tables are owned by
 * Better Auth. They match the schema `@better-auth/cli generate` produces, so
 * Better Auth's Drizzle adapter can use them as-is. `user` carries one extra
 * column beyond the Better Auth baseline: `defaultPrivate`, which backs the
 * "New snippets default to private" toggle on the settings page.
 *
 * Everything else — snippets, tags, share links, favorites — is app domain
 * data. `id` generation matches the frontend's conventions so seeded rows are
 * indistinguishable from user-created ones.
 */

import {
  boolean,
  customType,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Postgres full-text vector, maintained by triggers (see the migration that
 * adds it): title + description + language + the snippet's tags, english
 * config. Declared here so drizzle-kit owns the column and the GIN index;
 * the triggers live as raw SQL appended to that migration.
 */
const tsvector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});

/* ------------------------------------------------------------------ *
 * Better Auth tables
 * ------------------------------------------------------------------ */

export const user = pgTable("user", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  /** app column — the default visibility chosen for new snippets */
  defaultPrivate: boolean("default_private").notNull().default(true),
});

export const session = pgTable("session", {
  id: text("id").primaryKey().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey().notNull(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey().notNull(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ *
 * App tables
 * ------------------------------------------------------------------ */

export const snippets = pgTable(
  "snippets",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => `snip_${crypto.randomUUID()}`),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    /** one of the 19 slugs in lib/languages.ts */
    language: text("language").notNull(),
    code: text("code").notNull(),
    visibility: text("visibility", { enum: ["private", "public"] })
      .notNull()
      .default("private"),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    /** denormalised counters — always updated atomically, never read-then-written */
    favorites: integer("favorites").notNull().default(0),
    copies: integer("copies").notNull().default(0),
    /** fork credit survives deletion of the original snippet */
    forkedFromId: text("forked_from_id"),
    forkedFromAuthor: text("forked_from_author"),
    /** full-text vector for ranked search — trigger-maintained, see migration */
    search: tsvector("search"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("snippets_author_id_idx").on(t.authorId),
    index("snippets_updated_at_idx").on(t.updatedAt),
    index("snippets_visibility_idx").on(t.visibility),
    index("snippets_language_idx").on(t.language),
    index("snippets_search_gin_idx").using("gin", t.search),
  ],
);

export const snippetTags = pgTable(
  "snippet_tags",
  {
    snippetId: text("snippet_id")
      .notNull()
      .references(() => snippets.id, { onDelete: "cascade" }),
    tag: text("tag").notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.snippetId, t.tag] }),
    index("snippet_tags_tag_idx").on(t.tag),
  ],
);

export const shareLinks = pgTable(
  "share_links",
  {
    /** 32 hex chars, opaque, unguessable — looked up only by primary key */
    token: text("token")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID().replace(/-/g, "")),
    snippetId: text("snippet_id")
      .notNull()
      .references(() => snippets.id, { onDelete: "cascade" }),
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    revoked: boolean("revoked").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("share_links_snippet_id_idx").on(t.snippetId)],
);

export const favorites = pgTable(
  "favorites",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    snippetId: text("snippet_id")
      .notNull()
      .references(() => snippets.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.snippetId] }),
    index("favorites_user_id_idx").on(t.userId),
  ],
);

export const collections = pgTable(
  "collections",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => `col_${crypto.randomUUID()}`),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("collections_author_id_idx").on(t.authorId),
    index("collections_updated_at_idx").on(t.updatedAt),
  ],
);

export const collectionSnippets = pgTable(
  "collection_snippets",
  {
    collectionId: text("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    snippetId: text("snippet_id")
      .notNull()
      .references(() => snippets.id, { onDelete: "cascade" }),
    addedAt: timestamp("added_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.collectionId, t.snippetId] }),
    index("collection_snippets_snippet_id_idx").on(t.snippetId),
  ],
);

/** Unlisted links for collections — same pattern as snippet share_links. */
export const collectionLinks = pgTable(
  "collection_links",
  {
    /** 32 hex chars, opaque, unguessable — looked up only by primary key */
    token: text("token")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID().replace(/-/g, "")),
    collectionId: text("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    revoked: boolean("revoked").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("collection_links_collection_id_idx").on(t.collectionId)],
);
