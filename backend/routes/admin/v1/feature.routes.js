import express from 'express'
import { asyncHandler } from '#utils/asyncHandler'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission } from '#middleware/permission.middleware'
import adminFeatureController from '#controllers/admin/v1/feature.controller'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken)
router.use(requireAdmin)

// All routes require 'features' tab permission
router.use(requireTabPermission('features'))

// GET /admin/v1/features - Get features filtered by user permissions
router.get('/', asyncHandler(adminFeatureController.index.bind(adminFeatureController)))

export default router
