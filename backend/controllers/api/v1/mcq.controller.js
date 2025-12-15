import { GetMcqTopicsService } from '../../../services/mcq/getMcqTopicsService.js'
import { GetMcqTopicByIdService } from '../../../services/mcq/getMcqTopicByIdService.js'
import { GetMcqTopicSessionService } from '../../../services/mcq/getMcqTopicSessionService.js'
import { SubmitMcqAnswersService } from '../../../services/mcq/submitMcqAnswersService.js'
import { CheckMcqAnswersService } from '../../../services/mcq/checkMcqAnswersService.js'
import { GetMcqConstantsService } from '../../../services/mcq/admin/getMcqConstantsService.js'

class McqController {
  /**
   * Get all published MCQ topics with filters
   * GET /api/v1/mcq/topics
   */
  async getTopics(req, res) {
    const { page, limit, university, semester, search } = req.query

    const filters = {}
    if (university) {
      filters.universityTagIds = university.split(',')
    }
    if (semester) {
      filters.semesterTagIds = semester.split(',')
    }
    if (search) {
      filters.search = search
    }

    const result = await GetMcqTopicsService.call({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 30,
      filters
    })

    return res.status(200).json({
      success: true,
      data: result
    })
  }

  /**
   * Get single MCQ topic by ID
   * GET /api/v1/mcq/topics/:id
   */
  async getTopic(req, res) {
    const { id } = req.params

    const result = await GetMcqTopicByIdService.call({
      topicId: parseInt(id)
    })

    return res.status(200).json({
      success: true,
      data: result
    })
  }

  /**
   * Get MCQ topic session (questions for learning or quiz mode)
   * GET /api/v1/mcq/topics/:id/session
   */
  async getTopicSession(req, res) {
    const { id } = req.params
    const { mode } = req.query
    const userId = req.user?.id

    const result = await GetMcqTopicSessionService.call({
      topicId: parseInt(id),
      mode: mode || 'learning',
      userId
    })

    return res.status(200).json({
      success: true,
      data: result
    })
  }

  /**
   * Submit answers for an MCQ topic
   * POST /api/v1/mcq/topics/:id/submit
   */
  async submitAnswers(req, res) {
    const { id } = req.params
    const { answers } = req.body // Array of { question_id, user_answer }
    const userId = req.user?.id

    const result = await SubmitMcqAnswersService.call({
      topicId: parseInt(id),
      answers,
      userId
    })

    return res.status(200).json({
      success: true,
      data: result
    })
  }

  /**
   * Check answers for an MCQ topic
   * POST /api/v1/mcq/topics/:id/check
   */
  async checkAnswers(req, res) {
    const { id } = req.params
    const { answers } = req.body // Array of { questionId, userAnswer }
    const userId = req.user?.id

    const result = await CheckMcqAnswersService.call({
      topicId: parseInt(id),
      answers,
      userId
    })

    return res.status(200).json({
      success: true,
      data: result
    })
  }

  /**
   * Get MCQ constants
   * GET /api/v1/mcq/constants
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
}

export default new McqController()
