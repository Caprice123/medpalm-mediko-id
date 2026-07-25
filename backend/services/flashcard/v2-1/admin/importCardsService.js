import XLSX from 'xlsx'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class ImportCardsService extends BaseService {
  static async call({ nodeId, buffer }) {
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

    const results = { imported: 0, errors: [] }

    for (const [i, row] of rows.entries()) {
      const rowNum = i + 2

      const front = String(row['Depan'] || '').trim()
      const back = String(row['Belakang'] || '').trim()

      if (!front) { results.errors.push({ row: rowNum, message: 'Kolom Depan kosong' }); continue }
      if (!back) { results.errors.push({ row: rowNum, message: 'Kolom Belakang kosong' }); continue }

      try {
        const card = await prisma.flashcard_cards.create({
          data: { front, back, is_deleted: false },
        })

        if (nodeId) {
          await prisma.feature_node_records.create({
            data: { node_id: parseInt(nodeId), record_type: 'flashcard_card', record_id: card.id },
          })
        }

        results.imported++
      } catch {
        results.errors.push({ row: rowNum, message: 'Gagal menyimpan' })
      }
    }

    if (nodeId && results.imported > 0) {
      await prisma.node_statistics.upsert({
        where: { node_id_record_type: { node_id: parseInt(nodeId), record_type: 'flashcard_card' } },
        create: { node_id: parseInt(nodeId), record_type: 'flashcard_card', total_count: results.imported },
        update: { total_count: { increment: results.imported } },
      })
    }

    return results
  }
}
