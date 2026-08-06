-- Add card type (basic/cloze/occlusion) support to flashcard_cards
ALTER TABLE "flashcard_cards" ADD COLUMN "type" TEXT NOT NULL DEFAULT 'basic';
ALTER TABLE "flashcard_cards" ADD COLUMN "cloze_answers" JSONB;
ALTER TABLE "flashcard_cards" ADD COLUMN "occlusion_regions" JSONB;

-- front/back are only required for basic cards; cloze/occlusion use the new columns instead
ALTER TABLE "flashcard_cards" ALTER COLUMN "front" DROP NOT NULL;
ALTER TABLE "flashcard_cards" ALTER COLUMN "back" DROP NOT NULL;
