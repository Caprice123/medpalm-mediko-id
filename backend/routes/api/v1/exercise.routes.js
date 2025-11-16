import express from 'express'
import { authenticateToken } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'
import exerciseController from '../../../controllers/api/v1/exercise.controller.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Topic endpoints (for regular users)
router.get('/topics', asyncHandler(exerciseController.getTopics.bind(exerciseController)))
router.get('/:userLearningSessionId/attempts', asyncHandler(exerciseController.attempts.bind(exerciseController)))
router.post('/:userLearningSessionId/attempts', asyncHandler(exerciseController.createAttempts.bind(exerciseController)))

export default router
