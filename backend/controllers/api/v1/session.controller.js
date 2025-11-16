import { GetUserSessionsService } from '../../../services/session/getUserSessionsService.js'
import { CreateSessionService } from '../../../services/session/createSessionService.js'
import { GetAttemptDetailService } from '../../../services/session/getAttemptDetailService.js'
import { UserLearningSessionSerializer } from '../../../serializers/api/v1/userSessionLearningSerializer.js'
import { GetSessionDetailService } from '../../../services/session/getSessionDetailService.js'

class SessionController {
  // Get user's session history
  async index(req, res) {
    const userId = req.user.id
    const { status, limit, offset } = req.query

    const result = await GetUserSessionsService.call({
      userId,
      status,
      limit: limit ? parseInt(limit) : 30,
      offset: offset ? parseInt(offset) : 0
    })

    return res.status(200).json({
      success: true,
      data: UserLearningSessionSerializer.serialize(result.data),
      pagination: result.pagination
    })
  }

  async getUserSessions(req, res) {
    return this.index(req, res)
  }

  // Create a new learning session
  async create(req, res) {
    const { sessionType } = req.body
    const userId = req.user.id

    const result = await CreateSessionService.call({ userId, sessionType })

    return res.status(201).json({
      success: true,
      data: {
        id: result.userLearningSession.id,
        exercise_session_id: result.exerciseSession?.id,
        first_attempt_id: result.firstAttempt?.id,
        session_type: result.userLearningSession.type,
        status: result.firstAttempt?.status || 'not_started'
      },
      message: 'Session created successfully'
    })
  }

  async show(req, res) {
    const { sessionId } = req.params
    const userId = req.user.id

    const attemptDetail = await GetSessionDetailService.call({
      sessionId,
      userId
    })

    return res.status(200).json({
      success: true,
      data: attemptDetail
    })
  }
}

export default new SessionController()
