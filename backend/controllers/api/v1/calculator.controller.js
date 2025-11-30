import { GetCalculatorTopicsService } from '../../../services/calculator/getCalculatorTopicsService.js'
import { CalculateResultService } from '../../../services/calculator/calculateResultService.js'
import prisma from '../../../prisma/client.js'

class CalculatorController {
  /**
   * Get all available calculator topics for users
   * GET /api/v1/calculators/topics
   */
  async getTopics(req, res) {
    const topics = await GetCalculatorTopicsService.call()

    // Only return published and active calculators to users
    const publicTopics = topics.filter(topic =>
      topic.status === 'published' && topic.is_active
    ).map(topic => ({
      id: topic.id,
      title: topic.title,
      description: topic.description,
      result_label: topic.result_label,
      result_unit: topic.result_unit,
      fields: topic.fields
    }))

    return res.status(200).json({
      success: true,
      data: publicTopics,
      message: 'Calculator topics retrieved successfully'
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
