-- Follow-up to 20261106000000, which merged diagnostic cases into `diagnostic_quizzes`
-- but left their image attachments under record_type 'diagnostic_case'.
--
-- A case and a V1 quiz are now the same row, and V1 has always kept that row's image
-- under record_type 'diagnostic_quiz'. Keeping two names for one row's image meant the
-- V2 case form read 'diagnostic_case' and so found nothing for a legacy V1 quiz opened
-- from the unlinked inbox — its image is filed under 'diagnostic_quiz'. Unify on the
-- name that follows the table, so one row has exactly one image both sides can see.
--
-- Only `attachments` moves. `feature_node_records`, `user_review_states`,
-- `user_learned_items`, `node_statistics`, `user_node_progress` and
-- `user_feature_statistics` keep 'diagnostic_case', which names the unit of study rather
-- than the table. `attachments` has only an index on (record_type, record_id, name), no
-- unique constraint, so nothing here can collide.
UPDATE "attachments"
SET "record_type" = 'diagnostic_quiz'
WHERE "record_type" = 'diagnostic_case';
