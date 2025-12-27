import { GetExerciseTopicsService } from '#services/exercise/getExerciseTopicsService'
import { GetListAttemptsService } from '#services/exercise/attempts/getListAttemptsService'
import { CreateNewAttemptService } from '#services/exercise/attempts/createNewAttemptService'
import { StartExerciseTopicService } from '#services/exercise/startExerciseTopicService'
import { SubmitExerciseProgressService } from '#services/exercise/submitExerciseProgressService'

class ExerciseController {
  async getTopics(req, res) {
    const { university, semester } = req.query

    const topics = await GetExerciseTopicsService.call({ university, semester })

    return res.status(200).json({
      data: topics
    })
  }

  // Sessionless exercise endpoints
  async startTopic(req, res) {
    const { topicId } = req.body
    const userId = req.user.id

    const result = await StartExerciseTopicService.call({
      exerciseTopicId: topicId,
      userId
    })

    return res.status(200).json({
      data: result,
      message: 'Exercise topic started successfully'
    })
  }

  async submitProgress(req, res) {
    const { topicId, answers } = req.body
    const userId = req.user.id

    const result = await SubmitExerciseProgressService.call({
      topicId,
      userId,
      answers
    })

    return res.status(200).json({
      data: result,
      message: 'Exercise progress submitted successfully'
    })
  }

  // Legacy session-based endpoints (kept for backward compatibility)
  async attempts(req, res) {
    const { userLearningSessionId } = req.params
    const { page, perPage } = req.query
    const userId = req.user.id

    const result = await GetListAttemptsService.call({
        userLearningSessionId,
        userId,
        page: page ? parseInt(page) : 1,
        perPage: perPage ? parseInt(perPage) : 30
    })

    return res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
    })
  }

  async createAttempts(req, res) {
    const { userLearningSessionId } = req.params
    const userId = req.user.id

    const result = await CreateNewAttemptService.call({
        userLearningSessionId,
        userId
    })

    return res.status(201).json({
        success: true,
        data: result,
        message: 'New attempt created successfully'
    })
  }
}

export default new ExerciseController()
