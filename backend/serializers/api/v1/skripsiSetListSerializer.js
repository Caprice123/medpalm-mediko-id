import moment from 'moment-timezone'

export class SkripsiSetListSerializer {
  static serialize(sets) {
    return sets.map(set => ({
      id: set.id,
      uniqueId: set.unique_id,
      title: set.title,
      description: set.description,
      updatedAt: set.updated_at ? moment(set.updated_at).tz('Asia/Jakarta').toISOString() : null
    }))
  }
}
