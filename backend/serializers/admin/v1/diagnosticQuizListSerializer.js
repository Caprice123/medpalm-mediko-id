import moment from 'moment-timezone'

export class DiagnosticQuizListSerializer {
  static serialize(quizzes, attachmentMap = new Map()) {
    return quizzes.map(quiz => {
      const allTags = (quiz.diagnostic_quiz_tags || []).map(t => ({
        id: t.tags.id,
        name: t.tags.name,
        tagGroupName: t.tags.tag_group?.name || null
      }))

      const universityTags = allTags.filter(tag => tag.tagGroupName === 'university')
      const semesterTags = allTags.filter(tag => tag.tagGroupName === 'semester')

      return {
        id: quiz.id,
        uniqueId: quiz.unique_id,
        title: quiz.title,
        description: quiz.description,
        status: quiz.status,
        mediaType: quiz.media_type || '2d',
        questionCount: quiz.question_count || 0,
        universityTags,
        semesterTags,
        createdAt: quiz.created_at ? moment(quiz.created_at).tz('Asia/Jakarta').toISOString() : null
      }
    })
  }
}
