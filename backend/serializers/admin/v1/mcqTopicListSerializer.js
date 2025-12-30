export class McqTopicListSerializer {
  static serialize(topics) {
    return topics.map(topic => {
      // If tags are already formatted by the service, use them directly
      // Otherwise, parse from the raw relation data
      let universityTags, semesterTags

      if (topic.universityTags !== undefined || topic.semesterTags !== undefined) {
        // Service already formatted the tags
        universityTags = topic.universityTags || []
        semesterTags = topic.semesterTags || []
      } else {
        // Parse from raw relation data
        const topicTags = topic.mcq_topic_tags || topic.tags || []

        const allTags = topicTags.map(tt => ({
          id: tt.tags ? tt.tags.id : tt.id,
          name: tt.tags ? tt.tags.name : tt.name,
          tagGroupName: tt.tags?.tag_group?.name || null
        }))

        universityTags = allTags.filter(tag => tag.tagGroupName === 'university')
        semesterTags = allTags.filter(tag => tag.tagGroupName === 'semester')
      }

      return {
        id: topic.id,
        title: topic.title,
        description: topic.description,
        status: topic.status,
        quizTimeLimit: topic.quiz_time_limit || topic.quizTimeLimit,
        passingScore: topic.passing_score || topic.passingScore,
        questionCount: topic.question_count || topic._count?.mcq_questions || topic.questionCount || 0,
        universityTags,
        semesterTags
      }
    })
  }
}
