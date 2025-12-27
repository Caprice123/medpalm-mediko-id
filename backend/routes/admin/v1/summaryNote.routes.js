import express from 'express'
import SummaryNotesAdminController from '#controllers/admin/v1/summaryNotes.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)

// CRUD routes
router.get('/', asyncHandler(SummaryNotesAdminController.index))
router.get('/:id', asyncHandler(SummaryNotesAdminController.show))
router.post('/', asyncHandler(SummaryNotesAdminController.create))
router.put('/:id', asyncHandler(SummaryNotesAdminController.update))
router.delete('/:id', asyncHandler(SummaryNotesAdminController.destroy))

// Generate summary from document
router.post('/generate', asyncHandler(SummaryNotesAdminController.generateFromDocument))

// ChromaDB embeddings routes
router.get('/embeddings/list', asyncHandler(SummaryNotesAdminController.getEmbeddings))
router.get('/embeddings/:id', asyncHandler(SummaryNotesAdminController.getEmbeddingDetail))

export default router
