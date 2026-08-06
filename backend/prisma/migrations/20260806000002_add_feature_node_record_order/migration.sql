-- AlterTable
ALTER TABLE "feature_node_records" ADD COLUMN "order" INTEGER;

-- CreateIndex
CREATE INDEX "feature_node_records_node_id_record_type_order_idx" ON "feature_node_records"("node_id", "record_type", "order");
