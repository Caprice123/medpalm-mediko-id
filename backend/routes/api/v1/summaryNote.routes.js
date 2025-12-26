import express from 'express'
import SummaryNoteController from '#controllers/api/v1/summaryNote.controller'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

const featureConstantKey = 'summary_notes_is_active'

// All routes require authentication
router.use(authenticateToken)
router.use(checkFeature(featureConstantKey))

// Get all available summary notes
router.get('/', asyncHandler(SummaryNoteController.index))

// Get a single summary note by ID
router.get('/:id', asyncHandler(SummaryNoteController.show))

// Start summary note session (select topic and deduct credits)
router.post('/sessions/start', asyncHandler(SummaryNoteController.start))

// Get session content
router.get('/sessions/:sessionId', asyncHandler(SummaryNoteController.getSession))

export default router
