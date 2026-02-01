import { GetExerciseTopicsService } from '#services/exercise/getExerciseTopicsService'
import { StartExerciseTopicService } from '#services/exercise/startExerciseTopicService'
import { SubmitExerciseProgressService } from '#services/exercise/submitExerciseProgressService'
import { ExerciseTopicListSerializer } from '#serializers/api/v1/exerciseTopicListSerializer'
import { ExerciseTopicSerializer } from '#serializers/api/v1/exerciseTopicSerializer'

class ExerciseController {
  async getTopics(req, res) {
    const { university, semester, search, page, perPage } = req.query

    const result = await GetExerciseTopicsService.call(
      { university, semester, search },
      page ? parseInt(page) : undefined,
      perPage ? parseInt(perPage) : undefined
    )

    return res.status(200).json({
      data: ExerciseTopicListSerializer.serialize(result.topics),
      pagination: result.pagination,
      cost: result.cost
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
      data: {
        topic: ExerciseTopicSerializer.serialize(result.topic)
      },
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
}

export default new ExerciseController()
