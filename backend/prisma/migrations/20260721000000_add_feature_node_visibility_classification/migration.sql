-- AlterTable: add visibility, classification, layer to feature_nodes
ALTER TABLE "feature_nodes" ADD COLUMN "visibility" TEXT NOT NULL DEFAULT 'general';
ALTER TABLE "feature_nodes" ADD COLUMN "classification" TEXT;
ALTER TABLE "feature_nodes" ADD COLUMN "layer" INTEGER;

-- CreateIndex
CREATE INDEX "feature_nodes_layer_idx" ON "feature_nodes"("layer");

-- AlterTable: make deck_id nullable on flashcard_cards, add node_id for V2 node-based cards
ALTER TABLE "flashcard_cards" ALTER COLUMN "deck_id" DROP NOT NULL;
ALTER TABLE "flashcard_cards" ADD COLUMN "node_id" INTEGER;

-- CreateIndex
CREATE INDEX "flashcard_cards_node_id_idx" ON "flashcard_cards"("node_id");
