-- CreateTable
CREATE TABLE "skripsi_constants" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skripsi_constants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "skripsi_constants_key_key" ON "skripsi_constants"("key");

-- CreateIndex
CREATE INDEX "skripsi_constants_key_idx" ON "skripsi_constants"("key");

-- Insert default values
INSERT INTO "skripsi_constants" ("key", "value", "description") VALUES
('credits_per_message', '1', 'Number of credits deducted per AI message sent'),
('max_ai_researcher_tabs', '3', 'Maximum number of AI Researcher tabs available (1-3)'),
('ai_model', 'gpt-4', 'AI model to use for generating responses'),
('enable_paraphraser', 'true', 'Enable/disable the Paraphraser tab'),
('enable_diagram_builder', 'true', 'Enable/disable the Diagram Builder tab');
