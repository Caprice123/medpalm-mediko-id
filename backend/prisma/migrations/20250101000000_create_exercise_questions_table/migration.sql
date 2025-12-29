-- CreateTable
CREATE TABLE IF NOT EXISTS "exercise_questions" (
    "id" SERIAL NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "explanation" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercise_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "exercise_questions_order_idx" ON "exercise_questions"("order");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "exercise_questions_topic_id_idx" ON "exercise_questions"("topic_id");

-- AddForeignKey
ALTER TABLE "exercise_questions" DROP CONSTRAINT IF EXISTS "exercise_questions_topic_id_fkey";
ALTER TABLE "exercise_questions" ADD CONSTRAINT "exercise_questions_topic_id_fkey"
    FOREIGN KEY ("topic_id") REFERENCES "exercise_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
