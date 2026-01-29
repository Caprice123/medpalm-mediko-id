-- AlterTable
ALTER TABLE "skripsi_diagrams"
ALTER COLUMN "diagram_type" DROP NOT NULL,
ALTER COLUMN "detail_level" DROP NOT NULL,
ALTER COLUMN "orientation" DROP NOT NULL,
ALTER COLUMN "layout_style" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
