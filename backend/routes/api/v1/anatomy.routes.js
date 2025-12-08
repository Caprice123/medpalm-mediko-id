import express from 'express'
import { authenticateToken } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'
import anatomyController from '../../../controllers/api/v1/anatomy.controller.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Get all published anatomy quizzes
router.get('/quizzes', asyncHandler(anatomyController.getQuizzes.bind(anatomyController)))

// Get single quiz for user to take
router.get('/quizzes/:id', asyncHandler(anatomyController.getQuiz.bind(anatomyController)))

// Submit answers for a quiz (simpler approach without sessions)
router.post(
  '/quizzes/:id/submit',
  asyncHandler(anatomyController.submitQuizAnswers.bind(anatomyController))
)

// Start a quiz (creates session with spaced repetition) - Alternative approach
router.post(
  '/quizzes/:id/start',
  asyncHandler(anatomyController.startQuiz.bind(anatomyController))
)

// Submit answers for a quiz attempt - Alternative approach
router.post(
  '/attempts/:attemptId/submit',
  asyncHandler(anatomyController.submitAnswers.bind(anatomyController))
)

export default router
