import express from 'express'
import topicController from '#controllers/admin/v1/oscePractice/topic.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken)
router.use(requireAdmin)

// All routes require 'features' tab permission
router.use(requireTabPermission('features'))

// All OSCE Practice routes require 'oscePractice' feature permission
router.use(requireFeaturePermission('oscePractice'))

// Topics CRUD
router.get('/', asyncHandler(topicController.index.bind(topicController)))
router.post('/', asyncHandler(topicController.create.bind(topicController)))
router.get('/:uniqueId', asyncHandler(topicController.show.bind(topicController)))
router.put('/:uniqueId', asyncHandler(topicController.update.bind(topicController)))

export default router
