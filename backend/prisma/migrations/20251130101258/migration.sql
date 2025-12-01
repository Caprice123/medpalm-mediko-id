/*
  Warnings:

  - You are about to drop the column `number_of_attempts` on the `flashcard_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `tags` table. All the data in the column will be lost.
  - You are about to drop the `flashcard_session_answers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `flashcard_session_attempts` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `pricing_plans` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,tag_group_id]` on the table `tags` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tag_group_id` to the `tags` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "flashcard_session_answers" DROP CONSTRAINT "flashcard_session_answers_flashcard_session_attempt_id_fkey";

-- DropForeignKey
ALTER TABLE "flashcard_session_answers" DROP CONSTRAINT "flashcard_session_answers_flashcard_session_card_id_fkey";

-- DropForeignKey
ALTER TABLE "flashcard_session_attempts" DROP CONSTRAINT "flashcard_session_attempts_flashcard_session_id_fkey";

-- DropIndex
DROP INDEX "tags_name_type_key";

-- DropIndex
DROP INDEX "tags_type_idx";

-- AlterTable
ALTER TABLE "flashcard_sessions" DROP COLUMN "number_of_attempts";

-- AlterTable
ALTER TABLE "pricing_plans" ADD COLUMN     "code" TEXT;

-- AlterTable
ALTER TABLE "tags" DROP COLUMN "type",
ADD COLUMN     "tag_group_id" INTEGER;

-- DropTable
DROP TABLE "flashcard_session_answers";

-- DropTable
DROP TABLE "flashcard_session_attempts";

-- CreateTable
CREATE TABLE "tag_groups" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tag_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_question_progress" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "times_correct" INTEGER NOT NULL DEFAULT 0,
    "times_incorrect" INTEGER NOT NULL DEFAULT 0,
    "last_reviewed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_question_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calculator_topics" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "clinical_references" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "formula" TEXT NOT NULL,
    "result_label" TEXT NOT NULL,
    "result_unit" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calculator_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calculator_topic_tags" (
    "id" SERIAL NOT NULL,
    "calculator_topic_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calculator_topic_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calculator_fields" (
    "id" SERIAL NOT NULL,
    "calculator_topic_id" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "placeholder" TEXT NOT NULL,
    "description" TEXT,
    "unit" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calculator_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calculator_field_options" (
    "id" SERIAL NOT NULL,
    "calculator_field_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calculator_field_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calculator_classifications" (
    "id" SERIAL NOT NULL,
    "calculator_topic_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Classification Group',
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calculator_classifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calculator_classification_options" (
    "id" SERIAL NOT NULL,
    "calculator_classification_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL DEFAULT 'classification',
    "label" TEXT NOT NULL DEFAULT 'Classification',
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calculator_classification_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calculator_classification_option_conditions" (
    "id" SERIAL NOT NULL,
    "calculator_classification_option_id" INTEGER NOT NULL,
    "result_key" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "logical_operator" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calculator_classification_option_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tag_groups_name_key" ON "tag_groups"("name");

-- CreateIndex
CREATE INDEX "user_question_progress_user_id_idx" ON "user_question_progress"("user_id");

-- CreateIndex
CREATE INDEX "user_question_progress_question_id_idx" ON "user_question_progress"("question_id");

-- CreateIndex
CREATE INDEX "user_question_progress_topic_id_idx" ON "user_question_progress"("topic_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_question_progress_user_id_question_id_key" ON "user_question_progress"("user_id", "question_id");

-- CreateIndex
CREATE INDEX "calculator_topics_created_by_idx" ON "calculator_topics"("created_by");

-- CreateIndex
CREATE INDEX "calculator_topics_status_idx" ON "calculator_topics"("status");

-- CreateIndex
CREATE INDEX "calculator_topics_is_active_idx" ON "calculator_topics"("is_active");

-- CreateIndex
CREATE INDEX "calculator_topic_tags_calculator_topic_id_idx" ON "calculator_topic_tags"("calculator_topic_id");

-- CreateIndex
CREATE INDEX "calculator_topic_tags_tag_id_idx" ON "calculator_topic_tags"("tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "calculator_topic_tags_calculator_topic_id_tag_id_key" ON "calculator_topic_tags"("calculator_topic_id", "tag_id");

-- CreateIndex
CREATE INDEX "calculator_fields_calculator_topic_id_idx" ON "calculator_fields"("calculator_topic_id");

-- CreateIndex
CREATE INDEX "calculator_fields_order_idx" ON "calculator_fields"("order");

-- CreateIndex
CREATE UNIQUE INDEX "calculator_fields_calculator_topic_id_key_key" ON "calculator_fields"("calculator_topic_id", "key");

-- CreateIndex
CREATE INDEX "calculator_field_options_calculator_field_id_idx" ON "calculator_field_options"("calculator_field_id");

-- CreateIndex
CREATE INDEX "calculator_field_options_order_idx" ON "calculator_field_options"("order");

-- CreateIndex
CREATE INDEX "calculator_classifications_calculator_topic_id_idx" ON "calculator_classifications"("calculator_topic_id");

-- CreateIndex
CREATE INDEX "calculator_classifications_order_idx" ON "calculator_classifications"("order");

-- CreateIndex
CREATE INDEX "calculator_classification_options_calculator_classification_idx" ON "calculator_classification_options"("calculator_classification_id");

-- CreateIndex
CREATE INDEX "calculator_classification_options_order_idx" ON "calculator_classification_options"("order");

-- CreateIndex
CREATE INDEX "calculator_classification_option_conditions_calculator_clas_idx" ON "calculator_classification_option_conditions"("calculator_classification_option_id");

-- CreateIndex
CREATE INDEX "calculator_classification_option_conditions_order_idx" ON "calculator_classification_option_conditions"("order");

-- CreateIndex
CREATE UNIQUE INDEX "pricing_plans_code_key" ON "pricing_plans"("code");

-- CreateIndex
CREATE INDEX "pricing_plans_code_idx" ON "pricing_plans"("code");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_tag_group_id_key" ON "tags"("name", "tag_group_id");

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_tag_group_id_fkey" FOREIGN KEY ("tag_group_id") REFERENCES "tag_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calculator_topic_tags" ADD CONSTRAINT "calculator_topic_tags_calculator_topic_id_fkey" FOREIGN KEY ("calculator_topic_id") REFERENCES "calculator_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calculator_topic_tags" ADD CONSTRAINT "calculator_topic_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calculator_fields" ADD CONSTRAINT "calculator_fields_calculator_topic_id_fkey" FOREIGN KEY ("calculator_topic_id") REFERENCES "calculator_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calculator_field_options" ADD CONSTRAINT "calculator_field_options_calculator_field_id_fkey" FOREIGN KEY ("calculator_field_id") REFERENCES "calculator_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calculator_classifications" ADD CONSTRAINT "calculator_classifications_calculator_topic_id_fkey" FOREIGN KEY ("calculator_topic_id") REFERENCES "calculator_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calculator_classification_options" ADD CONSTRAINT "calculator_classification_options_calculator_classificatio_fkey" FOREIGN KEY ("calculator_classification_id") REFERENCES "calculator_classifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calculator_classification_option_conditions" ADD CONSTRAINT "calculator_classification_option_conditions_calculator_cla_fkey" FOREIGN KEY ("calculator_classification_option_id") REFERENCES "calculator_classification_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;
