-- CreateTable
CREATE TABLE IF NOT EXISTS "osce_session_physical_interactions" (
    "id" SERIAL NOT NULL,
    "osce_session_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "sender_type" TEXT NOT NULL,
    "credits_used" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "osce_session_physical_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "osce_session_physical_interactions_osce_session_id_idx" ON "osce_session_physical_interactions"("osce_session_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "osce_session_physical_interactions_sender_type_idx" ON "osce_session_physical_interactions"("sender_type");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "osce_session_physical_interactions_created_at_idx" ON "osce_session_physical_interactions"("created_at");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'osce_session_physical_interactions_osce_session_id_fkey'
    ) THEN
        ALTER TABLE "osce_session_physical_interactions"
        ADD CONSTRAINT "osce_session_physical_interactions_osce_session_id_fkey"
        FOREIGN KEY ("osce_session_id") REFERENCES "osce_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
