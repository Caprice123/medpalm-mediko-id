import express from 'express'
import { asyncHandler } from '#utils/asyncHandler'
import { authenticateToken } from '#middleware/auth.middleware'
import nodesController from '#controllers/api/v1/featureNodes/nodes.controller'
import previewController from '#controllers/api/v1/featureNodes/preview.controller'
import statsController from '#controllers/api/v1/featureNodes/stats.controller'
import atlasModelsController from '#controllers/api/v1/featureNodes/atlasModels.controller'
import anatomyQuizzesController from '#controllers/api/v1/featureNodes/anatomyQuizzes.controller'

const router = express.Router()
router.use(authenticateToken)
router.get('/', asyncHandler(nodesController.index.bind(nodesController)))
router.get('/batch-stats', asyncHandler(statsController.batchStats.bind(statsController)))
router.get('/:id/stats', asyncHandler(statsController.stats.bind(statsController)))
router.get('/:id/preview', asyncHandler(previewController.preview.bind(previewController)))
router.get('/:id/atlas-models', asyncHandler(atlasModelsController.nodeAtlasModels.bind(atlasModelsController)))
router.get('/:id/topic-atlas-models', asyncHandler(atlasModelsController.topicAtlasModels.bind(atlasModelsController)))
router.get('/:id/anatomy-quizzes', asyncHandler(anatomyQuizzesController.nodeAnatomyQuizzes.bind(anatomyQuizzesController)))
export default router
