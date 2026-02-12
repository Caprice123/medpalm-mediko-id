-- AlterTable osce_session_therapies: Change to JSONB and remove order
-- First, add new JSONB column
ALTER TABLE "osce_session_therapies" ADD COLUMN "therapy_new" JSONB;

-- Migrate existing data: convert single therapy strings to JSONB string
UPDATE "osce_session_therapies" SET "therapy_new" = to_jsonb("therapy");

-- Drop old column and indexes
DROP INDEX IF EXISTS "osce_session_therapies_order_idx";
ALTER TABLE "osce_session_therapies" DROP COLUMN "therapy";
ALTER TABLE "osce_session_therapies" DROP COLUMN "order";

-- Rename new column to therapy
ALTER TABLE "osce_session_therapies" RENAME COLUMN "therapy_new" TO "therapy";

-- Add unique constraint on osce_session_id (one therapy record per session)
-- First, remove duplicate records, keeping only the first one
DELETE FROM "osce_session_therapies" a
USING "osce_session_therapies" b
WHERE a.id > b.id AND a.osce_session_id = b.osce_session_id;

-- Now add the unique constraint
ALTER TABLE "osce_session_therapies" ADD CONSTRAINT "osce_session_therapies_osce_session_id_key" UNIQUE ("osce_session_id");


-- AlterTable osce_session_diagnoses: Change to JSONB and remove type
-- First, add new JSONB column
ALTER TABLE "osce_session_diagnoses" ADD COLUMN "diagnosis_new" JSONB;

-- Migrate existing data: aggregate by session into {utama: string, pembanding: [strings]}
WITH aggregated AS (
  SELECT
    osce_session_id,
    MAX(CASE WHEN type = 'utama' THEN diagnosis END) as utama,
    jsonb_agg(diagnosis) FILTER (WHERE type = 'pembanding') as pembanding
  FROM "osce_session_diagnoses"
  GROUP BY osce_session_id
)
UPDATE "osce_session_diagnoses" d
SET "diagnosis_new" = jsonb_build_object(
  'utama', COALESCE(a.utama, ''),
  'pembanding', COALESCE(a.pembanding, '[]'::jsonb)
)
FROM aggregated a
WHERE d.osce_session_id = a.osce_session_id;

-- Remove duplicate records, keeping only the first one per session
DELETE FROM "osce_session_diagnoses" a
USING "osce_session_diagnoses" b
WHERE a.id > b.id AND a.osce_session_id = b.osce_session_id;

-- Drop old column and indexes
DROP INDEX IF EXISTS "osce_session_diagnoses_type_idx";
ALTER TABLE "osce_session_diagnoses" DROP COLUMN "diagnosis";
ALTER TABLE "osce_session_diagnoses" DROP COLUMN "type";

-- Rename new column to diagnosis
ALTER TABLE "osce_session_diagnoses" RENAME COLUMN "diagnosis_new" TO "diagnosis";

-- Add unique constraint on osce_session_id
ALTER TABLE "osce_session_diagnoses" ADD CONSTRAINT "osce_session_diagnoses_osce_session_id_key" UNIQUE ("osce_session_id");
