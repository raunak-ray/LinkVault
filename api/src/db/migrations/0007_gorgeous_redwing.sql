ALTER TABLE "tbl_link_metadata" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tbl_link_metadata" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tbl_link_metadata" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tbl_link_metadata" DROP COLUMN "website_title";--> statement-breakpoint
ALTER TABLE "tbl_link_metadata" DROP COLUMN "hostname";--> statement-breakpoint
ALTER TABLE "tbl_link_metadata" DROP COLUMN "attempts";