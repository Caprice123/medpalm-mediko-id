import { GetCalculatorTopicsService } from '#services/calculator/getCalculatorTopicsService'
import { GetUserCalculatorTopicDetailService } from '#services/calculator/getUserCalculatorTopicDetailService'
import { CalculateResultService } from '#services/calculator/calculateResultService'
import { CalculatorTopicListSerializer } from '#serializers/api/v1/calculatorTopicListSerializer'
import { CalculatorTopicSerializer } from '#serializers/api/v1/calculatorTopicSerializer'

class CalculatorController {
  /**
   * Get all available calculator topics for users
   * GET /api/v1/calculators/topics?search=xxx&tagName=xxx&page=1&perPage=20
   */
  async getTopics(req, res) {
    const { search, tagName, page, perPage } = req.query

    const result = await GetCalculatorTopicsService.call({ search, tagName, page, perPage, userRole: req.user.role })

    return res.status(200).json({
      data: {
        topics: CalculatorTopicListSerializer.serialize(result.topics),
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

    const topic = await GetUserCalculatorTopicDetailService.call(topicId, { userId: req.user.id, userRole: req.user.role })

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
