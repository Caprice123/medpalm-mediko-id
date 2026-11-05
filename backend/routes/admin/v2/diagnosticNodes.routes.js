import express from 'express'
import casesController from '#controllers/admin/v2/diagnostic/cases.controller'
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

// Cases template download
router.get('/cases/template', importController.downloadTemplate.bind(importController))

// Cases per node — a case holds one vignette/image and the questions asked about it
router.get('/:nodeId/cases', asyncHandler(casesController.index.bind(casesController)))
router.post('/:nodeId/cases', asyncHandler(casesController.create.bind(casesController)))
router.post('/:nodeId/cases/import', uploadExcel, asyncHandler(importController.create.bind(importController)))
router.get('/:nodeId/cases/:caseId', asyncHandler(casesController.show.bind(casesController)))
router.put('/:nodeId/cases/:caseId', asyncHandler(casesController.update.bind(casesController)))
router.delete('/:nodeId/cases/:caseId', asyncHandler(casesController.destroy.bind(casesController)))

export default router
