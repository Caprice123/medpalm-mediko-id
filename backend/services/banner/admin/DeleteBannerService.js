import { NotFoundError } from '#errors/notFoundError'
import prisma from '#prisma/client'

export class DeleteBannerService {
  static async call(uniqueId) {
    const banner = await prisma.banners.findFirst({
      where: { unique_id: uniqueId, is_deleted: false },
    })

    if (!banner) throw new NotFoundError('Banner not found')

    await prisma.banners.update({
      where: { id: banner.id },
      data: { is_deleted: true, deleted_at: new Date() },
    })
  }
}
