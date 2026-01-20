import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"

export class UpdateOsceTopicService extends BaseService {
    static async call(topicId, { title, description, scenario, guide, context, answerKey, knowledgeBase, aiModel, rubricId, durationMinutes, status, tags, attachments, observations }) {
        this.validate(topicId, { title, scenario, aiModel, rubricId, durationMinutes, status })

        // Check if topic exists
        const topic = await prisma.osce_topics.findUnique({
            where: { id: parseInt(topicId) }
        })

        if (!topic) {
            throw new ValidationError('Topic not found')
        }

        // Update topic in a transaction
        const updatedTopic = await prisma.$transaction(async (tx) => {
            // Build update data
            const updateData = {}

            if (title !== undefined) updateData.title = title
            if (description !== undefined) updateData.description = description
            if (scenario !== undefined) updateData.scenario = scenario
            if (guide !== undefined) updateData.guide = guide
            if (context !== undefined) updateData.context = context
            if (answerKey !== undefined) updateData.answer_key = answerKey
            if (knowledgeBase !== undefined) updateData.knowledge_base = knowledgeBase
            if (aiModel !== undefined) updateData.ai_model = aiModel
            if (rubricId !== undefined) updateData.osce_rubric_id = rubricId
            if (durationMinutes !== undefined) updateData.duration_minutes = parseInt(durationMinutes)
            if (status !== undefined) updateData.status = status

            // Update topic basic info
            await tx.osce_topics.update({
                where: { id: parseInt(topicId) },
                data: updateData
            })

            // Update tags if provided
            if (tags && Array.isArray(tags)) {
                // Delete existing tags
                await tx.osce_topic_tags.deleteMany({
                    where: { topic_id: parseInt(topicId) }
                })

                // Create new tags
                if (tags.length > 0) {
                    await tx.osce_topic_tags.createMany({
                        data: tags.map(tagId => ({
                            topic_id: parseInt(topicId),
                            tag_id: typeof tagId === 'object' ? tagId.id : parseInt(tagId)
                        }))
                    })
                }
            }

            // Update attachments if provided
            if (attachments !== undefined && Array.isArray(attachments)) {
                // Delete existing attachments
                await tx.attachments.deleteMany({
                    where: {
                        record_type: 'osce_topic',
                        record_id: parseInt(topicId)
                    }
                })

                // Create new attachments
                if (attachments.length > 0) {
                    await tx.attachments.createMany({
                        data: attachments.map((att, index) => ({
                            name: `attachment_${index}`,
                            record_type: 'osce_topic',
                            record_id: parseInt(topicId),
                            blob_id: att.blobId
                        }))
                    })
                }
            }

            // Update observations if provided
            if (observations !== undefined && Array.isArray(observations)) {
                // Get existing observations to delete their attachments
                const existingObservations = await tx.osce_topic_observations.findMany({
                    where: { topic_id: parseInt(topicId) }
                })

                // Delete attachments for existing observations
                for (const existingObs of existingObservations) {
                    await tx.attachments.deleteMany({
                        where: {
                            record_type: 'osce_topic_observation',
                            record_id: existingObs.id
                        }
                    })
                }

                // Delete existing observations
                await tx.osce_topic_observations.deleteMany({
                    where: {
                        topic_id: parseInt(topicId)
                    }
                })

                // Create new observations
                if (observations.length > 0) {
                    for (const obs of observations) {
                        const topicObs = await tx.osce_topic_observations.create({
                            data: {
                                topic_id: parseInt(topicId),
                                observation_id: obs.observationId,
                                observation_text: obs.observationText || '',
                                requires_interpretation: obs.requiresInterpretation || false,
                            }
                        })

                        // Create attachment for observation image if provided
                        if (obs.observationImageBlobId) {
                            await tx.attachments.create({
                                data: {
                                    name: 'observation_image',
                                    record_type: 'osce_topic_observation',
                                    record_id: topicObs.id,
                                    blob_id: obs.observationImageBlobId
                                }
                            })
                        }
                    }
                }
            }

            // Fetch and return updated topic
            return await tx.osce_topics.findUnique({
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
                    }
                }
            })
        })

        return updatedTopic
    }

    static validate(topicId, { title, scenario, aiModel, rubricId, durationMinutes, status }) {
        if (!topicId) {
            throw new ValidationError('Topic ID is required')
        }

        const id = parseInt(topicId)
        if (isNaN(id) || id <= 0) {
            throw new ValidationError('Invalid topic ID')
        }

        if (title !== undefined && (!title || title.trim().length < 3)) {
            throw new ValidationError('Title must be at least 3 characters')
        }

        if (scenario !== undefined && (!scenario || scenario.trim().length < 10)) {
            throw new ValidationError('Scenario must be at least 10 characters')
        }

        if (aiModel !== undefined) {
            const supportedModels = [
                'gemini-1.5-pro',
                'gemini-1.5-flash',
                'gemini-2.0-flash',
                'gemini-2.5-flash',
                'gpt-4o',
                'gpt-4o-mini',
                'claude-3-5-sonnet'
            ]
            if (!supportedModels.includes(aiModel)) {
                throw new ValidationError(`AI Model must be one of: ${supportedModels.join(', ')}`)
            }
        }

        if (durationMinutes !== undefined && (!durationMinutes || parseInt(durationMinutes) <= 0)) {
            throw new ValidationError('Duration must be a positive number')
        }

        if (status !== undefined && !['draft', 'published'].includes(status)) {
            throw new ValidationError('Status must be either "draft" or "published"')
        }
    }
}
