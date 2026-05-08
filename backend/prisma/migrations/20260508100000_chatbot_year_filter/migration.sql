-- AlterTable
ALTER TABLE "user_chatbot_settings"
  ADD COLUMN "latest_years" INTEGER,
  ADD COLUMN "year_from"    INTEGER,
  ADD COLUMN "year_to"      INTEGER;
