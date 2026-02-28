-- CreateTable: Atlas Models
CREATE TABLE "atlas_models" (
    "id" SERIAL NOT NULL,
    "unique_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "embed_url" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "atlas_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Atlas Structures
CREATE TABLE "atlas_structures" (
    "id" SERIAL NOT NULL,
    "model_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "system" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "atlas_structures_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Atlas Model Tags
CREATE TABLE "atlas_model_tags" (
    "id" SERIAL NOT NULL,
    "model_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "atlas_model_tags_pkey" PRIMARY KEY ("id")
);

-- CreateUniqueIndex
CREATE UNIQUE INDEX "atlas_models_unique_id_key" ON "atlas_models"("unique_id");

-- CreateUniqueIndex
CREATE UNIQUE INDEX "atlas_model_tags_model_id_tag_id_key" ON "atlas_model_tags"("model_id", "tag_id");

-- CreateIndex
CREATE INDEX "atlas_models_created_by_idx" ON "atlas_models"("created_by");

-- CreateIndex
CREATE INDEX "atlas_models_status_idx" ON "atlas_models"("status");

-- CreateIndex
CREATE INDEX "atlas_structures_model_id_idx" ON "atlas_structures"("model_id");

-- CreateIndex
CREATE INDEX "atlas_model_tags_model_id_idx" ON "atlas_model_tags"("model_id");

-- CreateIndex
CREATE INDEX "atlas_model_tags_tag_id_idx" ON "atlas_model_tags"("tag_id");

-- Enable pg_trgm extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- CreateIndex (GIN full-text search)
CREATE INDEX "atlas_models_search_gin_idx" ON "atlas_models" USING GIN ("title" gin_trgm_ops, "description" gin_trgm_ops);

-- AddForeignKey
ALTER TABLE "atlas_structures" ADD CONSTRAINT "atlas_structures_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "atlas_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atlas_model_tags" ADD CONSTRAINT "atlas_model_tags_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "atlas_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atlas_model_tags" ADD CONSTRAINT "atlas_model_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
