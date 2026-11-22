import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { findOwnedSection } from '#services/skripsi/v2/skripsiSetOwnership'

// Renaming and writing a section both land here — the editor autosaves content
// far more often than it renames, so both go through one narrow write.
export class UpdateSkripsiSectionV2Service extends BaseService {
  static async call({ sectionId, userId, title, content }) {
    const section = await findOwnedSection(sectionId, userId)

    const data = { updated_at: new Date() }

    if (title !== undefined) {
      if (!title || !title.trim()) {
        throw new ValidationError('Judul bagian wajib diisi')
      }

      // The daftar pustaka is addressed by name in the export and in every
      // style's wording, so the one section that holds it keeps its heading.
      if (section.is_reference_slot && title.trim() !== section.title) {
        throw new ValidationError('Nama bagian Referensi tidak bisa diubah')
      }

      data.title = title.trim()
    }

    if (content !== undefined) data.content = content

    const updated = await prisma.skripsi_sections.update({ where: { id: section.id }, data })

    // The list page orders sets by `updated_at`, so writing a section has to
    // touch the set too or a report being actively written sinks down the list.
    await prisma.skripsi_sets.update({
      where: { id: section.set_id },
      data: { updated_at: new Date() },
    })

    return updated
  }
}
