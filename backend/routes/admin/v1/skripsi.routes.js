import express from 'express'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import SkripsiAdminController from '#controllers/admin/v1/skripsi.controller'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken)
router.use(requireAdmin)

// All routes require 'features' tab permission
router.use(requireTabPermission('features'))

// All skripsi routes require 'skripsi' feature permission
router.use(requireFeaturePermission('skripsi'))

// Skripsi Sets management
router.get('/sets', asyncHandler(SkripsiAdminController.index.bind(SkripsiAdminController)))
router.get('/sets/:uniqueId', asyncHandler(SkripsiAdminController.show.bind(SkripsiAdminController)))
router.get('/sets/:uniqueId/tabs', asyncHandler(SkripsiAdminController.getSetTabs.bind(SkripsiAdminController)))
router.delete('/sets/:uniqueId', asyncHandler(SkripsiAdminController.destroy.bind(SkripsiAdminController)))

export default router
