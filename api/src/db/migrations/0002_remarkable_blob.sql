ALTER TABLE "tbl_refresh_token" DROP CONSTRAINT "tbl_refresh_token_user_id_tbl_user_id_fk";
--> statement-breakpoint
ALTER TABLE "tbl_refresh_token" ALTER COLUMN "expires_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "tbl_refresh_token" ALTER COLUMN "expires_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tbl_refresh_token" ADD COLUMN "revoked_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "tbl_refresh_token" ADD CONSTRAINT "tbl_refresh_token_user_id_tbl_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tbl_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_refresh_token_user_id" ON "tbl_refresh_token" USING btree ("user_id");