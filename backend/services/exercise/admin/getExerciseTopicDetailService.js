import { ValidationError } from "../../../errors/validationError.js"
import prisma from "../../../prisma/client.js"
import { BaseService } from "../../baseService.js"

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

        // Transform tags to simpler format
        const transformedTopic = {
            ...topic,
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
