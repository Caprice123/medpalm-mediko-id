import { toJakartaISO } from '#utils/dateUtils'

// Shapes the hub's history rows.
export class OsceSessionHistorySerializer {
  static serializeList(sessions) {
    return sessions.map((session) => this.serializeSession(session))
  }

  static serializeSession(session) {
    return {
      uniqueId: session.uniqueId,
      // created | started | completed | expired — already resolved by the service, so the row
      // never has to decide what a `started` session with no time left is.
      state: session.state,
      topicTitle: session.topicTitle,
      scenario: session.scenario,
      durationMinutes: session.durationMinutes,
      remainingSeconds: session.remainingSeconds,
      timeTaken: session.timeTaken,
      totalScore: session.totalScore,
      maxScore: session.maxScore,
      percentage: session.percentage === null ? null : Math.round(session.percentage * 10) / 10,
      startedAt: toJakartaISO(session.startedAt),
      createdAt: toJakartaISO(session.createdAt),
      updatedAt: toJakartaISO(session.updatedAt),
      tags: session.tags,
    }
  }
}
