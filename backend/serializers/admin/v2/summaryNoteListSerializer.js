import { toJakartaISO } from '#utils/dateUtils'

export class SummaryNoteListV2Serializer {
  static serialize(notes) {
    return notes.map(note => {
      const noteTags = note.summary_note_tags || note.tags || []

      const allTags = noteTags.map(nt => ({
        id: nt.tags ? nt.tags.id : nt.id,
        name: nt.tags ? nt.tags.name : nt.name,
        tagGroupName: nt.tags?.tag_group?.name || null,
      }))

      return {
        id: note.id,
        uniqueId: note.unique_id,
        title: note.title,
        description: note.description,
        status: note.status,
        universityTags: allTags.filter(t => t.tagGroupName === 'university'),
        semesterTags: allTags.filter(t => t.tagGroupName === 'semester'),
        departmentTags: allTags.filter(t => t.tagGroupName === 'department'),
        createdAt: toJakartaISO(note.created_at),
        updatedAt: toJakartaISO(note.updated_at),
      }
    })
  }
}
