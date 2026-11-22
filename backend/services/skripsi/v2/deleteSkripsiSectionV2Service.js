import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { findOwnedSection } from '#services/skripsi/v2/skripsiSetOwnership'

// Every section can go except the one holding the daftar pustaka: it is where
// "Kumpulkan referensi" writes, and a report that lost it would have nowhere
// for its references to land.
export class DeleteSkripsiSectionV2Service extends BaseService {
  static async call({ sectionId, userId }) {
    const section = await findOwnedSection(sectionId, userId)

    if (section.is_reference_slot) {
      throw new ValidationError('Bagian Referensi tidak bisa dihapus')
    }

    await prisma.$transaction(async (tx) => {
      await tx.skripsi_sections.delete({ where: { id: section.id } })

      const remaining = await tx.skripsi_sections.findMany({
        where: { set_id: section.set_id },
        orderBy: [{ position: 'asc' }, { id: 'asc' }],
        select: { id: true },
      })

      await Promise.all(remaining.map((row, index) => (
        tx.skripsi_sections.update({ where: { id: row.id }, data: { position: index } })
      )))
    })

    return { success: true }
  }
}
