-- Backfill user_learned_items from user_review_states for flashcard_card records.
-- Run once after deploying migration 20260725000005.
-- is_correct is left NULL for flashcard (ratings are not binary correct/incorrect).

INSERT INTO user_learned_items (user_id, item_type, item_id, is_correct, created_at)
SELECT
  user_id,
  'flashcard_card',
  record_id,
  NULL,
  COALESCE(updated_at, NOW())
FROM user_review_states
WHERE record_type = 'flashcard_card';
