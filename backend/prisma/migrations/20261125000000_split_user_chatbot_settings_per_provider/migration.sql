-- One settings row per user per research provider. OpenAlex filters by journal
-- name and Perplexity by domain, so a user's pick, filter toggle and year window
-- belong to the provider they were made for; a single row per user cannot hold
-- both. Existing rows keep their 'openalex' stamp and become that provider's row.
DROP INDEX IF EXISTS "user_chatbot_settings_user_id_key";

CREATE UNIQUE INDEX "user_chatbot_settings_user_id_research_provider_key"
  ON "user_chatbot_settings"("user_id", "research_provider");
