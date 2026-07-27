ALTER TABLE "feature_nodes" DROP COLUMN IF EXISTS "video_url";
ALTER TABLE "feature_nodes" DROP COLUMN IF EXISTS "bunny_video_id";
ALTER TABLE "blobs" ADD COLUMN IF NOT EXISTS "provider" TEXT NOT NULL DEFAULT 'idrive';
