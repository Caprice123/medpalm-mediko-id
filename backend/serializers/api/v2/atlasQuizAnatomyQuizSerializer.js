export class AtlasQuizAnatomyQuizSerializer {
  static serialize(quiz, attachment) {
    return {
      uniqueId: quiz.unique_id,
      title: quiz.title,
      description: quiz.description,
      difficulty: quiz.difficulty || 'medium',
      estimatedMinutes: quiz.estimated_minutes || null,
      questionCount: quiz.question_count,
      imageUrl: attachment?.url || null,
      embedUrl: quiz.embed_url,
      mediaType: quiz.media_type,
    }
  }
}
