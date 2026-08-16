ALTER TABLE "tbl_user" ADD COLUMN "avatar" varchar(500);--> statement-breakpoint
ALTER TABLE "tbl_user" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "idx_user_deleted_at" ON "tbl_user" USING btree ("deleted_at");