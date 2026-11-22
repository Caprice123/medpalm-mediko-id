import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { findOwnedSet } from '#services/skripsi/v2/skripsiSetOwnership'
import { buildTemplateKey } from '#services/skripsi/admin/v2/skripsiTemplateKey'

const MAX_OWN_TEMPLATES = 20

// "Simpan sebagai template saya": the outline of the report being written is
// saved so the next one can start from it. Only the headings are copied — what
// was written into them stays with that report.
export class CreateUserSkripsiTemplateV2Service extends BaseService {
  static async call({ userId, setId, name }) {
    if (!name || !name.trim()) {
      throw new ValidationError('Nama template wajib diisi')
    }

    const set = await findOwnedSet(setId, userId)

    const sections = await prisma.skripsi_sections.findMany({
      where: { set_id: set.id },
      orderBy: [{ position: 'asc' }, { id: 'asc' }],
    })

    if (sections.length === 0) {
      throw new ValidationError('Laporan ini belum punya bagian untuk disimpan sebagai template')
    }

    const owned = await prisma.skripsi_templates.count({ where: { owner_user_id: userId } })
    if (owned >= MAX_OWN_TEMPLATES) {
      throw new ValidationError(`Template pribadi maksimal ${MAX_OWN_TEMPLATES}. Hapus salah satu dulu.`)
    }

    const key = await buildTemplateKey(`user_${userId}_${name.trim()}`)

    return prisma.skripsi_templates.create({
      data: {
        key,
        owner_user_id: userId,
        name: name.trim(),
        description: 'Template pribadi',
        position: 0,
        is_active: true,
        sections: {
          create: sections.map((section, index) => ({
            title: section.title,
            position: index + 1,
          })),
        },
      },
      include: { sections: { orderBy: [{ position: 'asc' }, { id: 'asc' }] } },
    })
  }
}
