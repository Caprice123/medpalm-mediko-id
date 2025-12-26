import express from 'express'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import flashcardController from '#controllers/api/v1/flashcard.controller'

const router = express.Router()

// All routes require authentication
const featureConstantKey = 'flashcard_is_active'

// All routes require authentication
router.use(authenticateToken)
router.use(checkFeature(featureConstantKey))

// Deck endpoints (for regular users)
router.get('/', asyncHandler(flashcardController.getDecks.bind(flashcardController)))

// Start flashcard deck (no session required)
router.post('/start', asyncHandler(flashcardController.startDeck.bind(flashcardController)))

// Submit flashcard answers (no session required)
router.post('/submit', asyncHandler(flashcardController.submitProgress.bind(flashcardController)))

export default router
