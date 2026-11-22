import { toJakartaISO } from '#utils/dateUtils'

// One editable section of a report. `isReferenceSlot` marks the Referensi
// section every report is created with as its last one — nothing in the editor
// shows it, it is only there for whatever later needs to find that section.
export class SkripsiSectionV2Serializer {
  static serializeOne(section) {
    return {
      id: section.id,
      title: section.title,
      content: section.content ?? '',
      position: section.position,
      isReferenceSlot: section.is_reference_slot,
      createdAt: toJakartaISO(section.created_at),
      updatedAt: toJakartaISO(section.updated_at),
    }
  }

  static serialize(sections) {
    return (sections || []).map(section => this.serializeOne(section))
  }
}
