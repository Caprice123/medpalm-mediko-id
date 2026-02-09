import { NotFoundError } from '#errors/notFoundError'
import prisma from '#prisma/client'
import { BaseService } from "../baseService.js"

export class DeleteCalculatorTopicService extends BaseService {
    static async call(topicId) {
        // Check if topic exists
        const existingTopic = await prisma.calculator_topics.findUnique({
            where: { unique_id: topicId }
        })

        if (!existingTopic) {
            throw new NotFoundError('Calculator topic not found')
        }

        // Delete the topic (cascade will delete fields)
        await prisma.calculator_topics.delete({
            where: { unique_id: topicId }
        })

        return {
            message: 'Calculator topic deleted successfully',
            id: topicId
        }
    }
}
