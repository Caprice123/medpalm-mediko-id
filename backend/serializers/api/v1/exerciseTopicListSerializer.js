export class ExerciseTopicListSerializer {
  static serialize(topics) {
    return topics.map(topic => ({
      id: topic.id,
      uniqueId: topic.unique_id,
      title: topic.title,
      description: topic.description,
      tags: (topic.exercise_topic_tags || []).map(t => ({
        id: t.tags.id,
        name: t.tags.name,
        tagGroupId: t.tags.tag_group_id
      })),
      questionCount: topic.question_count || 0,
      updatedAt: topic.updated_at
    }))
  }
}
