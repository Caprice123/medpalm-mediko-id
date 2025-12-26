-- Add Skripsi Builder feature constants
INSERT INTO "constants" ("key", "value", "created_at", "updated_at") VALUES
('skripsi_builder_feature_title', 'Skripsi Builder', NOW(), NOW()),
('skripsi_builder_feature_description', 'AI-powered skripsi writing assistant dengan multiple tabs untuk research, paraphrasing, dan diagram building', NOW(), NOW()),
('skripsi_builder_credit_cost', '0', NOW(), NOW()),
('skripsi_builder_access_type', 'subscription', NOW(), NOW()),
('skripsi_builder_is_active', 'true', NOW(), NOW())
ON CONFLICT (key) DO NOTHING;
