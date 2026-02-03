import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"

export class DeleteOsceTopicService extends BaseService {
    static async call(topicId) {
        this.validate(topicId)

        // Check if topic exists
        const topic = await prisma.osce_topics.findUnique({
            where: { id: parseInt(topicId) }
        })

        if (!topic) {
            throw new ValidationError('Topic not found')
        }

        // Soft delete by setting is_active to false
        await prisma.osce_topics.update({
            where: { id: parseInt(topicId) },
        })

        return true
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
