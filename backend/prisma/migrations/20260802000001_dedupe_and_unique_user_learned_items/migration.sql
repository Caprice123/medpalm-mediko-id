-- Remove duplicate rows, keeping the earliest (lowest id) per (user_id, item_type, item_id)
DELETE FROM "user_learned_items" a
USING "user_learned_items" b
WHERE a."user_id" = b."user_id"
  AND a."item_type" = b."item_type"
  AND a."item_id" = b."item_id"
  AND a."id" > b."id";

-- Replace the non-unique lookup index with a unique constraint so create-or-ignore is enforceable
DROP INDEX "user_learned_items_user_type_item_idx";
CREATE UNIQUE INDEX "user_learned_items_user_type_item_key" ON "user_learned_items"("user_id", "item_type", "item_id");
