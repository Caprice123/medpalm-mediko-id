CREATE TABLE "skripsi_journal_names" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "skripsi_journal_names_name_key" UNIQUE ("name")
);

ALTER TABLE "skripsi_set_settings" ADD COLUMN IF NOT EXISTS "selected_journals" JSONB NOT NULL DEFAULT '[]';
