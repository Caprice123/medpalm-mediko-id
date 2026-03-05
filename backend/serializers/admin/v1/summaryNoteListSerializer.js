import moment from 'moment-timezone'

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
      const topicTags = allTags.filter(tag => tag.tagGroupName === 'topic')
      const departmentTags = allTags.filter(tag => tag.tagGroupName === 'department')

      return {
        id: note.id,
        uniqueId: note.unique_id,
        title: note.title,
        description: note.description,
        status: note.status,
        universityTags,
        semesterTags,
        topicTags,
        departmentTags,
        createdAt: note.created_at ? moment(note.created_at).tz('Asia/Jakarta').toISOString() : null
      }
    })
  }
}
