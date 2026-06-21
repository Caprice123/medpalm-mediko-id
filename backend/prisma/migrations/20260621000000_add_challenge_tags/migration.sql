CREATE TABLE "challenge_tags" (
  "id"           SERIAL PRIMARY KEY,
  "challenge_id" INTEGER NOT NULL,
  "tag_id"       INTEGER NOT NULL,
  "created_at"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "challenge_tags_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "challenge_tags_tag_id_fkey"       FOREIGN KEY ("tag_id")       REFERENCES "tags"("id")       ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "challenge_tags_challenge_id_tag_id_key" UNIQUE ("challenge_id", "tag_id")
);

CREATE INDEX "challenge_tags_challenge_id_idx" ON "challenge_tags"("challenge_id");
CREATE INDEX "challenge_tags_tag_id_idx"       ON "challenge_tags"("tag_id");
