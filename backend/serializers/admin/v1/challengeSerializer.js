export class AdminChallengeSerializer {
  static serialize(challenge) {
    return {
      id: challenge.id,
      uniqueId: challenge.unique_id,
      title: challenge.title,
      description: challenge.description,
      scoringType: challenge.scoring_type,
      durationSeconds: challenge.duration_seconds,
      totalQuestions: challenge.total_questions,
      basePointsPerCorrect: challenge.base_points_per_correct,
      secondsPerQuestion: challenge.seconds_per_question,
      maxSpecialPerSession: challenge.max_special_per_session,
      specialDurationSeconds: challenge.special_duration_seconds,
      status: challenge.status,
      startAt: challenge.start_at,
      endAt: challenge.end_at,
      tags: (challenge.challenge_tags ?? []).map(ct => ({ id: ct.tags.id, name: ct.tags.name, tagGroupId: ct.tags.tag_group_id, tagGroupName: ct.tags.tag_group?.name || null })),
      questionCount: challenge._count?.challenge_questions ?? undefined,
      sessionCount: challenge._count?.challenge_sessions ?? undefined,
      createdAt: challenge.created_at,
      updatedAt: challenge.updated_at,
    }
  }

  static serializeList(challenges) {
    return challenges.map(c => this.serialize(c))
  }

  static serializeQuestion(q) {
    return {
      id: q.id,
      uniqueId: q.unique_id,
      challengeId: q.challenge_id,
      question: q.question,
      options: q.options,
      correctOptionIndex: q.correct_option_index,
      explanation: q.explanation,
      order: q.order,
      isSpecial: q.is_special,
      questionImage: q.questionImage
        ? { url: q.questionImage.url, filename: q.questionImage.blob?.filename }
        : null,
      optionImages: q.optionImages
        ? q.optionImages.map(img => img ? { url: img.url, filename: img.blob?.filename } : null)
        : null,
      createdAt: q.created_at,
      updatedAt: q.updated_at,
    }
  }

  static serializeQuestionList(questions) {
    return questions.map(q => this.serializeQuestion(q))
  }

  static serializeBadge(badge) {
    return {
      id: badge.id,
      uniqueId: badge.unique_id,
      challengeId: badge.challenge_id,
      name: badge.name,
      description: badge.description,
      minRank: badge.min_rank,
      maxRank: badge.max_rank,
      image: badge.image
        ? { url: badge.image.url, filename: badge.image.blob?.filename }
        : null,
      createdAt: badge.created_at,
      updatedAt: badge.updated_at,
    }
  }

  static serializeBadgeList(badges) {
    return badges.map(b => this.serializeBadge(b))
  }
}
