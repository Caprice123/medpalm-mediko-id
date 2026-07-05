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
      questionCount: challenge.question_pool_count,
      sessionCount: challenge.participant_count,
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

  static serializeReward(reward) {
    if (!reward) return null
    return {
      id: reward.id,
      title: reward.title,
      description: reward.description,
      status: reward.status,
      minRank: reward.min_rank ?? null,
      maxRank: reward.max_rank ?? null,
      proof: reward.proof ? { url: reward.proof.url } : null,
      createdAt: reward.created_at,
      updatedAt: reward.updated_at,
    }
  }

  static serializeRewards(rewards) {
    return rewards.map(r => this.serializeReward(r))
  }

  static serializeDisbursements(groups) {
    return groups.map(({ reward, disbursements }) => ({
      reward: this.serializeReward(reward),
      disbursements: disbursements.map(d => ({
        id: d.id,
        status: d.status,
        proof: d.proof ? { url: d.proof.url } : null,
        user: d.challenge_sessions?.users
          ? { name: d.challenge_sessions.users.name, email: d.challenge_sessions.users.email }
          : null,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      })),
    }))
  }
}
