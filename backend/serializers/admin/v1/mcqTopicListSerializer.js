export class McqTopicListSerializer {
  static serialize(topics) {
    return topics.map(topic => {
      const rawTags = topic.mcq_topic_tags || topic.tags || []
      const allTags = rawTags.filter(tt => tt.tags).map(tt => ({
        id: tt.tags.id,
        name: tt.tags.name,
        tagGroupName: tt.tags?.tag_group?.name || null
      }))

      const universityTags = allTags.filter(tag => tag.tagGroupName === 'university')
      const semesterTags = allTags.filter(tag => tag.tagGroupName === 'semester')
      const topicTagsList = allTags.filter(tag => tag.tagGroupName === 'topic')
      const departmentTags = allTags.filter(tag => tag.tagGroupName === 'department')

      return {
        id: topic.id,
        uniqueId: topic.unique_id,
        title: topic.title,
        description: topic.description,
        status: topic.status,
        quizTimeLimit: topic.quiz_time_limit || topic.quizTimeLimit,
        passingScore: topic.passing_score || topic.passingScore,
        questionCount: topic.question_count || topic._count?.mcq_questions || topic.questionCount || 0,
        universityTags,
        semesterTags,
        topicTags: topicTagsList,
        departmentTags
      }
    })
  }
}
