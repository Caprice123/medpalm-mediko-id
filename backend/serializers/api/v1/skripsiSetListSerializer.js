export class SkripsiSetListSerializer {
  static serialize(sets) {
    return sets.map(set => ({
      id: set.id,
      title: set.title,
      description: set.description,
      updated_at: set.updated_at
    }))
  }
}
