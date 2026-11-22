import { toJakartaISO } from '#utils/dateUtils'

// The admin variant carries the fields the student-facing one leaves out:
// whether the template is active, where it sits in the picker, and when it was
// last edited.
//
// `sections` is only present when the caller actually loaded them — the detail
// read behind the edit form. A listing row gets `sectionCount` instead, which
// is all its column draws.
export class SkripsiTemplateAdminV2Serializer {
  static serializeOne(template) {
    return {
      id: template.id,
      key: template.key,
      name: template.name,
      description: template.description ?? null,
      position: template.position,
      isActive: template.is_active,
      sectionCount: template._count?.sections ?? template.sections?.length ?? 0,
      sections: template.sections
        ? template.sections.map(section => ({
          id: section.id,
          title: section.title,
          position: section.position,
        }))
        : undefined,
      createdAt: toJakartaISO(template.created_at),
      updatedAt: toJakartaISO(template.updated_at),
    }
  }

  static serialize(templates) {
    return (templates || []).map(template => this.serializeOne(template))
  }
}
