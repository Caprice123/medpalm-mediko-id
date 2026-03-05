export class McqTopicSerializer {
  static serialize(topic) {
    const rawTags = topic.mcq_topic_tags || topic.tags || []
    const questions = topic.mcq_questions || topic.questions || []

    // Separate tags by group
    const allTags = rawTags.filter(tt => tt.tags).map(tt => ({
      id: tt.tags.id,
      name: tt.tags.name,
      tagGroupName: tt.tags?.tag_group?.name || null
    }))

    const universityTags = allTags.filter(tag => tag.tagGroupName === 'university')
    const semesterTags = allTags.filter(tag => tag.tagGroupName === 'semester')
    const topicTags = allTags.filter(tag => tag.tagGroupName === 'topic')
    const departmentTags = allTags.filter(tag => tag.tagGroupName === 'department')

    return {
      id: topic.id,
      uniqueId: topic.unique_id,
      title: topic.title,
      description: topic.description,
      contentType: topic.content_type,
      content: topic.content || null,
      quizTimeLimit: topic.quiz_time_limit,
      passingScore: topic.passing_score,
      status: topic.status,
      pdf: topic.pdf || null,
      questions: questions.map((q, index) => ({
        id: q.id,
        question: q.question,
        options: q.options || [],
        correct_answer: q.correct_answer,
        explanation: q.explanation || '',
        image: q.image || null,
        order: q.order !== undefined ? q.order : index
      })),
      universityTags,
      semesterTags,
      topicTags,
      departmentTags
    }
  }
}
