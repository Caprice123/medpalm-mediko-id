import express from 'express'
import flashcardV2Controller from '#controllers/admin/v2/flashcard.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)
router.use(requireTabPermission('featuresV2'))
router.use(requireFeaturePermission('flashcardV2'))

router.get('/', asyncHandler(flashcardV2Controller.index.bind(flashcardV2Controller)))
router.post('/', asyncHandler(flashcardV2Controller.create.bind(flashcardV2Controller)))
router.get('/:uniqueId', asyncHandler(flashcardV2Controller.show.bind(flashcardV2Controller)))
router.put('/:uniqueId', asyncHandler(flashcardV2Controller.update.bind(flashcardV2Controller)))
router.delete('/:uniqueId', asyncHandler(flashcardV2Controller.destroy.bind(flashcardV2Controller)))

export default router
