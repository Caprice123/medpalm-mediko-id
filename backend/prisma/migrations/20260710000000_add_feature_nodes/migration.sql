-- CreateTable
CREATE TABLE "feature_nodes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parent_id" INTEGER,
    "node_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feature_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_node_records" (
    "id" SERIAL NOT NULL,
    "node_id" INTEGER NOT NULL,
    "record_type" TEXT NOT NULL,
    "record_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feature_node_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "feature_nodes_slug_key" ON "feature_nodes"("slug");

-- CreateIndex
CREATE INDEX "feature_nodes_parent_id_idx" ON "feature_nodes"("parent_id");

-- CreateIndex
CREATE INDEX "feature_nodes_name_idx" ON "feature_nodes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "feature_node_records_node_id_record_type_record_id_key" ON "feature_node_records"("node_id", "record_type", "record_id");

-- CreateIndex
CREATE INDEX "feature_node_records_record_type_record_id_idx" ON "feature_node_records"("record_type", "record_id");

-- Note: no FK constraints — schema uses relationMode = "prisma" (ORM-level referential integrity)
