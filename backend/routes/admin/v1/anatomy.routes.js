import express from 'express'
import anatomyController from '#controllers/admin/v1/anatomy.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken)
router.use(requireAdmin)

// All routes require 'features' tab permission
router.use(requireTabPermission('features'))

// All anatomy routes require 'anatomy' feature permission
router.use(requireFeaturePermission('anatomy'))

// Quiz CRUD
router.get('/', asyncHandler(anatomyController.index.bind(anatomyController)))
router.post('/', asyncHandler(anatomyController.create.bind(anatomyController)))
router.get('/:uniqueId', asyncHandler(anatomyController.show.bind(anatomyController)))
router.put('/:uniqueId', asyncHandler(anatomyController.update.bind(anatomyController)))
router.delete('/:uniqueId', asyncHandler(anatomyController.delete.bind(anatomyController)))

// Generate questions from image
router.post('/generate-from-image', asyncHandler(anatomyController.generateQuestionsFromImage.bind(anatomyController)))

export default router
