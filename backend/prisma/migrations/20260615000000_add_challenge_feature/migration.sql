-- Challenge Feature Migration

CREATE TABLE "challenges" (
    "id" SERIAL NOT NULL,
    "unique_id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scoring_type" TEXT NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "total_questions" INTEGER NOT NULL,
    "base_points_per_correct" INTEGER NOT NULL DEFAULT 100,
    "time_bonus_pool" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "time_bonus_multiplier" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "start_at" TIMESTAMP(3),
    "end_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "challenges_unique_id_key" ON "challenges"("unique_id");
CREATE INDEX "challenges_status_idx" ON "challenges"("status");
CREATE INDEX "challenges_is_deleted_idx" ON "challenges"("is_deleted");
CREATE INDEX "challenges_start_at_idx" ON "challenges"("start_at");
CREATE INDEX "challenges_scoring_type_idx" ON "challenges"("scoring_type");

CREATE TABLE "challenge_questions" (
    "id" SERIAL NOT NULL,
    "unique_id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "challenge_id" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correct_option_index" INTEGER NOT NULL,
    "explanation" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "challenge_questions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "challenge_questions_unique_id_key" ON "challenge_questions"("unique_id");
CREATE INDEX "challenge_questions_challenge_id_idx" ON "challenge_questions"("challenge_id");
CREATE INDEX "challenge_questions_order_idx" ON "challenge_questions"("order");

CREATE TABLE "challenge_badges" (
    "id" SERIAL NOT NULL,
    "unique_id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "challenge_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "min_rank" INTEGER NOT NULL,
    "max_rank" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "challenge_badges_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "challenge_badges_unique_id_key" ON "challenge_badges"("unique_id");
CREATE INDEX "challenge_badges_challenge_id_idx" ON "challenge_badges"("challenge_id");
CREATE INDEX "challenge_badges_min_rank_idx" ON "challenge_badges"("min_rank");

CREATE TABLE "challenge_sessions" (
    "id" SERIAL NOT NULL,
    "unique_id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "challenge_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "question_ids" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "score" DOUBLE PRECISION,
    "correct_count" INTEGER,
    "total_time_seconds" DOUBLE PRECISION,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "challenge_sessions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "challenge_sessions_unique_id_key" ON "challenge_sessions"("unique_id");
CREATE UNIQUE INDEX "challenge_sessions_challenge_id_user_id_key" ON "challenge_sessions"("challenge_id", "user_id");
CREATE INDEX "challenge_sessions_challenge_id_idx" ON "challenge_sessions"("challenge_id");
CREATE INDEX "challenge_sessions_user_id_idx" ON "challenge_sessions"("user_id");
CREATE INDEX "challenge_sessions_status_idx" ON "challenge_sessions"("status");
CREATE INDEX "challenge_sessions_score_idx" ON "challenge_sessions"("score");

CREATE TABLE "challenge_session_answers" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "selected_option_index" INTEGER NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "time_taken_seconds" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "challenge_session_answers_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "challenge_session_answers_session_id_idx" ON "challenge_session_answers"("session_id");
CREATE INDEX "challenge_session_answers_question_id_idx" ON "challenge_session_answers"("question_id");
