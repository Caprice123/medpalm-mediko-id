export class SummaryNoteListSerializer {
  static serialize(notes) {
    return notes.map(note => {
      const noteTags = note.summary_note_tags || note.tags || []

      const allTags = noteTags.map(nt => ({
        id: nt.tags ? nt.tags.id : nt.id,
        name: nt.tags ? nt.tags.name : nt.name,
        tagGroupName: nt.tags?.tag_group?.name || null
      }))

      const universityTags = allTags.filter(tag => tag.tagGroupName === 'university')
      const semesterTags = allTags.filter(tag => tag.tagGroupName === 'semester')

      return {
        id: note.id,
        title: note.title,
        description: note.description,
        is_active: note.is_active,
        universityTags,
        semesterTags,
        created_at: note.created_at
      }
    })
  }
}
