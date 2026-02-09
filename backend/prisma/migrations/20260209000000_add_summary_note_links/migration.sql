-- CreateTable
CREATE TABLE "summary_note_flashcard_decks" (
    "id" SERIAL NOT NULL,
    "summary_note_id" INTEGER NOT NULL,
    "flashcard_deck_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "summary_note_flashcard_decks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "summary_note_mcq_topics" (
    "id" SERIAL NOT NULL,
    "summary_note_id" INTEGER NOT NULL,
    "mcq_topic_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "summary_note_mcq_topics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "summary_note_flashcard_decks_summary_note_id_idx" ON "summary_note_flashcard_decks"("summary_note_id");

-- CreateIndex
CREATE INDEX "summary_note_flashcard_decks_flashcard_deck_id_idx" ON "summary_note_flashcard_decks"("flashcard_deck_id");

-- CreateIndex
CREATE UNIQUE INDEX "summary_note_flashcard_decks_summary_note_id_flashcard_deck__key" ON "summary_note_flashcard_decks"("summary_note_id", "flashcard_deck_id");

-- CreateIndex
CREATE INDEX "summary_note_mcq_topics_summary_note_id_idx" ON "summary_note_mcq_topics"("summary_note_id");

-- CreateIndex
CREATE INDEX "summary_note_mcq_topics_mcq_topic_id_idx" ON "summary_note_mcq_topics"("mcq_topic_id");

-- CreateIndex
CREATE UNIQUE INDEX "summary_note_mcq_topics_summary_note_id_mcq_topic_id_key" ON "summary_note_mcq_topics"("summary_note_id", "mcq_topic_id");

-- AddForeignKey
ALTER TABLE "summary_note_flashcard_decks" ADD CONSTRAINT "summary_note_flashcard_decks_summary_note_id_fkey" FOREIGN KEY ("summary_note_id") REFERENCES "summary_notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "summary_note_flashcard_decks" ADD CONSTRAINT "summary_note_flashcard_decks_flashcard_deck_id_fkey" FOREIGN KEY ("flashcard_deck_id") REFERENCES "flashcard_decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "summary_note_mcq_topics" ADD CONSTRAINT "summary_note_mcq_topics_summary_note_id_fkey" FOREIGN KEY ("summary_note_id") REFERENCES "summary_notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "summary_note_mcq_topics" ADD CONSTRAINT "summary_note_mcq_topics_mcq_topic_id_fkey" FOREIGN KEY ("mcq_topic_id") REFERENCES "mcq_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
