CREATE TABLE "user_learned_items" (
  "id"         SERIAL        NOT NULL,
  "user_id"    INTEGER       NOT NULL,
  "item_type"  TEXT          NOT NULL,
  "item_id"    INTEGER       NOT NULL,
  "is_correct" BOOLEAN,
  "created_at" TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "user_learned_items_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "user_learned_items_user_type_item_idx" ON "user_learned_items"("user_id", "item_type", "item_id");
CREATE INDEX "user_learned_items_user_id_idx"         ON "user_learned_items"("user_id");
