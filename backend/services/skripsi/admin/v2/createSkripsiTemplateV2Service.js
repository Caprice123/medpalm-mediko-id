import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { buildTemplateKey } from '#services/skripsi/admin/v2/skripsiTemplateKey'

// A template describes the body of a report only: every report gets its
// Referensi section appended as the last one when it is created, so an outline
// never names it itself.
export class CreateSkripsiTemplateV2Service extends BaseService {
  static async call({ name, description, position, isActive = true, sections = [] }) {
    if (!name || !name.trim()) {
      throw new ValidationError('Nama template wajib diisi')
    }

    const cleanSections = (sections || [])
      .map(section => ({ title: section.title?.trim() }))
      .filter(section => section.title)

    if (cleanSections.length === 0) {
      throw new ValidationError('Template harus memiliki minimal satu bagian')
    }

    const key = await buildTemplateKey(name.trim())

    return prisma.skripsi_templates.create({
      data: {
        key,
        name: name.trim(),
        description: description?.trim() || null,
        position: parseInt(position) || 0,
        is_active: Boolean(isActive),
        sections: {
          create: cleanSections.map((section, index) => ({
            title: section.title,
            position: index + 1,
          })),
        },
      },
      include: { sections: { orderBy: [{ position: 'asc' }, { id: 'asc' }] } },
    })
  }
}
