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

    // Extract source document from attachment
    const sourceDocument = note.sourceAttachment ? {
      filename: note.sourceAttachment.blob.filename,
      contentType: note.sourceAttachment.blob.content_type,
      byteSize: note.sourceAttachment.blob.byte_size,
      url: note.sourceAttachment.url
    } : null

    return {
      id: note.id,
      title: note.title,
      description: note.description,
      content: note.content,
      sourceDocument,
      universityTags,
      semesterTags,
      topicTags,
      departmentTags
    }
  }
}
