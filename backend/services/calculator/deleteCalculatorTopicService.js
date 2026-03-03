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

        await prisma.$executeRaw`DELETE FROM calculator_topics WHERE id = ${existingTopic.id}`

        return {
            message: 'Calculator topic deleted successfully',
            id: topicId
        }
    }
}
