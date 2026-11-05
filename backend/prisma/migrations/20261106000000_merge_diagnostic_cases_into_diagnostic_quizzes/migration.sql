-- Diagnostic V2 stops having a container table of its own: a "case" is now just a row in
-- `diagnostic_quizzes` with version = 2, exactly how atlas_models and anatomy_quizzes
-- already share one table between V1 and V2.
--
--   version 1 — a V1 quiz (titled, tagged, many questions). Every V1 list filters on this.
--   version 2 — a V2 case (one vignette + image, several questions). No title, no tags.
--
-- `record_type` stays 'diagnostic_case' everywhere: it names the concept, not the table
-- (the same way '3d_atlas' names atlas_models rows). Keeping it means `node_statistics`,
-- `user_node_progress` and `user_feature_statistics` — whose keys contain that string —
-- need no change at all, and no unique constraint can collide. Only `record_id` moves,
-- because the row's id changes when it is re-created in `diagnostic_quizzes`.

-- 1. The case-level fields a quiz row did not have yet. `title` loses its NOT NULL since
-- a case has none; V1's own create/update service still rejects a blank title.
ALTER TABLE "diagnostic_quizzes" ADD COLUMN IF NOT EXISTS "image_caption" TEXT;
ALTER TABLE "diagnostic_quizzes" ADD COLUMN IF NOT EXISTS "explanation" TEXT;
ALTER TABLE "diagnostic_quizzes" ADD COLUMN IF NOT EXISTS "references" JSONB;
ALTER TABLE "diagnostic_quizzes" ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "diagnostic_quizzes" ALTER COLUMN "title" DROP NOT NULL;

CREATE INDEX IF NOT EXISTS "diagnostic_quizzes_version_idx" ON "diagnostic_quizzes"("version");

-- 2. Every live case becomes a version-2 quiz row. The temp column carries the old case id
-- so the re-pointing below can find its new row; it is dropped at the end. `created_by` is
-- NOT NULL and a case never recorded an author, so the oldest admin stands in for the
-- backfilled rows (the V2 create service passes the real admin id from here on).
ALTER TABLE "diagnostic_quizzes" ADD COLUMN "_migrated_case_id" INTEGER;

-- `unique_id` is spelled out rather than left to the column default: Prisma declares it
-- as @default(uuid()), which it fills in client-side, and the DB-level default this table
-- happens to carry came along from its anatomy_quizzes days.
INSERT INTO "diagnostic_quizzes"
  ("unique_id", "title", "description", "image_caption", "explanation", "references",
   "status", "is_deleted", "deleted_at", "question_count", "media_type", "version",
   "created_by", "created_at", "updated_at", "_migrated_case_id")
SELECT gen_random_uuid()::text,
       NULL,
       dc."vignette",
       dc."image_caption",
       dc."explanation",
       COALESCE(dc."references", '[]'::jsonb),
       'published',
       dc."is_deleted",
       dc."deleted_at",
       (SELECT COUNT(*)::int FROM "diagnostic_questions" dq
        WHERE dq."case_id" = dc."id" AND dq."is_deleted" = false),
       '2d',
       2,
       COALESCE(
         (SELECT u."id" FROM "users" u WHERE u."role" = 'admin' ORDER BY u."id" LIMIT 1),
         (SELECT u."id" FROM "users" u ORDER BY u."id" LIMIT 1)
       ),
       dc."created_at",
       dc."updated_at",
       dc."id"
FROM "diagnostic_cases" dc;

-- 3. Questions hang off the quiz they always could hang off
UPDATE "diagnostic_questions" dq
SET "quiz_id" = dz."id"
FROM "diagnostic_quizzes" dz
WHERE dz."_migrated_case_id" = dq."case_id";

-- 4. Everything that pointed at a case id now points at the new quiz id. Each UPDATE is
-- 1:1 through _migrated_case_id, so none of the unique constraints on these tables can
-- collide, and record_type/item_type keep their existing value.
UPDATE "feature_node_records" fnr
SET "record_id" = dz."id", "updated_at" = CURRENT_TIMESTAMP
FROM "diagnostic_quizzes" dz
WHERE fnr."record_type" = 'diagnostic_case' AND fnr."record_id" = dz."_migrated_case_id";

UPDATE "attachments" a
SET "record_id" = dz."id"
FROM "diagnostic_quizzes" dz
WHERE a."record_type" = 'diagnostic_case' AND a."record_id" = dz."_migrated_case_id";

UPDATE "user_review_states" urs
SET "record_id" = dz."id", "updated_at" = CURRENT_TIMESTAMP
FROM "diagnostic_quizzes" dz
WHERE urs."record_type" = 'diagnostic_case' AND urs."record_id" = dz."_migrated_case_id";

UPDATE "user_learned_items" uli
SET "item_id" = dz."id"
FROM "diagnostic_quizzes" dz
WHERE uli."item_type" = 'diagnostic_case' AND uli."item_id" = dz."_migrated_case_id";

-- 5. The case table and the column that pointed at it are no longer needed
ALTER TABLE "diagnostic_questions" DROP CONSTRAINT IF EXISTS "diagnostic_questions_case_id_fkey";
DROP INDEX IF EXISTS "diagnostic_questions_case_id_idx";
ALTER TABLE "diagnostic_questions" DROP COLUMN IF EXISTS "case_id";

DROP TABLE IF EXISTS "diagnostic_cases";

ALTER TABLE "diagnostic_quizzes" DROP COLUMN "_migrated_case_id";
