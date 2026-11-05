import { toJakartaISO } from '#utils/dateUtils'

// Shapes the hub's station panel. Each row carries the student's own record, which is what the
// panel is read for — not the catalogue, but which of these cases is worth the next attempt.
export class OsceStationSerializer {
  // Returns the rows only; the controller pairs them with the pagination block, the way
  // every other list endpoint in the product answers.
  static serializeList(stations) {
    return stations.map((station) => this.serializeStation(station))
  }

  static serializeStation(station) {
    const tags = station.osce_topic_tags.map((topicTag) => ({
      id: topicTag.tags.id,
      name: topicTag.tags.name,
      groupName: topicTag.tags.tag_group?.name || null,
    }))

    return {
      id: station.id,
      uniqueId: station.unique_id,
      title: station.title,
      description: station.description,
      // The scenario is the station's task card. The panel shows one line of it, so it ships
      // whole and the row clamps — trimming here would cut mid-sentence at a length the
      // backend cannot see the font for.
      scenario: station.scenario,
      durationMinutes: station.duration_minutes,
      tags,
      myRecord: station.myRecord ? this.serializeRecord(station.myRecord) : null,
    }
  }

  static serializeRecord(record) {
    return {
      attemptCount: record.attemptCount,
      bestPercentage: record.bestPercentage === null
        ? null
        : Math.round(record.bestPercentage * 10) / 10,
      bestSessionUniqueId: record.bestSessionUniqueId,
      lastAttemptAt: toJakartaISO(record.lastAttemptAt),
    }
  }
}
