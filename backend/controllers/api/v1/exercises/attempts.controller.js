import { CreateNewAttemptService } from '../../../../services/session/createNewAttemptService.js'
import { CompleteSessionService } from '../../../../services/session/completeSessionService.js'
import { StartExerciseWithTopicService } from '../../../../services/exercise/startExerciseWithTopicService.js'
import { GetAttemptDetailService } from '../../../../services/session/getAttemptDetailService.js'

class ExerciseAttemptsController {
  async detail(req, res) {
    const { attemptId } = req.params
    const userId = req.user.id

    const attempt = await GetAttemptDetailService.call({
        attemptId,
        userId
    })

    return res.status(200).json({
        success: true,
        data: attempt
    })
  }
  

  async start(req, res) {
      const { attemptId } = req.params
      const { userLearningSessionId, topicId } = req.body
      const userId = req.user.id

      const result = await StartExerciseWithTopicService.call({
        userLearningSessionId,
        attemptId,
        exerciseTopicId: topicId,
        userId
      })

      return res.status(200).json({
        success: true,
        data: {
          attempt: result.attempt,
          topic_snapshot: result.topicSnapshot
        },
        message: 'Exercise started successfully'
      })
  }

  async complete(req, res) {
    const { attemptId } = req.params
    const { answers } = req.body
    const userId = req.user.id

    const result = await CompleteSessionService.call({
        attemptId,
        userId,
        answers
    })

    return res.status(200).json({
        success: true,
        data: result,
        message: 'Attempt completed successfully'
    })
  }
}

export default new ExerciseAttemptsController()
