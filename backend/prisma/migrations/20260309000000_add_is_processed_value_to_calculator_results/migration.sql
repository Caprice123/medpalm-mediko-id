-- AlterTable: make result_label nullable and add is_processed_value flag
ALTER TABLE "calculator_results" ALTER COLUMN "result_label" DROP NOT NULL;
ALTER TABLE "calculator_results" ADD COLUMN "is_processed_value" BOOLEAN NOT NULL DEFAULT false;
