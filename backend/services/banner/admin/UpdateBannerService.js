import { ValidationError } from '#errors/validationError'
import { NotFoundError } from '#errors/notFoundError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class UpdateBannerService {
  static async call({ uniqueId, title, description, redirectUrl, redirectLabel, gradientStart, gradientEnd, isActive, order, imageBlobId }) {
    const banner = await prisma.banners.findFirst({
      where: { unique_id: uniqueId, is_deleted: false },
    })

    if (!banner) throw new NotFoundError('Banner not found')

    if (!title) throw new ValidationError('Title is required')
    if (!redirectUrl) throw new ValidationError('Redirect URL is required')

    const updated = await prisma.banners.update({
      where: { id: banner.id },
      data: {
        title,
        description: description || null,
        redirect_url: redirectUrl,
        redirect_label: redirectLabel || null,
        gradient_start: gradientStart || null,
        gradient_end: gradientEnd || null,
        is_active: isActive ?? banner.is_active,
        order: order !== undefined ? parseInt(order) : banner.order,
        updated_at: new Date(),
      },
    })

    if (imageBlobId) {
      await attachmentService.detachAll({ recordType: 'banner', recordId: banner.id })
      await attachmentService.attach({
        blobId: parseInt(imageBlobId),
        recordType: 'banner',
        recordId: banner.id,
        name: 'image',
      })
    }

    return updated
  }
}
