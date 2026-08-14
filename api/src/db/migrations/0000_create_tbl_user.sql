CREATE TABLE "tbl_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "tbl_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "idx_user_email" ON "tbl_user" USING btree ("email");