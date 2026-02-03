import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"

export class CreateOsceTopicService extends BaseService {
    static async call({ title, description, scenario, guide, context, answerKey, knowledgeBase, aiModel, rubricId, durationMinutes, tags, status, attachments, observations, created_by }) {
        // Validate inputs
        await this.validate({ title, scenario, aiModel, rubricId, durationMinutes, tags, status })

        // Create topic with tags and attachments in a transaction
        const topic = await prisma.$transaction(async (tx) => {
            // Create topic
            const createdTopic = await tx.osce_topics.create({
                data: {
                    title,
                    description: description || '',
                    scenario,
                    guide: guide || '',
                    context: context || '',
                    answer_key: answerKey || '',
                    knowledge_base: knowledgeBase || [],
                    ai_model: aiModel,
                    osce_rubric_id: rubricId,
                    duration_minutes: parseInt(durationMinutes),
                    status: status || 'draft',
                    created_by: created_by,
                    osce_topic_tags: {
                        create: tags.map(tag => ({
                            tag_id: typeof tag === 'object' ? tag.id : tag
                        }))
                    }
                },
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

            // Create attachments if provided
            if (attachments && attachments.length > 0) {
                await tx.attachments.createMany({
                    data: attachments.map((att, index) => ({
                        name: `attachment_${index}`,
                        record_type: 'osce_topic',
                        record_id: createdTopic.id,
                        blob_id: att.blobId
                    }))
                })
            }

            // Create observations if provided
            if (observations && observations.length > 0) {
                for (const obs of observations) {
                    const topicObs = await tx.osce_topic_observations.create({
                        data: {
                            topic_id: createdTopic.id,
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

            return createdTopic
        })

        return topic
    }

    static async validate({ title, scenario, aiModel, rubricId, durationMinutes, tags, status }) {
        // Validate required fields
        if (!title || title.trim().length < 3) {
            throw new ValidationError('Title is required and must be at least 3 characters')
        }

        if (!scenario || scenario.trim().length < 10) {
            throw new ValidationError('Scenario is required and must be at least 10 characters')
        }

        if (!aiModel) {
            throw new ValidationError('AI Model is required')
        }
        if (!durationMinutes || parseInt(durationMinutes) <= 0) {
            throw new ValidationError('Duration must be a positive number')
        }

        if (status && !['draft', 'published'].includes(status)) {
            throw new ValidationError('Status must be either "draft" or "published"')
        }

        if (!tags || tags.length === 0) {
            throw new ValidationError('At least one tag is required')
        }

        // Validate tags exist
        const tagIds = tags.map(t => typeof t === 'object' ? t.id : t)
        const existingTags = await prisma.tags.findMany({
            where: {
                id: { in: tagIds },
            }
        })

        if (existingTags.length !== tagIds.length) {
            throw new ValidationError('Some tags are invalid or inactive')
        }
    }
}
