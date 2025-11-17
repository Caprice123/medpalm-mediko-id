import { GetExerciseTopicsService } from '../../../services/exercise/getExerciseTopicsService.js'
import { GetListAttemptsService } from '../../../services/exercise/attempts/getListAttemptsService.js'
import { CreateNewAttemptService } from '../../../services/exercise/attempts/createNewAttemptService.js'

class ExerciseController {
  async getTopics(req, res) {
    const { university, semester } = req.query

    const topics = await GetExerciseTopicsService.call({ university, semester })

    return res.status(200).json({
      success: true,
      data: topics
    })
  }

  async attempts(req, res) {
    const { userLearningSessionId } = req.params
    const { limit, offset } = req.query
    const userId = req.user.id

    const result = await GetListAttemptsService.call({
        userLearningSessionId,
        userId,
        limit,
        offset
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
