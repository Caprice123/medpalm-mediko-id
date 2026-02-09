export class SkripsiSetListSerializer {
  static serialize(sets) {
    return sets.map(set => ({
      id: set.id,
      uniqueId: set.unique_id,
      title: set.title,
      description: set.description,
      user: set.user || (set.users ? {
        id: set.users.id,
        name: set.users.name,
        email: set.users.email
      } : null),
      tabCount: set._count?.skripsi_tabs || set.tabCount || 0,
      createdAt: set.createdAt || set.created_at,
      updatedAt: set.updatedAt || set.updated_at
    }))
  }
}
