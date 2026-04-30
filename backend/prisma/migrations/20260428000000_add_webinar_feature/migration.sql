-- CreateTable
CREATE TABLE "webinar_events" (
    "id" SERIAL NOT NULL,
    "unique_id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "join_url" TEXT NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'draft',
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webinar_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webinar_registrations" (
    "id" SERIAL NOT NULL,
    "unique_id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "webinar_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "admin_notes" TEXT,
    "reviewed_by" INTEGER,
    "reviewed_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webinar_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "webinar_events_unique_id_key" ON "webinar_events"("unique_id");

-- CreateIndex
CREATE INDEX "webinar_events_status_idx" ON "webinar_events"("status");

-- CreateIndex
CREATE INDEX "webinar_events_is_deleted_idx" ON "webinar_events"("is_deleted");

-- CreateIndex
CREATE INDEX "webinar_events_start_at_idx" ON "webinar_events"("start_at");

-- CreateIndex
CREATE UNIQUE INDEX "webinar_registrations_unique_id_key" ON "webinar_registrations"("unique_id");

-- CreateIndex
CREATE UNIQUE INDEX "webinar_registrations_webinar_id_user_id_key" ON "webinar_registrations"("webinar_id", "user_id");

-- CreateIndex
CREATE INDEX "webinar_registrations_webinar_id_idx" ON "webinar_registrations"("webinar_id");

-- CreateIndex
CREATE INDEX "webinar_registrations_user_id_idx" ON "webinar_registrations"("user_id");

-- CreateIndex
CREATE INDEX "webinar_registrations_status_idx" ON "webinar_registrations"("status");
