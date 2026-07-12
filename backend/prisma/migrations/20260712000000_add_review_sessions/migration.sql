CREATE TABLE "review_sessions" (
  "id"                  SERIAL PRIMARY KEY,
  "user_id"             INTEGER NOT NULL,
  "type"                TEXT NOT NULL DEFAULT 'all',
  "record_type"         TEXT NOT NULL DEFAULT 'flashcard_card',
  "mode"                TEXT NOT NULL DEFAULT 'due_today',
  "node_ids"            TEXT,
  "department_node_ids" TEXT,
  "last_rating"         TEXT,
  "card_limit"          INTEGER NOT NULL DEFAULT 20,
  "created_at"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "review_sessions_user_id_idx" ON "review_sessions"("user_id");
CREATE INDEX "review_sessions_created_at_idx" ON "review_sessions"("user_id", "created_at" DESC);
