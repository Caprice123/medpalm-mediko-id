CREATE TABLE "user_favorites" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "record_type" TEXT NOT NULL,
  "record_id" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "user_favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "user_favorites_user_id_record_type_record_id_key" ON "user_favorites"("user_id", "record_type", "record_id");
CREATE INDEX "user_favorites_user_id_record_type_idx" ON "user_favorites"("user_id", "record_type");
