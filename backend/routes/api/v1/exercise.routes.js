import express from 'express'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import exerciseController from '#controllers/api/v1/exercise.controller'
import { checkFeature } from '#middleware/checkFeature.middleware'

const router = express.Router()

// All routes require authentication
const featureConstantKey = 'exercise_is_active'

// All routes require authentication
router.use(authenticateToken)
router.use(checkFeature(featureConstantKey))

// Topic endpoints (for regular users)
router.get('/topics', asyncHandler(exerciseController.getTopics.bind(exerciseController)))

// Sessionless exercise endpoints
router.post('/start', asyncHandler(exerciseController.startTopic.bind(exerciseController)))
router.post('/submit', asyncHandler(exerciseController.submitProgress.bind(exerciseController)))

export default router
