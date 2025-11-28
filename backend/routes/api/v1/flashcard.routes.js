import express from 'express'
import { authenticateToken } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'
import flashcardController from '../../../controllers/api/v1/flashcard.controller.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Deck endpoints (for regular users)
router.get('/decks', asyncHandler(flashcardController.getDecks.bind(flashcardController)))

// Start flashcard deck (no session required)
router.post('/start', asyncHandler(flashcardController.startDeck.bind(flashcardController)))

// Submit flashcard answers (no session required)
router.post('/submit', asyncHandler(flashcardController.submitProgress.bind(flashcardController)))

export default router
