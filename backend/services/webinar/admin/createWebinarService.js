import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class CreateWebinarService {
  static async call({ title, description, speakers, benefits, suitableFor, joinUrl, startAt, endAt, registrationStartAt, registrationEndAt, status, thumbnailBlobId, createdBy }) {
    await this.validate({ title, joinUrl, startAt, registrationStartAt, registrationEndAt })

    const webinar = await prisma.webinar_events.create({
      data: {
        title,
        description: description || null,
        speakers: speakers || [],
        benefits: benefits || null,
        suitable_for: suitableFor || [],
        join_url: joinUrl || [],
        start_at: new Date(startAt),
        end_at: endAt ? new Date(endAt) : null,
        registration_start_at: new Date(registrationStartAt),
        registration_end_at: new Date(registrationEndAt),
        status: status || 'draft',
        created_by: createdBy,
      },
    })

    if (thumbnailBlobId) {
      await attachmentService.attach({
        blobId: parseInt(thumbnailBlobId),
        recordType: 'webinar_event',
        recordId: webinar.id,
        name: 'thumbnail',
      })
    }

    return webinar
  }

  static async validate({ title, joinUrl, startAt, registrationStartAt, registrationEndAt }) {
    if (!title) throw new ValidationError('Title is required')
    if (!joinUrl || !Array.isArray(joinUrl) || joinUrl.length === 0) throw new ValidationError('At least one join link is required')
    if (!startAt) throw new ValidationError('Start date is required')
    if (!registrationStartAt) throw new ValidationError('Registration start date is required')
    if (!registrationEndAt) throw new ValidationError('Registration end date is required')
  }
}
