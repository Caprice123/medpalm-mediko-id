import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { queueEmbedSummaryNote } from '#jobs/queues/summaryNotesQueue'

export class CreateSummaryNoteV2Service extends BaseService {
  static async call({ title, description, content, markdownContent, blobId, status, tagIds, createdBy, nodeId }) {
    if (!content) throw new ValidationError('Konten wajib diisi')
    if (!createdBy) throw new ValidationError('Pembuat wajib diisi')

    let node = null
    if (nodeId) {
      node = await prisma.feature_nodes.findUnique({ where: { id: parseInt(nodeId) } })
      if (!node) throw new ValidationError('Sub-topik tidak ditemukan')

      const existingRecord = await prisma.feature_node_records.findFirst({
        where: { node_id: node.id, record_type: 'summary_note' },
      })
      if (existingRecord) throw new ValidationError('Sub-topik ini sudah memiliki ringkasan')
    }

    const resolvedTitle = node ? node.name : title
    if (!resolvedTitle) throw new ValidationError('Judul wajib diisi')

    if (blobId) {
      const blob = await prisma.blobs.findUnique({ where: { id: parseInt(blobId) } })
      if (!blob) throw new ValidationError('Blob tidak ditemukan')
    }

    const result = await prisma.$transaction(async (tx) => {
      const summaryNote = await tx.summary_notes.create({
        data: {
          title: resolvedTitle,
          description: description || null,
          content,
          markdown_content: markdownContent || null,
          status: status || 'draft',
          created_by: createdBy,
          version: 2,
        },
      })

      if (node) {
        await tx.feature_node_records.create({
          data: { node_id: node.id, record_type: 'summary_note', record_id: summaryNote.id },
        })
      }

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
