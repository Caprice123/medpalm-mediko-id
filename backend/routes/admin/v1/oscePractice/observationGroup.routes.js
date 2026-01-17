import express from 'express'
import observationGroupController from '#controllers/admin/v1/oscePractice/observationGroup.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken)
router.use(requireAdmin)

// Observations CRUD
router.post('/', asyncHandler(observationGroupController.create.bind(observationGroupController)))
router.put('/:id', asyncHandler(observationGroupController.update.bind(observationGroupController)))

export default router
