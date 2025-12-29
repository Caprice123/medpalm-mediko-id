export class McqTopicSerializer {
  static serialize(topic) {
    const topicTags = topic.mcq_topic_tags || topic.tags || []
    const questions = topic.mcq_questions || topic.questions || []

    // Separate tags by group
    const allTags = topicTags.map(tt => ({
      id: tt.tags ? tt.tags.id : tt.id,
      name: tt.tags ? tt.tags.name : tt.name,
      tagGroupName: tt.tags?.tag_group?.name || tt.tagGroupName || null
    }))

    const universityTags = allTags.filter(tag => tag.tagGroupName === 'university')
    const semesterTags = allTags.filter(tag => tag.tagGroupName === 'semester')

    return {
      id: topic.id,
      title: topic.title,
      description: topic.description,
      contentType: topic.content_type,
      quiz_timeLimit: topic.quiz_time_limit,
      passingScore: topic.passing_score,
      status: topic.status,
      questions: questions.map((q, index) => ({
        id: q.id,
        question: q.question,
        options: q.options || [],
        correct_answer: q.correct_answer,
        explanation: q.explanation || '',
        imageUrl: q.image_url || null,
        imageKey: q.image_key || null,
        imageFilename: q.image_filename || null,
        order: q.order !== undefined ? q.order : index
      })),
      universityTags,
      semesterTags
    }
  }
}
