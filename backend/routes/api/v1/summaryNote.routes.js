import express from 'express'
import SummaryNoteController from '../../../controllers/api/v1/summaryNote.controller.js'
import { authenticateToken } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'

const router = express.Router()

// Get all available summary notes
router.get('/', authenticateToken, asyncHandler(SummaryNoteController.index))

// Start summary note session (select topic and deduct credits)
router.post('/sessions/start', authenticateToken, asyncHandler(SummaryNoteController.start))

// Get session content
router.get('/sessions/:sessionId', authenticateToken, asyncHandler(SummaryNoteController.getSession))

export default router
