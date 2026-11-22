-- CreateTable
CREATE TABLE "skripsi_templates" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skripsi_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skripsi_template_sections" (
    "id" SERIAL NOT NULL,
    "template_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "is_reference_slot" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skripsi_template_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skripsi_sections" (
    "id" SERIAL NOT NULL,
    "set_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "is_reference_slot" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skripsi_sections_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "skripsi_sets" ADD COLUMN "template_id" INTEGER;
ALTER TABLE "skripsi_sets" ADD COLUMN "work_mode" TEXT NOT NULL DEFAULT 'manual';

-- CreateIndex
CREATE UNIQUE INDEX "skripsi_templates_key_key" ON "skripsi_templates"("key");
CREATE INDEX "skripsi_templates_is_active_idx" ON "skripsi_templates"("is_active");
CREATE INDEX "skripsi_templates_position_idx" ON "skripsi_templates"("position");
CREATE INDEX "skripsi_template_sections_template_id_idx" ON "skripsi_template_sections"("template_id");
CREATE INDEX "skripsi_sections_set_id_idx" ON "skripsi_sections"("set_id");
CREATE INDEX "skripsi_sections_position_idx" ON "skripsi_sections"("position");

-- NOTE: the schema runs with relationMode = "prisma", so relations are enforced
-- by the client rather than by database foreign keys — only the indexes above
-- are created, matching every other migration in this project.

-- MigrateData: every existing set keeps its document as one section, so the
-- editor has something to show after the switch away from editor_content.
INSERT INTO "skripsi_sections" ("set_id", "title", "content", "position", "created_at", "updated_at")
SELECT "id", 'Isi Laporan', "editor_content", 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "skripsi_sets"
WHERE "editor_content" IS NOT NULL AND "editor_content" <> '';
