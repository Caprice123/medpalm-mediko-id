import express from 'express'
import SummaryNotesAdminController from '#controllers/admin/v1/summaryNotes.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)

// All routes require 'features' tab and 'summaryNotes' feature permission
router.use(requireTabPermission('features'))
router.use(requireFeaturePermission('summaryNotes'))

// CRUD routes
router.get('/', asyncHandler(SummaryNotesAdminController.index))
router.get('/:uniqueId', asyncHandler(SummaryNotesAdminController.show))
router.post('/', asyncHandler(SummaryNotesAdminController.create))
router.put('/:uniqueId', asyncHandler(SummaryNotesAdminController.update))
router.delete('/:uniqueId', asyncHandler(SummaryNotesAdminController.destroy))

// Generate summary from document
router.post('/generate', asyncHandler(SummaryNotesAdminController.generateFromDocument))

// ChromaDB embeddings routes
router.get('/embeddings', asyncHandler(SummaryNotesAdminController.getEmbeddings))
router.get('/embeddings/:id', asyncHandler(SummaryNotesAdminController.getEmbeddingDetail))

export default router
