CREATE TYPE "public"."metadata_status_enum" AS ENUM('pending', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "tbl_link_metadata" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"link_id" uuid NOT NULL,
	"website_title" text,
	"description" text,
	"hostname" text,
	"favicon" text,
	"og_image" text,
	"status" "metadata_status_enum" DEFAULT 'pending',
	"attempts" integer DEFAULT 0,
	"last_error" text,
	"fetched_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "tbl_link_metadata_link_id_unique" UNIQUE("link_id")
);
--> statement-breakpoint
ALTER TABLE "tbl_link_metadata" ADD CONSTRAINT "tbl_link_metadata_link_id_tbl_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."tbl_links"("id") ON DELETE cascade ON UPDATE no action;