CREATE TABLE "webhook_logs" (
  "id"                SERIAL PRIMARY KEY,
  "source"            TEXT NOT NULL,
  "event_type"        TEXT,
  "payment_reference" TEXT,
  "payload"           JSONB NOT NULL,
  "status"            TEXT NOT NULL,
  "error_message"     TEXT,
  "created_at"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "webhook_logs_source_idx"            ON "webhook_logs"("source");
CREATE INDEX "webhook_logs_payment_reference_idx" ON "webhook_logs"("payment_reference");
CREATE INDEX "webhook_logs_status_idx"            ON "webhook_logs"("status");
CREATE INDEX "webhook_logs_created_at_idx"        ON "webhook_logs"("created_at");
