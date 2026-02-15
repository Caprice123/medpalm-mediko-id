-- AlterTable
ALTER TABLE "users" ADD COLUMN "permissions" JSONB;

-- Add comment explaining the structure
COMMENT ON COLUMN "users"."permissions" IS 'User-specific permissions for admin features. Structure: { "tabs": ["features", "tags", ...], "features": { "features": ["exercise", "flashcard", ...], ... } }';
