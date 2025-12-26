import express from 'express'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import anatomyController from '#controllers/api/v1/anatomy.controller'
import { checkFeature } from '#middleware/checkFeature.middleware'

const router = express.Router()

const featureConstantKey = 'anatomy_is_active'

// All routes require authentication
router.use(authenticateToken)
router.use(checkFeature(featureConstantKey))

// Get all published anatomy quizzes
router.get('/', asyncHandler(anatomyController.index.bind(anatomyController)))

// Get single quiz for user to take
router.get('/:id', asyncHandler(anatomyController.show.bind(anatomyController)))

// Submit answers for a quiz (simpler approach without sessions)
router.post(
  '/:id/submit',
  asyncHandler(anatomyController.submit.bind(anatomyController))
)

export default router
