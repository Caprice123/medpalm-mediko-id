import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"
import attachmentService from '#services/attachment/attachmentService'

export class GetOsceTopicDetailService extends BaseService {
    static async call(topicId) {
        this.validate(topicId)

        const topic = await prisma.osce_topics.findUnique({
            where: { id: parseInt(topicId) },
            include: {
                osce_topic_tags: {
                    include: {
                        tags: {
                            include: {
                                tag_group: true
                            }
                        }
                    }
                },
                osce_topic_observations: {
                    include: {
                        osce_observation: {
                            include: {
                                osce_observation_group: true
                            }
                        },
                    },
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        })

        if (!topic) {
            throw new ValidationError('Topic not found')
        }

        // Fetch attachments with presigned URLs
        const attachments = await attachmentService.getAttachments('osce_topic', topic.id)

        // Add presigned URLs to attachments
        const attachmentsWithUrls = await Promise.all(
            attachments.map(async (attachment) => {
                const url = await attachmentService.getAttachmentWithUrl('osce_topic', topic.id, attachment.name)
                return {
                    blobId: attachment.blob_id,
                    filename: attachment.blob?.filename || attachment.name,
                    url: url?.url || null,
                    contentType: attachment.blob?.content_type || 'application/octet-stream'
                }
            })
        )

        // Process observations with image URLs
        const observationsWithUrls = await Promise.all(
            (topic.osce_topic_observations || []).map(async (topicObs) => {
                let imageUrl = null
                if (topicObs.observation_image_blob_id && topicObs.blob) {
                    const signedUrl = await attachmentService.getPresignedUrl(topicObs.blob.key)
                    imageUrl = signedUrl
                }

                return {
                    observationId: topicObs.observation_id,
                    observationName: topicObs.osce_observation?.name || null,
                    groupName: topicObs.osce_observation?.osce_observation_group?.name || null,
                    observationText: topicObs.observation_text,
                    observationImageBlobId: topicObs.observation_image_blob_id,
                    observationImageUrl: imageUrl,
                    observationImageFilename: topicObs.blob?.filename || null,
                    observationImageSize: topicObs.blob?.byte_size || null,
                    observationImageContentType: topicObs.blob?.content_type || null,
                    requiresInterpretation: topicObs.requires_interpretation,
                    order: topicObs.order
                }
            })
        )

        return {
            ...topic,
            attachments: attachmentsWithUrls,
            observations: observationsWithUrls
        }
    }

    static validate(topicId) {
        if (!topicId) {
            throw new ValidationError('Topic ID is required')
        }

        const id = parseInt(topicId)
        if (isNaN(id) || id <= 0) {
            throw new ValidationError('Invalid topic ID')
        }
    }
}
