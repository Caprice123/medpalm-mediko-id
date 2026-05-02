-- CreateTable
CREATE TABLE "banners" (
    "id" SERIAL NOT NULL,
    "unique_id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "redirect_url" TEXT NOT NULL,
    "redirect_label" TEXT,
    "gradient_start" TEXT,
    "gradient_end" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "banners_unique_id_key" ON "banners"("unique_id");
CREATE INDEX "banners_is_active_idx" ON "banners"("is_active");
CREATE INDEX "banners_is_deleted_idx" ON "banners"("is_deleted");
CREATE INDEX "banners_order_idx" ON "banners"("order");
