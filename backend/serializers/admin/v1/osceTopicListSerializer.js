export class OsceTopicListSerializer {
    /**
     * Serialize array of topics for list view (index endpoint)
     * Excludes heavy data like scenario and system prompt
     */
    static serialize(topics) {
        return topics.map(topic => this.serializeTopic(topic))
    }

    /**
     * Serialize single topic
     */
    static serializeTopic(topic) {
        const topicTags = topic.osce_topic_tags || topic.tags || [];

        return {
            id: topic.id,
            uniqueId: topic.unique_id,
            title: topic.title,
            description: topic.description,
            aiModel: topic.ai_model,
            durationMinutes: topic.duration_minutes,
            status: topic.status,
            tags: topicTags.map(tag => ({
                id: tag.tags ? tag.tags.id : (tag.tag ? tag.tag.id : tag.id),
                name: tag.tags ? tag.tags.name : (tag.tag ? tag.tag.name : tag.name),
                tagGroup: tag.tags?.tag_group ? {
                    id: tag.tags.tag_group.id,
                    name: tag.tags.tag_group.name
                } : null
            })),
            createdAt: topic.created_at,
            updatedAt: topic.updated_at
        }
    }
}
