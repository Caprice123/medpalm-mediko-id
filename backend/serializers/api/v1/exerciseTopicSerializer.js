export class ExerciseTopicSerializer {
  static serialize(topic) {
    return {
      id: topic.id,
      uniqueId: topic.uniqueId || topic.unique_id,
      title: topic.title,
      description: topic.description,
      tags: (topic.exercise_topic_tags || []).map(t => ({
        id: t.tags.id,
        name: t.tags.name,
        tagGroupId: t.tags.tag_group_id
      })),
      questions: (topic.questions || []).map((q, index) => ({
        id: q.id,
        question: q.question,
        order: q.order !== undefined ? q.order : index
      }))
    }
  }
}
