// A template as the "Buat laporan baru" picker needs it: its name, its
// one-line description and the section titles printed under each card.
// `isOwn` is what separates a student's saved outline (which they can delete)
// from an admin-managed one (which they cannot).
export class SkripsiTemplateV2Serializer {
  static serializeOne(template, userId = null) {
    return {
      id: template.id,
      key: template.key,
      name: template.name,
      description: template.description ?? null,
      isOwn: Boolean(template.owner_user_id) && template.owner_user_id === userId,
      sections: (template.sections || []).map(section => ({
        id: section.id,
        title: section.title,
        position: section.position,
      })),
    }
  }

  static serialize(templates, userId = null) {
    return (templates || []).map(template => this.serializeOne(template, userId))
  }
}
