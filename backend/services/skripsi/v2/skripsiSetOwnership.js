import prisma from '#prisma/client'
import { NotFoundError } from '#errors/notFoundError'

// Every section write is addressed by the set's uniqueId (or by a section id
// that must belong to one of the caller's sets), so both lookups live here
// rather than being re-typed in each service.
export async function findOwnedSet(uniqueId, userId) {
  const set = await prisma.skripsi_sets.findFirst({
    where: { unique_id: uniqueId, user_id: userId, is_deleted: false },
  })

  if (!set) {
    throw new NotFoundError('Set tidak ditemukan')
  }

  return set
}

export async function findOwnedSection(sectionId, userId) {
  const section = await prisma.skripsi_sections.findFirst({
    where: {
      id: parseInt(sectionId),
      skripsi_set: { user_id: userId, is_deleted: false },
    },
  })

  if (!section) {
    throw new NotFoundError('Bagian tidak ditemukan')
  }

  return section
}
