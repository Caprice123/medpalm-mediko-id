-- Diagnostic V2 moves from "one question = one card" to "one case (shared vignette +
-- image) = one card holding several questions". The case becomes the unit that
-- feature_node_records links to and that SRS state is tracked against.

-- 1. The case table
CREATE TABLE "diagnostic_cases" (
    "id" SERIAL NOT NULL,
    "vignette" TEXT,
    "image_caption" TEXT,
    "explanation" TEXT,
    "references" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diagnostic_cases_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "diagnostic_cases_is_deleted_idx" ON "diagnostic_cases"("is_deleted");

-- 2. Questions point at their case (nullable: V1 questions keep quiz_id and no case)
ALTER TABLE "diagnostic_questions" ADD COLUMN "case_id" INTEGER;

CREATE INDEX "diagnostic_questions_case_id_idx" ON "diagnostic_questions"("case_id");

ALTER TABLE "diagnostic_questions"
    ADD CONSTRAINT "diagnostic_questions_case_id_fkey"
    FOREIGN KEY ("case_id") REFERENCES "diagnostic_cases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- 3. Backfill: every V2 question (i.e. one linked to a feature node) becomes a
-- single-question case that inherits its vignette and image caption. The temp column
-- carries the old question id so the 1:1 re-pointing below can find its case; it is
-- dropped at the end. Every UPDATE ... FROM here is 1:1, so none of the unique
-- constraints on the touched tables can collide.
ALTER TABLE "diagnostic_cases" ADD COLUMN "_migrated_question_id" INTEGER;

INSERT INTO "diagnostic_cases" ("vignette", "image_caption", "order", "created_at", "updated_at", "_migrated_question_id")
SELECT dq."vignette", dq."image_caption", COALESCE(dq."order", 0), dq."created_at", dq."updated_at", dq."id"
FROM "diagnostic_questions" dq
WHERE dq."is_deleted" = false
  AND EXISTS (
    SELECT 1 FROM "feature_node_records" fnr
    WHERE fnr."record_type" = 'diagnostic_question' AND fnr."record_id" = dq."id"
  );

UPDATE "diagnostic_questions" dq
SET "case_id" = dc."id"
FROM "diagnostic_cases" dc
WHERE dc."_migrated_question_id" = dq."id";

-- node links: the node now holds cases, not questions
UPDATE "feature_node_records" fnr
SET "record_type" = 'diagnostic_case', "record_id" = dc."id", "updated_at" = CURRENT_TIMESTAMP
FROM "diagnostic_cases" dc
WHERE fnr."record_type" = 'diagnostic_question' AND fnr."record_id" = dc."_migrated_question_id";

-- the image belongs to the case now
UPDATE "attachments" a
SET "record_type" = 'diagnostic_case', "record_id" = dc."id"
FROM "diagnostic_cases" dc
WHERE a."record_type" = 'diagnostic_question' AND a."record_id" = dc."_migrated_question_id";

-- SRS state and the new/seen marker follow the case
UPDATE "user_review_states" urs
SET "record_type" = 'diagnostic_case', "record_id" = dc."id", "updated_at" = CURRENT_TIMESTAMP
FROM "diagnostic_cases" dc
WHERE urs."record_type" = 'diagnostic_question' AND urs."record_id" = dc."_migrated_question_id";

UPDATE "user_learned_items" uli
SET "item_type" = 'diagnostic_case', "item_id" = dc."id"
FROM "diagnostic_cases" dc
WHERE uli."item_type" = 'diagnostic_question' AND uli."item_id" = dc."_migrated_question_id";

-- per-node counts keep counting rows of whatever the node holds, which is now cases
UPDATE "node_statistics"
SET "record_type" = 'diagnostic_case', "updated_at" = CURRENT_TIMESTAMP
WHERE "record_type" = 'diagnostic_question';

-- the per-node rating buckets and the per-user rating tallies are keyed by a feature
-- name rather than by row id, so they only need the name swapped (no mapping, and no
-- 'diagnostic_case' rows can already exist to collide with)
UPDATE "user_node_progress"
SET "feature_type" = 'diagnostic_case', "updated_at" = CURRENT_TIMESTAMP
WHERE "feature_type" = 'diagnostic_question';

UPDATE "user_feature_statistics"
SET "feature" = 'diagnostic_case', "updated_at" = CURRENT_TIMESTAMP
WHERE "feature" = 'diagnostic_question';

ALTER TABLE "diagnostic_cases" DROP COLUMN "_migrated_question_id";
