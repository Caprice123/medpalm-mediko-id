import express from 'express'
import { authenticateToken } from '../../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../../utils/asyncHandler.js'
import exerciseAttemptsController from '../../../../controllers/api/v1/exercises/attempts.controller.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Topic endpoints (for regular users)
router.get('/:attemptId', asyncHandler(exerciseAttemptsController.detail.bind(exerciseAttemptsController)))
router.put('/:attemptId/start', asyncHandler(exerciseAttemptsController.start.bind(exerciseAttemptsController)))
router.put('/:attemptId/complete', asyncHandler(exerciseAttemptsController.complete.bind(exerciseAttemptsController)))

export default router
