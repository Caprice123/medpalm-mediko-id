ALTER TABLE challenges ADD COLUMN question_pool_count INT NOT NULL DEFAULT 0;

-- Backfill from actual question count per challenge
UPDATE challenges c
SET question_pool_count = (
  SELECT COUNT(*) FROM challenge_questions q WHERE q.challenge_id = c.id
);
