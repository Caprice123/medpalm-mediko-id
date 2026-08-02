import express from 'express'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import { checkFeature } from '#middleware/checkFeature.middleware'
import topicsController from '#controllers/api/v2/mcq/topics.controller'
import subtopicsController from '#controllers/api/v2/mcq/subtopics.controller'
import sessionController from '#controllers/api/v2/mcq/session.controller'
import answerController from '#controllers/api/v2/mcq/answer.controller'

const router = express.Router()

router.use(authenticateToken)
router.use(checkFeature('mcq_is_active'))

// Topics
router.get('/topics',                    asyncHandler(topicsController.getTopics.bind(topicsController)))
router.get('/topics/:topicId/subtopics', asyncHandler(subtopicsController.getSubtopics.bind(subtopicsController)))

// Sessions
router.post('/session',                  asyncHandler(sessionController.startSession.bind(sessionController)))
router.post('/custom-session',           asyncHandler(sessionController.startCustomSession.bind(sessionController)))
router.post('/submit',                   asyncHandler(sessionController.submitSession.bind(sessionController)))

// Answer
router.post('/answer',                   asyncHandler(answerController.create.bind(answerController)))

export default router
