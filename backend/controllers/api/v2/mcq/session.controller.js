import { StartMcqNodeSessionService } from '#services/mcq/v2/user/startMcqNodeSessionService'
import { StartMcqCustomSessionService } from '#services/mcq/v2/user/startMcqCustomSessionService'
import { SubmitMcqSessionService } from '#services/mcq/v2/user/submitMcqSessionService'

class SessionController {
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
}

export default new SessionController()
