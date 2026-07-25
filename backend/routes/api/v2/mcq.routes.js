import express from 'express'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import { checkFeature } from '#middleware/checkFeature.middleware'
import mcqV2Controller from '#controllers/api/v2/mcq.controller'

const router = express.Router()

router.use(authenticateToken)
router.use(checkFeature('mcq_is_active'))

router.get('/topics', asyncHandler(mcqV2Controller.getTopics.bind(mcqV2Controller)))
router.get('/topics/:topicId/subtopics', asyncHandler(mcqV2Controller.getSubtopics.bind(mcqV2Controller)))
router.post('/session', asyncHandler(mcqV2Controller.startSession.bind(mcqV2Controller)))
router.post('/custom-session', asyncHandler(mcqV2Controller.startCustomSession.bind(mcqV2Controller)))
router.post('/submit', asyncHandler(mcqV2Controller.submitSession.bind(mcqV2Controller)))

export default router
