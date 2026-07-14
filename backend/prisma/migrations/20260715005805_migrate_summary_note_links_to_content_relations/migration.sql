-- Migrate summary_note_flashcard_decks into content_relations
INSERT INTO content_relations (source_type, source_id, target_type, target_id, created_at, updated_at)
SELECT 'summary_note', summary_note_id, 'flashcard_deck', flashcard_deck_id, created_at, created_at
FROM summary_note_flashcard_decks
ON CONFLICT (source_type, source_id, target_type, target_id) DO NOTHING;

-- Migrate summary_note_mcq_topics into content_relations
INSERT INTO content_relations (source_type, source_id, target_type, target_id, created_at, updated_at)
SELECT 'summary_note', summary_note_id, 'mcq_topic', mcq_topic_id, created_at, created_at
FROM summary_note_mcq_topics
ON CONFLICT (source_type, source_id, target_type, target_id) DO NOTHING;
