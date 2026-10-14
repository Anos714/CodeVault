ALTER TABLE "snippets" ADD COLUMN "search" "tsvector";--> statement-breakpoint
CREATE INDEX "snippets_search_gin_idx" ON "snippets" USING gin ("search");--> statement-breakpoint
-- Full-text vector: title + description + language + the snippet's tags.
-- Tags live in snippet_tags, so two triggers keep the row fresh: one on
-- snippets itself, one that re-computes the parent row on tag changes.
CREATE OR REPLACE FUNCTION "snippets_search_refresh"() RETURNS trigger AS $$
BEGIN
  UPDATE "snippets" SET "search" = to_tsvector(
    'english',
    coalesce(NEW."title", '') || ' ' ||
    coalesce(NEW."description", '') || ' ' ||
    coalesce(NEW."language", '') || ' ' ||
    coalesce(
      (SELECT string_agg("tag", ' ') FROM "snippet_tags"
        WHERE "snippet_id" = NEW."id"),
      ''
    )
  ) WHERE "id" = NEW."id";
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;--> statement-breakpoint
CREATE OR REPLACE FUNCTION "snippet_tags_search_refresh"() RETURNS trigger AS $$
BEGIN
  UPDATE "snippets" SET "search" = to_tsvector(
    'english',
    coalesce("snippets"."title", '') || ' ' ||
    coalesce("snippets"."description", '') || ' ' ||
    coalesce("snippets"."language", '') || ' ' ||
    coalesce(
      (SELECT string_agg("tag", ' ') FROM "snippet_tags"
        WHERE "snippet_id" = coalesce(NEW."snippet_id", OLD."snippet_id")),
      ''
    )
  ) WHERE "id" = coalesce(NEW."snippet_id", OLD."snippet_id");
  RETURN coalesce(NEW, OLD);
END;
$$ LANGUAGE plpgsql;--> statement-breakpoint
DROP TRIGGER IF EXISTS "snippets_search_trg" ON "snippets";--> statement-breakpoint
CREATE TRIGGER "snippets_search_trg"
  AFTER INSERT OR UPDATE OF "title", "description", "language" ON "snippets"
  FOR EACH ROW EXECUTE FUNCTION "snippets_search_refresh"();--> statement-breakpoint
DROP TRIGGER IF EXISTS "snippet_tags_search_trg" ON "snippet_tags";--> statement-breakpoint
CREATE TRIGGER "snippet_tags_search_trg"
  AFTER INSERT OR UPDATE OR DELETE ON "snippet_tags"
  FOR EACH ROW EXECUTE FUNCTION "snippet_tags_search_refresh"();--> statement-breakpoint
-- Backfill every existing row through the same function.
UPDATE "snippets" SET "title" = "title";