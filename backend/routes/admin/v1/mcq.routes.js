import express from 'express'
import mcqController from '#controllers/admin/v1/mcq.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken)
router.use(requireAdmin)

// All routes require 'features' tab permission
router.use(requireTabPermission('features'))

// All MCQ routes require 'mcq' feature permission
router.use(requireFeaturePermission('mcq'))

// Generate MCQ questions
router.post('/generate', asyncHandler(mcqController.generate.bind(mcqController)))

// Topic CRUD
router.get('/topics', asyncHandler(mcqController.index.bind(mcqController)))
router.post('/topics', asyncHandler(mcqController.create.bind(mcqController)))
router.get('/topics/:uniqueId', asyncHandler(mcqController.show.bind(mcqController)))
router.put('/topics/:uniqueId', asyncHandler(mcqController.update.bind(mcqController)))
router.delete('/topics/:uniqueId', asyncHandler(mcqController.delete.bind(mcqController)))

export default router
