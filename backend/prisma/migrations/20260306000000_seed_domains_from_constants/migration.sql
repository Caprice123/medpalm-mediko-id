-- Reseed chatbot_research_domains from existing constant value
DELETE FROM "chatbot_research_domains";

INSERT INTO "chatbot_research_domains" ("domain", "is_active", "created_at", "updated_at")
SELECT
  trim(domain_value),
  true,
  NOW(),
  NOW()
FROM (
  SELECT unnest(string_to_array(value, ',')) AS domain_value
  FROM "constants"
  WHERE key = 'chatbot_research_trusted_domains'
) sub
WHERE trim(domain_value) != '';

-- Reseed skripsi_research_domains from existing constant value
DELETE FROM "skripsi_research_domains";

INSERT INTO "skripsi_research_domains" ("domain", "is_active", "created_at", "updated_at")
SELECT
  trim(domain_value),
  true,
  NOW(),
  NOW()
FROM (
  SELECT unnest(string_to_array(value, ',')) AS domain_value
  FROM "constants"
  WHERE key = 'skripsi_ai_researcher_trusted_domains'
) sub
WHERE trim(domain_value) != '';
