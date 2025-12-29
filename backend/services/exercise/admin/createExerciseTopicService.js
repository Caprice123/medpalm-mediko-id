import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"
import attachmentService from '#services/attachment/attachmentService'

export class CreateExerciseTopicService extends BaseService {
    static async call({ title, description, contentType, content, blobId, tags, questions, status, createdBy }) {
        // Validate inputs
        await this.validate({ title, description, contentType, content, blobId, tags, questions })

        // Create topic with questions and tags
        const topic = await prisma.exercise_topics.create({
            data: {
                title,
                description: description || '',
                content_type: contentType,
                content: contentType === 'text' ? content : null,
                status: status || 'draft',
                created_by: createdBy,
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
        if (blobId && contentType === 'pdf') {
            await attachmentService.attach({
                name: 'pdf',
                recordType: 'exercise_topic',
                recordId: topic.id,
                blobId: blobId
            })
        }

        return topic
    }

    static async validate({ title, contentType, content, blobId, tags, questions }) {
        // Validate required fields
        if (!title) {
            throw new ValidationError('Title is required')
        }

        if (!contentType || !['text', 'pdf'].includes(contentType)) {
            throw new ValidationError('Content type must be either "text" or "pdf"')
        }

        if (contentType === 'text' && !content) {
            throw new ValidationError('Content is required for text type')
        }

        if (contentType === 'pdf' && !blobId) {
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