export class UserChallengeSerializer {
  static serialize(challenge) {
    const { mySession } = challenge
    return {
      id: challenge.id,
      uniqueId: challenge.unique_id,
      title: challenge.title,
      description: challenge.description,
      scoringType: challenge.scoring_type,
      durationSeconds: challenge.duration_seconds,
      totalQuestions: challenge.total_questions,
      maxSpecialPerSession: challenge.max_special_per_session ?? 0,
      specialDurationSeconds: challenge.special_duration_seconds,
      basePointsPerCorrect: challenge.base_points_per_correct,
      secondsPerQuestion: challenge.seconds_per_question,
      startAt: challenge.start_at,
      endAt: challenge.end_at,
      badgesDisbursed: challenge.badges_disbursed,
      tags: (challenge.challenge_tags ?? []).map(ct => ({ id: ct.tags.id, name: ct.tags.name, tagGroupId: ct.tags.tag_group_id, tagGroupName: ct.tags.tag_group?.name || null })),
      poolSize: challenge.question_pool_count,
      playedCount: challenge.playedCount ?? 0,
      myStatus: mySession ? mySession.status : 'not_started',
      myScore: mySession?.score ?? null,
      myCorrectCount: mySession?.correct_count ?? null,
    }
  }

  static serializeList(challenges) {
    return challenges.map(c => this.serialize(c))
  }

  static serializeDetail({ challenge, mySession, activeSession, rewards, reward, rewardRead }) {
    return {
      challenge: {
        id: challenge.id,
        uniqueId: challenge.unique_id,
        title: challenge.title,
        description: challenge.description,
        scoringType: challenge.scoring_type,
        durationSeconds: challenge.duration_seconds,
        totalQuestions: challenge.total_questions,
        maxSpecialPerSession: challenge.max_special_per_session ?? 0,
        specialDurationSeconds: challenge.special_duration_seconds,
        basePointsPerCorrect: challenge.base_points_per_correct,
        secondsPerQuestion: challenge.seconds_per_question,
        startAt: challenge.start_at,
        endAt: challenge.end_at,
        status: challenge.status,
        badgesDisbursed: challenge.badges_disbursed,
        tags: (challenge.challenge_tags ?? []).map(ct => ({ id: ct.tags.id, name: ct.tags.name, tagGroupId: ct.tags.tag_group_id, tagGroupName: ct.tags.tag_group?.name || null })),
        poolSize: challenge.question_pool_count,
      },
      myStatus: mySession ? 'completed' : (activeSession ? 'in_progress' : 'not_started'),
      myScore: mySession?.score ?? null,
      myCorrectCount: mySession?.correct_count ?? null,
      myTotalTimeSeconds: mySession?.total_time_seconds ?? null,
      activeSession,
      rewards: (rewards ?? []).map(r => ({
        id: r.id,
        title: r.title,
        description: r.description,
        minRank: r.min_rank,
        maxRank: r.max_rank,
      })),
      reward: reward ? {
        id: reward.id,
        title: reward.title,
        description: reward.description,
        status: reward.disbursementStatus ?? 'pending',
        minRank: reward.min_rank,
        maxRank: reward.max_rank,
        proof: reward.proof ? { url: reward.proof.url } : null,
      } : null,
      rewardRead: rewardRead ?? false,
    }
  }

  static serializeBadges(badges) {
    return badges.map(b => ({
      id: b.id,
      uniqueId: b.unique_id,
      name: b.name,
      description: b.description,
      minRank: b.min_rank,
      maxRank: b.max_rank,
      image: b.image ? { url: b.image.url } : null,
    }))
  }

  static serializeLeaderboard({ leaderboard, myRank, myBadge, totalQuestions, badgesDisbursed, totalParticipants }) {
    return {
      leaderboard,
      myRank,
      myBadge: myBadge ? {
        uniqueId: myBadge.unique_id,
        name: myBadge.name,
        description: myBadge.description,
        image: myBadge.image ? { url: myBadge.image.url } : null,
      } : null,
      totalQuestions,
      badgesDisbursed,
      totalParticipants,
    }
  }
}
