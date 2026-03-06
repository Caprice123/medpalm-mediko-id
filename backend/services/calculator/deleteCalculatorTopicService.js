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

        await prisma.calculator_topics.update({
            where: { id: existingTopic.id },
            data: {
                is_deleted: true,
                deleted_at: new Date()
            }
        })

        return {
            message: 'Calculator topic deleted successfully',
            id: topicId
        }
    }
}
