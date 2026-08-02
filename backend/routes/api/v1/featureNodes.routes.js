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
router.get('/:id/atlas-models', asyncHandler(featureNodesController.nodeAtlasModels.bind(featureNodesController)))
router.get('/:id/topic-atlas-models', asyncHandler(featureNodesController.topicAtlasModels.bind(featureNodesController)))
router.get('/:id/anatomy-quizzes', asyncHandler(featureNodesController.nodeAnatomyQuizzes.bind(featureNodesController)))
export default router
