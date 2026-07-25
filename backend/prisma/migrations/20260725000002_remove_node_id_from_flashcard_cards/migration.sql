-- Drop index on node_id
DROP INDEX IF EXISTS "flashcard_cards_node_id_idx";

-- Drop foreign key constraint and remove node_id column
ALTER TABLE "flashcard_cards" DROP COLUMN IF EXISTS "node_id";
