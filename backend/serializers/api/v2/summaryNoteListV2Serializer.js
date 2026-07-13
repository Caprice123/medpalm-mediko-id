import { toJakartaISO } from '#utils/dateUtils'

export class SummaryNoteListV2Serializer {
  static serialize(notes) {
    return notes.map(note => ({
      id: note.id,
      uniqueId: note.unique_id,
      title: note.title,
      description: note.description,
      updatedAt: toJakartaISO(note.updated_at)
    }))
  }
}
