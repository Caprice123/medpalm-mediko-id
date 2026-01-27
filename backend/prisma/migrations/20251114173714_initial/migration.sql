-- CreateTable
CREATE TABLE "constants" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "constants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_plans" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "credits" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_transactions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "userCreditId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "balanceBefore" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "description" TEXT,
    "creditPlanId" INTEGER,
    "sessionId" INTEGER,
    "paymentStatus" TEXT,
    "paymentMethod" TEXT,
    "paymentReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_questions" (
    "id" SERIAL NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercise_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_sessions" (
    "id" SERIAL NOT NULL,
    "user_learning_session_id" INTEGER NOT NULL,
    "exercise_topic_id" INTEGER,
    "total_question" INTEGER NOT NULL,
    "credits_used" INTEGER NOT NULL DEFAULT 0,
    "number_of_attempts" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercise_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_session_questions" (
    "id" SERIAL NOT NULL,
    "exercise_session_id" INTEGER NOT NULL,
    "question_text" TEXT NOT NULL,
    "answer_text" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercise_session_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_session_attempts" (
    "id" SERIAL NOT NULL,
    "exercise_session_id" INTEGER NOT NULL,
    "attempt_number" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "score" INTEGER NOT NULL DEFAULT 0,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercise_session_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_session_answers" (
    "id" SERIAL NOT NULL,
    "exercise_session_attempt_id" INTEGER NOT NULL,
    "exercise_session_question_id" INTEGER NOT NULL,
    "user_answer" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "answered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time_taken_seconds" INTEGER,

    CONSTRAINT "exercise_session_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_topic_tags" (
    "id" SERIAL NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercise_topic_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_topics" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content_type" TEXT NOT NULL,
    "content" TEXT,
    "pdf_url" TEXT,
    "pdf_key" TEXT,
    "pdf_filename" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "question_count" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercise_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_credits" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_credits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_learning_sessions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'exercise',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_learning_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "picture" TEXT,
    "googleId" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "constants_key_key" ON "constants"("key");

-- CreateIndex
CREATE INDEX "constants_key_idx" ON "constants"("key");

-- CreateIndex
CREATE INDEX "credit_transactions_paymentStatus_idx" ON "credit_transactions"("paymentStatus");

-- CreateIndex
CREATE INDEX "credit_transactions_type_idx" ON "credit_transactions"("type");

-- CreateIndex
CREATE INDEX "credit_transactions_userCreditId_idx" ON "credit_transactions"("userCreditId");

-- CreateIndex
CREATE INDEX "credit_transactions_userId_idx" ON "credit_transactions"("userId");

-- CreateIndex
CREATE INDEX "exercise_questions_order_idx" ON "exercise_questions"("order");

-- CreateIndex
CREATE INDEX "exercise_questions_topic_id_idx" ON "exercise_questions"("topic_id");

-- CreateIndex
CREATE UNIQUE INDEX "exercise_sessions_user_learning_session_id_key" ON "exercise_sessions"("user_learning_session_id");

-- CreateIndex
CREATE INDEX "exercise_sessions_user_learning_session_id_idx" ON "exercise_sessions"("user_learning_session_id");

-- CreateIndex
CREATE INDEX "exercise_sessions_exercise_topic_id_idx" ON "exercise_sessions"("exercise_topic_id");

-- CreateIndex
CREATE INDEX "exercise_session_questions_order_idx" ON "exercise_session_questions"("order");

-- CreateIndex
CREATE INDEX "exercise_session_attempts_exercise_session_id_idx" ON "exercise_session_attempts"("exercise_session_id");

-- CreateIndex
CREATE INDEX "exercise_session_attempts_started_at_idx" ON "exercise_session_attempts"("started_at");

-- CreateIndex
CREATE INDEX "exercise_session_attempts_status_idx" ON "exercise_session_attempts"("status");

-- CreateIndex
CREATE INDEX "exercise_session_answers_answered_at_idx" ON "exercise_session_answers"("answered_at");

-- CreateIndex
CREATE INDEX "exercise_session_answers_exercise_session_attempt_id_idx" ON "exercise_session_answers"("exercise_session_attempt_id");

-- CreateIndex
CREATE INDEX "exercise_session_answers_exercise_session_question_id_idx" ON "exercise_session_answers"("exercise_session_question_id");

-- CreateIndex
CREATE INDEX "exercise_topic_tags_tag_id_idx" ON "exercise_topic_tags"("tag_id");

-- CreateIndex
CREATE INDEX "exercise_topic_tags_topic_id_idx" ON "exercise_topic_tags"("topic_id");

-- CreateIndex
CREATE UNIQUE INDEX "exercise_topic_tags_topic_id_tag_id_key" ON "exercise_topic_tags"("topic_id", "tag_id");

-- CreateIndex
CREATE INDEX "exercise_topics_created_by_idx" ON "exercise_topics"("created_by");

-- CreateIndex
CREATE INDEX "exercise_topics_is_active_idx" ON "exercise_topics"("is_active");

-- CreateIndex
CREATE INDEX "exercise_topics_status_idx" ON "exercise_topics"("status");

-- CreateIndex
CREATE INDEX "tags_is_active_idx" ON "tags"("is_active");

-- CreateIndex
CREATE INDEX "tags_type_idx" ON "tags"("type");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_type_key" ON "tags"("name", "type");

-- CreateIndex
CREATE UNIQUE INDEX "user_credits_userId_key" ON "user_credits"("userId");

-- CreateIndex
CREATE INDEX "user_credits_userId_idx" ON "user_credits"("userId");

-- CreateIndex
CREATE INDEX "user_learning_sessions_title_idx" ON "user_learning_sessions"("title");

-- CreateIndex
CREATE INDEX "user_learning_sessions_type_idx" ON "user_learning_sessions"("type");

-- CreateIndex
CREATE INDEX "user_learning_sessions_user_id_idx" ON "user_learning_sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_token_key" ON "user_sessions"("token");

-- CreateIndex
CREATE INDEX "user_sessions_token_idx" ON "user_sessions"("token");

-- CreateIndex
CREATE INDEX "user_sessions_userId_idx" ON "user_sessions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- AddForeignKey
ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_creditPlanId_fkey" FOREIGN KEY ("creditPlanId") REFERENCES "credit_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_userCreditId_fkey" FOREIGN KEY ("userCreditId") REFERENCES "user_credits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_questions" ADD CONSTRAINT "exercise_questions_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "exercise_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_sessions" ADD CONSTRAINT "exercise_sessions_user_learning_session_id_fkey" FOREIGN KEY ("user_learning_session_id") REFERENCES "user_learning_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_sessions" ADD CONSTRAINT "exercise_sessions_exercise_topic_id_fkey" FOREIGN KEY ("exercise_topic_id") REFERENCES "exercise_topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_session_questions" ADD CONSTRAINT "exercise_session_questions_exercise_session_id_fkey" FOREIGN KEY ("exercise_session_id") REFERENCES "exercise_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_session_attempts" ADD CONSTRAINT "exercise_session_attempts_exercise_session_id_fkey" FOREIGN KEY ("exercise_session_id") REFERENCES "exercise_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_session_answers" ADD CONSTRAINT "exercise_session_answers_exercise_session_attempt_id_fkey" FOREIGN KEY ("exercise_session_attempt_id") REFERENCES "exercise_session_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_session_answers" ADD CONSTRAINT "exercise_session_answers_exercise_session_question_id_fkey" FOREIGN KEY ("exercise_session_question_id") REFERENCES "exercise_session_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_topic_tags" ADD CONSTRAINT "exercise_topic_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_topic_tags" ADD CONSTRAINT "exercise_topic_tags_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "exercise_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
