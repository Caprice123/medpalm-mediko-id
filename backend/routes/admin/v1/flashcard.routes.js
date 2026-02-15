import express from 'express'
import flashcardController from '#controllers/admin/v1/flashcard.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import { uploadSingleImage } from '#middlewares/uploadSingleImage'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken)
router.use(requireAdmin)

// All routes require 'features' tab permission
router.use(requireTabPermission('features'))

// All flashcard routes require 'flashcard' feature permission
router.use(requireFeaturePermission('flashcard'))

// Generate flashcards
router.post('/generate', asyncHandler(flashcardController.generateCards.bind(flashcardController)))
router.post('/generate-from-pdf', asyncHandler(flashcardController.generateCardsFromPDF.bind(flashcardController)))

// Deck CRUD
router.get('/', asyncHandler(flashcardController.index.bind(flashcardController)))
router.post('/', asyncHandler(flashcardController.create.bind(flashcardController)))
router.get('/:uniqueId', asyncHandler(flashcardController.show.bind(flashcardController)))
router.put('/:uniqueId', asyncHandler(flashcardController.update.bind(flashcardController)))

export default router
