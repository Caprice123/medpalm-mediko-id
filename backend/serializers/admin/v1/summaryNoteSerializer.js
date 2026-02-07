export class SummaryNoteSerializer {
  static serialize(note) {
    const noteTags = note.summary_note_tags || note.tags || []

    // Separate tags by group
    const allTags = noteTags.map(nt => ({
      id: nt.tags ? nt.tags.id : nt.id,
      name: nt.tags ? nt.tags.name : nt.name,
      tagGroupName: nt.tags?.tag_group?.name || nt.tagGroupName || null
    }))

    const universityTags = allTags.filter(tag => tag.tagGroupName === 'university')
    const semesterTags = allTags.filter(tag => tag.tagGroupName === 'semester')
    const topicTags = allTags.filter(tag => tag.tagGroupName === 'topic')
    const departmentTags = allTags.filter(tag => tag.tagGroupName === 'department')

    // Extract source document blob from attachment
    const sourceBlob = note.sourceAttachment?.blob

    return {
      id: note.id,
      title: note.title,
      description: note.description,
      content: note.content,
      status: note.status,
      // Source document blob (if exists)
      blob: sourceBlob ? {
        id: sourceBlob.id,
        url: sourceBlob.url,
        key: sourceBlob.key,
        filename: sourceBlob.filename,
        contentType: sourceBlob.content_type,
        byteSize: sourceBlob.byte_size
      } : null,
      universityTags,
      semesterTags,
      topicTags,
      departmentTags
    }
  }

  static serializeList(notes) {
    return notes.map(note => this.serialize(note))
  }
}
