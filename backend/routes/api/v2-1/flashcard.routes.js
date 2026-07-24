import express from 'express'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import { checkFeature } from '#middleware/checkFeature.middleware'
import topicsController from '#controllers/api/v2-1/flashcard/topics.controller'
import subtopicsController from '#controllers/api/v2-1/flashcard/subtopics.controller'
import sessionController from '#controllers/api/v2-1/flashcard/session.controller'
import progressController from '#controllers/api/v2-1/flashcard/progress.controller'
import rateController from '#controllers/api/v2-1/flashcard/rate.controller'

const router = express.Router()

router.use(authenticateToken)
router.use(checkFeature('flashcard_is_active'))

// Topics
router.get('/topics',                            asyncHandler(topicsController.index.bind(topicsController)))
router.get('/topics/:topicId/subtopics',         asyncHandler(subtopicsController.index.bind(subtopicsController)))

// Sessions
router.post('/session',                          asyncHandler(sessionController.startSession.bind(sessionController)))
router.post('/custom-session',                   asyncHandler(sessionController.startCustomSession.bind(sessionController)))
router.post('/due-session',                      asyncHandler(sessionController.startDueSession.bind(sessionController)))
router.post('/node-due-session',                 asyncHandler(sessionController.startNodeDueSession.bind(sessionController)))

// Progress
router.get('/due-today',                         asyncHandler(progressController.getDueToday.bind(progressController)))
router.get('/progress/summary',                  asyncHandler(progressController.getProgressSummary.bind(progressController)))
router.get('/progress/topics',                   asyncHandler(progressController.getProgressTopics.bind(progressController)))

// Rate
router.post('/rate',                             asyncHandler(rateController.create.bind(rateController)))

export default router
