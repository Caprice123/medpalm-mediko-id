import express from 'express'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import tagGroupsController from '#controllers/admin/v1/tagGroups.controller'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Get all tag groups (requires admin role + tags tab + view permission)
router.get('/',
  requireAdmin,
  requireTabPermission('tags'),
  asyncHandler(tagGroupsController.index.bind(tagGroupsController))
)

export default router
