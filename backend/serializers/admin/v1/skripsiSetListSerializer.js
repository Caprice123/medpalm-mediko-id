export class SkripsiSetListSerializer {
  static serialize(sets) {
    return sets.map(set => ({
      id: set.id,
      title: set.title,
      description: set.description,
      user: set.users ? {
        name: set.users.name,
        email: set.users.email
      } : null,
      tabCount: set._count?.skripsi_tabs || set.tabCount || 0,
      createdAt: set.created_at,
      updatedAt: set.updated_at
    }))
  }
}
