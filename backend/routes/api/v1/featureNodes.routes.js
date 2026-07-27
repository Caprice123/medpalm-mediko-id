import express from 'express'
import { asyncHandler } from '#utils/asyncHandler'
import { authenticateToken } from '#middleware/auth.middleware'
import featureNodesController from '#controllers/api/v1/featureNodes.controller'

const router = express.Router()
router.use(authenticateToken)
router.get('/', asyncHandler(featureNodesController.index.bind(featureNodesController)))
router.get('/batch-stats', asyncHandler(featureNodesController.batchStats.bind(featureNodesController)))
router.get('/:id/stats', asyncHandler(featureNodesController.stats.bind(featureNodesController)))
router.get('/:id/preview', asyncHandler(featureNodesController.preview.bind(featureNodesController)))
export default router
