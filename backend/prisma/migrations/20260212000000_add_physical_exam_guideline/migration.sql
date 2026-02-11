-- AlterTable
ALTER TABLE "osce_topics" ADD COLUMN "physical_exam_guideline" TEXT;

-- AlterTable
ALTER TABLE "osce_session_topic_snapshots" ADD COLUMN "physical_exam_guideline" TEXT;
