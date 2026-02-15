import express from 'express'
import observationController from '#controllers/admin/v1/oscePractice/observation.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken)
router.use(requireAdmin)

// All routes require 'features' tab and 'oscePractice' feature permission
router.use(requireTabPermission('features'))
router.use(requireFeaturePermission('oscePractice'))

// Observations CRUD
router.get('/', asyncHandler(observationController.index.bind(observationController)))
router.post('/', asyncHandler(observationController.create.bind(observationController)))
router.put('/:id', asyncHandler(observationController.update.bind(observationController)))

export default router
