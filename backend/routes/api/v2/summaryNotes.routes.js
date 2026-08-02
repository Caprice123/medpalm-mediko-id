import express from 'express'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import { checkFeature } from '#middleware/checkFeature.middleware'
import topicsController from '#controllers/api/v2/summaryNotes/topics.controller'
import subtopicsController from '#controllers/api/v2/summaryNotes/subtopics.controller'
import notesController from '#controllers/api/v2/summaryNotes/notes.controller'

const router = express.Router()

router.use(authenticateToken)
router.use(checkFeature('summary_notes_is_active'))

router.get('/', asyncHandler(notesController.index.bind(notesController)))
router.get('/topics', asyncHandler(topicsController.getTopics.bind(topicsController)))
router.get('/topics/:topicId/subtopics', asyncHandler(subtopicsController.getSubtopics.bind(subtopicsController)))
router.get('/:id/content-relations', asyncHandler(notesController.contentRelations.bind(notesController)))
router.get('/:id', asyncHandler(notesController.show.bind(notesController)))

export default router
