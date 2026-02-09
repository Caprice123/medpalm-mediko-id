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
            where: { unique_id: topicId }
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
                where: { unique_id: topicId },
                data: updateData
            })

            // Update topic PDF attachment if blobId is provided
            if (blobId !== undefined) {
                // Delete existing PDF attachment
                await tx.attachments.deleteMany({
                    where: {
                        record_type: 'exercise_topic',
                        record_id: topic.id,
                        name: 'pdf'
                    }
                })

                // Create new PDF attachment if blobId is not null
                if (blobId) {
                    await tx.attachments.create({
                        data: {
                            name: 'pdf',
                            record_type: 'exercise_topic',
                            record_id: topic.id,
                            blob_id: blobId
                        }
                    })
                }
            }

            // Update tags if provided
            if (tags && Array.isArray(tags)) {
                // Delete existing tags
                await tx.exercise_topic_tags.deleteMany({
                    where: { topic_id: topic.id }
                })

                // Create new tags
                if (tags.length > 0) {
                    await tx.exercise_topic_tags.createMany({
                        data: tags.map(tagId => ({
                            topic_id: topic.id,
                            tag_id: parseInt(tagId)
                        }))
                    })
                }
            }

            // Update questions intelligently to preserve IDs and performance tracking
            if (questions && Array.isArray(questions)) {
                // Get existing questions
                const existingQuestions = await tx.exercise_questions.findMany({
                    where: { topic_id: topic.id }
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

                        // Update question image attachment if imageBlobId is provided
                        if (q.imageBlobId !== undefined) {
                            // Delete existing image attachment
                            await tx.attachments.deleteMany({
                                where: {
                                    record_type: 'exercise_question',
                                    record_id: q.id,
                                    name: 'image'
                                }
                            })

                            // Create new image attachment if imageBlobId is not null
                            if (q.imageBlobId) {
                                await tx.attachments.create({
                                    data: {
                                        name: 'image',
                                        record_type: 'exercise_question',
                                        record_id: q.id,
                                        blob_id: q.imageBlobId
                                    }
                                })
                            }
                        }
                    }
                }

                // 2. Create new questions (those without ID or with non-existent ID)
                const newQuestions = questions.filter(q => !q.id || !existingIds.has(q.id))
                if (newQuestions.length > 0) {
                    // Create questions one by one to handle attachments
                    for (const q of newQuestions) {
                        const createdQuestion = await tx.exercise_questions.create({
                            data: {
                                topic_id: topic.id,
                                question: q.question,
                                answer: q.answer,
                                explanation: q.explanation || '',
                                order: q.order !== undefined ? q.order : 0
                            }
                        })

                        // Attach image if provided
                        if (q.imageBlobId) {
                            await tx.attachments.create({
                                data: {
                                    name: 'image',
                                    record_type: 'exercise_question',
                                    record_id: createdQuestion.id,
                                    blob_id: q.imageBlobId
                                }
                            })
                        }
                    }
                }

                // 3. Delete removed questions (exist in DB but not in submitted list)
                // Note: Attachments will be cascade deleted automatically
                const questionsToDelete = existingQuestions
                    .filter(eq => !submittedIds.has(eq.id))
                    .map(eq => eq.id)

                if (questionsToDelete.length > 0) {
                    await tx.exercise_questions.deleteMany({
                        where: { id: { in: questionsToDelete } }
                    })
                }

                // 4. Update question_count after all question operations
                const questionCount = await tx.exercise_questions.count({
                    where: { topic_id: topic.id }
                })

                await tx.exercise_topics.update({
                    where: { unique_id: topicId },
                    data: { question_count: questionCount }
                })
            }

            // Fetch and return updated topic with all relations
            const updatedTopicData = await tx.exercise_topics.findUnique({
                where: { unique_id: topicId },
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

        // Fetch image attachments for all questions
        const questionIds = updatedTopic.exercise_questions.map(q => q.id)
        const questionAttachments = await prisma.attachments.findMany({
            where: {
                record_type: 'exercise_question',
                record_id: { in: questionIds },
                name: 'image'
            },
            include: {
                blob: true
            }
        })

        // Create a map of question_id -> attachment for quick lookup
        const attachmentMap = {}
        for (const att of questionAttachments) {
            if (att.blob) {
                const imageUrl = await idriveService.getSignedUrl(att.blob.key, 7 * 24 * 60 * 60)
                attachmentMap[att.record_id] = {
                    blobId: att.blob_id,
                    url: imageUrl,
                    key: att.blob.key,
                    filename: att.blob.filename
                }
            }
        }

        // Transform questions to include image info
        const questionsWithImages = updatedTopic.exercise_questions.map(q => ({
            ...q,
            image: attachmentMap[q.id] || null
        }))

        // Transform tags to match expected format
        const transformedTopic = {
            ...updatedTopic,
            exercise_questions: questionsWithImages,
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
            throw new ValidationError('Topic unique ID is required')
        }

        if (typeof topicId !== 'string' || topicId.trim() === '') {
            throw new ValidationError('Invalid topic unique ID')
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
