import { GetUserSessionsService } from '../../../services/session/getUserSessionsService.js'
import { CreateSessionService } from '../../../services/session/createSessionService.js'
import { UserLearningSessionSerializer } from '../../../serializers/api/v1/userSessionLearningSerializer.js'
import { GetSessionDetailService } from '../../../services/session/getSessionDetailService.js'
import { StartFlashcardWithDeckService } from '../../../services/flashcard/startFlashcardWithDeckService.js'
import { SubmitFlashcardAnswersService } from '../../../services/flashcard/submitFlashcardAnswersService.js'

class SessionController {
  // Get user's session history
  async index(req, res) {
    const userId = req.user.id
    const { status, page, perPage } = req.query

    const result = await GetUserSessionsService.call({
      userId,
      status,
      page: page ? parseInt(page) : 1,
      perPage: perPage ? parseInt(perPage) : 30
    })

    return res.status(200).json({
      success: true,
      data: UserLearningSessionSerializer.serialize(result.data),
      pagination: result.pagination
    })
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
        user_learning_session_id: result.userLearningSession.id,
        exercise_session_id: result.exerciseSession?.id,
        flashcard_session_id: result.flashcardSession?.id,
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

  // Start flashcard session with a deck
  async startFlashcard(req, res) {
    const { sessionId } = req.params
    const { deckId } = req.body
    const userId = req.user.id

    const result = await StartFlashcardWithDeckService.call({
      userLearningSessionId: sessionId,
      flashcardDeckId: deckId,
      userId
    })

    return res.status(200).json({
      success: true,
      data: {
        session: result.session,
        deck_snapshot: result.deckSnapshot
      },
      message: 'Flashcard session started successfully'
    })
  }

  // Submit flashcard answers
  async submitFlashcardAnswers(req, res) {
    const { sessionId } = req.params
    const { answers } = req.body
    const userId = req.user.id

    const result = await SubmitFlashcardAnswersService.call({
      userLearningSessionId: sessionId,
      userId,
      answers
    })

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Flashcard answers submitted successfully'
    })
  }
}

export default new SessionController()
