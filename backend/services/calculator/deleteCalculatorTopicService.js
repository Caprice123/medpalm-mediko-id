import { NotFoundError } from "../../errors/notFoundError.js"
import prisma from "../../prisma/client.js"
import { BaseService } from "../baseService.js"

export class DeleteCalculatorTopicService extends BaseService {
    static async call(topicId) {
        // Check if topic exists
        const existingTopic = await prisma.calculator_topics.findUnique({
            where: { id: parseInt(topicId) }
        })

        if (!existingTopic) {
            throw new NotFoundError('Calculator topic not found')
        }

        // Delete the topic (cascade will delete fields)
        await prisma.calculator_topics.delete({
            where: { id: parseInt(topicId) }
        })

        return {
            message: 'Calculator topic deleted successfully',
            id: parseInt(topicId)
        }
    }
}
