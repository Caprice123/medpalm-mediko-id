import express from 'express'
import summaryNotesV2AdminController from '#controllers/admin/v2/summaryNotes.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)
router.use(requireTabPermission('featuresV2'))
router.use(requireFeaturePermission('summaryNotesV2'))

router.get('/', asyncHandler(summaryNotesV2AdminController.index.bind(summaryNotesV2AdminController)))
router.post('/generate', asyncHandler(summaryNotesV2AdminController.generateFromDocument.bind(summaryNotesV2AdminController)))
router.get('/:uniqueId', asyncHandler(summaryNotesV2AdminController.show.bind(summaryNotesV2AdminController)))
router.post('/', asyncHandler(summaryNotesV2AdminController.create.bind(summaryNotesV2AdminController)))
router.put('/:uniqueId', asyncHandler(summaryNotesV2AdminController.update.bind(summaryNotesV2AdminController)))
router.delete('/:uniqueId', asyncHandler(summaryNotesV2AdminController.destroy.bind(summaryNotesV2AdminController)))

export default router
