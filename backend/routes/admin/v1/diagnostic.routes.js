import express from 'express'
import diagnosticController from '#controllers/admin/v1/diagnostic.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken)
router.use(requireAdmin)

// All routes require 'features' tab permission
router.use(requireTabPermission('features'))

// All diagnostic routes require 'diagnostic' feature permission
router.use(requireFeaturePermission('diagnostic'))

// Quiz CRUD
router.get('/', asyncHandler(diagnosticController.index.bind(diagnosticController)))
router.post('/', asyncHandler(diagnosticController.create.bind(diagnosticController)))
router.get('/:uniqueId', asyncHandler(diagnosticController.show.bind(diagnosticController)))
router.put('/:uniqueId', asyncHandler(diagnosticController.update.bind(diagnosticController)))
router.delete('/:uniqueId', asyncHandler(diagnosticController.delete.bind(diagnosticController)))

// Generate questions from image
router.post('/generate-from-image', asyncHandler(diagnosticController.generateQuestionsFromImage.bind(diagnosticController)))

export default router
