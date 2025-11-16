import express from 'express'
import sessionController from '../../../controllers/api/v1/session.controller.js'
import { authenticateToken } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Create a new exercise session
router.post('/', asyncHandler(sessionController.create.bind(sessionController)))

// Get user's session history
router.get('/', asyncHandler(sessionController.getUserSessions.bind(sessionController)))

// Get attempt detail
router.get('/:sessionId', asyncHandler(sessionController.show.bind(sessionController)))

export default router
