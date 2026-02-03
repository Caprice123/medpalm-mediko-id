export class OsceTopicSerializer {
    static serialize(topic) {
        const topicTags = topic.osce_topic_tags || topic.tags || [];

        return {
            id: topic.id,
            title: topic.title,
            description: topic.description,
            scenario: topic.scenario,
            guide: topic.guide,
            context: topic.context,
            answerKey: topic.answer_key,
            knowledgeBase: topic.knowledge_base || [],
            aiModel: topic.ai_model,
            rubricId: topic.osce_rubric_id,
            durationMinutes: topic.duration_minutes,
            status: topic.status,
            createdBy: topic.created_by,
            createdAt: topic.created_at,
            updatedAt: topic.updated_at,
            tags: topicTags.map(tag => ({
                id: tag.tags ? tag.tags.id : (tag.tag ? tag.tag.id : tag.id),
                name: tag.tags ? tag.tags.name : (tag.tag ? tag.tag.name : tag.name),
                tagGroup: tag.tags?.tag_group ? {
                    id: tag.tags.tag_group.id,
                    name: tag.tags.tag_group.name
                } : null
            })),
            attachments: topic.attachments || [],
            observations: topic.observations || []
        }
    }
}
