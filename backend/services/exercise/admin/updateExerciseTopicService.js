import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"
import attachmentService from '#services/attachment/attachmentService'
import idriveService from '#services/idrive.service'

export class UpdateExerciseTopicService extends BaseService {
    static async call(topicId, { title, description, contentType, content, status, tags, questions, blobId }) {
        console.log('UpdateExerciseTopicService - Received status:', status)
        console.log('UpdateExerciseTopicService - Received contentType:', contentType)
        this.validate(topicId, { title, questions })

        // Check if topic exists
        const topic = await prisma.exercise_topics.findUnique({
            where: { id: parseInt(topicId) }
        })

        if (!topic) {
            throw new ValidationError('Topic not found')
        }

        console.log('Current topic status:', topic.status)
        console.log('Current topic content_type:', topic.content_type)

        // Update topic with all fields in a transaction
        const updatedTopic = await prisma.$transaction(async (tx) => {
            // Update topic basic info
            const updateData = {
                title: title || topic.title,
                description: description !== undefined ? description : topic.description,
            }

            // Update contentType and content together
            if (contentType !== undefined && contentType !== null) {
                updateData.content_type = contentType

                // Clear content if switching to PDF, or update it if text
                if (contentType === 'pdf') {
                    updateData.content = null  // Clear text content for PDF type
                } else if (contentType === 'text' && content !== undefined) {
                    updateData.content = content
                }
            } else if (content !== undefined) {
                // If only content is provided without contentType
                updateData.content = content
            }

            // Only update status if explicitly provided
            if (status !== undefined && status !== null) {
                updateData.status = status
            }

            await tx.exercise_topics.update({
                where: { id: parseInt(topicId) },
                data: updateData
            })

            // Update topic PDF attachment if blobId is provided
            if (blobId !== undefined) {
                // Delete existing PDF attachment
                await tx.attachments.deleteMany({
                    where: {
                        record_type: 'exercise_topic',
                        record_id: parseInt(topicId),
                        name: 'pdf'
                    }
                })

                // Create new PDF attachment if blobId is not null
                if (blobId) {
                    await tx.attachments.create({
                        data: {
                            name: 'pdf',
                            record_type: 'exercise_topic',
                            record_id: parseInt(topicId),
                            blob_id: blobId
                        }
                    })
                }
            }

            // Update tags if provided
            if (tags && Array.isArray(tags)) {
                // Delete existing tags
                await tx.exercise_topic_tags.deleteMany({
                    where: { topic_id: parseInt(topicId) }
                })

                // Create new tags
                if (tags.length > 0) {
                    await tx.exercise_topic_tags.createMany({
                        data: tags.map(tagId => ({
                            topic_id: parseInt(topicId),
                            tag_id: parseInt(tagId)
                        }))
                    })
                }
            }

            // Update questions intelligently to preserve IDs and performance tracking
            if (questions && Array.isArray(questions)) {
                // Get existing questions
                const existingQuestions = await tx.exercise_questions.findMany({
                    where: { topic_id: parseInt(topicId) }
                })

                const existingIds = new Set(existingQuestions.map(q => q.id))
                const submittedIds = new Set(questions.filter(q => q.id).map(q => q.id))

                // 1. Update existing questions that are in the submitted list
                for (const q of questions) {
                    if (q.id && existingIds.has(q.id)) {
                        await tx.exercise_questions.update({
                            where: { id: q.id },
                            data: {
                                question: q.question,
                                answer: q.answer,
                                explanation: q.explanation || '',
                                order: q.order !== undefined ? q.order : 0
                            }
                        })
                    }
                }

                // 2. Create new questions (those without ID or with non-existent ID)
                const newQuestions = questions.filter(q => !q.id || !existingIds.has(q.id))
                if (newQuestions.length > 0) {
                    await tx.exercise_questions.createMany({
                        data: newQuestions.map((q, index) => ({
                            topic_id: parseInt(topicId),
                            question: q.question,
                            answer: q.answer,
                            explanation: q.explanation || '',
                            order: q.order !== undefined ? q.order : index
                        }))
                    })
                }

                // 3. Delete removed questions (exist in DB but not in submitted list)
                const questionsToDelete = existingQuestions
                    .filter(eq => !submittedIds.has(eq.id))
                    .map(eq => eq.id)

                if (questionsToDelete.length > 0) {
                    await tx.exercise_questions.deleteMany({
                        where: { id: { in: questionsToDelete } }
                    })
                }
            }

            // Fetch and return updated topic with all relations
            const updatedTopicData = await tx.exercise_topics.findUnique({
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
                    },
                }
            })

            // Transform blob attachment with presigned URL
            if (updatedTopicData.attachments && updatedTopicData.attachments.length > 0) {
                const attachment = updatedTopicData.attachments[0]
                if (attachment.blob) {
                    // Generate presigned URL for the blob
                    const pdfUrl = await idriveService.getSignedUrl(attachment.blob.key, 7 * 24 * 60 * 60)
                    updatedTopicData.blob = {
                        id: attachment.blob_id,
                        url: pdfUrl,
                        key: attachment.blob.key,
                        filename: attachment.blob.filename,
                        size: attachment.blob.byte_size
                    }
                }
            }

            return updatedTopicData
        })

        // Transform tags to match expected format
        const transformedTopic = {
            ...updatedTopic,
            tags: updatedTopic.exercise_topic_tags.map(t => ({
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

    static validate(topicId, { title, questions }) {
        if (!topicId) {
            throw new ValidationError('Topic ID is required')
        }

        const id = parseInt(topicId)
        if (isNaN(id) || id <= 0) {
            throw new ValidationError('Invalid topic ID')
        }

        if (title !== undefined && (!title || typeof title !== 'string')) {
            throw new ValidationError('Title must be a non-empty string')
        }

        if (!questions || !Array.isArray(questions)) {
            throw new ValidationError('Questions array is required')
        }

        if (questions.length === 0) {
            throw new ValidationError('At least one question is required')
        }

        // Validate each question
        questions.forEach((q, index) => {
            if (!q.question || typeof q.question !== 'string') {
                throw new ValidationError(`Question ${index + 1}: question text is required`)
            }
            if (!q.answer || typeof q.answer !== 'string') {
                throw new ValidationError(`Question ${index + 1}: answer is required`)
            }
        })
    }
}
