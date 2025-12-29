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
      created_at: set.created_at,
      updated_at: set.updated_at
    }))
  }
}
