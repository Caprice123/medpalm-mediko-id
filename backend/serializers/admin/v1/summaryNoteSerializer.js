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

    // Extract source document blob from attachment
    const sourceBlob = note.sourceAttachment?.blob

    return {
      id: note.id,
      title: note.title,
      description: note.description,
      content: note.content,
      status: note.status,
      is_active: note.is_active,
      // Source document info (if exists)
      blobId: sourceBlob?.id || null,
      sourceUrl: sourceBlob?.url || null,
      sourceFilename: sourceBlob?.filename || null,
      sourceContentType: sourceBlob?.contentType || null,
      sourceByteSize: sourceBlob?.byteSize || null,
      universityTags,
      semesterTags
    }
  }

  static serializeList(notes) {
    return notes.map(note => this.serialize(note))
  }
}
