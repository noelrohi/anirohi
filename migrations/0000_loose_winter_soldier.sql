CREATE TABLE IF NOT EXISTS "anirohi_account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "anirohi_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "anirohi_session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "anirohi_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "anirohi_verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "anirohi_verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "anirohi_anime" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"image" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"episodes" integer NOT NULL,
	"anilist_id" integer NOT NULL,
	CONSTRAINT "anirohi_anime_anilist_id_unique" UNIQUE("anilist_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "anirohi_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"episode_number" integer NOT NULL,
	"text" varchar(255) NOT NULL,
	"userId" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "anirohi_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(255),
	"slug" varchar(255) NOT NULL,
	"pathname" varchar(255) NOT NULL,
	"episode_number" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"image" varchar(255),
	"progress" numeric NOT NULL,
	"duration" numeric NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "slug_idx" ON "anirohi_anime" ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "anilist_idx" ON "anirohi_anime" ("anilist_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_idx" ON "anirohi_comments" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "path_idx" ON "anirohi_history" ("pathname");