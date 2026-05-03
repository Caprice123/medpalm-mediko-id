-- CreateTable events
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3),
    "registration_start_at" TIMESTAMP(3),
    "registration_end_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'draft',
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable event_registrations
CREATE TABLE "event_registrations" (
    "id" SERIAL NOT NULL,
    "unique_id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "event_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "admin_notes" TEXT,
    "reviewed_by" INTEGER,
    "reviewed_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "events_code_key" ON "events"("code");
CREATE INDEX "events_status_idx" ON "events"("status");
CREATE INDEX "events_is_deleted_idx" ON "events"("is_deleted");
CREATE INDEX "events_start_at_idx" ON "events"("start_at");

CREATE UNIQUE INDEX "event_registrations_unique_id_key" ON "event_registrations"("unique_id");
CREATE INDEX "event_registrations_event_id_idx" ON "event_registrations"("event_id");
CREATE INDEX "event_registrations_user_id_idx" ON "event_registrations"("user_id");
CREATE INDEX "event_registrations_status_idx" ON "event_registrations"("status");

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
