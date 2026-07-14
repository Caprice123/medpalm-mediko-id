import express from 'express'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import { checkFeature } from '#middleware/checkFeature.middleware'
import flashcardV2UserController from '#controllers/api/v2/flashcard.controller'

const router = express.Router()

router.use(authenticateToken)
router.use(checkFeature('flashcard_is_active'))

router.get('/', asyncHandler(flashcardV2UserController.getDecks.bind(flashcardV2UserController)))
router.get('/:uniqueId/content-relations', asyncHandler(flashcardV2UserController.contentRelations.bind(flashcardV2UserController)))
router.get('/:uniqueId', asyncHandler(flashcardV2UserController.getDeck.bind(flashcardV2UserController)))

export default router
