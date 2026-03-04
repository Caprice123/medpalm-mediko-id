import express from 'express'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import diagnosticController from '#controllers/api/v1/diagnostic.controller'
import { checkFeature } from '#middleware/checkFeature.middleware'

const router = express.Router()

const featureConstantKey = 'diagnostic_is_active'

// All routes require authentication
router.use(authenticateToken)
router.use(checkFeature(featureConstantKey))

// Get all published diagnostic quizzes
router.get('/', asyncHandler(diagnosticController.index.bind(diagnosticController)))

// Get single quiz for user to take
router.get('/:uniqueId', asyncHandler(diagnosticController.show.bind(diagnosticController)))

// Submit answers for a quiz (simpler approach without sessions)
router.post(
  '/:uniqueId/submit',
  asyncHandler(diagnosticController.submit.bind(diagnosticController))
)

export default router
