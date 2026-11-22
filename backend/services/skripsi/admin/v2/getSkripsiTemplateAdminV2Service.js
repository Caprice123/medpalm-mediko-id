import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { NotFoundError } from '#errors/notFoundError'

// One template with its whole outline, read when the edit form opens.
//
// The listing deliberately does not carry sections — a page of twenty
// templates would ship every heading of every one of them to draw a column
// that only needs a count — so this is where the form gets what it edits.
export class GetSkripsiTemplateAdminV2Service extends BaseService {
  static async call({ id }) {
    const template = await prisma.skripsi_templates.findUnique({
      where: { id: parseInt(id) },
      include: { sections: { orderBy: [{ position: 'asc' }, { id: 'asc' }] } },
    })

    if (!template) {
      throw new NotFoundError('Template tidak ditemukan')
    }

    return template
  }
}
