import { NotFoundError } from '#errors/notFoundError'
import prisma from '#prisma/client'
import { BaseService } from "../baseService.js"

export class GetCalculatorTopicDetailService extends BaseService {
    static async call(topicId) {
        const topic = await prisma.calculator_topics.findUnique({
            where: { unique_id: topicId },
            include: {
                calculator_fields: {
                    orderBy: {
                        order: 'asc'
                    },
                    include: {
                        field_options: {
                            orderBy: {
                                order: 'asc'
                            }
                        }
                    }
                },
                calculator_classifications: {
                    orderBy: {
                        order: 'asc'
                    },
                    include: {
                        options: {
                            orderBy: {
                                order: 'asc'
                            },
                            include: {
                                conditions: {
                                    orderBy: {
                                        order: 'asc'
                                    }
                                }
                            }
                        }
                    }
                },
                calculator_topic_tags: {
                    include: {
                        tags: true
                    }
                }
            }
        })

        if (!topic) {
            throw new NotFoundError('Calculator topic not found')
        }

        return topic
    }
}
