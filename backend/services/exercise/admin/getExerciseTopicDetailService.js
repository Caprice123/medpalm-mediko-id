import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"
import IDriveService from '#services/idrive.service'

export class GetExerciseTopicDetailService extends BaseService {
    static async call(topicId) {
        this.validate(topicId)

        const topic = await prisma.exercise_topics.findUnique({
            where: { id: parseInt(topicId) },
            include: {
                exercise_questions: {
                    orderBy: { order: 'asc' }
                },
                exercise_topic_tags: {
                    include: {
                        tags: true
                    }
                }
            }
        })

        if (!topic) {
            throw new ValidationError('Topic not found')
        }

        // Fetch PDF attachment if exists
        const attachment = await prisma.attachments.findFirst({
            where: {
                recordType: 'exercise_topic',
                recordId: topic.id,
                name: 'pdf'
            },
            include: {
                blob: true
            }
        })

        // Generate presigned URL if blob exists
        let pdfUrl = null
        if (attachment?.blob) {
            pdfUrl = await IDriveService.getSignedUrl(attachment.blob.key, 7 * 24 * 60 * 60)
        }

        // Transform with blob data
        const transformedTopic = {
            ...topic,
            blob: attachment ? {
                id: attachment.blobId,
                url: pdfUrl,
                key: attachment.blob.key,
                filename: attachment.blob.filename,
                size: attachment.blob.byteSize
            } : null,
            tags: topic.exercise_topic_tags.map(t => ({
                id: t.tags.id,
                name: t.tags.name,
                type: t.tags.type
            }))
        }

        return transformedTopic
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
