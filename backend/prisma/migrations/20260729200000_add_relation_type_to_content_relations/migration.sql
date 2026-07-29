-- Drop old unique constraint
ALTER TABLE "content_relations" DROP CONSTRAINT IF EXISTS "content_relations_source_type_source_id_target_type_target_id_key";

-- Add relation_type column
ALTER TABLE "content_relations" ADD COLUMN "relation_type" TEXT NOT NULL DEFAULT '';

-- Drop order column
ALTER TABLE "content_relations" DROP COLUMN IF EXISTS "order";

-- Add new unique constraint including relation_type
ALTER TABLE "content_relations" ADD CONSTRAINT "content_relations_source_type_source_id_target_type_target_id_relation_type_key"
  UNIQUE ("source_type", "source_id", "target_type", "target_id", "relation_type");
