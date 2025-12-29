export class CalculatorTopicListSerializer {
  static serialize(topics) {
    return topics.map(topic => {
      const topicTags = topic.calculator_topic_tags || topic.tags || []
      const topicFields = topic.calculator_fields || topic.fields || []

      return {
        id: topic.id,
        title: topic.title,
        description: topic.description,
        tags: topicTags.map(tt => ({
          id: tt.tags ? tt.tags.id : tt.id,
          name: tt.tags ? tt.tags.name : tt.name,
          tag_group: tt.tags?.tag_group ? {
            id: tt.tags.tag_group.id,
            name: tt.tags.tag_group.name
          } : null
        })),
        fields: topicFields.map(f => ({
          id: f.id,
          key: f.key,
          label: f.label
        })),
        updated_at: topic.updated_at
      }
    })
  }
}
