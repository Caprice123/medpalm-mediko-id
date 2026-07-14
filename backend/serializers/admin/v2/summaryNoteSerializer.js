import { toJakartaISO } from '#utils/dateUtils'

export class SummaryNoteV2Serializer {
  static serialize(note) {
    const noteTags = note.summary_note_tags || []

    const allTags = noteTags.map(nt => ({
      id: nt.tags.id,
      name: nt.tags.name,
      tagGroupName: nt.tags?.tag_group?.name || null,
    }))

    const sourceBlob = note.sourceAttachment?.blob
    const blob = sourceBlob ? {
      id: sourceBlob.id,
      url: sourceBlob.url,
      key: sourceBlob.key,
      filename: sourceBlob.filename,
      contentType: sourceBlob.content_type,
      byteSize: sourceBlob.byte_size,
    } : null

    const flashcardDecks = (note.summary_note_flashcard_decks || []).map(link => ({
      id: link.flashcard_deck.id,
      uniqueId: link.flashcard_deck.unique_id,
      title: link.flashcard_deck.title,
    }))

    const mcqTopics = (note.summary_note_mcq_topics || []).map(link => ({
      id: link.mcq_topic.id,
      uniqueId: link.mcq_topic.unique_id,
      title: link.mcq_topic.title,
    }))

    const nodes = (note.nodeRecords || []).map(r => {
      const path = []
      let current = r.node
      while (current) {
        path.unshift({ id: current.id, name: current.name, slug: current.slug })
        current = current.parent
      }
      return {
        nodeRecordId: r.id,
        nodeId: r.node.id,
        nodeName: r.node.name,
        nodeSlug: r.node.slug,
        departmentName: r.node.parent?.name ?? null,
        path,
      }
    })

    return {
      id: note.id,
      uniqueId: note.unique_id,
      title: note.title,
      description: note.description,
      content: note.content,
      markdownContent: note.markdown_content,
      status: note.status,
      blob,
      universityTags: allTags.filter(t => t.tagGroupName === 'university'),
      semesterTags: allTags.filter(t => t.tagGroupName === 'semester'),
      departmentTags: allTags.filter(t => t.tagGroupName === 'department'),
      flashcardDecks,
      mcqTopics,
      nodes,
      createdAt: toJakartaISO(note.created_at),
      updatedAt: toJakartaISO(note.updated_at),
    }
  }
}
