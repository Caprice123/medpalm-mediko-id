-- CreateTable: chatbot_research_domains
CREATE TABLE "chatbot_research_domains" (
    "id" SERIAL NOT NULL,
    "domain" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chatbot_research_domains_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "chatbot_research_domains_domain_key" ON "chatbot_research_domains"("domain");
CREATE INDEX "chatbot_research_domains_is_active_idx" ON "chatbot_research_domains"("is_active");

-- CreateTable: user_chatbot_settings
CREATE TABLE "user_chatbot_settings" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "selected_domains" JSONB NOT NULL DEFAULT '[]',
    "domain_filter_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_chatbot_settings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_chatbot_settings_user_id_key" ON "user_chatbot_settings"("user_id");
CREATE INDEX "user_chatbot_settings_user_id_idx" ON "user_chatbot_settings"("user_id");
