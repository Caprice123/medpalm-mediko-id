import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { findOwnedSet } from '#services/skripsi/v2/skripsiSetOwnership'

// Takes the full ordered list of section ids and renumbers them. Sending the
// whole order rather than a single move keeps the client and the stored order
// from drifting apart when two moves land close together.
//
// The reference section is pinned to the end whatever order arrives: a daftar
// pustaka that is not last is not a daftar pustaka, and the generate writes
// into whichever section holds the flag.
export class ReorderSkripsiSectionsV2Service extends BaseService {
  static async call({ setId, userId, sectionIds }) {
    if (!Array.isArray(sectionIds) || sectionIds.length === 0) {
      throw new ValidationError('Urutan bagian tidak valid')
    }

    const set = await findOwnedSet(setId, userId)

    const owned = await prisma.skripsi_sections.findMany({
      where: { set_id: set.id },
      select: { id: true, is_reference_slot: true },
    })
    const ownedIds = new Set(owned.map(row => row.id))
    const requested = sectionIds.map(id => parseInt(id))

    if (requested.length !== ownedIds.size || requested.some(id => !ownedIds.has(id))) {
      throw new ValidationError('Urutan bagian tidak cocok dengan isi laporan')
    }

    const referenceId = owned.find(row => row.is_reference_slot)?.id ?? null
    const ordered = referenceId === null
      ? requested
      : [...requested.filter(id => id !== referenceId), referenceId]

    await prisma.$transaction(ordered.map((id, index) => (
      prisma.skripsi_sections.update({ where: { id }, data: { position: index } })
    )))

    return prisma.skripsi_sections.findMany({
      where: { set_id: set.id },
      orderBy: [{ position: 'asc' }, { id: 'asc' }],
    })
  }
}
