-- AlterTable
ALTER TABLE "feature_nodes" ALTER COLUMN "order" TYPE INTEGER USING ROUND("order")::INTEGER;
