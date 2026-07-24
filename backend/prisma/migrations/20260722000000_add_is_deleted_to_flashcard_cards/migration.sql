ALTER TABLE "flashcard_cards" ADD COLUMN "is_deleted" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX "flashcard_cards_is_deleted_idx" ON "flashcard_cards"("is_deleted");
