export class CalculatorTopicListSerializer {
  static serialize(topics) {
    return topics.map(topic => ({
      id: topic.id,
      uniqueId: topic.unique_id,
      title: topic.title,
      description: topic.description,
      status: topic.status,
      fields_count: topic.calculator_fields?.length || topic._count?.calculator_fields || 0,
      tags: (topic.calculator_topic_tags || []).map(tt => ({
        id: tt.tags.id,
        name: tt.tags.name,
        tagGroup: {
          id: tt.tags.tag_group?.id,
          name: tt.tags.tag_group?.name
        }
      })),
      createdAt: topic.created_at
    }))
  }
}
