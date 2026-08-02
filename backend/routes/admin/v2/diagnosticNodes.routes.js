import express from 'express'
import questionsController from '#controllers/admin/v2/diagnostic/questions.controller'
import importController from '#controllers/admin/v2/diagnostic/import.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import { uploadExcel } from '#middlewares/uploadExcel'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)
router.use(requireTabPermission('features'))
router.use(requireFeaturePermission('diagnostic'))

// Questions template download
router.get('/questions/template', importController.downloadTemplate.bind(importController))

// Questions per node
router.get('/:nodeId/questions', asyncHandler(questionsController.index.bind(questionsController)))
router.post('/:nodeId/questions', asyncHandler(questionsController.create.bind(questionsController)))
router.post('/:nodeId/questions/import', uploadExcel, asyncHandler(importController.create.bind(importController)))
router.put('/:nodeId/questions/:questionId', asyncHandler(questionsController.update.bind(questionsController)))
router.delete('/:nodeId/questions/:questionId', asyncHandler(questionsController.destroy.bind(questionsController)))

export default router
