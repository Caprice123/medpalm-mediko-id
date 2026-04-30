-- Add new columns to webinar_events
ALTER TABLE "webinar_events" ADD COLUMN "speakers" JSONB;
ALTER TABLE "webinar_events" ADD COLUMN "benefits" TEXT;
ALTER TABLE "webinar_events" ADD COLUMN "suitable_for" JSONB;

-- Convert join_url from TEXT to JSONB (wrap existing strings in array format)
ALTER TABLE "webinar_events"
  ALTER COLUMN "join_url" TYPE JSONB
  USING json_build_array(json_build_object('label', 'Bergabung ke Webinar', 'url', "join_url"));
