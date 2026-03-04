-- Rename anatomy quiz tables to diagnostic quiz tables

-- Rename main tables
ALTER TABLE anatomy_quizzes RENAME TO diagnostic_quizzes;
ALTER TABLE anatomy_questions RENAME TO diagnostic_questions;
ALTER TABLE anatomy_quiz_tags RENAME TO diagnostic_quiz_tags;
ALTER TABLE anatomy_quiz_attempts RENAME TO diagnostic_quiz_attempts;
ALTER TABLE anatomy_quiz_answers RENAME TO diagnostic_quiz_answers;
ALTER TABLE user_anatomy_progress RENAME TO user_diagnostic_progress;

-- Rename indexes
ALTER INDEX IF EXISTS anatomy_quizzes_pkey RENAME TO diagnostic_quizzes_pkey;
ALTER INDEX IF EXISTS anatomy_questions_pkey RENAME TO diagnostic_questions_pkey;
ALTER INDEX IF EXISTS anatomy_quiz_tags_pkey RENAME TO diagnostic_quiz_tags_pkey;
ALTER INDEX IF EXISTS anatomy_quiz_attempts_pkey RENAME TO diagnostic_quiz_attempts_pkey;
ALTER INDEX IF EXISTS anatomy_quiz_answers_pkey RENAME TO diagnostic_quiz_answers_pkey;
ALTER INDEX IF EXISTS user_anatomy_progress_pkey RENAME TO user_diagnostic_progress_pkey;

-- Rename unique indexes
ALTER INDEX IF EXISTS anatomy_quizzes_unique_id_key RENAME TO diagnostic_quizzes_unique_id_key;
ALTER INDEX IF EXISTS anatomy_quiz_tags_quiz_id_tag_id_key RENAME TO diagnostic_quiz_tags_quiz_id_tag_id_key;
ALTER INDEX IF EXISTS user_anatomy_progress_user_id_question_id_key RENAME TO user_diagnostic_progress_user_id_question_id_key;

-- Rename GIN index
ALTER INDEX IF EXISTS anatomy_quizzes_search_gin_idx RENAME TO diagnostic_quizzes_search_gin_idx;

-- Update attachments record_type values
UPDATE attachments SET record_type = 'diagnostic_quiz' WHERE record_type = 'anatomy_quiz';

-- Update constants keys
-- UPDATE constants SET key = 'diagnostic_feature_title' WHERE key = 'anatomy_feature_title';
-- UPDATE constants SET key = 'diagnostic_feature_description' WHERE key = 'anatomy_feature_description';
-- UPDATE constants SET key = 'diagnostic_generation_model' WHERE key = 'anatomy_generation_model';
-- UPDATE constants SET key = 'diagnostic_generation_prompt' WHERE key = 'anatomy_generation_prompt';
-- UPDATE constants SET key = 'diagnostic_access_type' WHERE key = 'anatomy_access_type';
-- UPDATE constants SET key = 'diagnostic_credit_cost' WHERE key = 'anatomy_credit_cost';
-- UPDATE constants SET key = 'diagnostic_is_active' WHERE key = 'anatomy_is_active';
-- UPDATE constants SET key = 'diagnostic_youtube_url' WHERE key = 'anatomy_youtube_url';
