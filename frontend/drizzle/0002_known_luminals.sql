CREATE TABLE "collection_links" (
	"token" text PRIMARY KEY NOT NULL,
	"collection_id" text NOT NULL,
	"created_by" text NOT NULL,
	"expires_at" timestamp with time zone,
	"revoked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collection_snippets" (
	"collection_id" text NOT NULL,
	"snippet_id" text NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "collection_snippets_collection_id_snippet_id_pk" PRIMARY KEY("collection_id","snippet_id")
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"visibility" text DEFAULT 'private' NOT NULL,
	"author_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "collection_links" ADD CONSTRAINT "collection_links_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_links" ADD CONSTRAINT "collection_links_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_snippets" ADD CONSTRAINT "collection_snippets_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_snippets" ADD CONSTRAINT "collection_snippets_snippet_id_snippets_id_fk" FOREIGN KEY ("snippet_id") REFERENCES "public"."snippets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collections" ADD CONSTRAINT "collections_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "collection_links_collection_id_idx" ON "collection_links" USING btree ("collection_id");--> statement-breakpoint
CREATE INDEX "collection_snippets_snippet_id_idx" ON "collection_snippets" USING btree ("snippet_id");--> statement-breakpoint
CREATE INDEX "collections_author_id_idx" ON "collections" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "collections_updated_at_idx" ON "collections" USING btree ("updated_at");