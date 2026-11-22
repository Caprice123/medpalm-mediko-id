import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { NotFoundError } from '#errors/notFoundError'

// A student can only delete a template they saved themselves — the
// admin-managed ones (no owner) are not theirs to remove.
export class DeleteUserSkripsiTemplateV2Service extends BaseService {
  static async call({ userId, templateId }) {
    const template = await prisma.skripsi_templates.findFirst({
      where: { id: parseInt(templateId), owner_user_id: userId },
    })

    if (!template) {
      throw new NotFoundError('Template tidak ditemukan')
    }

    await prisma.skripsi_templates.delete({ where: { id: template.id } })

    return { success: true }
  }
}
