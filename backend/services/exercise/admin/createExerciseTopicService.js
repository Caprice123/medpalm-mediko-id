import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"
import attachmentService from '#services/attachment/attachmentService'

export class CreateExerciseTopicService extends BaseService {
    static async call({ title, description, content_type, content, blobId, tags, questions, created_by }) {
        // Validate inputs
        await this.validate({ title, description, content_type, content, blobId, tags, questions })

        // Create topic with questions and tags
        const topic = await prisma.exercise_topics.create({
            data: {
                title,
                description: description || '',
                content_type,
                content: content_type === 'text' ? content : null,
                status: 'ready',
                created_by: created_by,
                exercise_questions: {
                    create: questions.map((q, index) => ({
                        question: q.question,
                        answer: q.answer,
                        explanation: q.explanation || '',
                        order: q.order !== undefined ? q.order : index
                    }))
                },
                exercise_topic_tags: {
                    create: tags.map(tag => ({
                        tag_id: typeof tag === 'object' ? tag.id : tag
                    }))
                }
            },
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

        // Create attachment if blobId is provided (for PDF content)
        if (blobId && content_type === 'pdf') {
            await attachmentService.createAttachment({
                name: 'pdf',
                recordType: 'exercise_topic',
                recordId: topic.id,
                blobId: blobId
            })
        }

        return topic
    }

    static async validate({ title, content_type, content, blobId, tags, questions }) {
        // Validate required fields
        if (!title) {
            throw new ValidationError('Title is required')
        }

        if (!content_type || !['text', 'pdf'].includes(content_type)) {
            throw new ValidationError('Content type must be either "text" or "pdf"')
        }

        if (content_type === 'text' && !content) {
            throw new ValidationError('Content is required for text type')
        }

        if (content_type === 'pdf' && !blobId) {
            throw new ValidationError('Blob ID is required for PDF type')
        }

        if (!tags || tags.length === 0) {
            throw new ValidationError('At least one tag is required')
        }

        if (!questions || questions.length === 0) {
            throw new ValidationError('At least one question is required')
        }

        // Validate tags exist
        const tagIds = tags.map(t => typeof t === 'object' ? t.id : t)
        const existingTags = await prisma.tags.findMany({
            where: {
                id: { in: tagIds },
                is_active: true
            }
        })

        if (existingTags.length !== tagIds.length) {
            throw new ValidationError('Some tags are invalid or inactive')
        }

        // Validate blob exists if provided
        if (blobId) {
            const blob = await prisma.blobs.findUnique({
                where: { id: blobId }
            })
            if (!blob) {
                throw new ValidationError('Invalid blob ID')
            }
        }
    }
}