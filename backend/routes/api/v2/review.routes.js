import express from 'express'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import reviewController from '#controllers/api/v2/review.controller'

const router = express.Router()
router.use(authenticateToken)

router.get('/stats', asyncHandler(reviewController.getStats.bind(reviewController)))
router.post('/rate', asyncHandler(reviewController.submitRating.bind(reviewController)))
router.get('/session', asyncHandler(reviewController.getSession.bind(reviewController)))
router.post('/sessions', asyncHandler(reviewController.startSession.bind(reviewController)))
router.get('/sessions/:uniqueId', asyncHandler(reviewController.getSessionByUniqueId.bind(reviewController)))
router.get('/custom-sessions', asyncHandler(reviewController.listCustomSessions.bind(reviewController)))
router.post('/custom-sessions', asyncHandler(reviewController.createCustomSession.bind(reviewController)))
router.delete('/custom-sessions/:id', asyncHandler(reviewController.deleteCustomSession.bind(reviewController)))

export default router
