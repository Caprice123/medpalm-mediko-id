import { GetMcqTopicsService } from '#services/mcq/v2/user/getMcqTopicsService'
import { GetMcqSubtopicsService } from '#services/mcq/v2/user/getMcqSubtopicsService'
import { StartMcqNodeSessionService } from '#services/mcq/v2/user/startMcqNodeSessionService'
import { StartMcqCustomSessionService } from '#services/mcq/v2/user/startMcqCustomSessionService'
import { SubmitMcqSessionService } from '#services/mcq/v2/user/submitMcqSessionService'
import { SubmitMcqAnswerService } from '#services/mcq/v2/user/submitMcqAnswerService'

class McqV2Controller {
  async getTopics(req, res) {
    const userId = req.user.id
    const topics = await GetMcqTopicsService.call({ userId })
    return res.status(200).json({ data: topics })
  }

  async getSubtopics(req, res) {
    const userId = req.user.id
    const { topicId } = req.params
    const subtopics = await GetMcqSubtopicsService.call({ userId, topicId })
    return res.status(200).json({ data: subtopics })
  }

  async startSession(req, res) {
    const userId = req.user.id
    const { nodeId, count } = req.body
    const questions = await StartMcqNodeSessionService.call({ userId, nodeId, count })
    return res.status(200).json({ data: questions })
  }

  async startCustomSession(req, res) {
    const userId = req.user.id
    const { nodeIds, count } = req.body
    const questions = await StartMcqCustomSessionService.call({ userId, nodeIds, count })
    return res.status(200).json({ data: questions })
  }

  async submitSession(req, res) {
    const userId = req.user.id
    const { nodeResults } = req.body
    const result = await SubmitMcqSessionService.call({ userId, nodeResults })
    return res.status(200).json({ data: result })
  }

  async submitAnswer(req, res) {
    const userId = req.user.id
    const { questionId, isCorrect } = req.body
    const result = await SubmitMcqAnswerService.call({ userId, questionId, isCorrect })
    return res.status(200).json({ data: result })
  }
}

export default new McqV2Controller()
