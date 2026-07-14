CREATE TABLE "user_recently_viewed" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "record_type" TEXT NOT NULL,
    "record_id" INTEGER NOT NULL,
    "metadata" JSONB,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_recently_viewed_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_recently_viewed_user_id_record_type_record_id_key"
    ON "user_recently_viewed"("user_id", "record_type", "record_id");

CREATE INDEX "user_recently_viewed_user_id_record_type_viewed_at_idx"
    ON "user_recently_viewed"("user_id", "record_type", "viewed_at" DESC);
