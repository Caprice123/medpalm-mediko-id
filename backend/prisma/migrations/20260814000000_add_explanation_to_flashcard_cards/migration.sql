-- Add short/long explanation fields to flashcard_cards, shown after reveal in the player
ALTER TABLE "flashcard_cards" ADD COLUMN "explanation_short" TEXT;
ALTER TABLE "flashcard_cards" ADD COLUMN "explanation_long" TEXT;
