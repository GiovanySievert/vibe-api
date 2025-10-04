-- Add the column as nullable
ALTER TABLE "users" ADD COLUMN "username" text;
--> statement-breakpoint

-- Populate the new username column with email values for existing users
UPDATE "users" SET "username" = "email";
--> statement-breakpoint

-- Add the NOT NULL constraint
ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;
--> statement-breakpoint

-- Add the unique constraint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");
