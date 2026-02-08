export class ExerciseTopicListSerializer {
  static serialize(topics) {
    return topics.map(topic => ({
      id: topic.id,
      uniqueId: topic.unique_id,
      title: topic.title,
      description: topic.description,
      status: topic.status,
      questionCount: topic.question_count || 0,
      tags: (topic.exercise_topic_tags || []).map(t => ({
        id: t.tags.id,
        name: t.tags.name,
        tagGroup: t.tags.tag_group ? {
          id: t.tags.tag_group.id,
          name: t.tags.tag_group.name
        } : null
      })),
      createdAt: topic.created_at,
    }))
  }
}
