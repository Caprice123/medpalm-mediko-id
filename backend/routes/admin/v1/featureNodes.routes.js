import express from 'express'
import featureNodesController from '#controllers/admin/v1/featureNodes.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)
router.use(requireTabPermission('nodeStructure'))
router.use(requireFeaturePermission('featureNodes'))

// Nodes CRUD
router.get('/', asyncHandler(featureNodesController.index.bind(featureNodesController)))
router.post('/', asyncHandler(featureNodesController.create.bind(featureNodesController)))
router.put('/:id', asyncHandler(featureNodesController.update.bind(featureNodesController)))
router.delete('/:id', asyncHandler(featureNodesController.delete.bind(featureNodesController)))

// Node records
router.get('/records', asyncHandler(featureNodesController.getRecords.bind(featureNodesController)))
router.post('/records', asyncHandler(featureNodesController.createRecord.bind(featureNodesController)))
router.delete('/records/:id', asyncHandler(featureNodesController.deleteRecord.bind(featureNodesController)))

// Auto-link
router.post('/auto-link/flashcard-decks', asyncHandler(featureNodesController.autoLinkFlashcardDecks.bind(featureNodesController)))

export default router
