CREATE TABLE "tbl_collection" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"icon" varchar(100),
	"color" varchar(10),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_collection_name_user" UNIQUE("name","user_id")
);
--> statement-breakpoint
ALTER TABLE "tbl_collection" ADD CONSTRAINT "tbl_collection_user_id_tbl_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tbl_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_collection_user_id" ON "tbl_collection" USING btree ("user_id");