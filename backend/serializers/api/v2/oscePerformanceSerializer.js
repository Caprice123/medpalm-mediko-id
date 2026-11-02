// Shapes the per-topic OSCE practice performance response. One entry per clinical topic tag the
// user has finalized a session under.
export class OscePerformanceSerializer {
  static serialize(performance) {
    return {
      topics: performance.topics.map(topic => this.serializeTopic(topic)),
    }
  }

  // The percentage is rounded to one decimal here rather than in the chart: the bar, the
  // tooltip and any later consumer should all quote the same number.
  static serializeTopic(topic) {
    return {
      tagId: topic.tagId,
      title: topic.title,
      sessionCount: topic.sessionCount,
      averageScore: Math.round(topic.averageScore * 10) / 10,
    }
  }
}
