CREATE TABLE "content_relations" (
  "id" SERIAL NOT NULL,
  "source_type" TEXT NOT NULL,
  "source_id" INTEGER NOT NULL,
  "target_type" TEXT NOT NULL,
  "target_id" INTEGER NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "content_relations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "content_relations_source_target_key" ON "content_relations"("source_type", "source_id", "target_type", "target_id");
CREATE INDEX "content_relations_source_idx" ON "content_relations"("source_type", "source_id");
CREATE INDEX "content_relations_target_idx" ON "content_relations"("target_type", "target_id");
