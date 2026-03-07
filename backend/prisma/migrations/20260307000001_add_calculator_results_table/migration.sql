-- CreateTable: calculator_results
CREATE TABLE "calculator_results" (
    "id" SERIAL NOT NULL,
    "calculator_topic_id" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "formula" TEXT NOT NULL,
    "result_label" TEXT NOT NULL,
    "result_unit" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calculator_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "calculator_results_calculator_topic_id_key_key" ON "calculator_results"("calculator_topic_id", "key");
CREATE INDEX "calculator_results_calculator_topic_id_idx" ON "calculator_results"("calculator_topic_id");

-- MigrateData: create one result per existing topic from its formula/result_label/result_unit
INSERT INTO "calculator_results" ("calculator_topic_id", "key", "formula", "result_label", "result_unit")
SELECT "id", 'result', "formula", "result_label", COALESCE("result_unit", '')
FROM "calculator_topics"
WHERE "formula" IS NOT NULL AND "formula" != '';

-- AddColumn: link each classification to a result
ALTER TABLE "calculator_classifications" ADD COLUMN "result_id" INTEGER;

-- Link existing classifications to their migrated result
UPDATE "calculator_classifications" cc
SET "result_id" = cr."id"
FROM "calculator_results" cr
WHERE cr."calculator_topic_id" = cc."calculator_topic_id";

-- AlterTable: make old columns optional
ALTER TABLE "calculator_topics" ALTER COLUMN "formula" DROP NOT NULL;
ALTER TABLE "calculator_topics" ALTER COLUMN "result_label" DROP NOT NULL;
