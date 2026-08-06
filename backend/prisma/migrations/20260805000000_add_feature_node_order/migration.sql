-- AlterTable
ALTER TABLE "feature_nodes" ADD COLUMN "order" INTEGER;

-- CreateIndex
CREATE INDEX "feature_nodes_parent_id_order_idx" ON "feature_nodes"("parent_id", "order");
