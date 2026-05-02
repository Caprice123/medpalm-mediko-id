-- AlterTable: add registration window columns (non-nullable, default to webinar start_at for existing rows)
ALTER TABLE "webinar_events"
  ADD COLUMN "registration_start_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
  ADD COLUMN "registration_end_at"   TIMESTAMP(3) NOT NULL DEFAULT now();

-- Remove the defaults so future inserts must supply values explicitly
ALTER TABLE "webinar_events"
  ALTER COLUMN "registration_start_at" DROP DEFAULT,
  ALTER COLUMN "registration_end_at"   DROP DEFAULT;
