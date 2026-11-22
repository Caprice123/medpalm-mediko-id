import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { NotFoundError } from '#errors/notFoundError'

// The outline is edited as a whole list in the modal, so it is written back as
// a whole list: the old rows go, the submitted ones take their place. Sets
// already created keep their own copy of the sections, so rewriting the
// template never touches a student's report.
// A template describes the body of a report only: every report gets its
// Referensi section appended as the last one when it is created, so an outline
// never names it itself.
export class UpdateSkripsiTemplateV2Service extends BaseService {
  static async call({ id, name, description, position, isActive, sections }) {
    const template = await prisma.skripsi_templates.findUnique({ where: { id: parseInt(id) } })

    if (!template) {
      throw new NotFoundError('Template tidak ditemukan')
    }

    const data = { updated_at: new Date() }

    if (name !== undefined) {
      if (!name || !name.trim()) throw new ValidationError('Nama template wajib diisi')
      data.name = name.trim()
    }
    if (description !== undefined) data.description = description?.trim() || null
    if (position !== undefined) data.position = parseInt(position) || 0
    if (isActive !== undefined) data.is_active = Boolean(isActive)

    let cleanSections = null
    if (sections !== undefined) {
      cleanSections = (sections || [])
        .map(section => ({ title: section.title?.trim() }))
        .filter(section => section.title)

      if (cleanSections.length === 0) {
        throw new ValidationError('Template harus memiliki minimal satu bagian')
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.skripsi_templates.update({ where: { id: template.id }, data })

      if (cleanSections) {
        await tx.skripsi_template_sections.deleteMany({ where: { template_id: template.id } })
        await tx.skripsi_template_sections.createMany({
          data: cleanSections.map((section, index) => ({
            template_id: template.id,
            title: section.title,
            position: index + 1,
          })),
        })
      }
    })

    return prisma.skripsi_templates.findUnique({
      where: { id: template.id },
      include: { sections: { orderBy: [{ position: 'asc' }, { id: 'asc' }] } },
    })
  }
}
