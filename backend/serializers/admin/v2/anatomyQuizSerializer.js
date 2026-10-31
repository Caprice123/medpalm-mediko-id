import moment from 'moment-timezone'

// Detail shape for one anatomy quiz: everything the V2 admin edit form needs. `difficulty`
// and `estimatedMinutes` are here because the form edits them and UpdateAnatomyQuizV2Service
// writes them — no list serializer carried them, so the form used to reset both to their
// defaults on every save. No tags: V2 content is organised by the feature_nodes tree.
export class AnatomyQuizSerializer {
  static serialize(quiz) {
    return {
      id: quiz.id,
      uniqueId: quiz.unique_id,
      title: quiz.title,
      description: quiz.description,
      embedUrl: quiz.embed_url || null,
      mediaType: quiz.media_type || '2d',
      questionCount: quiz.question_count || 0,
      difficulty: quiz.difficulty || 'medium',
      estimatedMinutes: quiz.estimated_minutes ?? null,
      status: quiz.status,
      version: quiz.version ?? 1,
      createdAt: quiz.created_at
        ? moment(quiz.created_at).tz('Asia/Jakarta').toISOString()
        : null,
    }
  }
}
