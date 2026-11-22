-- AlterTable: the PBL case the report is written about
ALTER TABLE "skripsi_sets" ADD COLUMN "case_text" TEXT;

-- AlterTable: a template with an owner is that student's own; the admin-managed
-- ones everyone sees keep owner_user_id NULL.
ALTER TABLE "skripsi_templates" ADD COLUMN "owner_user_id" INTEGER;

-- CreateTable: the group a PBL report belongs to. Names are typed in, so a
-- member does not need a MedPal account to appear on the cover.
CREATE TABLE "skripsi_set_members" (
    "id" SERIAL NOT NULL,
    "set_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "student_number" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skripsi_set_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "skripsi_set_members_set_id_idx" ON "skripsi_set_members"("set_id");
CREATE INDEX "skripsi_templates_owner_user_id_idx" ON "skripsi_templates"("owner_user_id");

-- NOTE: the schema runs with relationMode = "prisma", so relations are enforced
-- by the client rather than by database foreign keys — only the indexes above
-- are created, matching every other migration in this project.
