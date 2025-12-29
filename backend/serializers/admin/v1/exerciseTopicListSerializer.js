export class ExerciseTopicListSerializer {
  static serialize(topics) {
    return topics.map(topic => ({
      id: topic.id,
      title: topic.title,
      description: topic.description,
      contentType: topic.content_type,
      questionCount: topic.exercise_questions?.length || topic._count?.exercise_questions || 0,
      tags: (topic.exercise_topic_tags || []).map(t => ({
        id: t.tags.id,
        name: t.tags.name,
        tagGroup: t.tags.tag_group ? {
          id: t.tags.tag_group.id,
          name: t.tags.tag_group.name
        } : null
      })),
      createdAt: topic.created_at,
      updatedAt: topic.updated_at
    }))
  }
}
