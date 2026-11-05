import { toJakartaISO } from '#utils/dateUtils'

// Shapes the OSCE hub rail: the session to resume, the counted states, and the last mark.
export class OsceHubSerializer {
  static serialize(hub) {
    return {
      resumable: hub.resumable ? this.serializeResumable(hub.resumable) : null,
      expiredCount: hub.expiredCount,
      counts: {
        running: hub.counts.running || 0,
        created: hub.counts.created || 0,
        completed: hub.counts.completed || 0,
        expired: hub.counts.expired || 0,
      },
      lastResult: hub.lastResult ? this.serializeLastResult(hub.lastResult) : null,
      totalPracticeSeconds: hub.totalPracticeSeconds,
    }
  }

  static serializeResumable(session) {
    return {
      uniqueId: session.uniqueId,
      status: session.status,
      topicTitle: session.topicTitle,
      scenario: session.scenario,
      durationMinutes: session.durationMinutes,
      // Seconds, not a timestamp: the rail counts down from this on the client, and a clock
      // that has to subtract two dates drifts with the user's own system time.
      remainingSeconds: session.remainingSeconds,
      startedAt: toJakartaISO(session.startedAt),
      tags: session.tags,
      progress: session.progress,
    }
  }

  static serializeLastResult(result) {
    return {
      uniqueId: result.uniqueId,
      topicTitle: result.topicTitle,
      totalScore: result.totalScore,
      maxScore: result.maxScore,
      percentage: result.percentage === null ? null : Math.round(result.percentage * 10) / 10,
      completedAt: toJakartaISO(result.completedAt),
    }
  }
}
