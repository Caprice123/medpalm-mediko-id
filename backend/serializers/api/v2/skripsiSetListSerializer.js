import { toJakartaISO } from '#utils/dateUtils'

export class SkripsiSetListV2Serializer {
  static serialize(sets) {
    return sets.map(set => SkripsiSetListV2Serializer.serializeOne(set))
  }

  // `createdAt` is carried here and was not in V1's list shape: the list sorts
  // by last activity, so without the creation date there is no way to tell a
  // genuinely new draft from one that was simply touched most recently.
  static serializeOne(set) {
    return {
      id: set.id,
      uniqueId: set.unique_id ?? set.uniqueId,
      title: set.title,
      description: set.description ?? null,
      createdAt: toJakartaISO(set.created_at ?? set.createdAt),
      updatedAt: toJakartaISO(set.updated_at ?? set.updatedAt),
    }
  }
}
