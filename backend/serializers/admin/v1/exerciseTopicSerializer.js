export class ExerciseTopicSerializer {
    static serialize(topic) {
        // Handle both old and new relation names
        const topicTags = topic.exercise_topic_tags || topic.tags || [];
        const topicQuestions = topic.exercise_questions || topic.questions || [];

        return {
            id: topic.id,
            title: topic.title,
            description: topic.description,
            content_type: topic.content_type,
            content: topic.content,
            // PDF-related fields
            pdf_url: topic.pdf_url || topic.blob?.url || null,
            pdf_key: topic.pdf_key || topic.blob?.key || null,
            pdf_filename: topic.pdf_filename || topic.blob?.filename || null,
            tags: topicTags.map(tag => ({
                id: tag.tags ? tag.tags.id : (tag.tag ? tag.tag.id : tag.id),
                name: tag.tags ? tag.tags.name : (tag.tag ? tag.tag.name : tag.name),
                tag_group: tag.tags?.tag_group ? {
                    id: tag.tags.tag_group.id,
                    name: tag.tags.tag_group.name
                } : null
            })),
            questions: topicQuestions.map((q, index) => ({
                id: q.id,
                question: q.question,
                answer: q.answer,
                explanation: q.explanation || '',
                order: q.order !== undefined ? q.order : index
            }))
        }
    }
}