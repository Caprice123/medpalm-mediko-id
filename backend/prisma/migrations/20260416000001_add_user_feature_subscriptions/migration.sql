-- CreateTable
CREATE TABLE "user_feature_subscriptions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "feature" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_feature_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_feature_subscriptions_user_id_feature_key" ON "user_feature_subscriptions"("user_id", "feature");

-- CreateIndex
CREATE INDEX "user_feature_subscriptions_user_id_idx" ON "user_feature_subscriptions"("user_id");

-- CreateIndex
CREATE INDEX "user_feature_subscriptions_feature_idx" ON "user_feature_subscriptions"("feature");

-- CreateIndex
CREATE INDEX "user_feature_subscriptions_is_active_idx" ON "user_feature_subscriptions"("is_active");

-- Seed: give all existing users access to all features
INSERT INTO "user_feature_subscriptions" ("user_id", "feature", "is_active")
SELECT u.id, f.feature, true
FROM "users" u
CROSS JOIN (
  VALUES
    ('exercise'),
    ('flashcard'),
    ('calculator'),
    ('diagnostic'),
    ('anatomy'),
    ('mcq'),
    ('chatbot'),
    ('skripsi'),
    ('oscePractice'),
    ('summaryNotes'),
    ('atlas')
) AS f(feature)
WHERE u.role = 'user'
ON CONFLICT DO NOTHING;
