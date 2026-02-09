export class McqTopicSerializer {
  static serialize(topic, includeAnswers = false) {
    const questions = topic.mcq_questions || topic.questions || []
    const topicTags = (topic.mcq_topic_tags || [])
      .filter(tt => tt.tags)
      .map(tt => ({
        id: tt.tags.id,
        name: tt.tags.name,
        tagGroupId: tt.tags.tag_group_id
      }))

    return {
      id: topic.id,
      uniqueId: topic.unique_id,
      title: topic.title,
      description: topic.description,
      quizTimeLimit: topic.quiz_time_limit,
      passingScore: topic.passing_score,
      tags: topicTags,
      mcq_questions: questions.map(q => {
        const question = {
          id: q.id,
          question: q.question,
          options: q.options
        }

        // SECURITY: Only include answers when explicitly requested (after submission or in learning mode after answer)
        if (includeAnswers) {
          question.correct_answer = q.correct_answer
          question.explanation = q.explanation
        }

        return question
      })
    }
  }
}
