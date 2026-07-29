import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { queueEmbedSummaryNote } from '#jobs/queues/summaryNotesQueue'

export class CreateSummaryNoteV2Service extends BaseService {
  static async call({ title, description, content, markdownContent, blobId, status, tagIds, flashcardDeckIds, mcqTopicIds, createdBy }) {
    if (!title) throw new ValidationError('Judul wajib diisi')
    if (!content) throw new ValidationError('Konten wajib diisi')
    if (!createdBy) throw new ValidationError('Pembuat wajib diisi')

    if (blobId) {
      const blob = await prisma.blobs.findUnique({ where: { id: parseInt(blobId) } })
      if (!blob) throw new ValidationError('Blob tidak ditemukan')
    }

    const result = await prisma.$transaction(async (tx) => {
      const summaryNote = await tx.summary_notes.create({
        data: {
          title,
          description: description || null,
          content,
          markdown_content: markdownContent || null,
          status: status || 'draft',
          created_by: createdBy,
          version: 2,
        },
      })

      if (tagIds?.length > 0) {
        await tx.summary_note_tags.createMany({
          data: tagIds.map(tagId => ({ summary_note_id: summaryNote.id, tag_id: tagId })),
        })
      }

      if (blobId) {
        await tx.attachments.create({
          data: {
            name: 'source_document',
            record_type: 'summary_note',
            record_id: summaryNote.id,
            blob_id: parseInt(blobId),
          },
        })
      }

      if (flashcardDeckIds?.length > 0) {
        await tx.summary_note_flashcard_decks.createMany({
          data: flashcardDeckIds.map(deckId => ({ summary_note_id: summaryNote.id, flashcard_deck_id: parseInt(deckId) })),
        })
        await tx.content_relations.createMany({
          data: flashcardDeckIds.map((deckId, i) => ({
            source_type: 'summary_note', source_id: summaryNote.id,
            target_type: 'flashcard_deck', target_id: parseInt(deckId), order: i,
          })),
          skipDuplicates: true,
        })
      }

      if (mcqTopicIds?.length > 0) {
        await tx.summary_note_mcq_topics.createMany({
          data: mcqTopicIds.map(topicId => ({ summary_note_id: summaryNote.id, mcq_topic_id: parseInt(topicId) })),
        })
        await tx.content_relations.createMany({
          data: mcqTopicIds.map((topicId, i) => ({
            source_type: 'summary_note', source_id: summaryNote.id,
            target_type: 'mcq_topic', target_id: parseInt(topicId), order: i,
          })),
          skipDuplicates: true,
        })
      }

      return tx.summary_notes.findUnique({ where: { id: summaryNote.id } })
    }, { timeout: 30_000 })

    if (result.status === 'published') {
      try {
        await queueEmbedSummaryNote(result.id, result.unique_id)
      } catch (error) {
        console.error('Gagal mengantrekan embedding:', error)
      }
    }

    return result
  }
}
