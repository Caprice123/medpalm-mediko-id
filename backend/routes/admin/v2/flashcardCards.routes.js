import express from 'express'
import flashcardCardsController from '#controllers/admin/v2/flashcard/unlinkedCards.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)
router.use(requireTabPermission('features'))
router.use(requireFeaturePermission('flashcard'))

router.get('/unlinked', asyncHandler(flashcardCardsController.getUnlinked.bind(flashcardCardsController)))
router.put('/unlinked/:cardId', asyncHandler(flashcardCardsController.updateUnlinked.bind(flashcardCardsController)))
router.delete('/unlinked/:cardId', asyncHandler(flashcardCardsController.deleteUnlinked.bind(flashcardCardsController)))
router.put('/unlinked/:cardId/assign', asyncHandler(flashcardCardsController.assignToNode.bind(flashcardCardsController)))

export default router
