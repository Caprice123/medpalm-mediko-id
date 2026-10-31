import moment from 'moment-timezone'

// Row shape for anatomy quiz lists. No `blob`: fetching it meant a presigned-URL round
// trip per row, and no V2 list renders the image. V2 quizzes are embed-only anyway.
export class AnatomyQuizListSerializer {
  static serialize(quizzes) {
    return quizzes.map(quiz => ({
      id: quiz.id,
      uniqueId: quiz.unique_id,
      title: quiz.title,
      description: quiz.description,
      status: quiz.status,
      mediaType: quiz.media_type || '2d',
      embedUrl: quiz.embed_url || null,
      questionCount: quiz.question_count || 0,
      version: quiz.version ?? 1,
      createdAt: quiz.created_at ? moment(quiz.created_at).tz('Asia/Jakarta').toISOString() : null,
    }))
  }
}
