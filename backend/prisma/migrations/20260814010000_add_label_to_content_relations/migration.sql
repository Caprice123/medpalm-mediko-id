-- Custom display label for a content_relations row (e.g. flashcard_card -> summary_note link name)
ALTER TABLE "content_relations" ADD COLUMN "label" TEXT;
