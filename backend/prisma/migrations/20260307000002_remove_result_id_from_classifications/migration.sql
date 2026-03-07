-- DropIndex
DROP INDEX IF EXISTS "calculator_classifications_result_id_idx";

-- AlterTable
ALTER TABLE "calculator_classifications" DROP COLUMN IF EXISTS "result_id";
