import express from 'express'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import topicsController from '#controllers/api/v2/atlasQuiz/topics.controller'
import atlasModelsController from '#controllers/api/v2/atlasQuiz/atlasModels.controller'
import anatomyQuizzesController from '#controllers/api/v2/atlasQuiz/anatomyQuizzes.controller'

const router = express.Router()

router.use(authenticateToken)

// Topics
router.get('/topics', asyncHandler(topicsController.index.bind(topicsController)))
router.get('/:slug', asyncHandler(topicsController.show.bind(topicsController)))
router.get('/:slug/module-options', asyncHandler(topicsController.moduleOptions.bind(topicsController)))

// Atlas models
router.get('/:slug/atlas-models', asyncHandler(atlasModelsController.index.bind(atlasModelsController)))
router.get('/:slug/atlas-models/:uniqueId', asyncHandler(atlasModelsController.show.bind(atlasModelsController)))

// Anatomy quizzes
router.get('/:slug/anatomy-quizzes', asyncHandler(anatomyQuizzesController.index.bind(anatomyQuizzesController)))
router.get('/:slug/anatomy-quizzes/:uniqueId', asyncHandler(anatomyQuizzesController.show.bind(anatomyQuizzesController)))

export default router
