-- CreateTable
CREATE TABLE "skripsi_sets" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "skripsi_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skripsi_tabs" (
    "id" SERIAL NOT NULL,
    "set_id" INTEGER NOT NULL,
    "tab_type" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "editor_content" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skripsi_tabs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skripsi_messages" (
    "id" SERIAL NOT NULL,
    "tab_id" INTEGER NOT NULL,
    "sender_type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skripsi_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "skripsi_sets_user_id_idx" ON "skripsi_sets"("user_id");

-- CreateIndex
CREATE INDEX "skripsi_sets_is_deleted_idx" ON "skripsi_sets"("is_deleted");

-- CreateIndex
CREATE INDEX "skripsi_tabs_set_id_idx" ON "skripsi_tabs"("set_id");

-- CreateIndex
CREATE INDEX "skripsi_tabs_tab_type_idx" ON "skripsi_tabs"("tab_type");

-- CreateIndex
CREATE INDEX "skripsi_messages_tab_id_idx" ON "skripsi_messages"("tab_id");

-- CreateIndex
CREATE INDEX "skripsi_messages_sender_type_idx" ON "skripsi_messages"("sender_type");

-- AddForeignKey
ALTER TABLE "skripsi_tabs" ADD CONSTRAINT "skripsi_tabs_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "skripsi_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skripsi_messages" ADD CONSTRAINT "skripsi_messages_tab_id_fkey" FOREIGN KEY ("tab_id") REFERENCES "skripsi_tabs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
