-- CreateTable
CREATE TABLE "skripsi_message_sources" (
    "id" SERIAL NOT NULL,
    "message_id" INTEGER NOT NULL,
    "source_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "url" TEXT,
    "score" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skripsi_message_sources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "skripsi_message_sources_message_id_idx" ON "skripsi_message_sources"("message_id");

-- CreateIndex
CREATE INDEX "skripsi_message_sources_source_type_idx" ON "skripsi_message_sources"("source_type");

-- AddForeignKey
ALTER TABLE "skripsi_message_sources" ADD CONSTRAINT "skripsi_message_sources_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "skripsi_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
