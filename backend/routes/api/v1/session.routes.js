import express from 'express'
import sessionController from '../../../controllers/api/v1/session.controller.js'
import { authenticateToken } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Get user's session history
router.get('/', asyncHandler(sessionController.index.bind(sessionController)))

// Create a new session
router.post('/', asyncHandler(sessionController.create.bind(sessionController)))

// Get session detail
router.get('/:sessionId', asyncHandler(sessionController.show.bind(sessionController)))

// DEPRECATED: Old session-based flashcard endpoints
// Flashcards now use sessionless flow via /api/v1/flashcards routes
// router.put('/:sessionId/flashcard/start', asyncHandler(sessionController.startFlashcard.bind(sessionController)))
// router.post('/:sessionId/flashcard/submit', asyncHandler(sessionController.submitFlashcardAnswers.bind(sessionController)))

export default router
