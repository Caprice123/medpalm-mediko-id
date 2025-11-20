-- CreateTable
CREATE TABLE "summary_notes" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "source_type" TEXT,
    "source_url" TEXT,
    "source_key" TEXT,
    "source_filename" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "summary_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "summary_note_tags" (
    "id" SERIAL NOT NULL,
    "summary_note_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "summary_note_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "summary_note_sessions" (
    "id" SERIAL NOT NULL,
    "user_learning_session_id" INTEGER NOT NULL,
    "summary_note_id" INTEGER NOT NULL,
    "credits_used" INTEGER NOT NULL DEFAULT 0,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "summary_note_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "summary_notes_created_by_idx" ON "summary_notes"("created_by");

-- CreateIndex
CREATE INDEX "summary_notes_is_active_idx" ON "summary_notes"("is_active");

-- CreateIndex
CREATE INDEX "summary_notes_status_idx" ON "summary_notes"("status");

-- CreateIndex
CREATE INDEX "summary_note_tags_summary_note_id_idx" ON "summary_note_tags"("summary_note_id");

-- CreateIndex
CREATE INDEX "summary_note_tags_tag_id_idx" ON "summary_note_tags"("tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "summary_note_tags_summary_note_id_tag_id_key" ON "summary_note_tags"("summary_note_id", "tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "summary_note_sessions_user_learning_session_id_key" ON "summary_note_sessions"("user_learning_session_id");

-- CreateIndex
CREATE INDEX "summary_note_sessions_user_learning_session_id_idx" ON "summary_note_sessions"("user_learning_session_id");

-- CreateIndex
CREATE INDEX "summary_note_sessions_summary_note_id_idx" ON "summary_note_sessions"("summary_note_id");

-- AddForeignKey
ALTER TABLE "summary_note_tags" ADD CONSTRAINT "summary_note_tags_summary_note_id_fkey" FOREIGN KEY ("summary_note_id") REFERENCES "summary_notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "summary_note_tags" ADD CONSTRAINT "summary_note_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "summary_note_sessions" ADD CONSTRAINT "summary_note_sessions_user_learning_session_id_fkey" FOREIGN KEY ("user_learning_session_id") REFERENCES "user_learning_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "summary_note_sessions" ADD CONSTRAINT "summary_note_sessions_summary_note_id_fkey" FOREIGN KEY ("summary_note_id") REFERENCES "summary_notes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
