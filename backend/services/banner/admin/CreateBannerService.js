import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class CreateBannerService {
  static async call({ title, description, redirectUrl, redirectLabel, gradientStart, gradientEnd, isActive, order, imageBlobId }) {
    if (!title) throw new ValidationError('Title is required')
    if (!redirectUrl) throw new ValidationError('Redirect URL is required')

    const banner = await prisma.banners.create({
      data: {
        title,
        description: description || null,
        redirect_url: redirectUrl,
        redirect_label: redirectLabel || null,
        gradient_start: gradientStart || null,
        gradient_end: gradientEnd || null,
        is_active: isActive ?? false,
        order: order ? parseInt(order) : 0,
      },
    })

    if (imageBlobId) {
      await attachmentService.attach({
        blobId: parseInt(imageBlobId),
        recordType: 'banner',
        recordId: banner.id,
        name: 'image',
      })
    }

    return banner
  }
}
