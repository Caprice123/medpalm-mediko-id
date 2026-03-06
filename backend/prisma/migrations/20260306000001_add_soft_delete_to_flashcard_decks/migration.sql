ALTER TABLE "flashcard_decks" ADD COLUMN "is_deleted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "flashcard_decks" ADD COLUMN "deleted_at" TIMESTAMP(3);
CREATE INDEX "flashcard_decks_is_deleted_idx" ON "flashcard_decks"("is_deleted");
