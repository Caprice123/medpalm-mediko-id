export class McqTopicListSerializer {
  static serialize(topics) {
    return topics.map(topic => {
      const topicTags = topic.mcq_topic_tags || topic.tags || []

      const allTags = topicTags.map(tt => ({
        id: tt.tags ? tt.tags.id : tt.id,
        name: tt.tags ? tt.tags.name : tt.name,
        tagGroupName: tt.tags?.tag_group?.name || null
      }))

      const universityTags = allTags.filter(tag => tag.tagGroupName === 'university')
      const semesterTags = allTags.filter(tag => tag.tagGroupName === 'semester')

      return {
        id: topic.id,
        title: topic.title,
        description: topic.description,
        status: topic.status,
        quiz_time_limit: topic.quiz_time_limit,
        passing_score: topic.passing_score,
        question_count: topic._count?.mcq_questions || topic.questionCount || 0,
        universityTags,
        semesterTags
      }
    })
  }
}
