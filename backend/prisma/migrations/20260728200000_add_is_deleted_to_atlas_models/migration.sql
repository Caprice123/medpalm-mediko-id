ALTER TABLE "atlas_models" ADD COLUMN "is_deleted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "atlas_models" ADD COLUMN "deleted_at" TIMESTAMP(3);
CREATE INDEX "atlas_models_is_deleted_idx" ON "atlas_models"("is_deleted");
