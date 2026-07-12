-- user_review_states: polymorphic SRS state per user per record
CREATE TABLE "user_review_states" (
    "id"           SERIAL PRIMARY KEY,
    "user_id"      INTEGER NOT NULL,
    "record_type"  TEXT NOT NULL,
    "record_id"    INTEGER NOT NULL,
    "interval"     FLOAT NOT NULL DEFAULT 1,
    "ease_factor"  FLOAT NOT NULL DEFAULT 2.5,
    "due_date"     TIMESTAMP(3) NOT NULL,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "last_rating"  TEXT NOT NULL,
    "created_at"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "user_review_states_unique" ON "user_review_states"("user_id", "record_type", "record_id");
CREATE INDEX "user_review_states_user_id_idx" ON "user_review_states"("user_id");
CREATE INDEX "user_review_states_due_date_idx" ON "user_review_states"("due_date");
CREATE INDEX "user_review_states_record_idx" ON "user_review_states"("record_type", "record_id");

-- user_review_custom_sessions: saved session presets
CREATE TABLE "user_review_custom_sessions" (
    "id"                  SERIAL PRIMARY KEY,
    "user_id"             INTEGER NOT NULL,
    "name"                TEXT NOT NULL,
    "record_type"         TEXT NOT NULL DEFAULT 'flashcard_card',
    "node_id"             INTEGER,
    "department_node_id"  INTEGER,
    "mode"                TEXT NOT NULL DEFAULT 'due_today',
    "card_limit"          INTEGER NOT NULL DEFAULT 20,
    "created_at"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "user_review_custom_sessions_user_id_idx" ON "user_review_custom_sessions"("user_id");
