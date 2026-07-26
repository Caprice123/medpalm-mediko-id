import { StartDiagnosticNodeSessionService } from '#services/diagnostic/v2/session/startDiagnosticNodeSessionService'
import { StartDiagnosticCustomSessionService } from '#services/diagnostic/v2/session/startDiagnosticCustomSessionService'
import { StartDiagnosticDueSessionService } from '#services/diagnostic/v2/session/startDiagnosticDueSessionService'
import { StartDiagnosticNodeDueSessionService } from '#services/diagnostic/v2/session/startDiagnosticNodeDueSessionService'

class SessionController {
  async startSession(req, res) {
    const { nodeId, count } = req.body
    const userId = req.user.id
    const data = await StartDiagnosticNodeSessionService.call({ userId, nodeId, count })
    res.json({ success: true, data })
  }

  async startCustomSession(req, res) {
    const { nodeIds, count } = req.body
    const userId = req.user.id
    const data = await StartDiagnosticCustomSessionService.call({ userId, nodeIds, count })
    res.json({ success: true, data })
  }

  async startDueSession(req, res) {
    const { count } = req.body
    const userId = req.user.id
    const data = await StartDiagnosticDueSessionService.call({ userId, count })
    res.json({ success: true, data })
  }

  async startNodeDueSession(req, res) {
    const { nodeId } = req.body
    const userId = req.user.id
    const data = await StartDiagnosticNodeDueSessionService.call({ userId, nodeId })
    res.json({ success: true, data })
  }
}

export default new SessionController()
