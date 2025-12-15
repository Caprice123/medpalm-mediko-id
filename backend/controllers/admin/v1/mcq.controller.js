import { CreateMcqTopicService } from '../../../services/mcq/admin/createMcqTopicService.js'
import { UpdateMcqTopicService } from '../../../services/mcq/admin/updateMcqTopicService.js'
import { DeleteMcqTopicService } from '../../../services/mcq/admin/deleteMcqTopicService.js'
import { GetMcqTopicsService } from '../../../services/mcq/admin/getMcqTopicsService.js'
import { GetMcqTopicDetailService } from '../../../services/mcq/admin/getMcqTopicDetailService.js'
import { GetMcqConstantsService } from '../../../services/mcq/admin/getMcqConstantsService.js'
import { UpdateMcqConstantsService } from '../../../services/mcq/admin/updateMcqConstantsService.js'
import { GenerateMcqQuestionsService } from '../../../services/mcq/admin/generateMcqQuestionsService.js'
import idriveService from '../../../services/idrive.service.js'

class McqController {
  /**
   * Upload question image
   * POST /admin/v1/mcq/upload-question-image
   */
  async uploadQuestionImage(req, res) {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      })
    }

    // Upload image to iDrive E2 cloud storage
    const uploadResult = await idriveService.uploadFile(
      req.file.path,
      'mcq-questions',
      req.file.originalname.replace(/\.(jpg|jpeg|png)$/i, '')
    )

    return res.status(200).json({
      success: true,
      data: {
        image_url: await idriveService.getSignedUrl(uploadResult.key),
        image_key: uploadResult.key,
        image_filename: uploadResult.fileName
      }
    })
  }

  /**
   * Create MCQ topic
   * POST /admin/v1/mcq/topics
   */
  async create(req, res) {
    const {
      title,
      description,
      content_type,
      source_url,
      source_key,
      source_filename,
      quiz_time_limit,
      passing_score,
      tags,
      questions,
      status
    } = req.body

    const topic = await CreateMcqTopicService.call({
      title,
      description,
      content_type,
      source_url,
      source_key,
      source_filename,
      quiz_time_limit,
      passing_score,
      tags,
      questions,
      status: status || 'draft',
      created_by: req.user.id
    })

    return res.status(201).json({
      success: true,
      data: topic,
      message: 'MCQ topic created successfully'
    })
  }

  /**
   * Get all MCQ topics with pagination and filters
   * GET /admin/v1/mcq/topics
   */
  async index(req, res) {
    const { page, limit, status, is_active, search } = req.query

    const filters = {}
    if (status) filters.status = status
    if (is_active !== undefined) filters.is_active = is_active === 'true'
    if (search) filters.search = search

    const result = await GetMcqTopicsService.call({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 30,
      filters
    })

    return res.status(200).json({
      success: true,
      data: result.topics,
      pagination: result.pagination
    })
  }

  /**
   * Get single MCQ topic detail
   * GET /admin/v1/mcq/topics/:id
   */
  async show(req, res) {
    const { id } = req.params

    const topic = await GetMcqTopicDetailService.call({ id: parseInt(id) })

    return res.status(200).json({
      success: true,
      data: topic
    })
  }

  /**
   * Update MCQ topic
   * PUT /admin/v1/mcq/topics/:id
   */
  async update(req, res) {
    const { id } = req.params
    const {
      title,
      description,
      content_type,
      source_url,
      source_key,
      source_filename,
      quiz_time_limit,
      passing_score,
      tags,
      questions,
      status,
      is_active
    } = req.body

    const topic = await UpdateMcqTopicService.call({
      id: parseInt(id),
      title,
      description,
      content_type,
      source_url,
      source_key,
      source_filename,
      quiz_time_limit,
      passing_score,
      tags,
      questions,
      status,
      is_active
    })

    return res.status(200).json({
      success: true,
      data: topic,
      message: 'MCQ topic updated successfully'
    })
  }

  /**
   * Delete MCQ topic
   * DELETE /admin/v1/mcq/topics/:id
   */
  async delete(req, res) {
    const { id } = req.params

    await DeleteMcqTopicService.call({ id: parseInt(id) })

    return res.status(200).json({
      success: true,
      message: 'MCQ topic deleted successfully'
    })
  }

  /**
   * Get MCQ constants
   * GET /admin/v1/mcq/constants
   */
  async getConstants(req, res) {
    const { keys } = req.query
    const keysArray = keys ? keys.split(',') : null

    const constants = await GetMcqConstantsService.call({ keys: keysArray })

    return res.status(200).json({
      success: true,
      data: constants
    })
  }

  /**
   * Update MCQ constants
   * PUT /admin/v1/mcq/constants
   */
  async updateConstants(req, res) {
    const constants = req.body

    await UpdateMcqConstantsService.call({ constants })

    return res.status(200).json({
      success: true,
      message: 'Constants updated successfully'
    })
  }

  /**
   * Generate MCQ questions from text or PDF
   * POST /admin/v1/mcq/generate
   */
  async generate(req, res) {
    const { content, type, questionCount } = req.body

    let questions

    if (type === 'pdf') {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'PDF file is required for PDF type generation'
        })
      }

      questions = await GenerateMcqQuestionsService.call({
        pdfFilePath: req.file.path,
        type: 'pdf',
        questionCount: questionCount ? parseInt(questionCount) : 10
      })
    } else if (type === 'text') {
      questions = await GenerateMcqQuestionsService.call({
        content,
        type: 'text',
        questionCount: questionCount ? parseInt(questionCount) : 10
      })
    } else {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "text" or "pdf"'
      })
    }

    return res.status(200).json({
      success: true,
      data: questions,
      message: 'MCQ questions generated successfully'
    })
  }
}

export default new McqController()
