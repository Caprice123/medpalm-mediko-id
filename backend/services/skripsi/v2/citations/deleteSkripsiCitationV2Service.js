import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { NotFoundError } from '#errors/notFoundError'

// Dropping a source from the daftar pustaka. The rest are renumbered so the
// saved order stays dense — that order is the Vancouver numbering, and a gap in
// it would show up in the generated list.
//
// Markers already pasted into paragraphs are plain text and do not move: that
// is the known cost of plain-text markers, and why the panel warns before a
// delete when the style is a numbered one.
export class DeleteSkripsiCitationV2Service extends BaseService {
  static async call({ citationId, userId }) {
    const citation = await prisma.skripsi_citations.findFirst({
      where: {
        id: parseInt(citationId),
        skripsi_set: { user_id: userId, is_deleted: false },
      },
    })

    if (!citation) {
      throw new NotFoundError('Referensi tidak ditemukan')
    }

    await prisma.$transaction(async (tx) => {
      await tx.skripsi_citations.delete({ where: { id: citation.id } })

      const remaining = await tx.skripsi_citations.findMany({
        where: { set_id: citation.set_id },
        orderBy: [{ position: 'asc' }, { id: 'asc' }],
        select: { id: true },
      })

      await Promise.all(remaining.map((row, index) => (
        tx.skripsi_citations.update({ where: { id: row.id }, data: { position: index } })
      )))
    })

    return { success: true }
  }
}
