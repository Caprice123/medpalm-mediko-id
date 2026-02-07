export class SummaryNoteSerializer {
  static serialize(note) {
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
      content: note.content,
      universityTags,
      semesterTags,
      topicTags,
      departmentTags
    }
  }
}
