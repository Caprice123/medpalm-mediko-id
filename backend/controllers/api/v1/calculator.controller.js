import { GetCalculatorTopicsService } from '#services/calculator/getCalculatorTopicsService'
import { CalculateResultService } from '#services/calculator/calculateResultService'
import { CalculatorTopicListSerializer } from '#serializers/api/v1/calculatorTopicListSerializer'
import { CalculatorTopicSerializer } from '#serializers/api/v1/calculatorTopicSerializer'
import prisma from '#prisma/client'

class CalculatorController {
  /**
   * Get all available calculator topics for users
   * GET /api/v1/calculators/topics?search=xxx&tagName=xxx&page=1&perPage=20
   */
  async getTopics(req, res) {
    const { search, tagName, page, perPage } = req.query

    const result = await GetCalculatorTopicsService.call({ search, tagName, page, perPage })

    // Only return published and active calculators to users
    const publicTopics = result.topics.filter(topic =>
      topic.status === 'published'
    )

    return res.status(200).json({
      data: {
        topics: CalculatorTopicListSerializer.serialize(publicTopics),
        pagination: result.pagination
      },
    })
  }

  /**
   * Get calculator topic detail
   * GET /api/v1/calculators/topics/:topicId
   */
  async getTopicDetail(req, res) {
    const { topicId } = req.params

    const topic = await prisma.calculator_topics.findUnique({
      where: { id: Number(topicId) },
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
        calculator_topic_tags: {
          include: {
            tags: true
          }
        }
      }
    })

    if (!topic || topic.status !== 'published') {
      return res.status(404).json({
        message: 'Calculator topic not found or not available'
      })
    }

    return res.status(200).json({
      data: await CalculatorTopicSerializer.serialize(topic),
    })
  }

  /**
   * Calculate result based on inputs
   * POST /api/v1/calculators/:topicId/calculate
   */
  async calculate(req, res) {
    const { topicId } = req.params
    const inputs = req.body

    const result = await CalculateResultService.call(topicId, inputs)

    return res.status(200).json({
      data: result,
    })
  }
}

export default new CalculatorController()
