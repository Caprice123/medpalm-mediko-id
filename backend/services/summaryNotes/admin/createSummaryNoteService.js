import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { queueEmbedSummaryNote } from '#jobs/queues/summaryNotesQueue'

export class CreateSummaryNoteService extends BaseService {
  static async call({ title, description, content, markdownContent, blobId, status, tagIds, flashcardDeckIds, mcqTopicIds, createdBy }) {
    // Validate required fields
    if (!title) {
      throw new ValidationError('Title is required')
    }

    if (!content) {
      throw new ValidationError('Content is required')
    }

    if (!createdBy) {
      throw new ValidationError('Created by is required')
    }

    // Validate blob exists if provided
    if (blobId) {
      const blob = await prisma.blobs.findUnique({
        where: { id: parseInt(blobId) }
      })
      if (!blob) {
        throw new ValidationError('Invalid blob ID')
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create the summary note
      const summaryNote = await tx.summary_notes.create({
        data: {
          title,
          description: description || null,
          content,
          markdown_content: markdownContent || null,
          status: status || 'draft',
          created_by: createdBy
        }
      })

      // Create tag associations if provided
      if (tagIds && tagIds.length > 0) {
        await tx.summary_note_tags.createMany({
          data: tagIds.map(tagId => ({
            summary_note_id: summaryNote.id,
            tag_id: tagId
          }))
        })
      }

      // Create attachment for source document if blobId provided
      if (blobId) {
        await tx.attachments.create({
          data: {
            name: 'source_document',
            record_type: 'summary_note',
            record_id: summaryNote.id,
            blob_id: parseInt(blobId)
          }
        })
      }

      // Create flashcard deck links if provided
      if (flashcardDeckIds && flashcardDeckIds.length > 0) {
        await tx.summary_note_flashcard_decks.createMany({
          data: flashcardDeckIds.map(deckId => ({
            summary_note_id: summaryNote.id,
            flashcard_deck_id: parseInt(deckId)
          }))
        })
      }

      // Create MCQ topic links if provided
      if (mcqTopicIds && mcqTopicIds.length > 0) {
        await tx.summary_note_mcq_topics.createMany({
          data: mcqTopicIds.map(topicId => ({
            summary_note_id: summaryNote.id,
            mcq_topic_id: parseInt(topicId)
          }))
        })
      }

      // Fetch the complete summary note with tags
      const completeSummaryNote = await tx.summary_notes.findUnique({
        where: { id: summaryNote.id },
        include: {
          summary_note_tags: {
            include: {
              tags: true
            }
          }
        }
      })

      return completeSummaryNote
    })

    // Queue embedding job if status is 'published'
    if (result.status === 'published') {
      try {
        await queueEmbedSummaryNote(result.id, result.unique_id)
        console.log(`✓ Queued embedding job for summary note ${result.unique_id}`)
      } catch (error) {
        console.error('Failed to queue embedding job:', error)
        // Don't throw - note was created successfully, embedding is supplementary
      }
    }

    return result
  }
}
