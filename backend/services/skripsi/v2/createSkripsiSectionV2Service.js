import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { findOwnedSet } from '#services/skripsi/v2/skripsiSetOwnership'

const REFERENCE_SECTION_TITLE = 'Referensi'

// Adds one section. `afterPosition` is what the "+" between two cards sends, so
// a new section can be slotted in the middle rather than only appended.
//
// The daftar pustaka closes the report, so the reference section is the one
// position nothing may be placed after: an append lands just above it, and an
// explicit afterPosition past it is pulled back. The UI hides the "+" below it
// too, but the rule belongs here — it has to hold whatever the client sends.
export class CreateSkripsiSectionV2Service extends BaseService {
  static async call({ setId, userId, title, afterPosition = null }) {
    if (!title || !title.trim()) {
      throw new ValidationError('Judul bagian wajib diisi')
    }

    const set = await findOwnedSet(setId, userId)

    const siblings = await prisma.skripsi_sections.findMany({
      where: { set_id: set.id },
      orderBy: [{ position: 'asc' }, { id: 'asc' }],
      select: { id: true, is_reference_slot: true },
    })

    // Where the reference section sits, or the end of the list when the report
    // has none (one written before the section existed).
    const referenceIndex = siblings.findIndex(row => row.is_reference_slot)
    const lastAllowed = referenceIndex === -1 ? siblings.length : referenceIndex

    const requestedIndex = afterPosition === null || afterPosition === undefined
      ? lastAllowed
      : Math.min(Math.max(parseInt(afterPosition), 0), siblings.length)

    const insertIndex = Math.min(requestedIndex, lastAllowed)

    const ordered = [...siblings]
    ordered.splice(insertIndex, 0, { id: null })

    const section = await prisma.$transaction(async (tx) => {
      const created = await tx.skripsi_sections.create({
        data: {
          set_id: set.id,
          title: title.trim(),
          content: '',
          position: insertIndex,
        },
      })

      // Everything after the insertion point shifts down by one. The list is a
      // handful of rows, so renumbering it outright keeps `position` dense.
      await Promise.all(ordered.map((row, index) => {
        if (row.id === null) return null
        return tx.skripsi_sections.update({ where: { id: row.id }, data: { position: index } })
      }))

      // A report with no Referensi section gets one now. Reports created today
      // are given theirs up front, and the backfill handled the ones that had
      // a document already — this covers the rest: an empty report whose first
      // section is being written right now.
      if (referenceIndex === -1) {
        await tx.skripsi_sections.create({
          data: {
            set_id: set.id,
            title: REFERENCE_SECTION_TITLE,
            content: '',
            position: ordered.length,
            is_reference_slot: true,
          },
        })
      }

      return created
    })

    return section
  }
}
