export class ExerciseTopicListSerializer {
  static serialize(topics) {
    return topics.map(topic => ({
      id: topic.id,
      title: topic.title,
      description: topic.description,
      tags: (topic.exercise_topic_tags || []).map(t => ({
        id: t.tags.id,
        name: t.tags.name,
        tagGroupId: t.tags.tag_group_id
      })),
      questionCount: topic.exercise_questions?.length || topic._count?.exercise_questions || 0,
      updated_at: topic.updated_at
    }))
  }
}
