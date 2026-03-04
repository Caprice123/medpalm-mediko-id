import moment from 'moment-timezone'

export class AnatomyQuizListSerializer {
  static serialize(quizzes) {
    return quizzes.map(quiz => {
      const quizTags = quiz.anatomy_quiz_tags || quiz.tags || []

      // Separate tags by group
      const allTags = quizTags.map(t => ({
        id: t.tags ? t.tags.id : t.id,
        name: t.tags ? t.tags.name : t.name,
        tagGroupName: t.tags?.tag_group?.name || t.tagGroupName
      }))

      const anatomyTopicTags = allTags.filter(tag => tag.tagGroupName === 'anatomy_topic')

      return {
        id: quiz.id,
        uniqueId: quiz.unique_id,
        title: quiz.title,
        description: quiz.description,
        anatomyTopicTags: anatomyTopicTags.map(tag => ({
          id: tag.id,
          name: tag.name
        })),
        questionCount: quiz.questionCount || quiz._count?.anatomy_questions || 0,
        embedUrl: quiz.embed_url || null,
        mediaType: quiz.media_type || '2d',
        updatedAt: (quiz.updatedAt || quiz.updated_at) ? moment(quiz.updatedAt || quiz.updated_at).tz('Asia/Jakarta').toISOString() : null
      }
    })
  }
}
