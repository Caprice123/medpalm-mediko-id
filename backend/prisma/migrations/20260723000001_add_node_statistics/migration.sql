CREATE TABLE "node_statistics" (
  "node_id"     INTEGER NOT NULL,
  "record_type" TEXT NOT NULL,
  "total_count" INTEGER NOT NULL DEFAULT 0,
  "updated_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "node_statistics_pkey" PRIMARY KEY ("node_id", "record_type")
);

ALTER TABLE "node_statistics"
  ADD CONSTRAINT "node_statistics_node_id_fkey"
  FOREIGN KEY ("node_id") REFERENCES "feature_nodes"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill flashcard counts from existing cards
INSERT INTO "node_statistics" ("node_id", "record_type", "total_count")
SELECT node_id, 'flashcard_card', COUNT(*)::int
FROM flashcard_cards
WHERE node_id IS NOT NULL
GROUP BY node_id
ON CONFLICT DO NOTHING;
