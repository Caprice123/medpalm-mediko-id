-- CreateTable: Skripsi Diagrams
CREATE TABLE "skripsi_diagrams" (
    "id" SERIAL NOT NULL,
    "tab_id" INTEGER NOT NULL,
    "diagram_type" TEXT NOT NULL,
    "detail_level" TEXT NOT NULL,
    "orientation" TEXT NOT NULL,
    "layout_style" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "diagram_data" TEXT NOT NULL,
    "credits_used" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skripsi_diagrams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "skripsi_diagrams_tab_id_idx" ON "skripsi_diagrams"("tab_id");
CREATE INDEX "skripsi_diagrams_diagram_type_idx" ON "skripsi_diagrams"("diagram_type");
CREATE INDEX "skripsi_diagrams_created_at_idx" ON "skripsi_diagrams"("created_at");

-- AddForeignKey
ALTER TABLE "skripsi_diagrams" ADD CONSTRAINT "skripsi_diagrams_tab_id_fkey" FOREIGN KEY ("tab_id") REFERENCES "skripsi_tabs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
