-- Make start_at and end_at optional since registration dates cover the event window
ALTER TABLE "events" ALTER COLUMN "start_at" DROP NOT NULL;
