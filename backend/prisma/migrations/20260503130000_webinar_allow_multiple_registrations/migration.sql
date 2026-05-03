-- Allow multiple registrations per user per webinar (for re-submission history)
DROP INDEX IF EXISTS "webinar_registrations_webinar_id_user_id_key";
