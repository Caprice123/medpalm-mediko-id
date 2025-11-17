import { GenerateQuestionService } from '../../../services/exercise/admin/generateQuestionService.js'
import { QuestionSerializer } from '../../../serializers/admin/v1/questionSerializer.js'
import { CreateExerciseTopicService } from '../../../services/exercise/admin/createExerciseTopicService.js'
import { ExerciseTopicSerializer } from '../../../serializers/admin/v1/exerciseTopicSerializer.js'
import { GetExerciseTopicsService } from '../../../services/exercise/getExerciseTopicsService.js'
import { GetExerciseTopicDetailService } from '../../../services/exercise/admin/getExerciseTopicDetailService.js'
import { UpdateExerciseQuestionsService } from '../../../services/exercise/admin/updateExerciseQuestionsService.js'
import idriveService from '../../../services/idrive.service.js'

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
   */
  async generateQuestionsFromPDF(req, res) {
    const { questionCount = 10 } = req.body

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'PDF file is required'
      })
    }

    // Upload PDF to iDrive E2 cloud storage
    const uploadResult = await idriveService.uploadExercisePDF(
      req.file.path,
      req.file.originalname.replace('.pdf', '')
    )

    // Generate questions from the uploaded PDF
    const questions = await GenerateQuestionService.call({
      pdfFilePath: req.file.path,
      type: 'pdf',
      questionCount: parseInt(questionCount) || 10
    })

    return res.status(200).json({
      success: true,
      data: {
        questions: QuestionSerializer.serialize(questions),
        pdf_url: uploadResult.url,
        pdf_key: uploadResult.key,
        pdf_filename: uploadResult.fileName
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
      content_type,
      content,
      pdf_url,
      pdf_key,
      pdf_filename,
      tags,
      questions
    } = req.body

    const topic = await CreateExerciseTopicService.call({
      title,
      description,
      content_type,
      content,
      pdf_url,
      pdf_key,
      pdf_filename,
      tags,
      questions,
      created_by: req.user.id
    })

    return res.status(201).json({
      success: true,
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
      success: true,
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
      success: true,
      data: ExerciseTopicSerializer.serialize(topic)
    })
  }

  async update(req, res) {
    const { id } = req.params
    const { questions } = req.body

    const updatedTopic = await UpdateExerciseQuestionsService.call(id, questions)

    return res.status(200).json({
      success: true,
      data: ExerciseTopicSerializer.serialize(updatedTopic)
    })
  }
}

export default new ExerciseController()
