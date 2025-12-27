import { GenerateQuestionService } from '#services/exercise/admin/generateQuestionService'
import { QuestionSerializer } from '#serializers/admin/v1/questionSerializer'
import { CreateExerciseTopicService } from '#services/exercise/admin/createExerciseTopicService'
import { ExerciseTopicSerializer } from '#serializers/admin/v1/exerciseTopicSerializer'
import { GetExerciseTopicsService } from '#services/exercise/getExerciseTopicsService'
import { GetExerciseTopicDetailService } from '#services/exercise/admin/getExerciseTopicDetailService'
import { UpdateExerciseQuestionsService } from '#services/exercise/admin/updateExerciseQuestionsService'
import idriveService from '#services/idrive.service'

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

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'PDF file is required'
      })
    }

    // Generate questions from the uploaded PDF
    const questions = await GenerateQuestionService.call({
      pdfFilePath: req.file.path,
      type: 'pdf',
      questionCount: parseInt(questionCount) || 10
    })

    // If blobId was provided from centralized upload, return it
    // Otherwise, fallback to old behavior for backward compatibility
    let responseData = {
      questions: QuestionSerializer.serialize(questions)
    }

    if (blobId) {
      responseData.blobId = blobId
    }

    return res.status(200).json({
      data: responseData
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
      content_type,
      content,
      blobId,
      tags,
      questions
    } = req.body

    const topic = await CreateExerciseTopicService.call({
      title,
      description,
      content_type,
      content,
      blobId,
      tags,
      questions,
      created_by: req.user.id
    })

    return res.status(201).json({
      data: ExerciseTopicSerializer.serialize(topic),
      message: 'Topic created successfully'
    })
  }

  /**
   * Get all topics with optional filters
   * GET /admin/v1/exercises/topics
   */
  async index(req, res) {
    const { university, semester } = req.query

    const topics = await GetExerciseTopicsService.call({ university, semester })

    return res.status(200).json({
      data: topics
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
    const { questions } = req.body

    const updatedTopic = await UpdateExerciseQuestionsService.call(id, questions)

    return res.status(200).json({
      data: ExerciseTopicSerializer.serialize(updatedTopic)
    })
  }
}

export default new ExerciseController()
