CREATE TABLE "post" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" varchar(50) NOT NULL,
	"body" varchar(255) NOT NULL,
	"is_draft" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(48) NOT NULL,
	"password" text NOT NULL,
	"email" varchar(128) NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL
);
