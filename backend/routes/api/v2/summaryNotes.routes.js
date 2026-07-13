import express from 'express'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import { checkFeature } from '#middleware/checkFeature.middleware'
import summaryNotesV2Controller from '#controllers/api/v2/summaryNotes.controller'

const router = express.Router()

router.use(authenticateToken)
router.use(checkFeature('summary_notes_is_active'))

router.get('/', asyncHandler(summaryNotesV2Controller.index.bind(summaryNotesV2Controller)))
router.get('/:id', asyncHandler(summaryNotesV2Controller.show.bind(summaryNotesV2Controller)))

export default router
