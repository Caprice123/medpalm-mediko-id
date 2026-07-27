import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import embeddingService from '#services/embedding/embeddingService'

export class DeleteSummaryNoteV2Service extends BaseService {
  static async call({ id }) {
    if (!id) throw new ValidationError('ID ringkasan wajib diisi')

    const existing = await prisma.summary_notes.findUnique({ where: { unique_id: id } })
    if (!existing) throw new ValidationError('Ringkasan tidak ditemukan')

    await prisma.summary_notes.update({
      where: { id: existing.id },
      data: { is_deleted: true, deleted_at: new Date() },
    })

    if (existing.status === 'published') {
      try {
        await embeddingService.deleteSummaryNoteEmbedding(existing.unique_id)
      } catch (error) {
        console.error('Gagal menghapus embedding ringkasan:', error)
      }
    }

    return { success: true }
  }
}
