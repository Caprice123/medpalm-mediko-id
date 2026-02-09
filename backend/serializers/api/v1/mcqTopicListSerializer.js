export class McqTopicListSerializer {
  static serialize(topics) {
    return topics.map(topic => {
      const topicTags = topic.mcq_topic_tags || []

      return {
        id: topic.id,
        uniqueId: topic.unique_id,
        title: topic.title,
        description: topic.description,
        quizTimeLimit: topic.quiz_time_limit,
        passingScore: topic.passing_score,
        questionCount: topic.question_count || 0,
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
