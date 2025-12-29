export class McqTopicListSerializer {
  static serialize(topics) {
    return topics.map(topic => {
      const topicTags = topic.mcq_topic_tags || []

      return {
        id: topic.id,
        title: topic.title,
        description: topic.description,
        quiz_timeLimit: topic.quiz_time_limit,
        passingScore: topic.passing_score,
        questionCount: topic.mcq_questions?.length || topic._count?.mcq_questions || 0,
        tags: topicTags.map(tt => ({
          id: tt.tags.id,
          name: tt.tags.name,
          tagGroup: {
            name: tt.tags.tag_group?.name || null
          }
        }))
      }
    })
  }
}
