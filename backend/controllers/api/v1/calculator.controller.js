import { GetCalculatorTopicsService } from '../../../services/calculator/getCalculatorTopicsService.js'
import { CalculateResultService } from '../../../services/calculator/calculateResultService.js'
import prisma from '../../../prisma/client.js'

class CalculatorController {
  /**
   * Get all available calculator topics for users
   * GET /api/v1/calculators/topics?name=xxx&tagName=xxx&page=1&perPage=20
   */
  async getTopics(req, res) {
    const { name, tagName, page, perPage } = req.query

    const result = await GetCalculatorTopicsService.call({ name, tagName, page, perPage })

    // Only return published and active calculators to users
    const publicTopics = result.topics.filter(topic =>
      topic.status === 'published' && topic.is_active
    ).map(topic => ({
      id: topic.id,
      title: topic.title,
      description: topic.description,
      result_label: topic.result_label,
      result_unit: topic.result_unit,
      fields: topic.fields,
      tags: topic.tags,
      clinical_references: topic.clinical_references,
      updated_at: topic.updated_at
    }))

    return res.status(200).json({
      success: true,
      data: {
        topics: publicTopics,
        pagination: result.pagination
      },
      message: 'Calculator topics retrieved successfully'
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
                        tags: {
                            include: {
                                tag_group: true
                            }
                        }
                    }
                }
            },
    })

    if (!topic || topic.status !== 'published' || !topic.is_active) {
      return res.status(404).json({
        success: false,
        message: 'Calculator topic not found or not available'
      })
    }

    return res.status(200).json({
      success: true,
      data: topic,
      message: 'Calculator topic detail retrieved successfully'
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
      success: true,
      data: result,
      message: 'Calculation completed successfully'
    })
  }
}

export default new CalculatorController()
