import { NotFoundError } from '#errors/notFoundError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class GetBannerDetailService {
  static async call(uniqueId) {
    const banner = await prisma.banners.findFirst({
      where: { unique_id: uniqueId, is_deleted: false },
    })

    if (!banner) throw new NotFoundError('Banner not found')

    const image = await attachmentService.getAttachmentWithUrl('banner', banner.id, 'image')

    return { ...banner, image }
  }
}
