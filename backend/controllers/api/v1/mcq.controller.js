import { GetMcqTopicsService } from '#services/mcq/getMcqTopicsService'
import { GetMcqTopicByIdService } from '#services/mcq/getMcqTopicByIdService'
import { GetMcqTopicSessionService } from '#services/mcq/getMcqTopicSessionService'
import { SubmitMcqAnswersService } from '#services/mcq/submitMcqAnswersService'
import { CheckMcqAnswersService } from '#services/mcq/checkMcqAnswersService'
import { McqTopicListSerializer } from '#serializers/api/v1/mcqTopicListSerializer'
import { McqTopicSerializer } from '#serializers/api/v1/mcqTopicSerializer'
import { McqTopicSessionSerializer } from '#serializers/api/v1/mcqTopicSessionSerializer'

class McqController {
  /**
   * Get all published MCQ topics with filters
   * GET /api/v1/mcq/topics
   */
  async getTopics(req, res) {
    const { page, limit, topic, department, university, semester, search } = req.query

    const filters = {}
    if (topic) {
      filters.topicTagIds = topic.split(',')
    }
    if (department) {
      filters.departmentTagIds = department.split(',')
    }
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
      data: McqTopicListSerializer.serialize(result.topics),
      pagination: result.pagination
    })
  }

  /**
   * Get single MCQ topic by ID (info/preview only)
   * GET /api/v1/mcq/topics/:id
   *
   * WARNING: This endpoint should NOT be used for quiz sessions as it would expose answers.
   * Use /topics/:id/session instead for quiz/learning mode.
   *
   * Frontend currently uses this incorrectly - needs to be updated to use /session endpoint.
   */
  async getTopic(req, res) {
    const userId = req.user?.id

    const topic = await GetMcqTopicByIdService.call({
      topicId: req.params.id,
      userId // Pass userId for spaced repetition question ordering
    })

    // TEMPORARY: Include answers for backward compatibility with current frontend
    // TODO: Update frontend to use /session endpoint, then set includeAnswers=false here
    return res.status(200).json({
      data: McqTopicSerializer.serialize(topic, true) // includeAnswers=true for now
    })
  }

  /**
   * Get MCQ topic session (questions for learning or quiz mode)
   * GET /api/v1/mcq/topics/:id/session
   *
   * SECURITY: This endpoint does NOT expose correct_answer in the response.
   * Answers are only revealed after submission via /submit or /check endpoints.
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
      data: McqTopicSessionSerializer.serialize(result)
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
      topicId: id,
      answers,
      userId
    })

    return res.status(200).json({
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
      data: result
    })
  }
}

export default new McqController()
