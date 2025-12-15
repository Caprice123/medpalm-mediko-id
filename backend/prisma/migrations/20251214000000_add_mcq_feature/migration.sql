-- CreateTable
CREATE TABLE "mcq_topics" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content_type" TEXT NOT NULL,
    "source_url" TEXT,
    "source_key" TEXT,
    "source_filename" TEXT,
    "quiz_time_limit" INTEGER NOT NULL DEFAULT 0,
    "passing_score" INTEGER NOT NULL DEFAULT 70,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mcq_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mcq_questions" (
    "id" SERIAL NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "image_url" TEXT,
    "image_key" TEXT,
    "image_filename" TEXT,
    "option_a" TEXT NOT NULL,
    "option_b" TEXT NOT NULL,
    "option_c" TEXT NOT NULL,
    "option_d" TEXT NOT NULL,
    "correct_answer" TEXT NOT NULL,
    "explanation" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mcq_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mcq_topic_tags" (
    "id" SERIAL NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mcq_topic_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mcq_attempts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "mode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "score" INTEGER NOT NULL DEFAULT 0,
    "total_questions" INTEGER NOT NULL,
    "correct_count" INTEGER NOT NULL DEFAULT 0,
    "time_spent" INTEGER,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mcq_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mcq_answers" (
    "id" SERIAL NOT NULL,
    "attempt_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "user_answer" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "answered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time_taken" INTEGER,

    CONSTRAINT "mcq_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_mcq_progress" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "times_correct" INTEGER NOT NULL DEFAULT 0,
    "times_incorrect" INTEGER NOT NULL DEFAULT 0,
    "last_reviewed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_mcq_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mcq_topics_created_by_idx" ON "mcq_topics"("created_by");

-- CreateIndex
CREATE INDEX "mcq_topics_is_active_idx" ON "mcq_topics"("is_active");

-- CreateIndex
CREATE INDEX "mcq_topics_status_idx" ON "mcq_topics"("status");

-- CreateIndex
CREATE INDEX "mcq_questions_topic_id_idx" ON "mcq_questions"("topic_id");

-- CreateIndex
CREATE INDEX "mcq_questions_order_idx" ON "mcq_questions"("order");

-- CreateIndex
CREATE INDEX "mcq_topic_tags_topic_id_idx" ON "mcq_topic_tags"("topic_id");

-- CreateIndex
CREATE INDEX "mcq_topic_tags_tag_id_idx" ON "mcq_topic_tags"("tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "mcq_topic_tags_topic_id_tag_id_key" ON "mcq_topic_tags"("topic_id", "tag_id");

-- CreateIndex
CREATE INDEX "mcq_attempts_user_id_idx" ON "mcq_attempts"("user_id");

-- CreateIndex
CREATE INDEX "mcq_attempts_topic_id_idx" ON "mcq_attempts"("topic_id");

-- CreateIndex
CREATE INDEX "mcq_attempts_status_idx" ON "mcq_attempts"("status");

-- CreateIndex
CREATE INDEX "mcq_answers_attempt_id_idx" ON "mcq_answers"("attempt_id");

-- CreateIndex
CREATE INDEX "mcq_answers_question_id_idx" ON "mcq_answers"("question_id");

-- CreateIndex
CREATE INDEX "user_mcq_progress_user_id_idx" ON "user_mcq_progress"("user_id");

-- CreateIndex
CREATE INDEX "user_mcq_progress_question_id_idx" ON "user_mcq_progress"("question_id");

-- CreateIndex
CREATE INDEX "user_mcq_progress_topic_id_idx" ON "user_mcq_progress"("topic_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_mcq_progress_user_id_question_id_key" ON "user_mcq_progress"("user_id", "question_id");

-- AddForeignKey
ALTER TABLE "mcq_questions" ADD CONSTRAINT "mcq_questions_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "mcq_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mcq_topic_tags" ADD CONSTRAINT "mcq_topic_tags_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "mcq_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mcq_topic_tags" ADD CONSTRAINT "mcq_topic_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mcq_attempts" ADD CONSTRAINT "mcq_attempts_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "mcq_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mcq_answers" ADD CONSTRAINT "mcq_answers_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "mcq_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mcq_answers" ADD CONSTRAINT "mcq_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "mcq_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
