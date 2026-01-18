// Serializer for user-facing OSCE topic list
class OsceTopicSerializer {
  static serialize(topic) {
    const tags = topic.osce_topic_tags?.map(tt => ({
      id: tt.tags.id,
      name: tt.tags.name,
      tagGroup: tt.tags.tag_group ? {
        id: tt.tags.tag_group.id,
        name: tt.tags.tag_group.name
      } : null
    })) || [];

    return {
      id: topic.id,
      title: topic.title,
      description: topic.description,
      scenario: topic.scenario,
      aiModel: topic.ai_model,
      durationMinutes: topic.duration_minutes,
      tags,
      createdAt: topic.created_at,
      updatedAt: topic.updated_at,
    };
  }

  static serializeList(topics) {
    return topics.map(topic => this.serialize(topic));
  }
}

export default OsceTopicSerializer;
