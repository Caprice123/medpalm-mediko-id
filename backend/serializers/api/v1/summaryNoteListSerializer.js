export class SummaryNoteListSerializer {
  static serialize(notes) {
    return notes.map(note => {
      const allTags = (note.summary_note_tags || []).map(t => ({
        id: t.tags.id,
        name: t.tags.name,
        tagGroupName: t.tags.tag_group?.name || null
      }))

      const universityTags = allTags.filter(tag => tag.tagGroupName === 'university')
      const semesterTags = allTags.filter(tag => tag.tagGroupName === 'semester')
      const topicTags = allTags.filter(tag => tag.tagGroupName === 'topic')
      const departmentTags = allTags.filter(tag => tag.tagGroupName === 'department')

      return {
        id: note.id,
        title: note.title,
        description: note.description,
        universityTags,
        semesterTags,
        topicTags,
        departmentTags,
        updatedAt: note.updated_at
      }
    })
  }
}
