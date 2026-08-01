import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { queueEmbedSummaryNote, queueDeleteSummaryNoteEmbedding } from '#jobs/queues/summaryNotesQueue'

export class UpdateSummaryNoteV2Service extends BaseService {
  static async call({ id, title, description, content, markdownContent, blobId, status, tagIds }) {
    if (!id) throw new ValidationError('ID ringkasan wajib diisi')

    const existing = await prisma.summary_notes.findUnique({ where: { unique_id: id } })
    if (!existing) throw new ValidationError('Ringkasan tidak ditemukan')

    if (blobId !== undefined && blobId !== null) {
      const blob = await prisma.blobs.findUnique({ where: { id: parseInt(blobId) } })
      if (!blob) throw new ValidationError('Blob tidak ditemukan')
    }

    const result = await prisma.$transaction(async (tx) => {
      const updateData = { updated_at: new Date() }
      if (title !== undefined) updateData.title = title
      if (description !== undefined) updateData.description = description
      if (content !== undefined) updateData.content = content
      if (markdownContent !== undefined) updateData.markdown_content = markdownContent
      if (status !== undefined) updateData.status = status

      const summaryNote = await tx.summary_notes.update({
        where: { unique_id: id },
        data: updateData,
      })

      if (tagIds !== undefined) {
        await tx.summary_note_tags.deleteMany({ where: { summary_note_id: existing.id } })
        if (tagIds.length > 0) {
          await tx.summary_note_tags.createMany({
            data: tagIds.map(tagId => ({ summary_note_id: summaryNote.id, tag_id: tagId })),
          })
        }
      }

      if (blobId !== undefined) {
        await tx.attachments.deleteMany({
          where: { record_type: 'summary_note', record_id: existing.id, name: 'source_document' },
        })
        if (blobId) {
          await tx.attachments.create({
            data: {
              name: 'source_document',
              record_type: 'summary_note',
              record_id: existing.id,
              blob_id: parseInt(blobId),
            },
          })
        }
      }

      return tx.summary_notes.findUnique({
        where: { id: summaryNote.id },
        select: { id: true, unique_id: true, status: true },
      })
    }, { timeout: 30_000 })

    try {
      const wasPublished = existing.status === 'published'
      const isPublished = result.status === 'published'
      if (!wasPublished && isPublished) {
        await queueEmbedSummaryNote(result.id, result.unique_id)
      } else if (wasPublished && !isPublished) {
        await queueDeleteSummaryNoteEmbedding(result.id, result.unique_id)
      } else if (isPublished) {
        await queueEmbedSummaryNote(result.id, result.unique_id)
      }
    } catch (error) {
      console.error('Gagal mengantrekan embedding:', error)
    }

    return result
  }
}
