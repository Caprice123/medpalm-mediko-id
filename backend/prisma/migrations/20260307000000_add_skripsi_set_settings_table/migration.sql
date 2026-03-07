-- CreateTable
CREATE TABLE "skripsi_set_settings" (
    "id" SERIAL NOT NULL,
    "set_id" INTEGER NOT NULL,
    "selected_domains" JSONB NOT NULL DEFAULT '[]',
    "domain_filter_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skripsi_set_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "skripsi_set_settings_set_id_key" ON "skripsi_set_settings"("set_id");

-- CreateIndex
CREATE INDEX "skripsi_set_settings_set_id_idx" ON "skripsi_set_settings"("set_id");

-- MigrateData: copy existing per-set domain settings into the new table
INSERT INTO "skripsi_set_settings" ("set_id", "selected_domains", "domain_filter_enabled", "created_at", "updated_at")
SELECT "id", "selected_domains", "domain_filter_enabled", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "skripsi_sets"
WHERE "selected_domains" != '[]'::jsonb OR "domain_filter_enabled" = false;

-- AlterTable: remove migrated columns from skripsi_sets
ALTER TABLE "skripsi_sets" DROP COLUMN "selected_domains";
ALTER TABLE "skripsi_sets" DROP COLUMN "domain_filter_enabled";
