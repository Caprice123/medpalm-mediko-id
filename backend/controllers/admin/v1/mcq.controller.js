import { CreateMcqTopicService } from '#services/mcq/admin/createMcqTopicService'
import { UpdateMcqTopicService } from '#services/mcq/admin/updateMcqTopicService'
import { DeleteMcqTopicService } from '#services/mcq/admin/deleteMcqTopicService'
import { GetMcqTopicsService } from '#services/mcq/admin/getMcqTopicsService'
import { GetMcqTopicDetailService } from '#services/mcq/admin/getMcqTopicDetailService'
import { GenerateMcqQuestionsService } from '#services/mcq/admin/generateMcqQuestionsService'
import { McqTopicSerializer } from '#serializers/admin/v1/mcqTopicSerializer'
import { McqTopicListSerializer } from '#serializers/admin/v1/mcqTopicListSerializer'
import idriveService from '#services/idrive.service'
import blobService from '#services/attachment/blobService'
import { ValidationError } from '#errors/validationError'

class McqController {
  /**
   * Create MCQ topic
   * POST /admin/v1/mcq/topics
   */
  async create(req, res) {
    const {
      title,
      description,
      contentType,
      content,
      blobId,
      quizTimeLimit,
      passingScore,
      tags,
      questions,
      status
    } = req.body

    const topic = await CreateMcqTopicService.call({
      title,
      description,
      contentType,
      content,
      blobId,
      quizTimeLimit,
      passingScore,
      tags,
      questions,
      status: status || 'draft',
      createdBy: req.user.id
    })

    return res.status(201).json({
      data: McqTopicSerializer.serialize(topic),
    })
  }

  /**
   * Get all MCQ topics with pagination and filters
   * GET /admin/v1/mcq/topics
   */
  async index(req, res) {
    const { page, limit, status, search, university, semester } = req.query

    const filters = {}
    if (status) filters.status = status
    if (search) filters.search = search
    if (university) filters.university = university
    if (semester) filters.semester = semester

    const result = await GetMcqTopicsService.call({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 30,
      filters
    })

    return res.status(200).json({
      data: McqTopicListSerializer.serialize(result.topics),
      pagination: result.pagination
    })
  }

  /**
   * Get single MCQ topic detail
   * GET /admin/v1/mcq/topics/:uniqueId
   */
  async show(req, res) {
    const { uniqueId } = req.params

    const topic = await GetMcqTopicDetailService.call({ id: uniqueId })

    return res.status(200).json({
      data: McqTopicSerializer.serialize(topic)
    })
  }

  /**
   * Update MCQ topic
   * PUT /admin/v1/mcq/topics/:uniqueId
   */
  async update(req, res) {
    const { uniqueId } = req.params
    const {
      title,
      description,
      contentType,
      content,
      blobId,
      quizTimeLimit,
      passingScore,
      tags,
      questions,
      status,
      isActive
    } = req.body

    const topic = await UpdateMcqTopicService.call({
      id: uniqueId,
      title,
      description,
      contentType,
      content,
      blobId,
      quizTimeLimit,
      passingScore,
      tags,
      questions,
      status,
      isActive
    })

    return res.status(200).json({
      data: McqTopicSerializer.serialize(topic),
    })
  }

  /**
   * Delete MCQ topic
   * DELETE /admin/v1/mcq/topics/:uniqueId
   */
  async delete(req, res) {
    const { uniqueId } = req.params

    await DeleteMcqTopicService.call({ id: uniqueId })

    return res.status(200).json({
      data: {
        success: true
      }
    })
  }

  /**
   * Generate MCQ questions from text or PDF
   * POST /admin/v1/mcq/generate
   *
   * Frontend uploads PDF to /api/v1/upload/image with type=mcq to get blobId
   * Then passes only the blobId for question generation
   * PDF is kept in memory (no disk write) for optimal performance
   */
  async generate(req, res) {
    const { content, type, questionCount, blobId } = req.body

    let questions

    if (type === 'pdf') {
      if (!blobId) {
        throw new ValidationError("blobId is required for PDF type generation")
      }

      // Get blob from database
      const blob = await blobService.getBlobById(parseInt(blobId))
      if (!blob) {
        throw new ValidationError("Invalid blobId")
      }

      // Download PDF as buffer (in-memory, no disk write)
      const pdfBuffer = await idriveService.downloadFileAsBuffer(blob.key)

      // Generate MCQ questions from buffer
      questions = await GenerateMcqQuestionsService.call({
        pdfBuffer: pdfBuffer,
        type: 'pdf',
        questionCount: questionCount ? parseInt(questionCount) : 10,
        mimeType: blob.content_type
      })

      // Buffer is automatically garbage collected, no cleanup needed
    } else if (type === 'text') {
      questions = await GenerateMcqQuestionsService.call({
        content,
        type: 'text',
        questionCount: questionCount ? parseInt(questionCount) : 10
      })
    } else {
      return res.status(400).json({
        message: 'Type must be either "text" or "pdf"'
      })
    }

    return res.status(200).json({
      data: questions,
    })
  }
}

export default new McqController()
