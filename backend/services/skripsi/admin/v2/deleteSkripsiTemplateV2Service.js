import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { NotFoundError } from '#errors/notFoundError'

// Reports created from the template keep their own sections; the foreign key
// only drops the back-reference, so deleting a template never deletes a
// student's work.
export class DeleteSkripsiTemplateV2Service extends BaseService {
  static async call({ id }) {
    const template = await prisma.skripsi_templates.findUnique({ where: { id: parseInt(id) } })

    if (!template) {
      throw new NotFoundError('Template tidak ditemukan')
    }

    await prisma.skripsi_templates.delete({ where: { id: template.id } })

    return { success: true }
  }
}
