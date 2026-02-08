import express from 'express'
import anatomyController from '#controllers/admin/v1/anatomy.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken)
router.use(requireAdmin)

// Quiz CRUD
router.post('/', asyncHandler(anatomyController.create.bind(anatomyController)))
router.get('/', asyncHandler(anatomyController.index.bind(anatomyController)))
router.get('/:uniqueId', asyncHandler(anatomyController.show.bind(anatomyController)))
router.put('/:uniqueId', asyncHandler(anatomyController.update.bind(anatomyController)))
router.delete('/:uniqueId', asyncHandler(anatomyController.delete.bind(anatomyController)))

// Generate questions from image using Gemini (also uploads and creates blob)
router.post(
  '/generate-from-image',
  asyncHandler(anatomyController.generateQuestionsFromImage.bind(anatomyController))
)

export default router
