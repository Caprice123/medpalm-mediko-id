import moment from 'moment-timezone'

export class AnatomyQuizListSerializer {
  static serialize(quizzes, attachmentMap = new Map()) {
    return quizzes.map(quiz => {
      const attachment = attachmentMap ? attachmentMap.get(quiz.id) : null

      return {
        id: quiz.id,
        uniqueId: quiz.unique_id,
        title: quiz.title,
        description: quiz.description,
        status: quiz.status,
        mediaType: quiz.media_type || '2d',
        embedUrl: quiz.embed_url || null,
        questionCount: quiz.question_count || 0,
        version: quiz.version ?? 1,
        blob: attachment ? {
          id: attachment.blob_id,
          url: attachment.url,
          filename: attachment.blob?.filename || null,
          size: attachment.blob?.byte_size || null,
        } : null,
        createdAt: quiz.created_at ? moment(quiz.created_at).tz('Asia/Jakarta').toISOString() : null,
      }
    })
  }
}
