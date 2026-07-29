import express from 'express'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import atlasQuizV2Controller from '#controllers/api/v2/atlasQuiz.controller'

const router = express.Router()

router.use(authenticateToken)

router.get('/topics', asyncHandler(atlasQuizV2Controller.topics.bind(atlasQuizV2Controller)))
router.get('/:slug', asyncHandler(atlasQuizV2Controller.topicDetail.bind(atlasQuizV2Controller)))
router.get('/:slug/module-options', asyncHandler(atlasQuizV2Controller.topicModuleOptions.bind(atlasQuizV2Controller)))
router.get('/:slug/atlas-models', asyncHandler(atlasQuizV2Controller.topicAtlasModels.bind(atlasQuizV2Controller)))
router.get('/:slug/anatomy-quizzes', asyncHandler(atlasQuizV2Controller.topicAnatomyQuizzes.bind(atlasQuizV2Controller)))
router.get('/:slug/atlas-models/:uniqueId', asyncHandler(atlasQuizV2Controller.atlasModelDetail.bind(atlasQuizV2Controller)))
router.get('/:slug/anatomy-quizzes/:uniqueId', asyncHandler(atlasQuizV2Controller.anatomyQuizDetail.bind(atlasQuizV2Controller)))

export default router
