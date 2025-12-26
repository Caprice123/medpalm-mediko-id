import express from 'express'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import mcqController from '#controllers/api/v1/mcq.controller'

const router = express.Router()

// All routes require authentication
const featureConstantKey = 'mcq_is_active'

// All routes require authentication
router.use(authenticateToken)
router.use(checkFeature(featureConstantKey))

// Get MCQ constants
router.get('/constants', asyncHandler(mcqController.getConstants.bind(mcqController)))

// Get all published MCQ topics with filters
router.get('/topics', asyncHandler(mcqController.getTopics.bind(mcqController)))

// Get topic session (questions for learning or quiz mode)
router.get('/topics/:id/session', asyncHandler(mcqController.getTopicSession.bind(mcqController)))

// Get single topic by ID (must be after /topics/:id/session to avoid conflicts)
router.get('/topics/:id', asyncHandler(mcqController.getTopic.bind(mcqController)))

// Submit answers
router.post('/topics/:id/submit', asyncHandler(mcqController.submitAnswers.bind(mcqController)))

// Check answers
router.post('/topics/:id/check', asyncHandler(mcqController.checkAnswers.bind(mcqController)))

export default router
