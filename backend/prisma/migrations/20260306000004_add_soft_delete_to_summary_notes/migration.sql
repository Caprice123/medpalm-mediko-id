ALTER TABLE "summary_notes" ADD COLUMN "is_deleted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "summary_notes" ADD COLUMN "deleted_at" TIMESTAMP(3);
CREATE INDEX "summary_notes_is_deleted_idx" ON "summary_notes"("is_deleted");
