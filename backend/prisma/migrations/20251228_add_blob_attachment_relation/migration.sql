-- AddForeignKey: Add relation between attachments and blobs
-- This establishes the foreign key constraint for the blob/attachment system

-- CreateIndex: Add index on blobs.checksum for duplicate detection
CREATE INDEX IF NOT EXISTS "blobs_checksum_idx" ON "blobs"("checksum");

-- AddForeignKey: attachments -> blobs
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_blobId_fkey"
  FOREIGN KEY ("blobId") REFERENCES "blobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
