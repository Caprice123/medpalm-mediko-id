import { GetCalculatorTopicsService } from '../../../services/calculator/getCalculatorTopicsService.js'
import { GetCalculatorTopicDetailService } from '../../../services/calculator/getCalculatorTopicDetailService.js'
import { CreateCalculatorTopicService } from '../../../services/calculator/createCalculatorTopicService.js'
import { UpdateCalculatorTopicService } from '../../../services/calculator/updateCalculatorTopicService.js'
import { DeleteCalculatorTopicService } from '../../../services/calculator/deleteCalculatorTopicService.js'

class CalculatorController {
  /**
   * Get all calculator topics
   * GET /admin/v1/calculators
   */
  async getTopics(req, res) {
    const { name, tagName } = req.query

    const topics = await GetCalculatorTopicsService.call({ name, tagName })
    return res.status(200).json({
      success: true,
      data: topics,
      message: 'Calculator topics retrieved successfully'
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
      success: true,
      data: topic,
      message: 'Calculator topic retrieved successfully'
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
      success: true,
      data: topic,
      message: 'Calculator topic created successfully'
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
      is_active
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
      is_active
    })

    return res.status(200).json({
      success: true,
      data: topic,
      message: 'Calculator topic updated successfully'
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
      success: true,
      data: result,
      message: 'Calculator topic deleted successfully'
    })
  }
}

export default new CalculatorController()
