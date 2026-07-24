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

// Node cards (flashcard_cards linked via node_id)
router.get('/:nodeId/cards', asyncHandler(featureNodesController.getNodeCards.bind(featureNodesController)))
router.post('/:nodeId/cards', asyncHandler(featureNodesController.addNodeCard.bind(featureNodesController)))
router.put('/:nodeId/cards/:cardId', asyncHandler(featureNodesController.updateNodeCard.bind(featureNodesController)))
router.delete('/:nodeId/cards/:cardId', asyncHandler(featureNodesController.deleteNodeCard.bind(featureNodesController)))
router.put('/:nodeId/cards/:cardId/move', asyncHandler(featureNodesController.moveNodeCard.bind(featureNodesController)))

export default router
