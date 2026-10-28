import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import embeddingService from '#services/embedding/embeddingService'
import { decrementNodeStat } from '#utils/nodeStatisticsHelper'
import { decrementContentStat, CONTENT_STAT_KEYS } from '#utils/contentStatsHelper'

export class DeleteSummaryNoteV2Service extends BaseService {
  static async call({ id }) {
    if (!id) throw new ValidationError('ID ringkasan wajib diisi')

    const existing = await prisma.summary_notes.findUnique({ where: { unique_id: id } })
    if (!existing) throw new ValidationError('Ringkasan tidak ditemukan')

    const record = await prisma.feature_node_records.findFirst({
      where: { record_type: 'summary_note', record_id: existing.id },
    })

    await prisma.summary_notes.update({
      where: { id: existing.id },
      data: { is_deleted: true, deleted_at: new Date() },
    })

    // Soft delete removes it from the landing-page count, but only if it was
    // published and not already deleted.
    if (existing.status === 'published' && !existing.deleted_at) {
      await decrementContentStat(CONTENT_STAT_KEYS.summaryNote)
    }

    if (record) {
      await prisma.feature_node_records.delete({ where: { id: record.id } })
      await decrementNodeStat(record.node_id, 'summary_note')
    }

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
