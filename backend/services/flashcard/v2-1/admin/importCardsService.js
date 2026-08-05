import XLSX from 'xlsx'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { bumpNodeStat } from '#utils/nodeStatisticsHelper'

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

      const references = []
      for (let n = 1; n <= 3; n++) {
        const label = String(row[`Referensi ${n} Judul`] || '').trim()
        const url = String(row[`Referensi ${n} Link`] || '').trim()
        if (label || url) references.push({ label, url: url || undefined })
      }

      if (!front) { results.errors.push({ row: rowNum, message: 'Kolom Depan kosong' }); continue }
      if (!back) { results.errors.push({ row: rowNum, message: 'Kolom Belakang kosong' }); continue }

      try {
        const card = await prisma.flashcard_cards.create({
          data: { front, back, references, is_deleted: false, version: nodeId ? 2 : 1 },
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
      await bumpNodeStat(prisma, parseInt(nodeId), 'flashcard_card', results.imported)

      const node = await prisma.feature_nodes.findUnique({ where: { id: parseInt(nodeId) }, select: { parent_id: true } })
      if (node?.parent_id) {
        await bumpNodeStat(prisma, node.parent_id, 'flashcard_card', results.imported)
      }
    }

    return results
  }
}
