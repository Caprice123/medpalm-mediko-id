import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { queueEmbedSummaryNote, queueDeleteSummaryNoteEmbedding } from '#jobs/queues/summaryNotesQueue'

export class UpdateSummaryNoteService extends BaseService {
  static async call({ id, title, description, content, markdownContent, blobId, status, isActive, tagIds, flashcardDeckIds, mcqTopicIds }) {
    // Validate required fields
    if (!id) {
      throw new ValidationError('Summary note ID is required')
    }

    // Check if summary note exists
    const existing = await prisma.summary_notes.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existing) {
      throw new ValidationError('Summary note not found')
    }

    // Validate blob exists if provided
    if (blobId !== undefined && blobId !== null) {
      const blob = await prisma.blobs.findUnique({
        where: { id: parseInt(blobId) }
      })
      if (!blob) {
        throw new ValidationError('Invalid blob ID')
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      // Build update data
      const updateData = {
        updated_at: new Date()
      }

      if (title !== undefined) updateData.title = title
      if (description !== undefined) updateData.description = description
      if (content !== undefined) updateData.content = content
      if (markdownContent !== undefined) updateData.markdown_content = markdownContent
      if (status !== undefined) updateData.status = status

      // Update the summary note
      const summaryNote = await tx.summary_notes.update({
        where: { id: parseInt(id) },
        data: updateData
      })

      // Update tag associations if provided
      if (tagIds !== undefined) {
        // Delete existing tags
        await tx.summary_note_tags.deleteMany({
          where: { summary_note_id: parseInt(id) }
        })

        // Create new tag associations
        if (tagIds.length > 0) {
          await tx.summary_note_tags.createMany({
            data: tagIds.map(tagId => ({
              summary_note_id: summaryNote.id,
              tag_id: tagId
            }))
          })
        }
      }

      // Update source document attachment if blobId provided
      if (blobId !== undefined) {
        // Delete existing source document attachment
        await tx.attachments.deleteMany({
          where: {
            record_type: 'summary_note',
            record_id: parseInt(id),
            name: 'source_document'
          }
        })

        // Create new attachment if blobId is not null
        if (blobId) {
          await tx.attachments.create({
            data: {
              name: 'source_document',
              record_type: 'summary_note',
              record_id: parseInt(id),
              blob_id: parseInt(blobId)
            }
          })
        }
      }

      // Update flashcard deck links if provided
      if (flashcardDeckIds !== undefined) {
        // Delete existing flashcard deck links
        await tx.summary_note_flashcard_decks.deleteMany({
          where: { summary_note_id: parseInt(id) }
        })

        // Create new flashcard deck links
        if (flashcardDeckIds.length > 0) {
          await tx.summary_note_flashcard_decks.createMany({
            data: flashcardDeckIds.map(deckId => ({
              summary_note_id: parseInt(id),
              flashcard_deck_id: parseInt(deckId)
            }))
          })
        }
      }

      // Update MCQ topic links if provided
      if (mcqTopicIds !== undefined) {
        // Delete existing MCQ topic links
        await tx.summary_note_mcq_topics.deleteMany({
          where: { summary_note_id: parseInt(id) }
        })

        // Create new MCQ topic links
        if (mcqTopicIds.length > 0) {
          await tx.summary_note_mcq_topics.createMany({
            data: mcqTopicIds.map(topicId => ({
              summary_note_id: parseInt(id),
              mcq_topic_id: parseInt(topicId)
            }))
          })
        }
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

    // Handle embedding updates (queue jobs instead of processing immediately)
    try {
      const wasPublished = existing.status === 'published'
      const isPublished = result.status === 'published'

      if (!wasPublished && isPublished) {
        // Status changed from draft to published → queue embedding job
        await queueEmbedSummaryNote(result.id)
        console.log(`✓ Queued embedding job for summary note ${result.id}`)
      } else if (wasPublished && !isPublished) {
        // Status changed from published to draft → queue deletion job
        await queueDeleteSummaryNoteEmbedding(result.id)
        console.log(`✓ Queued embedding deletion job for summary note ${result.id}`)
      } else if (isPublished) {
        // Still published → queue update embedding job (in case content changed)
        await queueEmbedSummaryNote(result.id)
        console.log(`✓ Queued embedding update job for summary note ${result.id}`)
      }
    } catch (error) {
      console.error('Failed to queue embedding job:', error)
      // Don't throw - note was updated successfully, embedding is supplementary
    }

    return result
  }
}
