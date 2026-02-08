import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"
import attachmentService from '#services/attachment/attachmentService'

export class GetOsceTopicDetailService extends BaseService {
    static async call(topicId) {
        this.validate(topicId)

        const topic = await prisma.osce_topics.findUnique({
            where: { unique_id: topicId },
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
                        }
                    },
                    orderBy: {
                        id: 'asc'
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
                    blobId: attachment.blob?.id,
                    filename: attachment.blob?.filename || attachment.name,
                    url: url?.url || null,
                    byteSize: attachment.blob?.byte_size || null,
                    contentType: attachment.blob?.content_type || 'application/octet-stream'
                }
            })
        )

        // Process observations with image URLs
        const observationsWithUrls = await Promise.all(
            (topic.osce_topic_observations || []).map(async (topicObs) => {
                // Fetch observation image attachment if exists
                const imageAttachment = await attachmentService.getAttachmentWithUrl(
                    'osce_topic_observation',
                    topicObs.id,
                    'observation_image'
                )

                return {
                    observationId: topicObs.observation_id,
                    observationName: topicObs.osce_observation?.name || null,
                    groupName: topicObs.osce_observation?.osce_observation_group?.name || null,
                    observationText: topicObs.observation_text,
                    observationImageBlobId: imageAttachment?.blob.id || null,
                    observationImageUrl: imageAttachment?.url || null,
                    observationImageFilename: imageAttachment?.blob.filename || null,
                    observationImageSize: imageAttachment?.blob?.byte_size || null,
                    observationImageContentType: imageAttachment?.blob?.content_type || null,
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
        if (!topicId || typeof topicId !== 'string') {
            throw new ValidationError('Topic ID is required')
        }
    }
}
