-- Which provider's vocabulary a user's saved trust selection is expressed in:
-- 'openalex' means `selected_journals` is the authoritative pick, 'perplexity'
-- means `selected_domains` is. Existing rows were all saved while OpenAlex was
-- the only research provider, so the default backfills them correctly.
ALTER TABLE "user_chatbot_settings"
  ADD COLUMN "research_provider" TEXT NOT NULL DEFAULT 'openalex';
