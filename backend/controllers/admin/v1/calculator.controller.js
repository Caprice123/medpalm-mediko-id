import { GetCalculatorTopicsService } from '#services/calculator/getCalculatorTopicsService'
import { GetCalculatorTopicDetailService } from '#services/calculator/getCalculatorTopicDetailService'
import { CreateCalculatorTopicService } from '#services/calculator/createCalculatorTopicService'
import { UpdateCalculatorTopicService } from '#services/calculator/updateCalculatorTopicService'
import { DeleteCalculatorTopicService } from '#services/calculator/deleteCalculatorTopicService'
import { CalculatorTopicSerializer } from '#serializers/admin/v1/calculatorTopicSerializer'
import { CalculatorTopicListSerializer } from '#serializers/admin/v1/calculatorTopicListSerializer'

class CalculatorController {
  /**
   * Get all calculator topics
   * GET /admin/v1/calculators?search=xxx&tagName=xxx&page=1&perPage=20
   */
  async getTopics(req, res) {
    const { search, tagName, page, perPage } = req.query

    const result = await GetCalculatorTopicsService.call({ search, tagName, page, perPage })

    return res.status(200).json({
      data: {
        topics: CalculatorTopicListSerializer.serialize(result.topics),
        pagination: result.pagination
      },
    })
  }

  /**
   * Get a specific calculator topic
   * GET /admin/v1/calculators/:id
   */
  async getTopicDetail(req, res) {
    const { id } = req.params

    const topic = await GetCalculatorTopicDetailService.call(id)

    return res.status(200).json({
      data: CalculatorTopicSerializer.serialize(topic),
    })
  }

  /**
   * Create a new calculator topic
   * POST /admin/v1/calculators
   */
  async create(req, res) {
    const {
      title,
      description,
      clinical_references,
      formula,
      result_label,
      result_unit,
      fields,
      classifications,
      status,
      tags
    } = req.body

    const topic = await CreateCalculatorTopicService.call({
      title,
      description,
      clinical_references,
      formula,
      result_label,
      result_unit,
      fields,
      classifications,
      status,
      tags,
      created_by: req.user.id
    })

    return res.status(201).json({
      data: CalculatorTopicSerializer.serialize(topic),
    })
  }

  /**
   * Update a calculator topic
   * PUT /admin/v1/calculators/:id
   */
  async update(req, res) {
    const { id } = req.params
    const {
      title,
      description,
      clinical_references,
      formula,
      result_label,
      result_unit,
      fields,
      classifications,
      status,
      tags,
    } = req.body

    const topic = await UpdateCalculatorTopicService.call(id, {
      title,
      description,
      clinical_references,
      formula,
      result_label,
      result_unit,
      fields,
      classifications,
      status,
      tags,
    })

    return res.status(200).json({
      data: CalculatorTopicSerializer.serialize(topic),
    })
  }

  /**
   * Delete a calculator topic
   * DELETE /admin/v1/calculators/:id
   */
  async delete(req, res) {
    const { id } = req.params

    const result = await DeleteCalculatorTopicService.call(id)

    return res.status(200).json({
      data: result,
    })
  }
}

export default new CalculatorController()
