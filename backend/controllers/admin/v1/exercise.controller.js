import { GenerateQuestionService } from '#services/exercise/admin/generateQuestionService'
import { QuestionSerializer } from '#serializers/admin/v1/questionSerializer'
import { CreateExerciseTopicService } from '#services/exercise/admin/createExerciseTopicService'
import { ExerciseTopicSerializer } from '#serializers/admin/v1/exerciseTopicSerializer'
import { ExerciseTopicListSerializer } from '#serializers/admin/v1/exerciseTopicListSerializer'
import { GetExerciseTopicsService } from '#services/exercise/getExerciseTopicsService'
import { GetExerciseTopicDetailService } from '#services/exercise/admin/getExerciseTopicDetailService'
import { UpdateExerciseTopicService } from '#services/exercise/admin/updateExerciseTopicService'
import idriveService from '#services/idrive.service'
import blobService from '#services/attachment/blobService'
import { ValidationError } from '#errors/validationError'

class ExerciseController {
  async generateQuestions(req, res) {
    const { content, type, questionCount = 10 } = req.body

    const questions = await GenerateQuestionService.call({ content, type, questionCount })

    return res.status(200).json({
      data: QuestionSerializer.serialize(questions)
    })
  }

  /**
   * Generate questions from uploaded PDF (preview mode)
   * POST /admin/v1/exercises/generate-from-pdf
   *
   * Note: This now uses the centralized upload endpoint
   * Frontend should call /api/v1/upload/image with type=exercise to get blobId
   * Then pass that blobId along with the PDF file path for question generation
   */
  async generateQuestionsFromPDF(req, res) {
    const { questionCount = 10, blobId } = req.body

    if (!blobId) {
      throw new ValidationError("blobId is required")
    }

    // Get blob from database
    const blob = await blobService.getBlobById(parseInt(blobId))
    if (!blob) {
      throw new ValidationError("Invalid blobId")
    }

    // Download PDF as buffer (in-memory, no disk write)
    const pdfBuffer = await idriveService.downloadFileAsBuffer(blob.key)

    // Generate questions from buffer
    const questions = await GenerateQuestionService.call({
      pdfBuffer: pdfBuffer,
      type: 'pdf',
      questionCount: parseInt(questionCount) || 10,
      mimeType: blob.content_type
    })

    // Buffer is automatically garbage collected, no cleanup needed
    return res.status(200).json({
      data: {
        questions: QuestionSerializer.serialize(questions),
        blobId: blobId
      }
    })
  }

  /**
   * Create exercise topic
   * Handles both text-based and PDF-based topic creation
   * Questions are already generated in preview, so we just save them
   * POST /admin/v1/exercises/topics
   */
  async create(req, res) {
    const {
      title,
      description,
      contentType,
      content,
      blobId,
      tags,
      questions,
      status
    } = req.body

    const topic = await CreateExerciseTopicService.call({
      title,
      description,
      contentType,
      content,
      blobId,
      tags,
      questions,
      status,
      createdBy: req.user.id
    })

    return res.status(201).json({
      data: ExerciseTopicSerializer.serialize(topic),
    })
  }

  /**
   * Get all topics with optional filters and pagination
   * GET /admin/v1/exercises/topics
   */
  async index(req, res) {
    const { university, semester, page = 1, perPage = 20 } = req.query

    const result = await GetExerciseTopicsService.call(
      { university, semester },
      parseInt(page),
      parseInt(perPage)
    )

    return res.status(200).json({
      data: ExerciseTopicListSerializer.serialize(result.topics),
      pagination: result.pagination
    })
  }

  /**
   * Get single topic detail with questions
   * GET /admin/v1/exercises/topics/:id
   */
  async show(req, res) {
    const { id } = req.params

    const topic = await GetExerciseTopicDetailService.call(id)

    return res.status(200).json({
      data: ExerciseTopicSerializer.serialize(topic)
    })
  }

  async update(req, res) {
    const { id } = req.params
    const { title, description, contentType, content, status, tags, questions, blobId } = req.body

    const updatedTopic = await UpdateExerciseTopicService.call(id, {
      title,
      description,
      contentType,
      content,
      status,
      tags,
      questions,
      blobId
    })

    return res.status(200).json({
      data: ExerciseTopicSerializer.serialize(updatedTopic)
    })
  }
}

export default new ExerciseController()
