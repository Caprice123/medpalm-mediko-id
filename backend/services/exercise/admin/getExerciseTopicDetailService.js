import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"
import idriveService from '#services/idrive.service'

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
                        tags: {
                            include: {
                                tag_group: true
                            }
                        }
                    }
                }
            }
        })

        if (!topic) {
            throw new ValidationError('Topic not found')
        }

        // Fetch PDF attachment for topic if exists
        const attachment = await prisma.attachments.findFirst({
            where: {
                record_type: 'exercise_topic',
                record_id: topic.id,
                name: 'pdf'
            },
            include: {
                blob: true
            }
        })

        // Generate presigned URL for topic PDF if blob exists
        let pdfUrl = null
        if (attachment?.blob) {
            pdfUrl = await idriveService.getSignedUrl(attachment.blob.key, 7 * 24 * 60 * 60)
        }

        // Transform tags to include tag_group info
        const transformedTopic = {
            ...topic,
            blob: attachment ? {
                id: attachment.blob_id,
                url: pdfUrl,
                key: attachment.blob.key,
                filename: attachment.blob.filename,
                size: attachment.blob.byte_size
            } : null,
            tags: topic.exercise_topic_tags.map(t => ({
                id: t.tags.id,
                name: t.tags.name,
                type: t.tags.type,
                tag_group: t.tags.tag_group ? {
                    id: t.tags.tag_group.id,
                    name: t.tags.tag_group.name
                } : null
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
