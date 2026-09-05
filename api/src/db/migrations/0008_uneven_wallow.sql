CREATE TYPE "public"."auth_provider" AS ENUM('local', 'google', 'github');--> statement-breakpoint
ALTER TABLE "tbl_user" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tbl_user" ADD COLUMN "provider" "auth_provider" DEFAULT 'local';--> statement-breakpoint
ALTER TABLE "tbl_refresh_token" ADD COLUMN "last_provider" "auth_provider" DEFAULT 'local';