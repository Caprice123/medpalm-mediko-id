import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

// The template picker on "Buat laporan baru": the admin-managed templates
// everyone sees, plus the student's own saved outlines. Inactive admin
// templates stay in the admin panel but are never offered here.
export class GetSkripsiTemplatesV2Service extends BaseService {
  static async call({ userId } = {}) {
    return prisma.skripsi_templates.findMany({
      where: {
        is_active: true,
        OR: [{ owner_user_id: null }, { owner_user_id: userId ?? -1 }],
      },
      // Admin templates first, then the student's own, each in their own order.
      orderBy: [{ owner_user_id: { sort: 'asc', nulls: 'first' } }, { position: 'asc' }, { id: 'asc' }],
      include: {
        sections: { orderBy: [{ position: 'asc' }, { id: 'asc' }] },
      },
    })
  }
}
