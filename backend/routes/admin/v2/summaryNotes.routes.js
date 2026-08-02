import express from 'express'
import notesController from '#controllers/admin/v2/summaryNotes/notes.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)
router.use(requireTabPermission('features'))
router.use(requireFeaturePermission('summaryNotes'))

router.get('/', asyncHandler(notesController.index.bind(notesController)))
router.post('/generate', asyncHandler(notesController.generateFromDocument.bind(notesController)))
router.get('/:uniqueId', asyncHandler(notesController.show.bind(notesController)))
router.post('/', asyncHandler(notesController.create.bind(notesController)))
router.put('/:uniqueId', asyncHandler(notesController.update.bind(notesController)))
router.delete('/:uniqueId', asyncHandler(notesController.destroy.bind(notesController)))

export default router
