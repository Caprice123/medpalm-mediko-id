import express from 'express'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import tagsController from '#controllers/admin/v1/tags.controller'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken)
router.use(requireAdmin)

// All tags routes require 'tags' tab permission
router.use(requireTabPermission('tags'))

// Tags CRUD
router.get('/', asyncHandler(tagsController.index.bind(tagsController)))
router.post('/', asyncHandler(tagsController.create.bind(tagsController)))
router.put('/:id', asyncHandler(tagsController.update.bind(tagsController)))

export default router
