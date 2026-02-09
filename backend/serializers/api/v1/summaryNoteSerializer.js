import { FlashcardDeckListSerializer } from './flashcardDeckListSerializer.js'
import { McqTopicListSerializer } from './mcqTopicListSerializer.js'

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

    // Extract linked flashcard decks and use existing serializer
    const flashcardDecks = FlashcardDeckListSerializer.serialize(
      (note.summary_note_flashcard_decks || []).map(link => link.flashcard_deck)
    )

    // Extract linked MCQ topics and use existing serializer
    const mcqTopics = McqTopicListSerializer.serialize(
      (note.summary_note_mcq_topics || []).map(link => link.mcq_topic)
    )

    return {
      id: note.id,
      title: note.title,
      description: note.description,
      content: note.content,
      sourceDocument,
      universityTags,
      semesterTags,
      topicTags,
      departmentTags,
      flashcardDecks,
      mcqTopics
    }
  }
}
