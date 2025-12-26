-- Move editor_content from skripsi_tabs to skripsi_sets
-- This migration consolidates editor content at the set level

-- Step 1: Add new column to skripsi_sets
ALTER TABLE "skripsi_sets" ADD COLUMN "editor_content" TEXT;

-- Step 2: Migrate data - concatenate all tab contents with separators
UPDATE "skripsi_sets"
SET "editor_content" = (
  SELECT STRING_AGG(
    CONCAT(
      '<h2>', COALESCE("title", "tab_type"), '</h2>',
      COALESCE("editor_content", '')
    ),
    '<hr>'
    ORDER BY "id"
  )
  FROM "skripsi_tabs"
  WHERE "skripsi_tabs"."set_id" = "skripsi_sets"."id"
);

-- Step 3: Drop old column from skripsi_tabs
ALTER TABLE "skripsi_tabs" DROP COLUMN "editor_content";
