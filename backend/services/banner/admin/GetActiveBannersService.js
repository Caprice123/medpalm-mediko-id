import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class GetActiveBannersService {
  static async call() {
    const banners = await prisma.banners.findMany({
      where: { is_deleted: false, is_active: true },
      orderBy: [{ order: 'asc' }, { created_at: 'desc' }],
    })

    const images = await Promise.all(
      banners.map(b => attachmentService.getAttachmentWithUrl('banner', b.id, 'image'))
    )

    return banners.map((b, i) => ({ ...b, image: images[i] }))
  }
}
