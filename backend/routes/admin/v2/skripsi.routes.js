import express from 'express'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import SkripsiAdminV2Controller from '#controllers/admin/v2/skripsi.controller'

const router = express.Router()

// Same gate as the V1 admin routes: an admin with the 'features' tab and the
// 'skripsi' feature. `/admin/v1/skripsi/*` stays mounted and untouched.
router.use(authenticateToken)
router.use(requireAdmin)
router.use(requireTabPermission('features'))
router.use(requireFeaturePermission('skripsi'))

const bind = (method) => asyncHandler(SkripsiAdminV2Controller[method].bind(SkripsiAdminV2Controller))

// Report templates — the outline a new report is stamped from.
router.get('/templates', bind('indexTemplates'))
router.get('/templates/:id', bind('showTemplate'))
router.post('/templates', bind('createTemplate'))
router.put('/templates/:id', bind('updateTemplate'))
router.delete('/templates/:id', bind('destroyTemplate'))

export default router
