import { toJakartaISO } from '#utils/dateUtils'

export class SummaryNoteV2Serializer {
  static serialize(note) {
    const allTags = (note.summary_note_tags || []).map(t => ({
      id: t.tags.id,
      name: t.tags.name,
      tagGroupName: t.tags.tag_group?.name || null
    }))

    const sourceDocument = note.sourceAttachment ? {
      filename: note.sourceAttachment.blob.filename,
      contentType: note.sourceAttachment.blob.content_type,
      byteSize: note.sourceAttachment.blob.byte_size,
      url: note.sourceAttachment.url
    } : null

    // Build node path for breadcrumb (root → … → leaf)
    const nodes = (note.nodeRecords || []).map(record => {
      const path = []
      let current = record.node
      while (current) {
        path.unshift({ id: current.id, name: current.name, slug: current.slug })
        current = current.parent
      }
      return {
        nodeRecordId: record.id,
        nodeId: record.node.id,
        nodeName: record.node.name,
        nodeSlug: record.node.slug,
        path
      }
    })

    return {
      id: note.id,
      uniqueId: note.unique_id,
      title: note.title,
      description: note.description,
      content: note.content,
      sourceDocument,
      universityTags: allTags.filter(t => t.tagGroupName === 'university'),
      semesterTags: allTags.filter(t => t.tagGroupName === 'semester'),
      departmentTags: allTags.filter(t => t.tagGroupName === 'department'),
      nodes,
      updatedAt: toJakartaISO(note.updated_at),
      createdAt: toJakartaISO(note.created_at)
    }
  }
}
