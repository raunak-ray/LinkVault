CREATE TABLE "tbl_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"collection_id" uuid NOT NULL,
	"url" varchar(500) NOT NULL,
	"title" varchar(255),
	"is_favourite" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tbl_collection" ADD CONSTRAINT "uq_collection_id_user" UNIQUE("id","user_id");--> statement-breakpoint
ALTER TABLE "tbl_links" ADD CONSTRAINT "tbl_links_user_id_tbl_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tbl_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_links" ADD CONSTRAINT "fk_link_collection_owner" FOREIGN KEY ("collection_id","user_id") REFERENCES "public"."tbl_collection"("id","user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_link_user_created" ON "tbl_links" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_link_collection" ON "tbl_links" USING btree ("collection_id","id");--> statement-breakpoint
